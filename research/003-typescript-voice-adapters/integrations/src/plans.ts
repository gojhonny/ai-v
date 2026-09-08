import { validateConfig, validateRequest, VoiceError } from './contracts.ts';
import type { VoiceConfig, SpeechRequest } from './contracts.ts';

export type Decoder = 'wav' | 'inworld-base64' | 'speechify-base64' | 'gemini-pcm';
export type RequestPlan = {
  transport: 'http'; url: string; headers: Record<string, string>;
  body: Record<string, unknown>; decoder: Decoder;
} | {
  transport: 'websocket'; url: string; messages: Record<string, unknown>[];
  decoder: 'eleven-mp3';
};

// SERVER ONLY: the resulting plan contains credentials. Never serialize it to the client.
export function toProviderRequest(config: VoiceConfig, request: SpeechRequest, credential: string): RequestPlan {
  const c=validateConfig(config), r=validateRequest(request);
  if (!credential.trim() || /[\r\n]/.test(credential)) throw new VoiceError('CONFIG', 'A server-side provider credential is required');
  const json = { 'Content-Type': 'application/json' };
  const bearer = { ...json, Authorization: `Bearer ${credential}` };
  const voice=c.voice.id, text=r.text;
  switch (c.provider) {
    case 'cartesia': return {
      transport:'http', url:'https://api.cartesia.ai/tts/bytes', decoder:'wav',
      headers:{ ...bearer, 'Cartesia-Version':'2026-08-14' },
      body:{ model_id:c.model, transcript:text, voice,
        output_format:{ container:'wav', encoding:'pcm_s16le', sample_rate:44100 },
        ...(c.locale ? { locale:c.locale } : {}),
        ...(c.options?.cartesia?.speed !== undefined ? { generation_config:{ speed:c.options.cartesia.speed } } : {}) },
    };
    case 'inworld': return {
      transport:'http', url:'https://api.inworld.ai/tts/v1/voice', decoder:'inworld-base64',
      // Credential is the provider-issued Basic value; do not base64-encode it again.
      headers:{ ...json, Authorization:`Basic ${credential}` },
      body:{ text, voiceId:voice, modelId:c.model,
        audioConfig:{ audioEncoding:'WAV', sampleRateHertz:24000,
          ...(c.options?.inworld?.speakingRate !== undefined ? { speakingRate:c.options.inworld.speakingRate } : {}) },
        ...(c.locale ? { language:c.locale } : {}),
        ...(c.options?.inworld?.instruction ? { instruction:c.options.inworld.instruction } : {}) },
    };
    case 'speechify': return {
      transport:'http', url:'https://api.speechify.ai/v1/audio/speech', decoder:'speechify-base64',
      headers:{ ...bearer, 'Speechify-Version':'2026-06-28' },
      body:{ model:c.model, voice_id:voice, input:text, audio_format:'wav',
        ...(c.locale ? { language:c.locale } : {}) },
    };
    case 'elevenlabs': return {
      transport:'websocket', decoder:'eleven-mp3',
      url:'wss://api.elevenlabs.io/v1/text-to-dialogue/stream-input'
        + '?model_id=eleven_v3_conversational&output_format=mp3_44100_128',
      messages:[{ voices:[voice], xi_api_key:credential },
        { inputs:[{ text, voice_id:voice, new_turn:false }] }, { close_socket:true }],
    };
    case 'google': return {
      transport:'http', decoder:'gemini-pcm',
      url:`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(c.model)}:generateContent`,
      headers:{ ...json, 'x-goog-api-key':credential },
      body:{ contents:[{ parts:[{ text }] }], generationConfig:{ responseModalities:['AUDIO'],
        speechConfig:{ voiceConfig:{ prebuiltVoiceConfig:{ voiceName:voice } } } } },
    };
    case 'openai': return {
      transport:'http', url:'https://api.openai.com/v1/audio/speech', decoder:'wav', headers:bearer,
      body:{ model:c.model, voice, input:text, response_format:'wav',
        ...(c.options?.openai?.instructions ? { instructions:c.options.openai.instructions } : {}) },
    };
    case 'smallest': return {
      transport:'http', url:'https://api.smallest.ai/waves/v1/tts', decoder:'wav',
      headers:{ ...bearer, Accept:'audio/wav' },
      body:{ model:c.model, voice_id:voice, text, output_format:'wav', sample_rate:24000,
        ...(c.locale ? { language:c.locale.split('-')[0] } : {}) },
    };
    case 'soniox': return {
      transport:'http', url:'https://tts-rt.soniox.com/tts', decoder:'wav', headers:bearer,
      body:{ model:c.model, voice, text, audio_format:'wav', sample_rate:24000,
        ...(c.locale ? { language:c.locale.split('-')[0] } : {}) },
    };
  }
}
