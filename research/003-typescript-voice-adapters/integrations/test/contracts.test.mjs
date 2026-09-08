import test from 'node:test';
import assert from 'node:assert/strict';
import { fromSimple, fromNative, validateConfig } from '../src/contracts.ts';
import { toProviderRequest } from '../src/plans.ts';
import { profiles, elevenProfile } from '../src/profiles.ts';
import { synthesize } from '../src/engine.ts';
import { pcm16ToWav, assertWav, decodeGemini, ElevenAccumulator, readBounded, fromBase64 } from '../src/audio.ts';
import { createSpeechHandler } from '../src/server.ts';
import { breezeLocal } from '../src/breeze-local.ts';

const request={requestId:'turn-42',text:'Could you help me compare these options?'};
const pcm=Uint8Array.of(0,0,255,127,0,128,0,0);
const wav=pcm16ToWav(pcm);
const b64=bytes=>Buffer.from(bytes).toString('base64');
const json=data=>new Response(JSON.stringify(data),{headers:{'Content-Type':'application/json'}});

test('the original OpenAI-style object imports without confusing app route and upstream URL',()=>{
  const c=fromSimple({provider:'openai-speech',endpoint:'/api/voice/speech',profileId:'openai-marin',model:'gpt-4o-mini-tts',voice:'marin'});
  assert.equal(c.provider,'openai'); assert.equal(c.voice.id,'marin');
  assert.equal(toProviderRequest(c,request,'test-credential').url,'https://api.openai.com/v1/audio/speech');
  assert.throws(()=>validateConfig({...c,endpoint:'https://example.org/speech'}));
  assert.throws(()=>validateConfig({...c,endpoint:'//example.org/speech'}));
  assert.throws(()=>validateConfig({...c,apiKey:'not-allowed-in-config'}));
});

test('literal top-five gap is explicit, and unsupported controls are not dropped',()=>{
  assert.throws(()=>validateConfig({...profiles.cartesia,provider:'vui-labs',model:'Luna TTS'}),/no verified/);
  assert.throws(()=>validateConfig({...profiles.inworldFlash,options:{inworld:{instruction:'Whisper'}}}),/Flash/);
  assert.throws(()=>validateConfig({...profiles.speechify,locale:'pt-BR'}),/English-only/);
  assert.throws(()=>validateConfig({...profiles.cartesia,options:{cartesia:{speed:9}}}));
  assert.throws(()=>fromNative('inworld',{modelId:'inworld-tts-2',voiceId:'Dennis',temperature:1},{profileId:'x',endpoint:'/api/voice/speech'}));
  assert.throws(()=>fromNative('elevenlabs',{model_id:'eleven_v3_conversational',voices:['a','b']},{profileId:'x',endpoint:'/api/voice/speech'}));
  assert.throws(()=>validateConfig({...profiles.google,apiVariant:'interactions'}));
  assert.throws(()=>validateConfig({...profiles.soniox,locale:undefined}),/explicit/);
});

test('self-hosted Breeze uses multipart inference controls without invented model or voice fields',async()=>{
  const result=await breezeLocal({...request,instruction:'A clear English voice'},new AbortController().signal,
    async(url,options)=>{
      assert.equal(url,'http://127.0.0.1:7860/v1/audio/speech');
      assert(options.body instanceof FormData); assert.equal(options.headers,undefined);
      assert.equal(options.body.get('text'),request.text); assert.equal(options.body.get('cfg_scale'),'4');
      assert.equal(options.body.has('model'),false); assert.equal(options.body.has('voice_id'),false);
      return new Response(pcm);
    });
  assert.deepEqual(result,wav);
});

