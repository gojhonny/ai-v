// Proposed application contract, verified against the cited 2026-09-08 snapshot.
// These application identifiers are not vendor SDK identifiers.
export type Provider = 'cartesia' | 'inworld' | 'speechify' | 'elevenlabs'
  | 'google' | 'openai' | 'smallest' | 'soniox';
export type ApiVariant = 'bytes' | 'synthesize' | 'speech' | 'dialogue-websocket'
  | 'generate-content' | 'waves' | 'realtime-http';

export interface VoiceConfig {
  schemaVersion: 1;
  kind: 'tts';
  profileId: string;
  endpoint: string; // Same-origin application route; NEVER an upstream URL.
  provider: Provider;
  apiVariant: ApiVariant;
  model: string;
  voice: { id: string }; // Provider-scoped identity, not a portable persona.
  delivery: 'buffered'; // This reference waits for complete audio before playback.
  locale?: string; // Requested language; mapping requires provider support.
  options?: {
    cartesia?: { speed?: number };
    inworld?: { instruction?: string; speakingRate?: number };
    openai?: { instructions?: string };
  };
}

export interface SpeechRequest { requestId: string; text: string }
export interface SpeechResult {
  requestId: string;
  provider: Provider;
  model: string;
  voiceId: string;
  delivery: 'buffered';
  bytes: Uint8Array;
  mediaType: 'audio/wav' | 'audio/mpeg';
  container: 'wav' | 'mp3';
}
export type ErrorCode = 'CONFIG' | 'UNSUPPORTED' | 'PROVIDER' | 'PROTOCOL' | 'LIMIT';
export class VoiceError extends Error {
  code: ErrorCode;
  constructor(code: ErrorCode, message: string) {
    super(message); this.name = 'VoiceError'; this.code = code;
  }
}

export const MODELS: Record<Provider, readonly string[]> = {
  cartesia: ['sonic-3.6'],
  inworld: ['inworld-tts-2', 'inworld-tts-2-flash'],
  speechify: ['simba-3.2'],
  elevenlabs: ['eleven_v3_conversational'],
  google: ['gemini-3.1-flash-tts-preview'],
  openai: ['gpt-4o-mini-tts'],
  smallest: ['lightning_v3.1_pro'],
  soniox: ['tts-rt-v2'],
};
export const VARIANTS: Record<Provider, ApiVariant> = {
  cartesia: 'bytes', inworld: 'synthesize', speechify: 'speech',
  elevenlabs: 'dialogue-websocket', google: 'generate-content',
  openai: 'speech', smallest: 'waves', soniox: 'realtime-http',
};

export function record(value: unknown, label: string): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw new VoiceError('CONFIG', `${label} must be an object`);
  return value as Record<string, unknown>;
}
export function nonempty(value: unknown, label: string): string {
  if (typeof value !== 'string' || !value.trim())
    throw new VoiceError('CONFIG', `${label} must be a nonempty string`);
  return value;
}
export function onlyKeys(value: Record<string, unknown>, keys: string[], label: string): void {
  for (const key of Object.keys(value)) if (!keys.includes(key))
    throw new VoiceError('UNSUPPORTED', `${label}.${key} is not supported by this reference`);
}
function range(value: unknown, min: number, max: number): void {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max)
    throw new VoiceError('CONFIG', `Expected a finite number from ${min} to ${max}`);
}

export function validateConfig(value: unknown): VoiceConfig {
  const c = record(value, 'config');
  onlyKeys(c, ['schemaVersion','kind','profileId','endpoint','provider','apiVariant','model','voice','delivery','locale','options'], 'config');
  if (c.schemaVersion !== 1 || c.kind !== 'tts' || c.delivery !== 'buffered')
    throw new VoiceError('UNSUPPORTED', 'Expected schemaVersion 1, kind tts and buffered delivery');
  const provider = nonempty(c.provider, 'provider');
  if (!Object.hasOwn(MODELS, provider)) throw new VoiceError('UNSUPPORTED', 'Provider has no verified reference adapter');
  const p = provider as Provider;
  if (!MODELS[p].includes(nonempty(c.model, 'model')) || c.apiVariant !== VARIANTS[p])
    throw new VoiceError('UNSUPPORTED', 'Model or API variant is not in this dated adapter catalog');
  if (!/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,79}$/.test(nonempty(c.profileId, 'profileId')))
    throw new VoiceError('CONFIG', 'Invalid profileId');
  // A deliberately narrow route grammar also excludes //host, backslashes and query strings.
  const endpoint = nonempty(c.endpoint, 'endpoint');
  if (!/^\/[a-zA-Z0-9/_-]+$/.test(endpoint) || endpoint.startsWith('//'))
    throw new VoiceError('CONFIG', 'endpoint must be an application-relative route');
  const voice = record(c.voice, 'voice'); onlyKeys(voice, ['id'], 'voice');
  const voiceId = nonempty(voice.id, 'voice.id');
  if (voiceId.length > 200 || /[<>\r\n]/.test(voiceId)) throw new VoiceError('CONFIG', 'Select a real provider voice ID');
  if (p === 'cartesia' && !/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(voiceId))
    throw new VoiceError('CONFIG', 'Cartesia voice must be a UUID');
  if (p === 'soniox' && c.locale === undefined)
    throw new VoiceError('CONFIG', 'The Soniox reference requires an explicit input locale');
  if (c.locale !== undefined) {
    const locale = nonempty(c.locale, 'locale');
    try { if (Intl.getCanonicalLocales(locale)[0] !== locale) throw new Error(); }
    catch { throw new VoiceError('CONFIG', 'Use a canonical BCP 47 locale'); }
    if (p === 'speechify' && locale.split('-')[0] !== 'en')
      throw new VoiceError('UNSUPPORTED', 'Simba 3.2 is English-only');
    if (['google', 'openai', 'elevenlabs'].includes(p))
      throw new VoiceError('UNSUPPORTED', 'This adapter does not enforce locale; author input in the desired language');
  }
  if (c.options !== undefined) {
    const options = record(c.options, 'options');
    onlyKeys(options, [p], 'options');
    if (options[p] !== undefined) {
      const o = record(options[p], `options.${p}`);
      if (p === 'cartesia') {
        onlyKeys(o, ['speed'], p); if (o.speed !== undefined) range(o.speed, 0.6, 1.5);
      } else if (p === 'inworld') {
        onlyKeys(o, ['instruction', 'speakingRate'], p);
        if (o.speakingRate !== undefined) range(o.speakingRate, 0.5, 1.5);
        if (o.instruction !== undefined) {
          nonempty(o.instruction, 'instruction');
          if (c.model === 'inworld-tts-2-flash') throw new VoiceError('UNSUPPORTED', 'Flash does not support instruction');
        }
      } else if (p === 'openai') {
        onlyKeys(o, ['instructions'], p);
        if (o.instructions !== undefined) nonempty(o.instructions, 'instructions');
      } else throw new VoiceError('UNSUPPORTED', 'No provider options are implemented for this adapter');
    }
  }
  // Return a fresh JSON value so external mutations cannot alter a stored configuration.
  return structuredClone(c) as unknown as VoiceConfig;
}

