# Spec 001: Build the Public AI Voice Engineering Research Collection and Harness

**Status:** Done  
**Created:** 2026-09-06  
**Study:** [001 — Cost vs. Human-Like Speech](../research/001-cost-vs-naturalness/README.md)  
**Delivery:** Complete project ZIP; no external repository publication requested.

## Objective

Create an English-language research collection that can accommodate future studies, starting with a documented comparison of AI voice options by cost and naturalness. Include a generic spec-driven harness and reproducible local tooling so the downloaded project can be maintained independently.

## Scope

- Root README with a research index, a stable folder layout, contribution guidance, shared glossary, and reusable templates.
- A curated naturalness comparison of 15 TTS options and a reproducible cost/naturalness comparison for entries with sufficient pricing evidence.
- A separate cost panel for two native audio conversation models, with their different scope made explicit.
- Provider and model profiles covering the selected options, relevant full-model variants, and Simba 3.0 language context alongside English-only Simba 3.2.
- Dated public source register, documented cost assumptions, benchmark interpretation, uncertainty, and structured ranking inputs.
- JavaScript integration guidance and general provider-adapter design that explains transport, authentication, audio formats, and event differences. Examples are not claimed to have been live tested.
- A generic harness containing working instructions, rules, reusable prompts, one structure decision, project state, spec workflow, safe spec creation, and review evidence.
- A ZIP containing the complete project with locally verified contents.

## Exclusions

Exclude private product names, confidential plans, proprietary architecture, credentials, private conversation material, and copied third-party documentation. Do not fabricate exhaustive market coverage, model availability, listening experiments, live API tests, or rankings for entries without the needed evidence. This task does not include publishing a repository, opening a pull request, or merging.

## Acceptance criteria

- [x] Every Markdown document has a descriptive English H1 and an appropriate place in the collection.
- [x] Root and study navigation, glossary, contribution guidance, templates, harness, and specification links are consistent.
- [x] Both comparison perspectives are documented; native audio costs remain distinguishable from TTS pipeline estimates.
- [x] Selected models have sourced profiles, pricing scope, availability and language notes, and bounded gaps.
- [x] Calculations can be reproduced from structured inputs using the included ranking utility; derived tables match those inputs.
- [x] JavaScript examples and proposed interfaces explain their runtime and credential boundaries and their not-live-tested status.
- [x] The spec allocator safely generates the next ID, rejects invalid input, and cannot overwrite an existing file.
- [x] Local validation and focused review outcomes are recorded as actual evidence, with any limitations disclosed.
- [x] The complete ZIP is checked and delivered in accordance with the current request.

## Verification plan

```bash
node scripts/validate.mjs
node scripts/rank.mjs
```

Use `node scripts/rank.mjs --write` to regenerate tables after intentional changes to structured ranking data, then repeat the affected checks. Review source attribution, price units, subscriptions, category boundaries, Markdown navigation, and the public-information boundary. Check the archive includes research, scripts, templates, specifications, and `.agents/` files.

Check the allocator's syntax and behavior in an isolated temporary copy: sequential allocation, malformed titles, existing files, and lock contention. Do not create test specs in the delivered collection.

## Authorization and workflow

Ordinary reversible implementation and review follow the user's task authorization. The current deliverable is a ZIP, so the workflow must not publish externally. Progress uses Draft, Ready, InProgress, InReview, and Done; readiness does not require a redundant approval request.

## Current evidence

The public collection, source register, examples, and harness passed the recorded local checks. The project archive was created and verified against every source file. It is prepared for download as `ai-v-research-2026-09-06.zip`. See [.agents/evidence/validation.md](../.agents/evidence/validation.md) for commands, outcomes, review fixes, and remaining validation limits.

## Risks and limits

Provider documentation and prices change. Listening preferences are not universal or proof of equivalent quality in every supported language. Cost outputs depend on the stated workload and billing assumptions. JavaScript examples require credentials and a separate authorized live evaluation before claiming production behavior.
