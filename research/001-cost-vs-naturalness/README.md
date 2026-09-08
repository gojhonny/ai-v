# AI Voice Engineering: Cost vs. Human-Like Speech

**Study 001 · Evidence checked September 6, 2026 · Public desk research**

[Collection](../../README.md) · [Methodology](methodology.md) · [Provider profiles](providers.md) · [JavaScript integrations](integrations/README.md) · [Sources](sources.md)

## The question

Which voice technologies offer a useful balance between price and human-like speech, which prioritize naturalness alone, and what must a JavaScript application abstract to support multiple providers?

The core selection contains **15 TTS models and two native conversational models**. Full-size OpenAI Realtime and Speechify Simba 3.0 provide additional context. This is a curated study of the selected options, not a census of every voice product. Several rows represent synthesis components, not LLMs or complete agents.

## Findings

**The best choice changes with the objective and the workload.** In the explicit cost scenario below, Simba 3.2 leads the combined score but supports English only. Inworld's Flash and full TTS 2 models are the next candidates under the 60% cost weighting. When cost is removed, Sonic 3.6 leads the selected naturalness cohort. These are screening results derived from public evidence; no listening or production latency tests were performed for this study.

A practical multilingual evaluation can pair an economical synthesis option with a higher-preference voice and a native audio agent. That comparison reveals whether the application's constraint is synthesis quality, conversational timing, reasoning, or cost. Portuguese support is a capability filter; it does not validate the English-oriented preference order for Brazilian Portuguese. [Provider language evidence](providers.md).

