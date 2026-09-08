# AI-V Research Harness

This directory contains working rules, reusable prompts, a repository decision record, task state, and validation evidence. It supports the research collection without embedding a private product's architecture or requirements.

## Working files

| Path | Purpose |
| --- | --- |
| [rules/research.md](rules/research.md) | Evidence, scope, implementation, and delivery rules. |
| [prompts/spec.prompt.md](prompts/spec.prompt.md) | Turn an authorized task into a reviewable specification. |
| [prompts/research.prompt.md](prompts/research.prompt.md) | Investigate and write a public study. |
| [prompts/review.prompt.md](prompts/review.prompt.md) | Review claims, code boundaries, calculations, and completion. |
| [decisions/001-research-layout.md](decisions/001-research-layout.md) | Why studies and harness material have separate locations. |
| [state/project.json](state/project.json) | Active specification and honest verification state. |
| [evidence/validation.md](evidence/validation.md) | Actual validation results written during review. |
| [../specs/README.md](../specs/README.md) | Specification workflow and index. |

## State transitions

| State | Meaning | Exit condition |
| --- | --- | --- |
| Draft | The question, boundaries, and deliverable are being defined. | Scope and acceptance criteria are specific enough to review. |
| Ready | The task is scoped and authorization is understood. | Implementation starts within the authorized scope. |
| InProgress | Research, implementation, or correction is underway. | The deliverable is ready for the stated checks and review. |
| InReview | Evidence and acceptance criteria are being checked. | Checks pass, gaps are disclosed, and requested delivery is completed. |
| Done | The authorized task and delivery are complete. | A later change gets its own spec or an explicit revision. |

Return InReview work to InProgress when a finding requires changes. A state label is not evidence that a command passed. Readiness and routine internal transitions do not require a new approval when the user's task already provides authorization.

## Evidence discipline

Keep evidence concise: timestamp, command or review, outcome, relevant paths, and limitations. Distinguish local syntax or consistency checks from live service tests. Do not include API keys, confidential source material, account identifiers, or private conversation history.

Use the next unused three-digit study ID under `research/`. Spec IDs under `specs/` form their own sequence; a later spec may revise an existing study. The root README remains the study index. Update the spec index when adding or completing a spec.
