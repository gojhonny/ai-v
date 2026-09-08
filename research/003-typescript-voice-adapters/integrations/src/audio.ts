import { VoiceError } from './contracts.ts';
export const MAX_BYTES = 16 * 1024 * 1024; // Application policy for this buffered reference.

export function joinBytes(chunks: Uint8Array[], limit=MAX_BYTES): Uint8Array {
  const length=chunks.reduce((sum,c)=>sum+c.byteLength,0);
  if (length > limit) throw new VoiceError('LIMIT','Audio exceeds the configured buffer limit');
  const result=new Uint8Array(length); let offset=0;
  for (const chunk of chunks) { result.set(chunk,offset); offset+=chunk.byteLength; }
  return result;
}
export function fromBase64(value: unknown): Uint8Array {
  if (typeof value !== 'string' || !value || value.length > Math.ceil(MAX_BYTES/3)*4
    || !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(value))
    throw new VoiceError('PROTOCOL','Expected nonempty bounded standard base64 audio');
  try { return Uint8Array.from(atob(value),char=>char.charCodeAt(0)); }
  catch { throw new VoiceError('PROTOCOL','Invalid base64 audio'); }
}

export async function readBounded(response: Response, signal: AbortSignal, limit=MAX_BYTES): Promise<Uint8Array> {
  if (!response.body) throw new VoiceError('PROTOCOL','Missing response body');
  const reader=response.body.getReader(), chunks:Uint8Array[]=[];
  let length=0, cancelled=false;
  const cancel=()=> { cancelled=true; void reader.cancel().catch(()=>{}); };
  signal.addEventListener('abort',cancel,{once:true});
  try {
    signal.throwIfAborted();
    for (;;) {
      const { value, done }=await reader.read(); signal.throwIfAborted();
      if (done) break;
      length+=value.byteLength;
      if (length > limit) throw new VoiceError('LIMIT','Response exceeds buffer limit');
      chunks.push(value);
    }
    return joinBytes(chunks,limit);
  } catch(error) { if (!cancelled) await reader.cancel().catch(()=>{}); throw error; }
  finally { signal.removeEventListener('abort',cancel); reader.releaseLock(); }
}

export function assertWav(bytes: Uint8Array): Uint8Array {
  const ascii=(start:number,length:number)=>new TextDecoder().decode(bytes.subarray(start,start+length));
  if (bytes.length < 44 || ascii(0,4)!=='RIFF' || ascii(8,4)!=='WAVE')
    throw new VoiceError('PROTOCOL','Expected a complete RIFF/WAVE container');
  const view=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);
  const declared=view.getUint32(4,true);
  // 0xffffffff is commonly used when HTTP streaming prevents knowing the size up front.
  if (declared !== 0xffffffff && declared+8 > bytes.length)
    throw new VoiceError('PROTOCOL','Truncated WAV file');
  let offset=12, hasFormat=false, hasData=false;
  while(offset+8<=bytes.length) {
    const kind=ascii(offset,4), size=view.getUint32(offset+4,true), start=offset+8;
    if (kind==='data' && size===0xffffffff) { hasData=start<bytes.length; break; }
    if (start+size>bytes.length) throw new VoiceError('PROTOCOL','Truncated WAV chunk');
    if (kind==='fmt ' && size>=16) hasFormat=true;
    if (kind==='data' && size>0) hasData=true;
    offset=start+size+(size%2);
  }
  if (!hasFormat || !hasData) throw new VoiceError('PROTOCOL','WAV must contain format and nonempty audio data');
  return bytes;
}

// Container wrapping only. No resampling, transcoding, loudness or voice-quality changes.
export function pcm16ToWav(pcm: Uint8Array, sampleRate=24000): Uint8Array {
  if (!pcm.length || pcm.length%2 || pcm.length>MAX_BYTES-44
    || !Number.isInteger(sampleRate) || sampleRate<8000 || sampleRate>48000)
    throw new VoiceError('PROTOCOL','Expected bounded mono PCM16 with a supported sample rate');
  const wav=new Uint8Array(pcm.length+44), view=new DataView(wav.buffer);
  const write=(offset:number,text:string)=>{ for(let i=0;i<text.length;i++) wav[offset+i]=text.charCodeAt(i); };
  write(0,'RIFF'); view.setUint32(4,36+pcm.length,true); write(8,'WAVE'); write(12,'fmt ');
  view.setUint32(16,16,true); view.setUint16(20,1,true); view.setUint16(22,1,true);
  view.setUint32(24,sampleRate,true); view.setUint32(28,sampleRate*2,true);
  view.setUint16(32,2,true); view.setUint16(34,16,true); write(36,'data');
  view.setUint32(40,pcm.length,true); wav.set(pcm,44); return wav;
}

export function decodeGemini(data: unknown): Uint8Array {
  const root=data as { candidates?:{ finishReason?:string; content?:{ parts?:{ inlineData?:{ mimeType?:string; data?:unknown } }[] } }[] };
  const candidate=root?.candidates?.[0];
  if (candidate?.finishReason !== 'STOP') throw new VoiceError('PROTOCOL','Gemini did not finish normally');
  const parts=candidate.content?.parts;
  if (!Array.isArray(parts)) throw new VoiceError('PROTOCOL','Missing Gemini content parts');
  const audio=parts.flatMap(part=>part.inlineData?[part.inlineData]:[]);
  if (!audio.length) throw new VoiceError('PROTOCOL','Gemini returned no inline audio');
  for (const item of audio) {
    const fields=(item.mimeType??'').toLowerCase().split(';').map(s=>s.trim());
    const params=new Map(fields.slice(1).map(s=>s.split('=',2) as [string,string]));
    if (fields[0]!=='audio/l16' || params.get('rate')!=='24000' || params.get('codec')!=='pcm'
      || (params.has('channels') && params.get('channels')!=='1'))
      throw new VoiceError('PROTOCOL','Unrecognized Gemini PCM metadata; do not guess sample rate or encoding');
    // Google's TTS guide explicitly decodes its L16-labeled bytes as s16le.
    // Do not generalize that convention to arbitrary audio/L16 sources.
  }
  return pcm16ToWav(joinBytes(audio.map(item=>fromBase64(item.data)),MAX_BYTES-44));
}

export class ElevenAccumulator {
  #chunks:Uint8Array[]=[]; #length=0; #done=false;
  accept(value:unknown): Uint8Array | undefined {
    if (this.#done) return undefined;
    if (!value || typeof value!=='object') throw new VoiceError('PROTOCOL','Invalid dialogue event');
    const message=value as Record<string,unknown>;
    if (message.error || message.type==='error') throw new VoiceError('PROVIDER','Dialogue synthesis failed');
    if (message.audio !== undefined && message.audio !== '') {
      const bytes=fromBase64(message.audio); this.#length+=bytes.length;
      if (this.#length>MAX_BYTES) throw new VoiceError('LIMIT','Dialogue exceeds buffer limit');
      this.#chunks.push(bytes);
    }
    if (message.is_final === true) {
      if (!this.#length) throw new VoiceError('PROTOCOL','Dialogue ended without audio');
      this.#done=true; return joinBytes(this.#chunks);
    }
    return undefined; // Turn-final, alignment, and other metadata do not end the session.
  }
}
