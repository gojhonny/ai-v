import { fromSimple, fromNative } from './contracts.ts';

// Documented stock voice IDs; catalog compatibility/access still needs a live check.
export const profiles = {
  cartesia: fromSimple({ provider:'cartesia-speech', profileId:'cartesia-skylar',
    endpoint:'/api/voice/speech', model:'sonic-3.6', voice:'db6b0ed5-d5d3-463d-ae85-518a07d3c2b4', locale:'en-US' }),
  inworld: fromNative('inworld', {modelId:'inworld-tts-2',voiceId:'Dennis'},
    {profileId:'inworld-dennis',endpoint:'/api/voice/speech'}),
  inworldFlash: fromNative('inworld', {modelId:'inworld-tts-2-flash',voiceId:'Dennis'},
    {profileId:'inworld-flash-dennis',endpoint:'/api/voice/speech'}),
  speechify: fromNative('speechify',{model:'simba-3.2',voice_id:'geffen_32'},
    {profileId:'speechify-geffen',endpoint:'/api/voice/speech'}),
  google: fromNative('google',{ model:'gemini-3.1-flash-tts-preview',
    speechConfig:{voiceConfig:{prebuiltVoiceConfig:{voiceName:'Kore'}}}},
    {profileId:'gemini-kore',endpoint:'/api/voice/speech'}),
  openai: fromSimple({ provider:'openai-speech', profileId:'openai-marin',
    endpoint:'/api/voice/speech', model:'gpt-4o-mini-tts', voice:'marin' }),
  smallest: fromSimple({ provider:'smallest-speech', profileId:'smallest-juliana',
    endpoint:'/api/voice/speech', model:'lightning_v3.1_pro',voice:'juliana',locale:'pt-BR' }),
  soniox: fromSimple({ provider:'soniox-speech', profileId:'soniox-adrian',
    endpoint:'/api/voice/speech', model:'tts-rt-v2',voice:'Adrian',locale:'pt-BR' }),
};

// Resolve an account-accessible ID using GET /v2/voices; no invented default voice.
export function elevenProfile(voiceId:string) {
  return fromNative('elevenlabs',{model_id:'eleven_v3_conversational',voices:[voiceId]},
    {profileId:'eleven-conversational',endpoint:'/api/voice/speech'});
}
