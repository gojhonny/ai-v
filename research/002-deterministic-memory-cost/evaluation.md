# Evaluation Protocol: Memory Cost, Quality and Voice Latency

**Protocol date:** 2026-09-06 (UTC).

**Status:** Proposed experiment; no live model, retrieval corpus or voice benchmark has been executed.

[Study findings](README.md) · [Evidence register](sources.md)

## Hypothesis and decision rule

Test whether deterministic admission, exact reuse and bounded memory retrieval reduce total cost per successfully completed task without unacceptable loss of grounded answer quality or conversational responsiveness. Predefine the minimum quality and latency requirements for the target application before observing the results. A lower bill alone is not success.

Freeze the provider/model snapshot, prompt, tokenizer, embedding model, retrieval configuration, source revisions, cache policy, machine allocation and price sheet. If a provider exposes only a moving alias, record that limitation and the execution timestamps. Record data preparation and model-based grading cost separately from product inference, and include both when reporting experiment expenditure.

## Baselines and ablations

| Arm | What changes | Why include it |
| --- | --- | --- |
| A | Full available history, fixed generator | Establish capability and cost of the simplest complete-context approach |
| B | Recent-window context | Show whether cross-session memory is needed for each task class |
| C | Full history with provider prefix caching | Compare selection against cheaper reuse of the same context |
| D | Scoped raw-event retrieval with a fixed token budget | Establish a simple memory baseline without expensive derived structures |
| E | D plus deterministic admission and exact/versioned response reuse | Isolate avoided dispatches and correct reuse |
| F | E plus admitted incremental extraction/consolidation | Measure lifetime cost and quality of derived memory |
| G | F plus a calibrated pre-generation model router | Include router overhead, fallback and category-specific errors |
| H | Separate additions of graph retrieval, semantic answer caching or learned compression | Attribute each marginal benefit and regression rather than enabling everything together |

Where technically feasible, run a small factorial comparison of context selection and prefix caching because they interact. Keep cold and warm cache results separate. Do not assign different test questions or weaker quality criteria to cheaper arms.

## Corpus and split

Start with versioned public text-memory benchmarks for reproducibility, then add a generic voice suite. [LoCoMo](https://aclanthology.org/2024.acl-long.747/) and [LongMemEval](https://arxiv.org/html/2410.10813v2) provide relevant evaluation categories; their text benchmarks do not establish audio performance.

Split by conversation, entity and memory history, not just by question. Related turns leaking across router training and test sets can inflate quality. Keep tuning, calibration and final evaluation distinct. Report category counts, all exclusions, cache warm-up procedure and the fraction of genuinely repeated requests. Do not manufacture a high cache-hit rate by replaying the same prompt unless explicitly testing that scenario.

Use paired comparisons on the same tasks; estimate uncertainty by resampling independent conversations or tasks rather than treating every correlated turn as independent. For tiny benchmark conversation sets, explicitly limit confidence in population-level conclusions. Human review should be blind to the configuration. A model grader should use a frozen rubric and be audited against human judgments.

## Essential failure cases

| Case | Expected observation |
| --- | --- |
| A corrected preference supersedes an older fact | Old answer cache becomes invalid; the next turn can use the correction |
| Two users ask identical questions | Retrieval and caches preserve authenticated scope |
| Same text is intentionally repeated in a new turn | Transport deduplication does not suppress a legitimate request |
| “I moved” versus “I did not move” | Negation survives extraction, compression and cache eligibility |
| “Next Friday” near midnight or across time zones | Date interpretation is explicit; uncertain dates do not become trusted arithmetic inputs |
| A fact appears in raw evidence but not in a summary | Retrieval can recover the source or acknowledge the gap |
| A fact is deleted while a worker is running | A stale worker cannot recreate a deleted view without authorization/version checks |
| A provider finishes before the client times out | The attempt remains potentially billable; retries do not silently double-count task success |
| Many concurrent requests see the same remaining budget | Admission accounts for in-flight reservations |
| No repeated queries and frequent invalidation | Report negative caching/precomputation economics honestly |
| A request requires several related facts | Retrieval budget does not silently turn missing evidence into fabricated certainty |
| Portuguese partial transcription changes a name or negation | Finalized revisions govern persistent memory; corrections remain traceable |
| User interrupts synthesized speech | Superseded output is not played or recorded as if heard |
| User pauses, backchannels or switches language | Endpointing does not trigger avoidable answers or discard intended turns |

These are proposed test cases. Passing a structural repository check does not execute them.

## Metrics and denominators

| Metric | Definition or required accounting |
| --- | --- |
| Total lifecycle cost | All measured foreground/background inference, embeddings, cache operations, retries, storage, compute and speech for the observation window |
| Cost per successful task | Total cost across all attempts divided by successfully completed, grounded tasks; zero successes means undefined/infinite, not zero cost |
| Quality by category | Factual accuracy, correction handling, temporal reasoning, speaker attribution, completion and appropriate abstention |
| Incorrect reuse | False cache hits / all requests **and** false cache hits / served cache hits |
| Memory efficiency | Read/use count before refresh or deletion; useful facts per extraction call; source retrieval recall |
| Bypass precision | Correctly completed deterministic bypasses / all bypasses, with false bypasses retained in evaluation |
| Grounding | Fraction of factual claims supported by eligible source evidence |
| Latency | p50/p95 time from user end-of-turn to first audible response; separately log endpointing, retrieval, generation and playback |
| Wasted work | Billed duplicate attempts, superseded generations, unused extraction, failed refreshes and speculative work |
| Budget integrity | Reserved, reconciled, unresolved and actual cost; overshoot and underutilization |

Include the cost of unsuccessful requests in the numerator and report rejected/degraded requests separately. Otherwise, refusing difficult tasks can appear to improve efficiency. Measure speech duration, generated audio that was never played, and the distinction between provider first-audio time and user-audible latency.

## Reporting and retention

Publish the frozen configuration, public fixtures, scenario assumptions and aggregate results sufficient to reproduce the comparison. Use synthetic identifiers and generic dialogues. Avoid real credentials and private user conversations. Derived memory should remain traceable to permitted source evidence while deletion and retention requirements apply to all derived views.

Report both favorable and unfavorable arms, uncertainty intervals and important category regressions. Treat savings from this protocol as measured only after execution and invoice/usage reconciliation. Until then, the study's six cost scenarios remain arithmetic illustrations.
