# Sources and Evidence Gaps: Deterministic Memory Controls

**Research and access date:** 2026-09-06 (UTC).

**Scope:** Primary literature, vendor-authored research and official operational documentation relevant to bounded memory/inference cost.

[Read the study](README.md) · [Machine-readable register](data/sources.json)

## Source register

Publication or version dates describe the source; they do not replace the access date. For living documentation whose update date is not visible, the access date is the verified temporal boundary. A vendor paper is primary evidence of its own experiment, not independent confirmation of its conclusions.

| Source | Publisher or authors | Publication or reviewed version | Evidence class |
| --- | --- | --- | --- |
| [FrugalGPT: How to Use Large Language Models While Reducing Cost and Improving Performance](https://arxiv.org/html/2305.05176v1) | Chen, Zaharia and Zou | 2023-05-09; arXiv v1 | original-paper |
| [RouteLLM: Learning to Route LLMs with Preference Data](https://arxiv.org/html/2406.18665v4) | Ong et al. | 2025-02-23; arXiv v4 | original-paper |
| [Palimpzest: Optimizing AI-Powered Analytics with Declarative Query Processing](https://www.vldb.org/cidrdb/papers/2025/p12-liu.pdf) | Liu et al.; CIDR | 2025; CIDR proceedings | original-paper |
| [TReMu: Towards Neuro-Symbolic Temporal Reasoning for LLM-Agents with Memory in Multi-Session Dialogues](https://arxiv.org/html/2502.01630v2) | Ge et al.; ACL Findings | 2025; arXiv v2 reviewed | original-paper |
| [MemGPT: Towards LLMs as Operating Systems](https://arxiv.org/html/2310.08560v2) | Packer et al. | 2023 initial preprint; arXiv v2 reviewed | original-paper |
| [Mem0: Building Production-Ready AI Agents with Scalable Long-Term Memory](https://arxiv.org/html/2504.19413v1) | Chhikara et al.; Mem0 | 2025-04-28; arXiv v1 | vendor-paper |
| [Zep: A Temporal Knowledge Graph Architecture for Agent Memory](https://arxiv.org/html/2501.13956v1) | Rasmussen et al.; Zep | 2025-01-20; arXiv v1 | vendor-paper |
| [LongMemEval: Benchmarking Chat Assistants on Long-Term Interactive Memory](https://arxiv.org/html/2410.10813v2) | Wu et al.; ICLR | 2025 conference; arXiv v2 reviewed | original-paper |
| [LLMLingua: Compressing Prompts for Accelerated Inference of Large Language Models](https://arxiv.org/html/2310.05736v2) | Jiang et al.; EMNLP | 2023-12-06; arXiv v2 | original-paper |
| [GPTCache: An Open-Source Semantic Cache for LLM Applications Enabling Faster Answers and Cost Savings](https://aclanthology.org/2023.nlposs-1.24/) | Bang; NLP-OSS | 2023-12; published workshop paper | original-paper |
| [vCache: Verified Semantic Prompt Caching](https://arxiv.org/html/2502.03771v5) | Schroeder et al. | 2026-02-21; arXiv v5 | original-paper |
| [Sleep-time Compute: Beyond Inference Scaling at Test-time](https://arxiv.org/html/2504.13171v1) | Lin et al. | 2025-04-17; arXiv v1 | original-paper |
| [Benchmarking AI Agent Memory: Is a Filesystem All You Need?](https://www.letta.com/blog/benchmarking-ai-agent-memory/) | Letta | 2025-08-12; research blog | vendor-report |
| [Lost in the Middle: How Language Models Use Long Contexts](https://aclanthology.org/2024.tacl-1.9/) | Liu et al.; TACL | 2024-02-19; published paper | original-paper |
| [Evaluating Very Long-Term Conversational Memory of LLM Agents](https://aclanthology.org/2024.acl-long.747/) | Maharana et al.; ACL | 2024-08; published ACL version | original-paper |
| [Latency optimization](https://developers.openai.com/api/docs/guides/latency-optimization) | OpenAI | Living documentation; revision date not displayed | official-documentation |
| [Prompt caching](https://developers.openai.com/api/docs/guides/prompt-caching) | OpenAI | Living documentation; revision date not displayed | official-documentation |
| [Prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching) | Anthropic | Living documentation; revision date not displayed | official-documentation |
| [LLM Cache API](https://redis.io/docs/latest/develop/ai/redisvl/0.17.0/api/cache/) | Redis | RedisVL 0.17.0; page date not displayed | official-documentation |
| [Budgets, Rate Limits](https://docs.litellm.ai/docs/proxy/users) | LiteLLM | Living documentation; revision date not displayed | official-documentation |
| [Deduplication](https://docs.bullmq.io/guide/jobs/deduplication) | Taskforce.sh / BullMQ | Living documentation; revision date not displayed | official-documentation |
| [Job Ids](https://docs.bullmq.io/guide/jobs/job-ids) | Taskforce.sh / BullMQ | Living documentation; revision date not displayed | official-documentation |
| [Idempotent jobs](https://docs.bullmq.io/patterns/idempotent-jobs) | Taskforce.sh / BullMQ | Living documentation; revision date not displayed | official-documentation |
| [Batch API](https://developers.openai.com/api/docs/guides/batch) | OpenAI | Living documentation; revision date not displayed | official-documentation |
| [GraphRAG Indexing](https://microsoft.github.io/graphrag/index/overview/) | Microsoft | Living documentation; revision date not displayed | official-documentation |
| [Global Search](https://microsoft.github.io/graphrag/query/global_search/) | Microsoft | Living documentation; revision date not displayed | official-documentation |
| [From Local to Global: A GraphRAG Approach to Query-Focused Summarization](https://arxiv.org/html/2404.16130v2) | Edge et al. | 2024 initial preprint; arXiv v2 reviewed | original-paper |
| [Managing costs](https://developers.openai.com/api/docs/guides/realtime-costs) | OpenAI | Living documentation; revision date not displayed | official-documentation |
| [Voice activity detection (VAD)](https://developers.openai.com/api/docs/guides/realtime-vad) | OpenAI | Living documentation; revision date not displayed | official-documentation |

## Search and reconciliation method

The review followed three bounded lanes: conversational memory and temporal reasoning; caching, routing and compression; and official voice/runtime billing and scheduling behavior. Discovery used exact paper titles, original proceedings and official provider pages. Follow-up inspected paper tables, versioned full texts, and operational caveats instead of aggregating marketing headlines.

Representative search families were `Mem0 full context token latency Table 2`, `LongMemEval fact raw retrieval ablation`, `TReMu temporal symbolic reasoning`, `Sleep-time Compute amortized cost`, `FrugalGPT cascade costs`, `RouteLLM v4 cost Table 6`, `vCache threshold dilemma`, and official caching/deduplication/budget documentation. The review includes relevant evidence published through the research date; it is a targeted review rather than a systematic review of every publication.

Critical checks distinguished percentage points from relative percentages, cache-hit errors from errors over all requests, published dataset versions from later revisions, query-context counts from lifecycle expenditure, and learned estimators from deterministic policy execution. Cross-paper scores were not treated as a shared leaderboard.

## Gap matrix

| Question | Evidence status | Confidence and limitation | What would resolve the gap |
| --- | --- | --- | --- |
| Can software prevent unnecessary model dispatch? | Supported by ordinary admission mechanisms and official controls | High for explicit contracts; uncertain inputs and concurrent state need separate handling | Instrument a real request path and verify rejected dispatches |
| Can selected memory reduce query context? | Supported by several source-reported experiments | High for their measurements; no universal quality outcome | Reproduce with a pinned model, source set and grader |
| Does the complete proposed architecture save money? | Not experimentally established | Unknown; the included experiment is arithmetic only | Full-lifecycle ablation including cold start, failures and speech |
| Are graphs consistently worth their cost? | Evidence is mixed and workload dependent | Low for a universal recommendation | Compare simple retrieval and optional graph views under identical conditions |
| Is semantic similarity a correctness guarantee? | Counterevidence and conditional methods reviewed | High that a universal threshold should not be assumed safe | Calibrate by request class, report false reuse and audit source changes |
| Does background execution itself save money? | Not established; amortization is necessary | High for accounting distinction; optimal triggers unknown | Measure reuse before invalidation and worker cost |
| Does text-benchmark quality transfer to Portuguese voice interaction? | Unverified in this review | Unknown | Speech evaluation with pt-BR, interruptions and ASR corrections |
| Is there a neutral full-lifecycle comparison of all memory systems? | No such replication verified | Absence in this bounded review is not proof none exists | A reproducible independent study with common datasets and billing boundaries |

The review stopped when each material section had primary support or an explicit evidence gap. Additional broad discovery was unlikely to change the main conclusion: deterministic controls are useful candidates, but end-to-end savings remain workload dependent. No proprietary corpus, paid provider test, new listening benchmark or production deployment was used.

## Evidence labels

- **Original paper:** A primary description of its authors' method and experiment; inspect the evaluation conditions.
- **Vendor paper/report:** First-party performance evidence with an interest in the compared system; distinguish it from neutral replication.
- **Official documentation:** Evidence of a documented behavior, API or billing rule at access time; not a measurement of this study's architecture.
- **Engineering proposal:** A suggested design choice whose effect needs testing.
- **Hypothetical arithmetic:** Reproducible calculations using invented inputs, with no quality or latency claim.