test('versioned request fixtures preserve documented native field boundaries',()=>{
  const c=toProviderRequest(profiles.cartesia,request,'credential');
  assert.equal(c.headers['Cartesia-Version'],'2026-08-14');
  assert.equal(typeof c.body.voice,'string'); assert.equal(c.body.transcript,request.text);
  assert.deepEqual(c.body.output_format,{container:'wav',encoding:'pcm_s16le',sample_rate:44100});
  const i=toProviderRequest(profiles.inworld,request,'credential');
  assert.equal(i.headers.Authorization,'Basic credential'); assert.equal(i.body.voiceId,'Dennis');
  assert.equal(i.body.modelId,'inworld-tts-2'); assert.equal(i.body.audioConfig.audioEncoding,'WAV');
  const s=toProviderRequest(profiles.speechify,request,'credential');
  assert.equal(s.headers['Speechify-Version'],'2026-06-28'); assert.equal(s.body.voice_id,'geffen_32');
  assert.equal(s.body.model,'simba-3.2'); assert.equal(s.body.input,request.text);
  const g=toProviderRequest(profiles.google,request,'credential');
  assert(g.url.endsWith(':generateContent')); assert.equal(g.body.generationConfig.speechConfig.voiceConfig.prebuiltVoiceConfig.voiceName,'Kore');
  assert.equal(g.body.response_format,undefined);
});

test('audio normalization decodes each provider envelope and rejects missing/wrong audio',async()=>{
  for(const [profile,response] of [
    [profiles.cartesia,new Response(wav)], [profiles.inworld,json({audioContent:b64(wav)})],
    [profiles.speechify,json({audio_data:b64(wav),audio_format:'wav'})],
    [profiles.openai,new Response(wav)], [profiles.smallest,new Response(wav)], [profiles.soniox,new Response(wav)],
  ]) {
    const result=await synthesize(profile,request,'credential',{fetch:async()=>response});
    assert.deepEqual(result.bytes,wav); assert.equal(result.mediaType,'audio/wav'); assert.equal(result.requestId,'turn-42');
  }
  await assert.rejects(()=>synthesize(profiles.speechify,request,'credential',{fetch:async()=>json({audio_data:b64(wav),audio_format:'mp3'})}),/format/);
  await assert.rejects(()=>synthesize(profiles.cartesia,request,'credential',{fetch:async()=>json({error:'unexpected'})}),/WAVE/);
  await assert.rejects(()=>synthesize(profiles.inworld,request,'credential',{fetch:async()=>new Response('private provider details',{status:401})}),/HTTP 401/);
  assert.throws(()=>fromBase64('@@@'));
});

test('PCM wrapping is lossless, metadata-aware, and rejects truncated or unfinished results',()=>{
  assert.equal(Buffer.from(wav.subarray(0,4)).toString(),'RIFF');
  const view=new DataView(wav.buffer); assert.equal(view.getUint32(24,true),24000); assert.equal(view.getUint16(22,true),1);
  assert.deepEqual(wav.subarray(44),pcm); assertWav(wav);
  assert.throws(()=>assertWav(wav.slice(0,-1)),/Truncated/);
  assert.throws(()=>pcm16ToWav(Uint8Array.of(1)));
  const gemini={candidates:[{finishReason:'STOP',content:{parts:[{text:'metadata'},
    {inlineData:{mimeType:'audio/L16;codec=pcm;rate=24000',data:b64(pcm)}}]}}]};
  assert.deepEqual(decodeGemini(gemini),wav);
  assert.throws(()=>decodeGemini({...gemini,candidates:[{...gemini.candidates[0],finishReason:'MAX_TOKENS'}]}));
  gemini.candidates[0].content.parts[1].inlineData.mimeType='audio/L16;codec=pcm;rate=48000';
  assert.throws(()=>decodeGemini(gemini),/metadata/);
});

test('dialogue turn-final does not end the session; audio preserves order',()=>{
  const acc=new ElevenAccumulator();
  assert.equal(acc.accept({audio:b64(Uint8Array.of(1,2)),is_final_audio_for_turn:true}),undefined);
  assert.equal(acc.accept({alignment:{chars:['a']}}),undefined);
  assert.deepEqual(acc.accept({audio:b64(Uint8Array.of(3,4)),is_final:true}),Uint8Array.of(1,2,3,4));
  assert.equal(acc.accept({audio:b64(Uint8Array.of(5))}),undefined);
  assert.throws(()=>new ElevenAccumulator().accept({is_final:true}),/without audio/);
  assert.throws(()=>new ElevenAccumulator().accept({error:'provider failure'}),/failed/);
});

