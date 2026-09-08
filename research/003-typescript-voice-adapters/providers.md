# Natural Voice Models: TypeScript Configuration and Native API Contracts

**Research date:** 2026-09-08

These profiles follow the ten-model cohort in the [study](README.md). `provider` aliases and `/api/voice/speech` are application conventions. Upstream URLs and body keys below are provider contracts. Examples are documentation-derived; no live synthesis or account entitlement check was executed. Model and voice catalogs must be checked with the application's credentials before deployment.

## 1. Cartesia Sonic 3.6

Use `model: 'sonic-3.6'` and a catalog UUID for the voice. The current versioned contract is materially different from older examples that used a `{ mode: 'id', id }` voice object. The reference uses a UUID **string**, pins `Cartesia-Version: 2026-08-14`, and requests a WAV response. An optional immutable model snapshot is documented; the shipped catalog deliberately keeps the reviewed model alias and rejects other IDs until explicitly updated. [Sonic 3.6 model](https://docs.cartesia.ai/build-with-cartesia/tts-models/latest), [Bytes API](https://docs.cartesia.ai/api-reference/tts/bytes).

```ts
const voiceModel = {
  provider: 'cartesia-speech',
  endpoint: '/api/voice/speech',
  profileId: 'cartesia-skylar',
  model: 'sonic-3.6',
  voice: 'db6b0ed5-d5d3-463d-ae85-518a07d3c2b4',
  locale: 'en-US',
} as const;

// POST https://api.cartesia.ai/tts/bytes
// Authorization: Bearer <server credential>
// Cartesia-Version: 2026-08-14
const body = {
  model_id: voiceModel.model,
  voice: voiceModel.voice,
  transcript: 'Welcome. How can I help?',
  locale: voiceModel.locale,
  output_format: { container: 'wav', encoding: 'pcm_s16le', sample_rate: 44100 },
};
```

The result is binary audio. The generated JavaScript snippet on the API page calls `res.json()`, but its response specification identifies audio bytes; the adapter follows the response contract. Use `arrayBuffer()` or a bounded stream reader. Voice discovery is `GET /voices` with pagination; use catalog locale/accent metadata. The documented Skylar ID above is an example, not an account-access guarantee. [Voice catalog](https://docs.cartesia.ai/api-reference/voices/list), [Audio formats](https://docs.cartesia.ai/build-with-cartesia/capability-guides/tts-output-audio-format).

Sonic 3.6 lists Portuguese. The adapter can map `locale` directly; it must not send both `language` and `locale`. Its speed option is provider guidance, not guaranteed digital time stretching. Streaming endpoints require their own event decoding and supported output formats.

## 2. Inworld TTS 2

Inworld uses camelCase identity fields and Basic authorization with its issued credential. The full-result endpoint returns a JSON wrapper rather than raw audio. [Models](https://docs.inworld.ai/tts/tts-models), [Synthesize speech](https://docs.inworld.ai/api-reference/ttsAPI/texttospeech/synthesize-speech).

```ts
const nativeConfig = { modelId: 'inworld-tts-2', voiceId: 'Dennis' };

// POST https://api.inworld.ai/tts/v1/voice
// Authorization: Basic <server credential>
const body = {
  ...nativeConfig,
  text: 'Welcome. How can I help?',
  audioConfig: { audioEncoding: 'WAV', sampleRateHertz: 24000 },
  language: 'en-US',
};
// JSON result: { audioContent: '<base64>', usage: {...} }
```

Convert `audioContent` from base64 and validate the WAV container. Discover accessible system/workspace voices with `GET /voices/v1/voices`; retain `voiceId` and follow `nextPageToken`. The full model supports `instruction` and `deliveryMode`; those settings must not be assumed to work on Flash. [Voice catalog](https://docs.inworld.ai/api-reference/voiceAPI/voiceservice/list-voices).

Streaming adds a significant format distinction: the HTTP stream is parsed as newline-delimited JSON, and its documented LINEAR16 form includes a WAV header in every audio chunk. A stream parser must preserve partial JSON across transport boundaries; blindly joining independent WAV files is invalid. [Streaming reference](https://docs.inworld.ai/api-reference/ttsAPI/texttospeech/synthesize-speech-stream), [Official JavaScript stream parser](https://github.com/inworld-ai/inworld-api-examples/blob/main/tts/js/example_tts_stream.js).

## 3. Speechify Simba 3.2

Use the explicit model ID and a compatible curated voice. **Simba 3.2 is English-only.** A Portuguese text field cannot make it a Portuguese model; selecting another Speechify model changes the evaluated model and requires a separate comparison. [Model catalog](https://docs.speechify.ai/build/guides/concepts/models).

```ts
const nativeConfig = { model: 'simba-3.2', voice_id: 'geffen_32' };

// POST https://api.speechify.ai/v1/audio/speech
// Authorization: Bearer <server credential>
// Speechify-Version: 2026-06-28
const body = {
  ...nativeConfig,
  input: 'Welcome. How can I help?',
  audio_format: 'wav',
  language: 'en-US',
};
// JSON result: { audio_data: '<base64>', audio_format: 'wav', ... }
```

`audio_data` differs from Inworld's `audioContent`. Explicitly validate the returned format. The reference pins the provider's documented version example rather than inventing a header from today's date. Query `GET /v1/voices?model=simba-3.2&locale=en`, then follow `has_more`/`next_cursor`. [Create speech](https://docs.speechify.ai/build/api-reference/v1/audio/speech), [Versioning](https://docs.speechify.ai/build/guides/concepts/api-versioning), [Voice discovery](https://docs.speechify.ai/build/api-reference/v1/voices/get).

The separate `/v1/audio/stream` endpoint returns raw audio selected through `Accept`; its supported formats differ from the full-result endpoint. A WAV choice cannot be carried over blindly. Speech controls use SSML in input, so this reference does not expose a pretend provider-neutral emotion control. [Streaming documentation](https://docs.speechify.ai/build/guides/text-to-speech/streaming).

## 4. VUI Labs Luna TTS

The public website identifies Luna TTS and displays a TypeScript-style request to `$VUILABS_API_BASE_URL/v1/text-to-speech`, using `X-API-Key`, `voice_id`, and `text`, followed by `res.blob()`. However, that example leaves the base URL and voice ID unspecified; it does not establish a complete model-selection, discovery, format or streaming contract. This is stronger evidence than no API mention, but insufficient for a validated production adapter. [VUI Labs public site](https://www.vuilabs.ai/).

```ts
// Catalog metadata only; deliberately not executable VoiceConfig.
const lunaCandidate = {
  provider: 'vui-labs',
  displayName: 'Luna TTS',
  modelId: null,
  integrationStatus: 'contract-unverified',
  missing: ['base URL', 'model selector', 'voice discovery', 'audio contract'],
} as const;
```

The canonical catalog can retain this candidate while the executable configuration validator rejects it. Do not guess `model: 'luna-tts'`, a public hostname, a voice ID or an OpenAI-compatible path. A future adapter needs vendor documentation or an account-specific contract plus a controlled smoke test. Portuguese support also remains unverified. Luna's benchmark placement is not proof that its API is publicly deployable.

## 5. Inworld TTS 2 Flash

The identity change is small:

```ts
const nativeConfig = {
  modelId: 'inworld-tts-2-flash',
  voiceId: 'Dennis',
};
```

Use the same `/tts/v1/voice` endpoint, Basic authentication and response decoder as TTS 2. The **capability change is not small**: the documented `instruction` and `deliveryMode` controls apply to the full model and are ignored on Flash. The reference rejects Flash instructions before making a network request. A provider-level capabilities list alone would miss this distinction. [Inworld models](https://docs.inworld.ai/tts/tts-models), [Request controls](https://docs.inworld.ai/api-reference/ttsAPI/texttospeech/synthesize-speech).

The earlier benchmark row was labeled research preview. The current model page documents the current model ID; this research does not prove that every production output is identical to the previously evaluated snapshot. Keep those evidence labels separate when comparing voices.

## 6. BreezeBlue Breeze TTS 2

This model has a documented self-hosted path. Its Python runtime loads the checkpoint when the server starts, so a per-request `model` property is not part of the demonstrated HTTP contract. Voice design uses an instruction; cloning/direction uses reference audio and its transcript. A single reusable `voice.id` does not describe those workflows faithfully. [Model card and API example](https://huggingface.co/BreezeBlue/Breeze-TTS-2), [Official inference repository](https://github.com/breezeblue-ai/breeze-tts).

```ts
// Server-side caller of a separately started local Python inference server.
const body = new FormData();
body.set('text', 'Welcome. How can I help?');
body.set('instruction', 'A calm, clear English voice.');
body.set('cfg_scale', '4');
body.set('seed', '42');

const response = await fetch('http://127.0.0.1:7860/v1/audio/speech', {
  method: 'POST',
  body,
});
// Documented response: mono 24 kHz PCM S16LE, without a WAV header.
```

Do not set `Content-Type` manually for `FormData`: the runtime supplies its multipart boundary. The separate [Breeze helper](integrations/src/breeze-local.ts) wraps the returned PCM into WAV. It is not in the shared hosted-provider registry.

The model card distinguishes Apache-licensed source code from research/non-commercial model weights and self-hosted outputs. It separately describes commercial use of hosted outputs under paid-service terms. English and Chinese are documented. Accordingly, the study does not treat this self-hosted path as an unrestricted commercial substitute for Luna.

## 7. ElevenLabs Eleven v3 Conversational

The exact model is `eleven_v3_conversational`. Its explicitly documented path is **Text-to-Dialogue WebSocket**. Do not silently substitute `eleven_v3` or reuse the older Text-to-Speech WebSocket's message structure. [Model catalog](https://elevenlabs.io/docs/overview/models), [Protocol comparison](https://elevenlabs.io/docs/eleven-api/guides/how-to/websockets/tts-vs-ttd-websockets).

```ts
const config = {
  model_id: 'eleven_v3_conversational',
  voices: [selectedVoiceId], // An accessible ID from the account voice catalog.
};

// Connect on the SERVER:
// wss://api.elevenlabs.io/v1/text-to-dialogue/stream-input
//   ?model_id=eleven_v3_conversational&output_format=mp3_44100_128
socket.send(JSON.stringify({ ...{ voices: config.voices }, xi_api_key: serverKey }));
socket.send(JSON.stringify({
  inputs: [{ text: 'Welcome. How can I help?', voice_id: selectedVoiceId, new_turn: false }],
}));
socket.send(JSON.stringify({ close_socket: true }));
```

Send those messages only after the connection opens. The conversational model permits one registered voice. Decode each JSON `audio` field from base64, preserve order, reject error events and wait for `is_final: true`. `is_final_audio_for_turn` is not the whole-session final event. `close_socket` requests flushing/completion; it is not cancellation. The executable driver handles premature close, abort, size limits and terminal cleanup. [Realtime dialogue guide](https://elevenlabs.io/docs/eleven-api/guides/how-to/websockets/realtime-tdd), [WebSocket schema](https://elevenlabs.io/docs/api-reference/text-to-dialogue/ttd-websocket).

Discover voices with `GET /v2/voices`, following `has_more` and `next_page_token`. No universal voice default is invented in the reference. Portuguese is listed in the model's language coverage. The exact conversational-model/REST combination remains unverified in this study; generic string-accepting REST schemas do not establish model support. [Voice catalog](https://elevenlabs.io/docs/api-reference/voices/search).

## 8. Google Gemini 3.1 Flash TTS Preview

The model ID is `gemini-3.1-flash-tts-preview`; `Kore` is a documented prebuilt voice. This provider is particularly useful for testing whether the abstraction hides only vendor differences or also confuses separate API families. [Speech generation](https://ai.google.dev/gemini-api/docs/speech-generation).

```ts
const config = {
  model: 'gemini-3.1-flash-tts-preview',
  speechConfig: {
    voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
  },
};

// POST https://generativelanguage.googleapis.com/v1beta/models/
//      gemini-3.1-flash-tts-preview:generateContent
// x-goog-api-key: <server credential>
const body = {
  contents: [{ parts: [{ text: 'Welcome. How can I help?' }] }],
  generationConfig: {
    responseModalities: ['AUDIO'],
    speechConfig: config.speechConfig,
  },
};
```

This **Generate Content** variant remains documented on a page labeled Legacy. The current main speech guide also demonstrates **Interactions**, whose field names include `response_format` and `generation_config.speech_config`, and whose event structure differs. The reference explicitly chooses `apiVariant: 'generate-content'`; it does not mix schemas. Legacy labeling alone is not evidence of removal. [Generate Content speech guide](https://ai.google.dev/gemini-api/docs/generate-content/speech-generation), [API reference](https://ai.google.dev/api/generate-content).

Inspect `candidates[0].finishReason` and the content parts, find `inlineData`, validate the PCM MIME parameters and decode the audio. Missing audio or abnormal completion is an error even after HTTP 200. The reference wraps known 24 kHz mono S16LE PCM as WAV. Gemini supports Portuguese and prompt-based direction, but exact spoken-text preservation and direction behavior need an audible test. It is a preview contract; pinning the application variant does not remove provider lifecycle risk.

## 9. Smallest AI Lightning v3.1 Pro

The request model uses underscores; the model-specific voice discovery path uses hyphens. The documented Brazilian Portuguese voice `juliana` makes that distinction concrete. [Model card](https://docs.smallest.ai/models/model-cards/text-to-speech/lightning-v-3-1-pro), [Voice discovery](https://docs.smallest.ai/models/api-reference/text-to-speech/get-waves-voices).

```ts
// POST https://api.smallest.ai/waves/v1/tts
// Authorization: Bearer <server credential>
// Accept: audio/wav
const body = {
  model: 'lightning_v3.1_pro',
  voice_id: 'juliana',
  text: 'Olá. Como posso ajudar?',
  language: 'pt',
  sample_rate: 24000,
  output_format: 'wav',
};
```

Read binary audio, not JSON. Discover the Pro voice pool using `GET /waves/v1/lightning-v3.1-pro/get_voices`; retain returned `voiceId`. The reference warns that a model/voice mismatch can produce incorrect output, so string validation alone cannot establish compatibility. Follow the explicit binary-response description rather than the generated Python sample's JSON call. [Synthesize Speech](https://docs.smallest.ai/models/api-reference/text-to-speech/synthesize-speech).

The streaming surface uses `/waves/v1/tts/live`. HTTP SSE audio events and WebSocket `{ status, data }` events have different envelopes and completion markers. They require separate decoders; the companion uses full-result HTTP. [Streaming guide](https://docs.smallest.ai/models/documentation/text-to-speech-lightning/streaming).

## 10. Soniox TTS Realtime v2

The request goes to a dedicated TTS hostname. Voice identity may be a catalog name or a clone ID. The model page documents v2's general availability on 2026-08-11. [Models](https://soniox.com/docs/tts/models), [Voices](https://soniox.com/docs/tts/concepts/voices).

```ts
// POST https://tts-rt.soniox.com/tts
// Authorization: Bearer <server credential>
const body = {
  model: 'tts-rt-v2',
  voice: 'Adrian',
  language: 'pt',
  text: 'Olá. Como posso ajudar?',
  audio_format: 'wav',
  sample_rate: 24000,
};
```

The REST response is binary audio. Do not reuse a general Soniox REST hostname by analogy. Validate the requested output and handle non-success status before consuming the body. The reference includes Portuguese in its language coverage. [Generate speech](https://soniox.com/docs/tts/rest-api/generate-speech), [Languages](https://soniox.com/docs/tts/concepts/supported-languages).

The WebSocket variant supports multiple identified streams. `audio_end` ends audio output; `terminated` ends stream state. Its documented `{ stream_id, cancel: true }` differs from another provider's flush-and-close operation. A future shared streaming interface should preserve that distinction. [WebSocket API](https://soniox.com/docs/api-reference/tts/websocket-api).

## OpenAI reference bridge

OpenAI is an additional configuration bridge, not an extra row inserted into the naturalness ranking:

```ts
// POST https://api.openai.com/v1/audio/speech
// Authorization: Bearer <server credential>
const body = {
  model: 'gpt-4o-mini-tts',
  voice: 'marin',
  input: 'Welcome. How can I help?',
  response_format: 'wav',
};
```

The upstream call returns audio bytes. The full TTS system can accept speaking instructions; the reference maps them through `options.openai.instructions`. Native Realtime sessions remain a different interface because they manage ongoing conversations, input audio and events, not merely text-to-audio generation. [OpenAI guide](https://developers.openai.com/api/docs/guides/text-to-speech), [Speech API](https://developers.openai.com/api/reference/resources/audio/subresources/speech/methods/create).
