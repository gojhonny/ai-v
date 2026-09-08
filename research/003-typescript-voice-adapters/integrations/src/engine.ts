import { VoiceError, validateConfig, validateRequest } from './contracts.ts';
import type { VoiceConfig, SpeechRequest, SpeechResult } from './contracts.ts';
import { toProviderRequest } from './plans.ts';
import type { RequestPlan } from './plans.ts';
import { assertWav, decodeGemini, ElevenAccumulator, fromBase64, readBounded, MAX_BYTES } from './audio.ts';

export interface EngineDependencies {
  fetch?: typeof fetch;
  webSocketFactory?: (url:string)=>WebSocket;
  signal?: AbortSignal;
  timeoutMs?: number;
}

async function dialogue(plan:Extract<RequestPlan,{transport:'websocket'}>, signal:AbortSignal,
  factory:(url:string)=>WebSocket): Promise<Uint8Array> {
  signal.throwIfAborted();
  return new Promise((resolve,reject)=>{
    const socket=factory(plan.url), accumulator=new ElevenAccumulator();
    let settled=false;
    const finish=(error?:unknown,bytes?:Uint8Array)=>{
      if (settled) return; settled=true;
      signal.removeEventListener('abort',abort);
      socket.onopen=null; socket.onmessage=null; socket.onclose=null; socket.onerror=null;
      // Abort closes the transport. It never sends the provider's completion/flush message.
      try { socket.close(); } catch { /* Already closed or still connecting. */ }
      if (error!==undefined) reject(error); else resolve(bytes!);
    };
    const abort=()=>finish(signal.reason ?? new DOMException('Aborted','AbortError'));
    signal.addEventListener('abort',abort,{once:true});
    socket.onopen=()=>{
      if (settled) return;
      try { signal.throwIfAborted(); for(const message of plan.messages) socket.send(JSON.stringify(message)); }
      catch(error) { finish(error); }
    };
    socket.onmessage=event=>{
      if (settled) return;
      try {
        if (typeof event.data!=='string' || event.data.length>Math.ceil(MAX_BYTES/3)*4+4096)
          throw new VoiceError('PROTOCOL','Expected bounded JSON dialogue frames');
        const result=accumulator.accept(JSON.parse(event.data));
        if (result) finish(undefined,result);
      } catch(error) { finish(error); }
    };
    socket.onerror=()=>finish(new VoiceError('PROVIDER','Dialogue transport failed'));
    socket.onclose=()=>finish(new VoiceError('PROTOCOL','Dialogue closed before is_final'));
    if (signal.aborted) abort();
  });
}

// SERVER ONLY. No provider SDK dependency. All URLs are generated from a fixed catalog.
export async function synthesize(config:VoiceConfig, request:SpeechRequest, credential:string,
  dependencies:EngineDependencies={}):Promise<SpeechResult> {
  const c=validateConfig(config), r=validateRequest(request);
  const timeout=dependencies.timeoutMs??60000;
  if (!Number.isInteger(timeout) || timeout<1 || timeout>120000)
    throw new VoiceError('CONFIG','timeoutMs must be from 1 to 120000');
  const signal=AbortSignal.any([AbortSignal.timeout(timeout), ...(dependencies.signal?[dependencies.signal]:[])]);
  signal.throwIfAborted();
  const plan=toProviderRequest(c,r,credential);
  let bytes:Uint8Array, container:'wav'|'mp3'='wav';
  if(plan.transport==='websocket') {
    bytes=await dialogue(plan,signal,dependencies.webSocketFactory??(url=>new WebSocket(url)));
    container='mp3';
  } else {
    const response=await (dependencies.fetch??fetch)(plan.url,{
      method:'POST',headers:plan.headers,body:JSON.stringify(plan.body),signal,redirect:'error',
    });
    if(!response.ok) {
      await response.body?.cancel().catch(()=>{});
      // Do not relay vendor error bodies that may echo text or credentials.
      throw new VoiceError('PROVIDER',`Provider request failed with HTTP ${response.status}`);
    }
    // Base64 JSON needs more room than decoded audio; decoded sizes remain bounded separately.
    const raw=await readBounded(response,signal,plan.decoder==='wav'?MAX_BYTES:Math.ceil(MAX_BYTES/3)*4+65536);
    if(plan.decoder==='wav') bytes=assertWav(raw);
    else {
      let data:unknown;
      try { data=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(raw)); }
      catch { throw new VoiceError('PROTOCOL','Provider returned invalid JSON'); }
      if(plan.decoder==='gemini-pcm') bytes=decodeGemini(data);
      else {
        if(!data || typeof data!=='object') throw new VoiceError('PROTOCOL','Expected audio JSON object');
        const object=data as Record<string,unknown>;
        if(plan.decoder==='speechify-base64' && object.audio_format!=='wav')
          throw new VoiceError('PROTOCOL','Speechify response format did not match WAV request');
        bytes=assertWav(fromBase64(object[plan.decoder==='inworld-base64'?'audioContent':'audio_data']));
      }
    }
  }
  signal.throwIfAborted();
  return { requestId:r.requestId, provider:c.provider, model:c.model, voiceId:c.voice.id,
    delivery:'buffered',bytes,container,mediaType:container==='wav'?'audio/wav':'audio/mpeg' };
}
