import type { VoiceConfig } from './contracts.ts';
import { VoiceError, record, onlyKeys, nonempty, validateConfig, validateRequest } from './contracts.ts';
import { readBounded } from './audio.ts';
import { synthesize } from './engine.ts';
import type { EngineDependencies } from './engine.ts';

export interface ServerDependencies {
  // Host implements authenticated user/profile authorization AND quota reservation.
  authorizeAndReserve:(request:Request,profile:VoiceConfig)=>Promise<boolean>;
  credentialFor:(profile:VoiceConfig)=>Promise<string>;
  profiles:readonly VoiceConfig[];
  engine?:EngineDependencies;
}

// Framework-neutral Request -> Response handler; mount at the configured same-origin route.
export function createSpeechHandler(deps:ServerDependencies) {
  const registry=new Map<string,VoiceConfig>();
  for(const value of deps.profiles) {
    const c=validateConfig(value);
    if(registry.has(c.profileId)) throw new VoiceError('CONFIG','Duplicate profileId');
    registry.set(c.profileId,c);
  }
  return async(request:Request):Promise<Response>=>{
    const headers={ 'Cache-Control':'no-store', 'Content-Type':'application/json' };
    const fail=(status:number,error:string)=>new Response(JSON.stringify({error}),{status,headers});
    if(request.method!=='POST') return fail(405,'METHOD_NOT_ALLOWED');
    const origin=request.headers.get('origin');
    if(origin && origin!==new URL(request.url).origin) return fail(403,'ORIGIN_REJECTED');
    if(!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) return fail(415,'EXPECTED_JSON');
    try {
      const raw=await readBounded(new Response(request.body),request.signal,16384);
      let input:unknown;
      try { input=JSON.parse(new TextDecoder().decode(raw)); }
      catch { return fail(400,'INVALID_JSON'); }
      const body=record(input,'body'); onlyKeys(body,['profileId','text','requestId'],'body');
      const profile=registry.get(nonempty(body.profileId,'profileId'));
      if(!profile || new URL(request.url).pathname!==profile.endpoint) return fail(404,'UNKNOWN_PROFILE');
      const speechRequest=validateRequest({requestId:nonempty(body.requestId,'requestId'),text:nonempty(body.text,'text')});
      // Browser-supplied model/endpoint/credentials are never used as upstream authority.
      if(!await deps.authorizeAndReserve(request,profile)) return fail(403,'NOT_AUTHORIZED');
      const result=await synthesize(profile,speechRequest,await deps.credentialFor(profile),{...deps.engine,signal:request.signal});
      return new Response(result.bytes.slice().buffer as ArrayBuffer,{
        headers:{ 'Content-Type':result.mediaType,'Cache-Control':'no-store',
          'X-Voice-Request-Id':result.requestId,'X-Content-Type-Options':'nosniff' },
      });
    } catch(error) {
      if(request.signal.aborted) return fail(499,'CANCELLED');
      if(error instanceof VoiceError) {
        if(error.code==='LIMIT') return fail(413,'LIMIT_EXCEEDED');
        if(error.code==='CONFIG'||error.code==='UNSUPPORTED') return fail(400,'INVALID_CONFIGURATION');
      }
      return fail(502,'SPEECH_UNAVAILABLE');
    }
  };
}
