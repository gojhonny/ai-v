# AI Voice Engineering Glossary

These working definitions describe how this collection uses common terms. They are explanatory vocabulary, not a formal standard.

| Term | Meaning in this collection |
| --- | --- |
| AI Voice Engineering | Designing, integrating, evaluating, and operating software that converses through speech. |
| Voice agent | A conversational system that receives user input, decides what to do, and responds through speech. |
| STT / ASR | Speech-to-text / automatic speech recognition: deriving text from incoming speech. |
| TTS | Text-to-speech: producing audio from supplied text. A TTS service alone does not provide conversational reasoning. |
| Native speech-to-speech | A conversational model interface accepting audio and producing audio without requiring the application to compose separate STT and TTS calls. |
| Cascaded pipeline | Separate recognition, language reasoning, and synthesis stages coordinated as one agent. |
| Naturalness | Perceived resemblance to human speech, including rhythm, phrasing, pronunciation, and prosody. |
| Prosody | Timing, stress, intonation, and other expressive properties of speech. |
| Voice | A speaker identity or preset. A model can support multiple voices. |
| Voice cloning | Creating a voice representation from a person's recorded speech; authorization and provider rules apply. |
| Full duplex | Input and output can overlap; successful overlap handling still requires suitable conversation control. |
| Barge-in | Interrupting an agent while it is speaking. Cancellation must address both generation and queued playback. |
| Backchannel | A short acknowledgement, such as “mm-hm,” that need not mean the user wants the turn. |
| VAD | Voice activity detection: estimating where speech is present in audio. |
| Endpointing | Deciding that the user has finished a conversational turn. |
| TTFA | Time to first audio. A provider may measure generation only; a product should also measure delay to audible playback. |
| PCM | Pulse-code modulation: audio samples requiring an explicit sample rate, channel count, and numeric encoding. |
| Sample rate | Audio samples per second. Changing metadata without resampling does not convert the waveform. |
| Codec | An encoding such as Opus or MP3. Encoded audio is not interchangeable with raw PCM. |
| WebRTC | A browser media and data transport frequently used for interactive voice sessions. |
| WebSocket | A bidirectional connection carrying messages or bytes; the application defines audio framing and playback. |
| SSE | Server-sent events: a server-to-client event stream, often carrying text or encoded audio payloads. |
| Ephemeral credential | A short-lived credential issued for a limited client session. |
| Elo | A relative preference score within a specified evaluation population. It is not a percentage of human likeness. |
| Confidence interval | An interval representing statistical uncertainty under the benchmark's method. |
| Marginal cost | The extra spend associated with an additional unit of usage. |
| Amortized cost | A fixed payment distributed over actual or assumed usage. Unused capacity raises the effective rate. |
| Preview | A release stage whose availability or behavior may change; it does not identify a fixed level of quality. |
| Deterministic control | A policy whose decision follows explicit inputs and state, such as a budget or permission comparison. Its inputs may still be uncertain. |
| Memory admission | Deciding whether an event warrants storage, extraction or consolidation work. |
| Derived memory | Facts, summaries, embeddings or graph relationships built from source events and subject to correction or invalidation. |
| Provenance | A trace from a claim or derived record to its source evidence and revision. |
| Exact answer cache | Reusing a completed answer only when the request and every required state/version match its validity contract. |
| Semantic answer cache | Reusing an answer based partly on learned similarity; similarity alone does not establish correctness. |
| Prefix cache | Reusing processing of a shared model-input prefix; generation still occurs. |
| Budget reservation | Accounting for the potential cost of in-flight work before dispatch, then reconciling actual usage. |
| Idempotence | Repeating an operation has the same intended effect as applying it once; this does not by itself guarantee one provider charge. |
| Amortization threshold | The number of valid reuses needed to recover the cost of producing a reusable result. |

For memory concepts and their limits, see [Study 002](../research/002-deterministic-memory-cost/README.md).

For browser behavior, consult [WebRTC](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API), [microphone capture](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia), and [AudioWorklet](https://developer.mozilla.org/en-US/docs/Web/API/AudioWorklet). For evaluation terminology, see the [Speech Agent benchmark methodology](https://artificialanalysis.ai/methodology/speech-to-speech-benchmarking).
