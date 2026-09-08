# Spec {{SPEC_ID}}: {{SPEC_TITLE}}

**Status:** Draft  
**Created:** {{CREATED_DATE}}  
**Study:** Identify the affected study or new study path.  
**Delivery:** Record the current requested format and any explicit publication authorization.

## Objective

State the concrete question or repository change and why it matters.

## Scope

List intended outputs, relevant files, and the public information boundary. Distinguish study IDs from specification IDs.

## Exclusions

Record what is outside the task, including any unavailable evidence or unauthorized external actions.

## Acceptance criteria

- [ ] Define an observable result that answers the task.
- [ ] Record evidence, assumptions, and remaining limitations.
- [ ] Complete the verification appropriate to the changed files.
- [ ] Deliver the requested result in the authorized format.

## Verification plan

```bash
node scripts/validate.mjs
node scripts/rank.mjs
```

If ranking inputs intentionally change, use `node scripts/rank.mjs --write` before rechecking. Add focused checks only where needed to resolve a concrete risk. Record actual outcomes in `.agents/evidence/validation.md`; distinguish local checks from live provider tests.

## Authorization and workflow

Use `Draft → Ready → InProgress → InReview → Done`. Continue ordinary reversible work within existing task authorization. Publishing, merging, and external communication follow the user's explicit instructions. Do not make routine readiness transitions an approval gate.

## Implementation and evidence

Describe implementation when it exists. Record completed commands and reviews with their outcomes. Do not replace planned checks with invented results. Mark Done only after acceptance criteria and requested delivery are satisfied.

## Risks and open questions

Identify material uncertainty and explain how it will be resolved or disclosed.
