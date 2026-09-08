# Spec 002: Deterministic Memory Controls for LLM Cost

**Status:** InReview

**Created:** 2026-09-06

**Study:** [Study 002](../research/002-deterministic-memory-cost/README.md)

**Delivery:** English Markdown study; pull request to `main`, followed by merge if required validations pass.

## Objective

Investigate whether deterministic policies around memory and conversational inference reduce total LLM expenditure while preserving acceptable quality and voice latency. Compare a generic hypothetical baseline with evidence-supported improvements.

## Scope

- Dated research README, original-paper evidence, official operational documentation, explicit limits and improvement priorities.
- Generic memory admission, retrieval, cache validity, budget enforcement, event deduplication, asynchronous processing and learned components.
- Reproducible offline cost scenarios, including an unfavorable scenario, and targeted arithmetic validation.
- Root research index, shared glossary, spec, state and validation evidence updates.

## Exclusions

Private names, proprietary implementation details, unpublished performance claims, paid API calls, live voice benchmarking, and changes to Study 001's findings or ranking inputs are outside scope. The hypothetical design is a research proposal, not a production implementation.

## Acceptance criteria

- [x] Answer the research question with primary sources and distinguish deterministic policies from learned estimators.
- [x] Present a hypothetical architecture, improvement comparison, break-even analysis, quality constraints and an evaluation protocol.
- [x] Date the study and source register; document empirical scope, uncertainty and evidence gaps.
- [x] Reproduce cost scenarios, exercise meaningful arithmetic edge cases, and pass repository validation and existing ranking checks.
- [x] Review every changed public file for confidential information and citation defects.
- [ ] Open a PR to `main`; merge only after required checks pass; record actual delivery status.

## Verification plan

```bash
node scripts/validate.mjs
node scripts/rank.mjs
node scripts/memory-cost.mjs
git diff --check
```

The repository validator will include the new cost-study checks. Review denominator consistency, overlapping savings, unsuccessful scenarios, source dates, links, and the distinction between simulations and measurements.

## Authorization and workflow

The current task explicitly authorizes research, repository changes, PR creation and merge to `main` after passing validations. Draft and Ready scope checks completed on 2026-09-06 before implementation. No further user approval is needed for ordinary implementation decisions.

## Implementation and evidence

The dated study, 29-source register, evaluation protocol and six hypothetical cost scenarios are complete. Local repository validation, original ranking reproduction and focused arithmetic checks passed. The final public-content review passed; Markdown structural checks passed, while visual rendering was unavailable. Remote reads succeeded. The GitHub integration rejected branch creation with HTTP 403 (`Resource not accessible by integration`); publication remains blocked by integration access. This is not a missing user authorization. Local preparation continues.

## Risks and open questions

Memory papers use heterogeneous benchmarks; token savings may omit ingestion, retrieval, retries, hosting or speech. Learned extraction can introduce errors and permanent information loss. Cache discounts and retention vary by provider/model. All generic improvement hypotheses need workload-specific evaluation.
