# AI-V Agent Working Instructions

AI-V is a public, English-language collection of AI Voice Engineering research. Use this harness to keep changes scoped, evidence-backed, and reproducible.

## Start a task

1. Read the user's current instructions and the relevant study.
2. Read [research rules](.agents/rules/research.md) and find the active specification in [the spec index](specs/README.md).
3. Create a spec for a new study or a material change using `node scripts/new-spec.mjs "Descriptive title"`. Small corrections may reference an existing spec.
4. Move the spec through `Draft → Ready → InProgress → InReview → Done` as its actual state changes. Update [.agents/state/project.json](.agents/state/project.json) when the active task changes.

## Work and authorization

Use the task's existing authorization for ordinary reversible research, documentation, and local code changes. Resolve routine implementation choices without asking again. A spec becoming Ready is a readiness check, not an automatic permission request.

Publishing, uploading to an external repository, creating a pull request, and merging must follow the user's explicit task authorization and current delivery preference. Preparing a local archive does not authorize publication. Do not send messages to other people without explicit authorization. Never commit credentials or confidential context.

## Validate before completion

```bash
node scripts/validate.mjs
node scripts/rank.mjs
```

When structured ranking inputs intentionally change, regenerate and then validate the tables:

```bash
node scripts/rank.mjs --write
node scripts/validate.mjs
```

Record commands, outcomes, material limitations, and the files reviewed in [.agents/evidence/validation.md](.agents/evidence/validation.md). Do not report planned checks as successful. Live provider calls are separate from local validation and require their own authorized execution and credentials.

Mark a spec Done only when its acceptance criteria and requested delivery are satisfied, with evidence. Preserve any known gaps in the study and final report. Read [the harness guide](.agents/README.md) for workflow details.