Native agents and configurable pipelines have different control boundaries. A TTS provider receives text chosen by another system. A native audio agent may generate the answer and its speech together. The integration should expose those differences rather than assume that changing a model string swaps the entire experience. [OpenAI voice-agent architectures](https://developers.openai.com/api/docs/guides/voice-agents), [LiveKit pipeline types](https://docs.livekit.io/agents/start/voice-ai/).

## Table 1 — Cost and naturalness

**Snapshot: 2026-09-06 (UTC).**

**60% cost + 40% naturalness**, using the reproducible formula in [methodology](methodology.md). Order uses unrounded scores; displayed scores are rounded to one decimal. The score is an editorial screening utility, not a benchmark score or a measure of human likeness.

The synthetic workload is **60 seconds of input audio and a 450-character response assumed to produce 30 seconds of speech**. The pipeline column adds an explicitly hypothetical **$0.006 recognition + $0.004 reasoning budget** to the synthesis charge. Those two budget items are held constant to isolate the voice choice. They are not a vendor quote or evidence that a working pipeline was measured at that price.

<!-- cost:start -->
| Rank | Voice option | Provider | Score / 10 | Speech output | Pipeline scenario | Rate basis |
| --- | --- | --- | ---: | ---: | ---: | --- |
| 1 | [Simba 3.2](providers.md#speechify) | Speechify | 8.4 | $0.00383 | $0.01383 | [Starter; $10/mo, $10/M overage](https://speechify.ai/pricing) |
| 2 | [TTS 2 Flash](providers.md#inworld-flash) | Inworld | 7.6 | $0.00675 | $0.01675 | [On-Demand; benchmark used research preview](https://inworld.ai/pricing) |
| 3 | [TTS 2](providers.md#inworld) | Inworld | 7.4 | $0.01125 | $0.02125 | [On-Demand](https://inworld.ai/pricing) |
| 4 | [TTS Realtime v2](providers.md#soniox) | Soniox | 7.2 | $0.00592 | $0.01591 | [Token pricing; counts estimated](https://soniox.com/pricing) |
| 5 | [Falcon 2](providers.md#murf) | Murf | 7.1 | $0.00450 | $0.01450 | [Model documentation rate](https://murf.ai/api/docs/text-to-speech-models/falcon-2) |
| 6 | [Lightning v3.1 Pro](providers.md#smallest) | Smallest AI | 6.9 | $0.00877 | $0.01878 | [Published model rate](https://smallest.ai/pricing/models) |
| 7 | [Sonic 3.6](providers.md#cartesia) | Cartesia | 6.7 | $0.02250 | $0.03250 | [Pro allocation; $5/mo, full use of 100k credits](https://www.cartesia.ai/pricing) |
| 8 | [S2.1 Pro](providers.md#fish) | Fish Audio | 6.5 | $0.00675 | $0.01675 | [Paid model; UTF-8 byte billing](https://docs.fish.audio/developer-guide/models-pricing/pricing-and-rate-limits) |
| 9 | [Gemini 3.1 Flash TTS](providers.md#gemini-tts) | Google | 6.4 | $0.01513 | $0.02514 | [Standard preview; text-token count estimated](https://ai.google.dev/gemini-api/docs/pricing) |
| 10 | [Eleven v3 Conversational](providers.md#elevenlabs) | ElevenLabs | 5.7 | $0.02250 | $0.03250 | [Displayed API rate; signup promotion visible](https://elevenlabs.io/pricing/api) |
| 11 | [Speech 2.8 Turbo](providers.md#minimax-turbo) | MiniMax | 4.6 | $0.02700 | $0.03700 | [Pay as you go](https://platform.minimax.io/docs/guides/pricing-paygo) |
| 12 | [Gradium TTS](providers.md#gradium) | Gradium | 4.3 | $0.03105 | $0.04105 | [XS top-up; $13/mo subscription required](https://gradium.ai/pricing) |
| 13 | [Speech 2.8 HD](providers.md#minimax-hd) | MiniMax | 3.8 | $0.04500 | $0.05500 | [Pay as you go](https://platform.minimax.io/docs/guides/pricing-paygo) |
<!-- cost:end -->

All amounts are USD **per scenario**, not flat conversation-minute tariffs. Cartesia uses an allocated subscription rate; Speechify and Gradium also have monthly commitments. The table combines disclosed rate bases for a screening exercise and does not compare complete monthly invoices. Free trials, taxes, hosting, networking, telephony, unused subscriptions, retries, and tools are excluded. Speechify excludes whitespace; Fish bills UTF-8 bytes; token-priced output uses explicit conversion assumptions. [Detailed billing treatment](methodology.md#billing-treatment).

Luna and Breeze remain in the naturalness table but have no combined score: a comparable verified hosted price is unavailable. Missing cost evidence is not a zero-dollar price.

### Native conversational options — separate cost panel

These options from the original selection receive a **fresh-audio-only cost estimate**. They are not inserted into the TTS score: a live-conversation preference result does not measure the same quantity as a text-to-speech listening result.

<!-- native:start -->
| Native model | Fresh-audio estimate | Scope |
| --- | ---: | --- |
| [Gemini 3.1 Flash Live](https://ai.google.dev/gemini-api/docs/pricing) | $0.0135 | Preview; fresh audio only; counts approximate |
| [GPT-Realtime-2.1 Mini](https://developers.openai.com/api/docs/models/gpt-realtime-2.1-mini) | $0.0180 | Fresh audio only; retained history and text excluded |
| [GPT-Realtime-2.1](https://developers.openai.com/api/docs/models/gpt-realtime-2.1) | $0.0576 | Supplementary full-model comparison; fresh audio only |
<!-- native:end -->

The native panel excludes text, reasoning, prior turns, tools, separate transcription, and infrastructure. It does not add the pipeline's hypothetical recognition/reasoning budget. It therefore provides a useful audio-meter comparison, not a like-for-like total against the pipeline column. Google counts are approximate; OpenAI's audio token accounting differs between input and output. [Google token guidance](https://ai.google.dev/gemini-api/docs/live-api/best-practices), [OpenAI cost accounting](https://developers.openai.com/api/docs/guides/realtime-costs).

In the separate live-conversation arena, Gemini 3.1 Flash Live Minimal has preference Elo 1046, GPT-Realtime-1.5 has 1000, and GPT-Realtime-2.1 Mini Minimal has 792. These are particular tested configurations. Preference and successful task completion are separate metrics; do not use these numbers as TTS naturalness ratings or assign an older result to a newer model. [Speech Agent Arena](https://artificialanalysis.ai/speech-to-speech/arena).

## Table 2 — Naturalness priority

**Snapshot: 2026-09-06 (UTC).**

This is the order **within the 15-model selection**, based on the publisher's provider-voice blind preference snapshot. Other models outside this study can appear between these entries on the full leaderboard. The intervals describe uncertainty in the published Elo; nearby positions should not be interpreted as certain audible differences. [Artificial Analysis TTS leaderboard](https://artificialanalysis.ai/text-to-speech/leaderboard/provider-voice).

<!-- naturalness:start -->
| Priority | Model | Provider | Preference Elo | 95% interval | Portuguese |
| --- | --- | --- | ---: | ---: | --- |
| 1 | [Sonic 3.6](providers.md#cartesia) | Cartesia | 1282 | ±17 | pt |
| 2 | [TTS 2](providers.md#inworld) | Inworld | 1252 | ±18 | pt |
| 3 | [Simba 3.2](providers.md#speechify) | Speechify | 1240 | ±14 | English only |
| 4 | [Luna TTS](providers.md#luna) | VUI Labs | 1228 | ±14 | Unverified |
| 5 | [TTS 2 Flash](providers.md#inworld-flash) | Inworld | 1222 | ±15 | pt |
| 6 | [Breeze TTS 2](providers.md#breeze) | BreezeBlue | 1215 | ±17 | English / Chinese |
| 7 | [Eleven v3 Conversational](providers.md#elevenlabs) | ElevenLabs | 1210 | ±15 | pt |
| 8 | [Gemini 3.1 Flash TTS](providers.md#gemini-tts) | Google | 1208 | ±12 | pt |
| 9 | [Lightning v3.1 Pro](providers.md#smallest) | Smallest AI | 1190 | ±14 | pt-BR / pt-PT |
| 10 | [TTS Realtime v2](providers.md#soniox) | Soniox | 1179 | ±11 | pt |
| 11 | [Speech 2.8 HD](providers.md#minimax-hd) | MiniMax | 1171 | ±11 | pt |
| 12 | [Falcon 2](providers.md#murf) | Murf | 1158 | ±15 | pt-BR |
| 13 | [Speech 2.8 Turbo](providers.md#minimax-turbo) | MiniMax | 1152 | ±11 | pt |
| 14 | [Gradium TTS](providers.md#gradium) | Gradium | 1149 | ±15 | pt-BR / pt-PT |
| 15 | [S2.1 Pro](providers.md#fish) | Fish Audio | 1141 | ±13 | pt |
<!-- naturalness:end -->

The Flash benchmark entry is explicitly a **research preview**; current Inworld documentation describes a production API, without establishing that it is byte-for-byte the evaluated snapshot. Gradium's benchmark label similarly does not identify a fixed `default` model version. Language cells come from the provider profiles, with Gradium regional coverage supported by its official LiveKit integration guide. [Inworld model documentation](https://docs.inworld.ai/tts/tts-models), [Gradium integration](https://docs.livekit.io/agents/models/tts/gradium/).

## How to interpret the shortlist

- **English with strong cost emphasis:** test Simba 3.2, then compare its actual subscription utilization and interruption behavior with other candidates.
- **Multilingual synthesis with cost emphasis:** audition Inworld TTS 2 Flash, Inworld TTS 2, Soniox, and Falcon 2 using the target language and the same agent backend.
- **Naturalness first:** begin the selected cohort with Sonic 3.6 and Inworld TTS 2. Keep the voice, speaking direction, codec, volume, and prompt set controlled.
- **Integrated audio conversation:** evaluate Gemini Live and OpenAI Realtime as complete conversational systems. Include task accuracy, turn-taking, and session-history billing.
- **Research or restricted access:** retain Luna and Breeze as documented research options while respecting the unresolved API and licensing boundaries.

These are proposed test priorities, not results of tests run by the author. The [evaluation protocol](methodology.md#proposed-evaluation-protocol) explains how to replace this screening study with evidence from a real application.

## Integration deliverables

The [integration guide](integrations/README.md) explains each provider boundary and links directly to the implementation examples. HTTP providers share request/error utilities while preserving their individual authentication and decoding rules. Soniox and ElevenLabs demonstrate different WebSocket protocols. Google and OpenAI demonstrate native session setup. Breeze demonstrates a local inference endpoint; Luna is explicitly blocked by incomplete public integration documentation.

A [generic TypeScript interface](integrations/voice-contract.ts) separates synthesis from conversational sessions and records capabilities. It is a proposed interface for comparison and future implementation, not a claim that all providers already implement one protocol.

## Verification and limitations

The repository validation checks Markdown structure and internal links, machine-readable model inputs, generated-table consistency, syntax of JavaScript examples, and harness state. The source register records the scope and gaps of the documentation review. No provider credentials were used, no audio was generated, and no production integration or listening experiment was executed. SDK examples require compatible installed dependencies and are not represented as package-version-tested applications.

## Revision log

| Date | Change |
| --- | --- |
| 2026-09-06 | Initial public snapshot. Recomputed cost ranking from explicit units and workload; separated TTS preference from live conversation evaluation; added profiles, integration examples, and reproducibility data. |
