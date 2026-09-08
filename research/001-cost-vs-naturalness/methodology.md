# Measuring Voice Value: Cost, Naturalness, and Evidence Limits

[Study](README.md) · [Inputs](data/models.json) · [Calculation script](../../scripts/rank.mjs)

## Scope and evidence classes

The study compares the selected 15 synthesis models, two focal native speech agents, and limited alternatives that clarify an important implementation or language distinction. Primary model/API/pricing documentation supports provider facts. The benchmark publisher supplies independent preference results. General engineering implications and the weighting scheme are this study's own analysis.

This is desk research dated **2026-09-06**. It does not claim completeness across the entire market, auditory testing, regional latency measurement, contract verification for a specific customer, or reproduction of the independent benchmark.

## Reproducible workload

The [synthetic English text](data/sample.txt), excluding its final newline, contains 450 Unicode code points, 450 UTF-8 bytes, and 383 non-whitespace characters. Its duration is **assumed to be 30 seconds**, not measured. A provider may generate a shorter or longer recording; measured audio duration and billable tokens must replace these assumptions in a deployment estimate.

| Input | Value | Evidence status |
| --- | ---: | --- |
| Incoming audio | 60 seconds | Scenario choice; not a measured call |
| Spoken response text | 450 characters | Counted from the fixture |
| Generated speech | 30 seconds | Duration assumption |
| Recognition budget | $0.006 | Hypothetical scenario parameter |
| Reasoning budget | $0.004 | Hypothetical scenario parameter |
| Currency | USD | Prices are recorded in their published USD units |
| Cache discount | None | Excluded to make the fresh-workload assumptions explicit |

The conversation's wall-clock duration is not fixed: input and output may overlap or occur sequentially. Accordingly, the calculated amount is **per scenario**, not per minute of elapsed conversation.

For synthesis components, `scenario_cost = speech_cost + recognition_budget + reasoning_budget`. These budget parameters are deliberately not attributed to a particular STT or LLM. Choosing an actual recognition model, reasoning model, prompt length, history strategy, and hosting environment requires a separate measured estimate.

## Billing treatment

| Provider | Formula for speech output in this scenario | Important qualification |
| --- | --- | --- |
| Cartesia | `450 × 50 / 1,000,000` | $5 Pro subscription divided by 100k included credits; assumes all are consumed by standard TTS. This is an allocation, not a verified overage rate. |
| Inworld | `450 × 25 / 1,000,000`, or `450 × 15 / 1,000,000` for Flash | On-Demand rates; paid tiers can reduce these rates but add a commitment. |
| Speechify | `383 × 10 / 1,000,000` | Starter billing excludes whitespace and tags; $10 monthly fee includes 1M billable characters. |
| ElevenLabs | `450 × 50 / 1,000,000` | Displayed conversational API rate; a signup promotion was visible on the date checked. Do not apply an additional assumed discount. |
| Murf | `450 × 10 / 1,000,000` | Uses the Falcon 2 character tariff rather than its approximate per-minute marketing illustration. |
| Smallest | `450 × 19.5 / 1,000,000` | Pro model rate, not the standard Lightning model. |
| MiniMax | `450 × 100 / 1,000,000` for HD; `450 × 60 / 1,000,000` for Turbo | Separate models with separate rates. |
| Fish | `UTF8_bytes(text) × 15 / 1,000,000` | The ASCII fixture has 450 bytes; accented characters and other scripts change the byte count. |
| Gradium | `450 × 69 / 1,000,000` | XS top-up rate after the included allowance; requires the $13/month plan. |
| Soniox | `(450 × 0.3 × 4 + 30/3600 × 30000 × 21.5) / 1,000,000` | Provider approximations for text/audio tokens, not a fixed duration tariff. |
| Gemini TTS | `(135 × 1 + 30 × 25 × 20) / 1,000,000` | 135 input tokens are an illustrative estimate; 25 audio tokens/second follows Google guidance. |

Each model's exact [pricing URL and rate basis](data/models.json) is stored alongside its inputs, with fuller context in the [profiles](providers.md). Rate formulas may require adjustment for text normalization or controls counted by a provider.

### Monthly spend is a different calculation

For a plan with monthly fee `F`, included usage `Q`, and overage rate `r` per million units:

`monthly_speech_spend = F + max(0, billable_usage - Q) × r / 1,000,000`

Use this formula only when the provider's plan actually follows that billing structure. Credit pools, shared service balances, expirations, and negotiated terms can change it. Do not add a monthly fee a second time to a fully amortized subscription allocation.

