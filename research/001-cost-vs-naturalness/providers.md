# Voice Models and Providers: Capabilities, Costs, and Integration Boundaries

**Evidence checked: 2026-09-06 (UTC).**

[Study](README.md) · [Integration guide](integrations/README.md) · [Source register](sources.md)

These profiles explain every row in the two main tables and the native cost panel. Language support and latency statements are provider documentation claims unless explicitly identified otherwise. No model was auditioned or benchmarked by the author.

## Cartesia

**Sonic 3.6 · `sonic-3.6` · TTS.** This is a speech-output component with Portuguese support and a generally available API. The stable alias can move; `sonic-3.6-2026-08-27` is a documented dated snapshot useful when freezing an evaluation. A voice identifier selects the speaker separately from the synthesis model. [Model documentation](https://docs.cartesia.ai/build-with-cartesia/tts-models/latest).

The price in the cost table allocates the Pro plan's $5 payment over its 100,000 included credits. It assumes full use for TTS; it is not a verified per-request PAYG offer. Preprocessing and shared credit consumption can affect this allocation. [Plan pricing](https://www.cartesia.ai/pricing), [Credit accounting](https://docs.cartesia.ai/pricing).

The HTTP byte endpoint accepts the whole transcript and streams audio. Incremental text requires a different interface, such as the provider's realtime SDK. Current HTTP configuration uses a version header, a string voice ID, and explicit output format. The [example](integrations/http-tts.mjs) consumes bytes rather than treating the response as JSON. [Bytes API](https://docs.cartesia.ai/api-reference/tts/bytes), [Realtime quickstart](https://docs.cartesia.ai/get-started/realtime-text-to-speech-quickstart).

**Evaluation focus:** test whether the preference advantage remains with the required language, voice and client transport. Measure the full delay through recognition and reasoning; excellent synthesis cannot by itself fix slow turn detection.

## Inworld

**Realtime TTS 2 · `inworld-tts-2` · TTS.** The full model supports natural-language speech direction and multilingual output, with Portuguese in the provider's Tier 1 language group. This lets an application request a specific delivery style without changing the text-generation model. [Models](https://docs.inworld.ai/tts/tts-models), [Languages](https://docs.inworld.ai/tts/capabilities/multilingual).

The baseline uses On-Demand's $25/M characters. Lower rates require a different plan; enterprise floors should not be used as universal prices. This is the synthesis bill, not the complete Inworld agent product. [Pricing](https://inworld.ai/pricing).

The [SDK example](integrations/sdk-tts.mjs) uses `@inworld/tts` and keeps voice, model, and audio encoding explicit. The SDK parameter names differ from raw REST fields, so copying a REST payload directly into the SDK is unsafe. [Node SDK](https://docs.inworld.ai/tts/node-sdk).

**Evaluation focus:** compare ordinary speech and directed speech separately. Expressive controls have value only if they produce the intended tone consistently without unwanted changes in wording or timing.

## Inworld Flash

**Realtime TTS 2 Flash · `inworld-tts-2-flash` · TTS.** Flash targets speed and lower synthesis cost. It shares language coverage with the full model, but it ignores the full model's natural-language steering directions. Non-verbal tags remain supported. Treat `steering` as a capability rather than promising identical controls across both models. [Prompting differences](https://docs.inworld.ai/tts/best-practices/prompting-for-tts-2).

The selected benchmark entry was a research preview. The current model documentation supports production use; exact equivalence between the preview result and the current API snapshot has not been established. The provisional combined score makes that mismatch visible. [Model documentation](https://docs.inworld.ai/tts/tts-models).

The same SDK example switches to Flash by changing the model value. Audio framing still matters: the documented `WAV` stream places its header in the first chunk, while `LINEAR16` has different chunk packaging. [Quickstart](https://docs.inworld.ai/quickstart-tts).

**Evaluation focus:** short acknowledgements, pause placement, interruption recovery, and whether reduced control materially affects the desired voice experience.

## Speechify

**Simba 3.2 · `simba-3.2` · TTS.** This model is English-only. **Simba 3.0 · `simba-3.0`** is the relevant documented alternative for Brazilian Portuguese. Changing only a language field on 3.2 does not establish Portuguese support, and its preference result must not be transferred to 3.0. Verify voice compatibility using the model and voice catalogs. Cloning availability is workspace-dependent in the current documentation. [Models](https://docs.speechify.ai/build/guides/concepts/models).

Speechify's character denominator excludes whitespace and SSML tags. The cost example counts the fixture accordingly and uses the Starter rate. The hosted voice-agent service is a different product from the TTS endpoint. [Pricing and billing](https://speechify.ai/pricing).

The HTTP [example](integrations/http-tts.mjs) reads the stream as binary audio. The one-shot endpoint instead exposes base64 audio in JSON. The current SDK is `@speechify/api`; older SDK names should not be copied blindly. [Streaming guide](https://docs.speechify.ai/build/streaming-tts-guide), [Official SDKs](https://docs.speechify.ai/build/guides/get-started/official-sdks).

**Evaluation focus:** English voice preference, allowed voice/model pairings, and the cost impact of actual monthly utilization. For Portuguese, run a distinct evaluation of Simba 3.0.

## Luna

**Luna TTS · VUI Labs · research/access-limited integration evidence.** The research distinguishes fully non-autoregressive Luna-TTS from a blockwise realtime variant. A leaderboard entry named Luna TTS does not identify which deployment behavior an application will receive. The paper documents English, Chinese, Japanese, and Korean; Portuguese was not established in this review. [Technical report](https://arxiv.org/html/2608.11593v1).

The official site advertises API access, but the public material reviewed did not establish a deployable base URL, complete model-selection contract, or verified price. It is therefore unscored for cost and has no fabricated executable provider wrapper. [VUI Labs](https://www.vuilabs.ai/).

**Integration boundary:** obtain the provider's actual endpoint, authentication method, model/version selector, voice catalog, audio format, streaming semantics, limits, and tariff before implementation. The [integration guide](integrations/README.md#luna-access-boundary) identifies the missing contract explicitly.

**Evaluation focus:** access reproducibility and realtime behavior are prerequisites, even when listening results are promising.

## Breeze

**Breeze TTS 2 · `BreezeBlue/Breeze-TTS-2` · local synthesis.** The model card documents English/Chinese speech, reference-audio conditioning, and a local streaming service. Its JavaScript integration can call that already-running service; downloading weights does not provide a managed voice-agent backend. [Model card](https://huggingface.co/BreezeBlue/Breeze-TTS-2).

The license distinguishes code from weights. The code uses Apache-2.0, while weights, derivatives, and self-hosted outputs have separate noncommercial/research restrictions. The license revision dated September 1, 2026 requires separate commercial permission; hosted outputs follow their service terms. [License](https://huggingface.co/BreezeBlue/Breeze-TTS-2/blob/main/LICENSE).

The [local HTTP example](integrations/breeze-local.mjs) uses multipart form data and returns raw PCM. A real deployment also needs the model runtime, suitable hardware, access control, scheduling, and audio delivery. Those operating costs are unmeasured, so self-hosted inference is not scored as free.

**Evaluation focus:** verify permitted use, hardware fit, first-request warmup, sustained concurrency, and actual generated audio quality before comparing operating economics.

## ElevenLabs

**Eleven v3 Conversational · `eleven_v3_conversational` · TTS.** This is a separate model from `eleven_v3`, designed for interactive speech with expressive tags and Portuguese among its supported languages. [Models](https://elevenlabs.io/docs/overview/models).

The displayed standalone API rate is $50/M characters. A signup promotion was visible when checked, so future purchases must recheck the applicable terms. This synthesis tariff does not include a hosted agent's conversation-minute charge. [API pricing](https://elevenlabs.io/pricing/api).

Use the dedicated Text-to-Dialogue WebSocket route. The conversational variant permits one registered voice; its initialization, text inputs, buffering, flushing, and finalization differ from a generic TTS WebSocket. The [example](integrations/websocket-tts.mjs) decodes base64 audio and waits for final completion. For a persistent connection, the application must implement keepalive and reuse instead of closing after every response. [Realtime dialogue guide](https://elevenlabs.io/docs/eleven-api/guides/how-to/websockets/realtime-tdd).

**Evaluation focus:** expressive speech with short streaming text fragments. Initial text buffering can matter more than a model's headline latency on brief conversational turns.

## Gemini TTS

**Gemini 3.1 Flash TTS · `gemini-3.1-flash-tts-preview` · TTS preview.** This output model supports Portuguese, speech-performance instructions, and multiple speakers. It is distinct from Gemini Live. Its current documentation demonstrates streaming through the Interactions API, so the [example](integrations/sdk-tts.mjs) uses that contract and decodes audio deltas. [Speech generation](https://ai.google.dev/gemini-api/docs/speech-generation).

The standard tariff meters text input and audio output separately. The scenario assumes a text-token count and output duration, which should be replaced with usage measurements. Batch pricing is excluded because an interactive application cannot assume a batch workflow. [Pricing](https://ai.google.dev/gemini-api/docs/pricing).

**Integration boundary:** the application still supplies recognition, reasoning, tool control, and conversation state. The output is audio data with its own format, not a ready browser media session. Preserve sample-rate metadata and validate the selected voice.

**Evaluation focus:** response direction, voice consistency, performance under incremental output, and the effect of preview changes on stored configurations.

## Smallest

**Lightning v3.1 Pro · `lightning_v3.1_pro` · TTS.** Pro is distinct from standard v3.1. Its catalog contains Brazilian and European Portuguese voices selected with `language: "pt"`; the voice itself determines regional character. Model and voice pools must match. [Pro model card](https://docs.smallest.ai/models/model-cards/text-to-speech/lightning-v-3-1-pro).

The published rate is $19.50/M characters. Current documents disagree on standard concurrency, so the study does not promise a fixed capacity for every account. [Pricing](https://smallest.ai/pricing/models).

The [HTTP example](integrations/http-tts.mjs) requests a WAV response, while SSE/WebSocket are separate live routes. A full REST input limit and a recommended streaming fragment size describe different constraints. Word timestamps are not universally available across all Pro voices. [Synthesis reference](https://docs.smallest.ai/models/api-reference/text-to-speech/synthesize-speech).

**Evaluation focus:** choose the correct Pro voice, verify account limits, and test timestamp support only where the actual application needs it.

## Soniox

**TTS Realtime v2 · `tts-rt-v2` · TTS.** The documentation lists a generally available realtime model and Portuguese support; listed voices can speak the supported languages. [Models](https://soniox.com/docs/tts/models), [Languages](https://soniox.com/docs/tts/concepts/supported-languages).

Pricing is based on input text and output audio tokens. The advertised hourly illustration is approximate. The study applies the provider's token conversion references to the fixture and assumed audio duration. [Pricing](https://soniox.com/pricing).

The WebSocket initializes an identified stream, receives text inputs, and returns base64 audio. Completion uses `terminated`; `audio_end` alone is not full lifecycle completion. The [example](integrations/websocket-tts.mjs) preserves that distinction. [Realtime protocol](https://soniox.com/docs/tts/rt/real-time-generation).

There is a documented two-minute generated-audio limit per stream, with additional concurrency and stream limits. Longer speech requires segmentation and correctly handling truncation indicators. [Limits](https://soniox.com/docs/tts/rt/limits-and-quotas).

**Evaluation focus:** stream lifecycle, long-output truncation, pronunciation in the target language, and the relationship between actual token usage and the public approximate rate.

## Murf

**Falcon 2 · `falcon-2` · TTS.** The model targets conversational streaming and has documented Brazilian Portuguese voices. Select a voice from the Falcon 2 catalog rather than assuming compatibility with an older model's voices. [Model and billing](https://murf.ai/api/docs/text-to-speech-models/falcon-2), [Streaming voice catalog](https://murf.ai/api/docs/text-to-speech/streaming).

The published model tariff is $0.01 per 1,000 characters. The study uses this billing unit rather than treating the provider's approximate generated-minute illustration as a fixed conversation rate. Synthesizing a response still needs a separate recognition and reasoning path around it.

The [HTTP example](integrations/http-tts.mjs) uses `api-key` authentication, camelCase voice/audio fields, explicit model selection and a binary WAV response. Global routing and regional endpoints are available; region and account capacity can influence real latency. [Streaming API](https://murf.ai/api/docs/api-reference/text-to-speech/stream).

**Evaluation focus:** voice compatibility, Brazilian pronunciation, regional performance, and whether the inexpensive synthesis remains useful with the application's actual response lengths and interruption pattern.

## MiniMax HD

**Speech 2.8 HD · `speech-2.8-hd` · TTS.** HD is the quality-oriented variant, with multilingual output and emotion controls. Portuguese can be selected through `language_boost`. Its $100/M character rate is higher than Turbo's. [Models](https://platform.minimax.io/docs/guides/models-intro), [PAYG pricing](https://platform.minimax.io/docs/guides/pricing-paygo).

The [example](integrations/http-tts.mjs) intentionally demonstrates a complete response to make its decoding clear: the API returns hexadecimal audio in JSON when configured that way. Both HTTP status and the provider's application status must be checked. [HTTP speech API](https://platform.minimax.io/docs/api-reference/speech-t2a-http).

**Integration boundary:** this is a synthesis model, so instructions about content and tool use remain in the reasoning stage. Switching to HD changes synthesis behavior and price without automatically changing the agent's reasoning.

**Evaluation focus:** compare HD and Turbo with identical voice and content. Determine whether the audible difference is large enough to justify higher speech spend for the actual target audience.

## MiniMax Turbo

**Speech 2.8 Turbo · `speech-2.8-turbo` · TTS.** Turbo emphasizes speed and costs $60/M characters in the checked PAYG schedule. It uses the same model family and API shape as HD, allowing a comparatively small configuration change within this provider. [Model family](https://platform.minimax.io/docs/guides/models-intro), [Pricing](https://platform.minimax.io/docs/guides/pricing-paygo).

The shared example accepts only the explicitly supported HD and Turbo IDs. It requests one-shot MP3 content and decodes hexadecimal bytes. The API also supports streaming, but the example is not presented as a low-latency playback loop. [API reference](https://platform.minimax.io/docs/api-reference/speech-t2a-http).

**Evaluation focus:** actual first-audio latency, voice consistency, and difficult pronunciations. An inexpensive internal switch does not mean a cross-provider switch is equally simple: another vendor may use different audio framing, authentication, or text buffering.

## Gradium

**Gradium TTS · production alias `default` · TTS.** The explicit beta alias is separate. A `default` alias can change; record the resolved `model_ext` reported by the WebSocket when available. The benchmark label alone does not identify an immutable deployment. [WebSocket API](https://docs.gradium.ai/api-reference/endpoint/tts-websocket).

The chosen price is the XS top-up rate, with a $13/month subscription required. The fully utilized included-credit rate is a different allocation. The free plan is not the commercial baseline. [Pricing](https://gradium.ai/pricing).

The [HTTP example](integrations/http-tts.mjs) requests binary output explicitly. The realtime default PCM format is 48 kHz, 16-bit mono; treating it as 24 kHz would change playback speed. Brazilian and European Portuguese support is documented by the official LiveKit integration guide. [REST API](https://docs.gradium.ai/api-reference/endpoint/tts-post), [Limits and formats](https://docs.gradium.ai/guides/limits), [Language integration](https://docs.livekit.io/agents/models/tts/gradium/).

**Evaluation focus:** regional voice choice, normalization of structured text, resolved model version, and subscription utilization.

## Fish

**S2.1 Pro · `s2.1-pro` · TTS.** The production model supports multilingual speech, including Portuguese, and expressive direction. The free variant has separate service guarantees and is not treated as an interchangeable production rate. [Models](https://docs.fish.audio/developer-guide/models-pricing/models-overview), [Portuguese support](https://fish.audio/blog/s2-1-pro-free-api/).

Billing is $15/M **UTF-8 bytes**. Text length in JavaScript code units is not a reliable billing estimator across languages; count encoded bytes. [Pricing](https://docs.fish.audio/developer-guide/models-pricing/pricing-and-rate-limits).

The [HTTP example](integrations/http-tts.mjs) places the model in a request header and uses `reference_id` for the voice. It receives binary audio. The realtime WebSocket uses MessagePack rather than JSON text frames, making transport decoding a provider-specific responsibility. [HTTP contract](https://docs.fish.audio/api-reference/endpoint/openapi-v1/text-to-speech), [WebSocket contract](https://docs.fish.audio/api-reference/endpoint/websocket/tts-live).

**Evaluation focus:** multilingual billable size, compatibility of voice references, stable model selection, and realtime format handling.

## Gemini Live

**Gemini 3.1 Flash Live · `gemini-3.1-flash-live-preview` · native conversational audio.** This model accepts audio in a live session and produces audio responses. Portuguese is documented. Unlike separate TTS, it participates in the conversation's reasoning and turn flow. [Live overview](https://ai.google.dev/gemini-api/docs/live-api).

Do not inherit every Gemini 2.5 feature into 3.1: the checked capability table excludes proactive audio and affective-dialogue configuration for 3.1 and describes sequential function calls. [Capability matrix](https://ai.google.dev/gemini-api/docs/live-api/capabilities).

The [session example](integrations/native-sessions.mjs) sends PCM16 at 16 kHz and forwards the 24 kHz output with metadata. It processes every response part and exposes interruption events. Browser-direct deployment should obtain short-lived credentials through the application backend. [SDK setup](https://ai.google.dev/gemini-api/docs/live-api/get-started-sdk).

**Evaluation focus:** end-to-end task behavior, interruptions, preview stability, long-session context, and real usage. A fresh-audio-only estimate cannot predict the complete cost of a long conversation.

## OpenAI Realtime

**GPT-Realtime-2.1 Mini · `gpt-realtime-2.1-mini` · native conversational audio.** Mini is the lower-cost focal option. **`gpt-realtime-2.1`** is included as a full-model cost comparison. They expose native realtime interaction rather than only synthesis. The bounded documentation review did not establish a model-specific Portuguese support list; validate the required language directly rather than borrowing another OpenAI product's language list. [Mini model card](https://developers.openai.com/api/docs/models/gpt-realtime-2.1-mini), [Full model card](https://developers.openai.com/api/docs/models/gpt-realtime-2.1).

The [server example](integrations/native-sessions.mjs) mints a short-lived credential. The [browser example](integrations/openai-browser.mjs) connects through the Agents SDK using the same model. Backend credentials stay on the server, and a real token route needs application authentication and a session budget. [WebRTC guide](https://developers.openai.com/api/docs/guides/realtime-webrtc).

**Evaluation focus:** speech recognition, silence, interruption handling, tools, and actual retained-history costs. Model-specific thinking and usage behavior can alter both latency and spend. The complete voice-agent guide is the starting reference for choosing native and cascaded architectures. [Voice agents](https://developers.openai.com/api/docs/guides/voice-agents).

## Where Claude and hosted platforms fit

Claude can provide the reasoning stage in a voice pipeline. That does not make it the synthesis voice being ranked here. The official LiveKit integration exposes a Claude LLM inside an agent session with separate speech components. [Anthropic plugin](https://docs.livekit.io/agents/models/llm/anthropic/).

Hosted platforms can operate that pipeline and its transport for the application. Their fees must be added or assessed under the platform's all-in billing definition. For example, Vapi lists $0.05/min hosting with model-provider charges separate; supplying provider keys changes who invoices the model usage, not whether that usage has a cost. [Vapi pricing](https://vapi.ai/pricing).

Do not expand a voice leaderboard by counting every orchestration platform, every speaker preset, and every reasoning-model combination as if each were an independently evaluated synthesis model.