export function validateRequest(value: SpeechRequest): SpeechRequest {
  const r = record(value, 'request'); onlyKeys(r, ['requestId', 'text'], 'request');
  if (!/^[a-zA-Z0-9._-]{1,100}$/.test(nonempty(r.requestId, 'requestId')))
    throw new VoiceError('CONFIG', 'Invalid requestId');
  const text = nonempty(r.text, 'text');
  // Application policy, not a universal provider quota. UTF-16 length is conservative here.
  if (text.length > 1800) throw new VoiceError('LIMIT', 'Reference request limit is 1800 UTF-16 code units');
  return { requestId: r.requestId as string, text };
}

export interface SimpleInput {
  provider: Provider | 'openai-speech' | 'cartesia-speech' | 'inworld-speech'
    | 'speechify-speech' | 'elevenlabs-dialogue' | 'google-gemini-tts'
    | 'smallest-speech' | 'soniox-speech';
  endpoint: string; model: string; voice: string;
  profileId: string; locale?: string;
}
export function fromSimple(input: SimpleInput): VoiceConfig {
  onlyKeys(record(input, 'input'), ['provider','endpoint','model','voice','profileId','locale'], 'input');
  const aliases: Record<string, Provider> = {
    'openai-speech': 'openai', 'cartesia-speech': 'cartesia', 'inworld-speech': 'inworld',
    'speechify-speech': 'speechify', 'elevenlabs-dialogue': 'elevenlabs',
    'google-gemini-tts': 'google', 'smallest-speech': 'smallest', 'soniox-speech': 'soniox',
  };
  const provider = Object.hasOwn(aliases, input.provider) ? aliases[input.provider] : input.provider;
  return validateConfig({ schemaVersion: 1, kind: 'tts', profileId: input.profileId,
    endpoint: input.endpoint, provider, apiVariant: VARIANTS[provider as Provider],
    model: input.model, voice: { id: input.voice }, delivery: 'buffered',
    ...(input.locale ? { locale: input.locale } : {}) });
}

// Import only the documented minimal configuration subset. Reject unsupported keys;
// never imply arbitrary full vendor requests can be converted without information loss.
export function fromNative(provider: Provider, input: unknown,
  application: { profileId: string; endpoint: string }): VoiceConfig {
  const n = record(input, 'native');
  let model: unknown, voice: unknown, locale: unknown;
  switch (provider) {
    case 'cartesia': onlyKeys(n, ['model_id','voice'], 'native'); model=n.model_id; voice=n.voice; break;
    case 'inworld': onlyKeys(n, ['modelId','voiceId'], 'native'); model=n.modelId; voice=n.voiceId; break;
    case 'speechify': case 'smallest': onlyKeys(n, ['model','voice_id'], 'native'); model=n.model; voice=n.voice_id; break;
    case 'elevenlabs': onlyKeys(n, ['model_id','voices'], 'native'); model=n.model_id;
      if (!Array.isArray(n.voices) || n.voices.length !== 1) throw new VoiceError('CONFIG', 'Expected one registered dialogue voice');
      voice=n.voices[0]; break;
    case 'google': {
      onlyKeys(n, ['model','speechConfig'], 'native'); model=n.model;
      const s=record(n.speechConfig,'speechConfig'); onlyKeys(s,['voiceConfig'],'speechConfig');
      const v=record(s.voiceConfig,'voiceConfig'); onlyKeys(v,['prebuiltVoiceConfig'],'voiceConfig');
      const p=record(v.prebuiltVoiceConfig,'prebuiltVoiceConfig'); onlyKeys(p,['voiceName'],'prebuiltVoiceConfig');
      voice=p.voiceName; break;
    }
    case 'openai': onlyKeys(n, ['model','voice'], 'native'); model=n.model; voice=n.voice; break;
    case 'soniox': onlyKeys(n, ['model','voice','language'], 'native');
      model=n.model; voice=n.voice; locale=nonempty(n.language,'language'); break;
    default: throw new VoiceError('UNSUPPORTED', 'No verified importer for this provider');
  }
  return fromSimple({ provider, ...application, model: nonempty(model,'model'), voice: nonempty(voice,'voice'),
    ...(locale ? { locale: nonempty(locale,'locale') } : {}) });
}