class FakeSocket {
  sent=[]; closed=false;
  onopen=null; onmessage=null; onclose=null; onerror=null;
  send(value){this.sent.push(JSON.parse(value));}
  close(){this.closed=true;}
  message(data){this.onmessage?.({data:JSON.stringify(data)});}
}

test('WebSocket driver completes only after provider final and rejects premature closure',async()=>{
  const socket=new FakeSocket();
  const pending=synthesize(elevenProfile('account-voice-id'),request,'credential',{webSocketFactory:()=>socket});
  socket.onopen();
  assert.deepEqual(socket.sent[0],{voices:['account-voice-id'],xi_api_key:'credential'});
  assert.deepEqual(socket.sent[2],{close_socket:true});
  socket.message({audio:b64(Uint8Array.of(73,68,51)),is_final_audio_for_turn:true});
  socket.message({is_final:true});
  const result=await pending; assert.equal(result.mediaType,'audio/mpeg'); assert(socket.closed);
  const early=new FakeSocket();
  const incomplete=synthesize(elevenProfile('account-voice-id'),request,'credential',{webSocketFactory:()=>early});
  early.onclose(); await assert.rejects(incomplete,/before is_final/);
});

test('abort closes dialogue transport without sending another flush message',async()=>{
  const socket=new FakeSocket(),controller=new AbortController();
  const pending=synthesize(elevenProfile('account-voice-id'),request,'credential',{
    signal:controller.signal,webSocketFactory:()=>socket,
  });
  socket.onopen(); const sent=socket.sent.length;
  controller.abort(); await assert.rejects(pending,{name:'AbortError'});
  assert(socket.closed); assert.equal(socket.sent.length,sent);
  assert.equal(socket.onmessage,null);
});

test('bounded readers reject overflow and abort a pending read',async()=>{
  await assert.rejects(()=>readBounded(new Response(new Uint8Array(8)),new AbortController().signal,4),/limit/);
  let cancelled=false;
  const controller=new AbortController();
  const pending=readBounded(new Response(new ReadableStream({cancel(){cancelled=true;}})),controller.signal);
  controller.abort(); await assert.rejects(pending,{name:'AbortError'}); assert(cancelled);
});

test('server resolves authorized profiles and refuses arbitrary upstream configuration',async()=>{
  let calls=0,reservations=0;
  const handler=createSpeechHandler({profiles:[profiles.cartesia],
    authorizeAndReserve:async()=>{reservations++;return true;},credentialFor:async()=> 'credential',
    engine:{fetch:async()=>{calls++;return new Response(wav);}},
  });
  const req=(body,origin='https://app.example')=>new Request('https://app.example/api/voice/speech',{
    method:'POST',headers:{'Content-Type':'application/json',Origin:origin},body:JSON.stringify(body),
  });
  const input={profileId:profiles.cartesia.profileId,...request};
  assert.equal((await handler(req({...input,endpoint:'https://elsewhere.invalid'}))).status,400);
  assert.equal((await handler(req({...input,profileId:'unknown'}))).status,404);
  assert.equal((await handler(req(input,'https://other.example'))).status,403);
  assert.equal((await handler(req({...input,text:'x'.repeat(1801)}))).status,413);
  assert.equal(calls,0); assert.equal(reservations,0);
  const response=await handler(req(input)); assert.equal(response.status,200);
  assert.equal(response.headers.get('Content-Type'),'audio/wav'); assert.equal(calls,1);
  assert.deepEqual(new Uint8Array(await response.arrayBuffer()),wav);
  const denied=createSpeechHandler({profiles:[profiles.cartesia],authorizeAndReserve:async()=>false,
    credentialFor:async()=>{throw new Error('Must not resolve credential');}});
  assert.equal((await denied(req(input))).status,403);
});
