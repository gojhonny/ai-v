// Node.js 22+. Documentation-checked examples; no live API validation.
// Each function synthesizes supplied text, not a complete conversational agent.

function input({ text, voiceId, apiKey }) {
  for (const [label, value] of Object.entries({ text, voiceId, apiKey })) {
    if (typeof value !== 'string' || !value.trim()) throw new Error(`${label} is required`);
  }
}

async function post(url, headers, body, signal) {
  const timeout = AbortSignal.timeout(60000);
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
    signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
  });
  if (!response.ok) throw new Error(`Speech service returned HTTP ${response.status}`);
  return response;
}

async function bytes(response, container) {
  const audio = new Uint8Array(await response.arrayBuffer());
  if (!audio.byteLength) throw new Error('Speech service returned no audio');
  return { audio, container, contentType: response.headers.get('content-type') };
}

// https://docs.cartesia.ai/api-reference/tts/bytes
export async function cartesia(options) {
  input(options);
  const { text, voiceId, apiKey, signal, language = 'en' } = options;
  return bytes(await post('https://api.cartesia.ai/tts/bytes', {
    Authorization: `Bearer ${apiKey}`, 'Cartesia-Version': '2026-08-14',
  }, {
    model_id: 'sonic-3.6', transcript: text, voice: voiceId, language,
    output_format: { container: 'wav', encoding: 'pcm_s16le', sample_rate: 44100 },
  }, signal), 'wav');
}

// https://docs.speechify.ai/build/streaming-tts-guide
export async function speechify(options) {
  input(options);
  const { text, voiceId, apiKey, signal, model = 'simba-3.2', language } = options;
  if (!['simba-3.2', 'simba-3.0'].includes(model)) throw new Error('Unsupported example model');
  if (model === 'simba-3.2' && language && !language.startsWith('en')) {
    throw new Error('Simba 3.2 is English-only; use an appropriate Simba 3.0 voice');
  }
  return bytes(await post('https://api.speechify.ai/v1/audio/stream', {
    Authorization: `Bearer ${apiKey}`,
  }, { input: text, voice_id: voiceId, model, ...(language ? { language } : {}) }, signal), 'provider-stream');
}

// https://murf.ai/api/docs/api-reference/text-to-speech/stream
export async function murf(options) {
  input(options);
  const { text, voiceId, apiKey, signal, locale = 'en-US' } = options;
  return bytes(await post('https://global.api.murf.ai/v1/speech/stream', {
    'api-key': apiKey,
  }, { model: 'falcon-2', voiceId, locale, text, format: 'WAV', sampleRate: 24000 }, signal), 'wav');
}

// https://docs.smallest.ai/models/api-reference/text-to-speech/synthesize-speech
export async function smallest(options) {
  input(options);
  const { text, voiceId, apiKey, signal, language = 'en' } = options;
  return bytes(await post('https://api.smallest.ai/waves/v1/tts', {
    Authorization: `Bearer ${apiKey}`, Accept: 'audio/wav',
  }, {
    model: 'lightning_v3.1_pro', voice_id: voiceId, language, text,
    sample_rate: 24000, output_format: 'wav',
  }, signal), 'wav');
}

// https://docs.gradium.ai/api-reference/endpoint/tts-post
export async function gradium(options) {
  input(options);
  const { text, voiceId, apiKey, signal } = options;
  return bytes(await post('https://api.gradium.ai/api/post/speech/tts', {
    'x-api-key': apiKey,
  }, { text, voice_id: voiceId, output_format: 'wav', only_audio: true }, signal), 'wav');
}

// https://docs.fish.audio/api-reference/endpoint/openapi-v1/text-to-speech
export async function fish(options) {
  input(options);
  const { text, voiceId, apiKey, signal } = options;
  return bytes(await post('https://api.fish.audio/v1/tts', {
    Authorization: `Bearer ${apiKey}`, model: 's2.1-pro',
  }, { text, reference_id: voiceId, format: 'mp3' }, signal), 'mp3');
}

// https://platform.minimax.io/docs/api-reference/speech-t2a-http
export async function minimax(options) {
  input(options);
  const { text, voiceId, apiKey, signal, model = 'speech-2.8-turbo', languageBoost = 'English' } = options;
  if (!['speech-2.8-hd', 'speech-2.8-turbo'].includes(model)) throw new Error('Unsupported example model');
  const response = await post('https://api.minimax.io/v1/t2a_v2', {
    Authorization: `Bearer ${apiKey}`,
  }, {
    model, text, stream: false, output_format: 'hex', language_boost: languageBoost,
    voice_setting: { voice_id: voiceId, speed: 1, vol: 1, pitch: 0 },
    audio_setting: { format: 'mp3', sample_rate: 32000, bitrate: 128000, channel: 1 },
  }, signal);
  const result = await response.json();
  const hex = result.data?.audio;
  if (result.base_resp?.status_code !== 0 || typeof hex !== 'string' || !/^(?:[a-f0-9]{2})+$/i.test(hex)) {
    throw new Error('MiniMax returned an application error or invalid audio');
  }
  return { audio: new Uint8Array(Buffer.from(hex, 'hex')), container: 'mp3', contentType: 'audio/mpeg' };
}
