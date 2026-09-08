# TypeScript Voice API Research Sources and Evidence Gaps

**Research date and access date:** 2026-09-08

The register contains primary provider documentation, provider-owned implementation examples, browser API documentation and the benchmark publisher. Model release dates, API revision dates and access dates are distinct. A missing publication date is recorded as missing rather than inferred from the access date.

## Source register

| Source | Publisher | Version or date | Claim family |
| --- | --- | --- | --- |
| [Text to Speech Leaderboard](https://artificialanalysis.ai/text-to-speech/leaderboard/provider-voice) | Artificial Analysis | Not displayed; living documentation | Preference ranking; not a live implementation test |
| [Sonic 3.6](https://docs.cartesia.ai/build-with-cartesia/tts-models/latest) | Cartesia | Snapshot 2026-08-27 | Model and language identity |
| [Text-to-Speech Bytes](https://docs.cartesia.ai/api-reference/tts/bytes) | Cartesia | API version 2026-08-14 | API version, UUID voice, request and binary response |
| [Output Audio Format](https://docs.cartesia.ai/build-with-cartesia/capability-guides/tts-output-audio-format) | Cartesia | Not displayed; living documentation | Container and encoding compatibility |
| [List Voices](https://docs.cartesia.ai/api-reference/voices/list) | Cartesia | Not displayed; living documentation | Voice catalog and pagination |
| [Volume, Speed, and Emotion](https://docs.cartesia.ai/build-with-cartesia/capability-guides/volume-speed-emotion) | Cartesia | Not displayed; living documentation | Model controls and limits |
| [Text-to-Speech WebSocket](https://docs.cartesia.ai/api-reference/tts/websocket) | Cartesia | Not displayed; living documentation | Context events and cancellation |
| [TTS Models](https://docs.inworld.ai/tts/tts-models) | Inworld | Not displayed; living documentation | Flagship and Flash identities |
| [Synthesize Speech](https://docs.inworld.ai/api-reference/ttsAPI/texttospeech/synthesize-speech) | Inworld | Not displayed; living documentation | Request, WAV, language, control semantics and response |
| [List Voices in a Workspace](https://docs.inworld.ai/api-reference/voiceAPI/voiceservice/list-voices) | Inworld | Not displayed; living documentation | Voice IDs and pagination |
| [Synthesize Speech Stream](https://docs.inworld.ai/api-reference/ttsAPI/texttospeech/synthesize-speech-stream) | Inworld | Not displayed; living documentation | Streaming formats and chunk headers |
| [JavaScript Streaming Example](https://github.com/inworld-ai/inworld-api-examples/blob/main/tts/js/example_tts_stream.js) | Inworld | Not displayed; living documentation | Incremental newline-delimited JSON parsing |
| [Bidirectional Speech WebSocket](https://docs.inworld.ai/api-reference/ttsAPI/texttospeech/synthesize-speech-websocket) | Inworld | Not displayed; living documentation | Flush and close semantics |
| [Models](https://docs.speechify.ai/build/guides/concepts/models) | Speechify | Not displayed; living documentation | Simba 3.2 English-only and curated voices |
| [Create Speech](https://docs.speechify.ai/build/api-reference/v1/audio/speech) | Speechify | Not displayed; living documentation | Request, base64 response and explicit format |
| [API Versioning](https://docs.speechify.ai/build/guides/concepts/api-versioning) | Speechify | API version example 2026-06-28 | Speechify-Version header |
| [List Voices](https://docs.speechify.ai/build/api-reference/v1/voices/get) | Speechify | Not displayed; living documentation | Model compatibility and pagination |
| [Streaming](https://docs.speechify.ai/build/guides/text-to-speech/streaming) | Speechify | Not displayed; living documentation | Raw audio stream formats and errors |
| [Voice AI APIs](https://www.vuilabs.ai/) | VUI Labs | Not displayed; living documentation | Public partial snippet; complete API contract unresolved |
| [Breeze TTS 2 Model Card](https://huggingface.co/BreezeBlue/Breeze-TTS-2) | BreezeBlue | Model release 2026-08-25 | Self-hosted multipart API, PCM output, languages and license notice |
| [Breeze TTS Official Inference](https://github.com/breezeblue-ai/breeze-tts) | BreezeBlue | Not displayed; living documentation | Python model deployment boundary |
| [Models](https://elevenlabs.io/docs/overview/models) | ElevenLabs | Not displayed; living documentation | Exact conversational model and voice synthesis scope |
| [Stream Dialogue in Real Time](https://elevenlabs.io/docs/eleven-api/guides/how-to/websockets/realtime-tdd) | ElevenLabs | Not displayed; living documentation | WebSocket initialization, ordered audio and finalization |
| [Text-to-Dialogue WebSocket](https://elevenlabs.io/docs/api-reference/text-to-dialogue/ttd-websocket) | ElevenLabs | Not displayed; living documentation | Protocol options, errors and turn final events |
| [List Voices](https://elevenlabs.io/docs/api-reference/voices/search) | ElevenLabs | Not displayed; living documentation | Account voices and pagination |
| [TTS versus TTD WebSockets](https://elevenlabs.io/docs/eleven-api/guides/how-to/websockets/tts-vs-ttd-websockets) | ElevenLabs | Not displayed; living documentation | Do not reuse legacy TTS protocol for conversational model |
| [Speech Generation](https://ai.google.dev/gemini-api/docs/speech-generation) | Google | Not displayed; living documentation | Current Interactions example, voices, language and model |
| [Speech Generation with Generate Content](https://ai.google.dev/gemini-api/docs/generate-content/speech-generation) | Google | Not displayed; living documentation | Documented legacy API variant and PCM wrapping |
| [Generating Content API Reference](https://ai.google.dev/api/generate-content) | Google | Not displayed; living documentation | Endpoint, nested speech configuration and candidate finish reason |
| [Lightning v3.1 Pro Model Card](https://docs.smallest.ai/models/model-cards/text-to-speech/lightning-v-3-1-pro) | Smallest AI | Not displayed; living documentation | Model and regional voices |
| [Synthesize Speech](https://docs.smallest.ai/models/api-reference/text-to-speech/synthesize-speech) | Smallest AI | Not displayed; living documentation | Endpoint, binary response and Accept header |
| [Get Waves Voices](https://docs.smallest.ai/models/api-reference/text-to-speech/get-waves-voices) | Smallest AI | Not displayed; living documentation | Hyphenated voice pool path versus underscored model ID |
| [Streaming](https://docs.smallest.ai/models/documentation/text-to-speech-lightning/streaming) | Smallest AI | Not displayed; living documentation | SSE versus WebSocket envelopes |
| [TTS Models](https://soniox.com/docs/tts/models) | Soniox | GA release 2026-08-11 | Exact model and GA release |
| [Generate Speech](https://soniox.com/docs/tts/rest-api/generate-speech) | Soniox | Not displayed; living documentation | Dedicated TTS host, native fields, binary response |
| [Voices](https://soniox.com/docs/tts/concepts/voices) | Soniox | Not displayed; living documentation | Voice names and clone IDs |
| [Supported Languages](https://soniox.com/docs/tts/concepts/supported-languages) | Soniox | Not displayed; living documentation | Base language codes including pt |
| [TTS WebSocket API](https://soniox.com/docs/api-reference/tts/websocket-api) | Soniox | Not displayed; living documentation | Per-stream cancellation and terminal events |
| [Text to Speech](https://developers.openai.com/api/docs/guides/text-to-speech) | OpenAI | Not displayed; living documentation | gpt-4o-mini-tts, marin, instructions and formats |
| [Create Speech API Reference](https://developers.openai.com/api/reference/resources/audio/subresources/speech/methods/create) | OpenAI | Not displayed; living documentation | Speech endpoint native fields |
| [Models Overview](https://docs.anthropic.com/en/docs/about-claude/models/overview) | Anthropic | Not displayed; living documentation | Text output reasoning models; not ranked speech synthesis |
| [Claude Cookbook](https://docs.anthropic.com/en/docs/resources/cookbook) | Anthropic | Not displayed; living documentation | Voice assistant recipe uses external speech components |
| [BaseAudioContext decodeAudioData](https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/decodeAudioData) | MDN Web Docs | Page modified 2024-07-29 | Complete-file decoding, not arbitrary audio chunks |
| [HTMLMediaElement play](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) | MDN Web Docs | Not displayed; living documentation | Playback promise and autoplay rejection |

The [machine-readable register](data/sources.json) includes stable source IDs and access dates. The [cohort snapshot](data/cohort.json) records selection membership, confidence intervals and current global positions independently.

## Research method and stopping point

The first pass recovered the earlier ten-model selection, checked the benchmark and inspected current provider model pages. Follow-up lanes traced model identity through voice catalogs, request schemas, response envelopes and streaming guides. Material disagreements were checked against explicit response contracts and provider-owned examples. The coordinator spot-checked versioned Cartesia requests, Inworld audio envelopes, ElevenLabs finalization, Google response structure, and Smallest/Soniox binary responses.

The review stopped when every integration had a documented contract or an explicit missing-evidence statement. Additional broad vendor searches would not resolve account entitlement or live audio behavior. Those require a future authenticated smoke test and listening evaluation. No API keys, private sources, product-specific architecture or unpublished results were used.

## Contradictions and access limits

| Issue | Resolution in this study |
| --- | --- |
| Earlier cohort versus global leaderboard | Preserve the requested cohort; do not label it the current global top ten. |
| Cartesia generated JavaScript calls res.json on an audio endpoint | Follow explicit audio response schema and output-format documentation. |
| Smallest generated Python sample calls response.json | Follow explicit binary response and Accept header contract. |
| Cartesia old voice object versus current string | Pin API revision 2026-08-14 and use the current UUID string contract. |
| Inworld flagship versus Flash controls | Reject unsupported Flash instructions instead of allowing silent omission. |
| Luna public example lacks deployment fields | Document the partial example; leave the executable adapter unsupported. |
| Breeze source-code license versus model license | Keep their distinct terms visible; do not infer commercial model rights from Apache source code. |
| Eleven conversational generic REST compatibility | Not established; implement documented Text-to-Dialogue WebSocket. |
| Google Generate Content versus Interactions | Use an explicit Generate Content variant; do not mix fields or events. |
| Coordinator could not open the dedicated Google legacy speech page | Research worker read it; coordinator corroborated structural fields with the public Generate Content reference. Two coordinator opens returned an internal retrieval error. |
| Coordinator full Speechify speech-page open failed | Worker read the page; coordinator also saw the official indexed request excerpt. |
| Model language coverage versus native quality | No new language-specific listening experiment; compatible language is not a quality ranking. |
| Abort versus completion/flush versus billing | State each separately; no universal provider billing cancellation claim. |

## Evidence confidence

Request/response shapes have documentary support; account/model/voice access and actual returned audio are untested. The proposed canonical schema, application limits, permission boundary and evaluation protocol are original engineering recommendations. Offline tests establish fixture behavior and catch known protocol mistakes; they do not prove production readiness.

## Refresh triggers

Revisit the affected adapter when a model or voice retires, an API revision changes, a contract fixture fails against a real service, or an account gains new capabilities. Preserve this dated snapshot and document changes in a later revision. Re-audition voices after changing model, voice ID, locale, prosody controls or audio processing.