For example, fully using Cartesia Pro's 100k credits yields the chosen $50/M allocated rate; using only 10k yields $500/M effective spend. Using Startup's 1.25M included credits solely for TTS gives $39.20/M at full utilization, but its $49 commitment may be inefficient at low volume. Gradium's XS included-credit allocation is about $57.78/M at full use, while its top-up price is $69/M. These differences can move the ranking without a model changing at all. [Cartesia pricing](https://www.cartesia.ai/pricing), [Cartesia credits](https://docs.cartesia.ai/pricing), [Gradium pricing](https://gradium.ai/pricing).

### Native fresh-audio calculation

Google Live uses approximately 25 audio tokens per second in this estimate. OpenAI uses roughly 10 input and 20 output audio tokens per second. Apply each provider's own rates and token counts; a common audio-token count would misprice one of them. The [structured native inputs](data/models.json) reproduce the separate cost panel. [Google best practices](https://ai.google.dev/gemini-api/docs/live-api/best-practices), [OpenAI realtime costs](https://developers.openai.com/api/docs/guides/realtime-costs).

Fresh-audio pricing excludes system text, generated text, thinking, tool use, separate transcription, and retained conversation history. A session can bill earlier content again as input. Therefore multiplying the first-turn estimate by conversation minutes can understate spend. Record actual API usage for short and long sessions, and inspect cache or compression behavior before extrapolating.

## Combined score

Let `E` be TTS preference Elo and `C` be the hypothetical pipeline scenario cost. Define:

```text
N = 10 × clamp((E - 1000) / (1300 - 1000), 0, 1)
K = 10 × clamp(log(0.10 / C) / log(0.10 / 0.01), 0, 1)
Score = 0.60 × K + 0.40 × N
```

The fixed Elo anchors and $0.01–$0.10 budget anchors are **editorial choices**. The logarithmic cost term treats proportional price changes consistently within the selected range. Clipping makes the output bounded between zero and ten. Neither scale has an intrinsic scientific interpretation; different anchors or weights can produce a different shortlist.

There is no cross-arena score conversion. Native conversational models are kept outside this TTS-based calculation. Luna and Breeze lack a verified comparable price and are unscored. Where the current service is a moving alias or has a different release label from the benchmark, the score is a provisional screening association, not proof of exact snapshot equivalence.

Run the script to inspect sensitivity. At 40% cost weight, the leading trio is Simba 3.2, Inworld TTS 2, and Sonic 3.6; at 80%, it becomes Simba 3.2, Falcon 2, and Inworld TTS 2 Flash. This is calculated sensitivity under the stated fixture and rate bases, not new listening evidence.

## Naturalness and uncertainty

The second table uses the benchmark publisher's point estimates and confidence intervals. Provider voice selection and benchmark prompts influence results. The population is not a controlled Brazilian Portuguese listening study. Do not describe the scores as percentages, statistically certain rank gaps, or evidence that speech is indistinguishable from a real person. [TTS leaderboard and method summary](https://artificialanalysis.ai/text-to-speech/leaderboard/provider-voice).

For native systems, live preference, task success, and conversational dynamics answer distinct questions. An agent can sound appealing while failing a task. The speech-agent methodology uses realistic interactive scenarios rather than only reading a fixed sentence. [Speech evaluation methodology](https://artificialanalysis.ai/methodology/speech-to-speech-benchmarking).

## Proposed evaluation protocol

This protocol is proposed work; it has not been executed.

1. **Define separate cohorts.** Compare TTS candidates on the same recognition/LLM backend. Compare complete native systems on the same tasks. Test each target language separately.
2. **Freeze the configuration.** Record exact model/snapshot, voice, language, temperature, speech direction, codec, sample rate, region, and access tier. Keep these alongside the date and usage response.
3. **Prepare ordinary and difficult prompts.** Include questions, numbers, abbreviations, names, changes of emotion, short acknowledgements, and mixed-language words. Use synthetic text or explicitly authorized recordings.
4. **Blind the audio comparison.** Randomize paired order, hide provider names, normalize playback loudness without changing tempo, and retain several suitable voices per model. Ask about naturalness, intelligibility, and listener preference separately.
5. **Measure conversation timing.** Capture user speech end, generation request, first received audio, first audible sample, interruption detection, and time until playback actually stops. Report median and tail latency.
6. **Test overlap and failure.** Include natural pauses, background noise, backchannels, a new question during speech, denied microphone permission, network loss, rate limits, and model failure.
7. **Measure costs from usage.** Compare short, medium, and long sessions; count wasted generated audio, repeated history, unused subscriptions, and engineering/hosting expenses separately.
8. **Report uncertainty.** Predefine enough prompts and listeners for the desired precision, report confidence intervals, and publish the sampling method. Preserve ties or inconclusive outcomes.

Use the resulting evidence to revise the shortlist. A small provider-only TTFA number is not a substitute for an application-level conversation test.
