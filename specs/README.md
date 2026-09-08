# AI-V Specification Index

Specifications define material research and repository changes before implementation. They document scope, acceptance criteria, actual validation, and delivery without turning ordinary authorized work into a permission loop.

| ID | Specification | Status |
| --- | --- | --- |
| 001 | [Build the Public Research Collection and Harness](001-research-collection.md) | Done |
| 002 | [Deterministic Memory Controls for LLM Cost](002-study-deterministic-memory-controls-for-llm-cost.md) | InReview |
| 003 | [Canonical TypeScript Voice Provider Adapters](003-canonical-typescript-voice-provider-adapters.md) | InReview |

## Create a specification

```bash
node scripts/new-spec.mjs "Compare conversational turn detection methods"
```

The command creates a Draft from [the spec template](../templates/spec-template.md) using the next unused three-digit ID. It accepts one quoted English title, uses a repository-relative destination, and refuses malformed titles, exhausted IDs, concurrent allocation, or overwriting an existing target. If another allocation is in progress, rerun after it finishes. Remove a stale `.spec-allocation.lock` only after confirming no allocator is running.

Fill in the generated sections and add an index row here. The command does not modify this index or the active project state automatically, so a new draft does not replace another task silently.

## Lifecycle

Use `Draft → Ready → InProgress → InReview → Done`. Ready means scope and authorization are understood. InReview means the deliverable still needs its stated checks and acceptance review. Done requires evidence and completion of the requested delivery. Return InReview work to InProgress if changes are needed.

Keep the spec, this index, and [project state](../.agents/state/project.json) consistent. A specification ID does not have to match the study it changes. Record actual validation in [the evidence log](../.agents/evidence/validation.md).
