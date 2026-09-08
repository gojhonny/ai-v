# AI-V · AI Voice Engineering Research

Evidence, trade-offs, and implementation notes for building conversational voice software.

AI-V is an English-language research collection covering speech models, voice agents, evaluation, cost, memory systems, and interoperability. Each study has a dated evidence snapshot, explicit assumptions, and its own README. Findings describe public technology and general engineering patterns.

## Research index

| ID | Research | Question | Evidence checked |
| --- | --- | --- | --- |
| 001 | [AI Voice Engineering: Cost vs. Human-Like Speech](research/001-cost-vs-naturalness/README.md) | How do voice options compare when optimizing for cost and naturalness, and how can JavaScript applications integrate them? | 2026-09-06 |
| 002 | [AI Voice Engineering: Deterministic Memory Controls for Lower LLM Cost](research/002-deterministic-memory-cost/README.md) | When can deterministic policies, selective memory and cache reuse reduce total inference cost without losing conversational quality? | 2026-09-06 |
| 003 | [AI Voice Engineering: Canonical TypeScript Configuration for Natural Speech APIs](research/003-typescript-voice-adapters/README.md) | How can natural voice APIs share configuration, request adapters and web component playback? | 2026-09-08 |

## Start reading

- [Study 001: findings and rankings](research/001-cost-vs-naturalness/README.md)
- [Model and provider profiles](research/001-cost-vs-naturalness/providers.md)
- [JavaScript integration guide](research/001-cost-vs-naturalness/integrations/README.md)
- [Scoring and cost methodology](research/001-cost-vs-naturalness/methodology.md)
- [Study 002: deterministic memory and inference cost](research/002-deterministic-memory-cost/README.md)
- [Memory cost evaluation protocol](research/002-deterministic-memory-cost/evaluation.md)
- [Study 003: canonical TypeScript voice adapters](research/003-typescript-voice-adapters/README.md)
- [Voice engineering glossary](docs/glossary.md)

## Collection structure

| Location | Purpose |
| --- | --- |
| `README.md` | Repository introduction and the single research index. |
| `research/NNN-topic/README.md` | A study's title, scope, findings, navigation, and dated results. |
| `research/NNN-topic/methodology.md` | Workload, scoring, evaluation method, and limitations. |
| `research/NNN-topic/providers.md` | Option-by-option explanations when a study compares providers. |
| `research/NNN-topic/sources.md` | Source register, claim families, dates, and evidence gaps. |
| `research/NNN-topic/data/` | Small structured inputs used to reproduce that study. |
| `research/NNN-topic/integrations/` | Study-specific examples and their integration guide. |
| `docs/` | Concepts shared across studies. |
| `templates/` | Reusable starting points for new studies. |
| `scripts/` | Dependency-free validation and calculation utilities. |
| `specs/` | Numbered specifications, acceptance criteria and implementation evidence. |
| `.agents/` | Research rules, reusable prompts, decisions, state and review evidence. |
| `.github/workflows/` | Local checks configured to run on pushes and pull requests. |

Assign the next unused three-digit ID and a descriptive lowercase slug. Keep a study's path stable when revising it. Add a revision entry when evidence changes; use Git history to preserve previous snapshots. Create an `assets/` folder inside a study only when it has actual illustrations or other supporting files.

## Evidence standards

Use official documentation for API behavior and pricing, and independent benchmark publishers for evaluation results. Separate measured results, provider claims, calculated estimates, and proposed designs. A model's language support does not establish its quality in that language. Examples must state whether they were executed against a live service.

This collection is AI-assisted desk research. It does not claim that its authors ran the cited listening benchmarks. Third-party names identify their owners' products; the collection has no implied provider endorsement.

## Reproduce and contribute

The [agent harness](AGENTS.md) follows a [spec-driven workflow](.agents/README.md), with research rules, reusable prompts, project state, review evidence, and numbered specifications. [Spec 001](specs/001-research-collection.md) describes this initial collection.

With Node.js 24 or newer:

```bash
node scripts/validate.mjs
node scripts/rank.mjs
node scripts/memory-cost.mjs
node scripts/new-spec.mjs "Evaluate interruption handling across voice providers"
```

See [contribution guidance](CONTRIBUTING.md) and the [research template](templates/research-template.md). Provider calls are separate, opt-in examples and require the relevant credentials.

## Start from the project archive

Extract the archive, open the `ai-v` directory, and run the validation command above. No dependency installation is required for the research tools. To start Git history from this project:

```bash
git init -b main
git add .
git commit -m "Initialize AI Voice Engineering research collection"
```

Then connect your chosen remote repository and push through your usual workflow. The included GitHub Actions workflow repeats the local research checks; it does not run paid API examples.
