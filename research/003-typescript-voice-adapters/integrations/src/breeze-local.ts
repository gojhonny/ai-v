import { pcm16ToWav, readBounded } from './audio.ts';
import { nonempty, validateRequest } from './contracts.ts';

// SERVER ONLY, separate research/non-commercial self-hosted example.
// The Python server is started separately with the Breeze TTS 2 checkpoint.
// This endpoint has no documented model or voice_id field; do not invent them.
export async function breezeLocal(request:{requestId:string;text:string;instruction:string},
  signal:AbortSignal, fetcher:typeof fetch=fetch):Promise<Uint8Array> {
  const r=validateRequest({requestId:request.requestId,text:request.text});
  const body=new FormData(); body.set('text',r.text);
  body.set('instruction',nonempty(request.instruction,'instruction'));
  body.set('cfg_scale','4'); body.set('seed','42');
  const response=await fetcher('http://127.0.0.1:7860/v1/audio/speech',{
    method:'POST',body,signal,redirect:'error',
  });
  if(!response.ok) { await response.body?.cancel(); throw new Error(`Breeze HTTP ${response.status}`); }
  return pcm16ToWav(await readBounded(response,signal),24000);
}
