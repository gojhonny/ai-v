# Prompt: Review Research and Delivery Evidence

Read the active spec, `AGENTS.md`, `.agents/rules/research.md`, and the modified files. Assess the deliverable against the spec before marking it complete.

Review these independent concerns:

- Public scope: no confidential context, credentials, private identities, or unsupported personal assertions.
- Evidence: material facts have appropriate sources, dates, exact model identities, and honest uncertainty.
- Comparisons: denominators, tier commitments, cost boundaries, scoring, and language limitations are explicit; category differences are preserved.
- Reproducibility: structured inputs agree with derived tables, local links resolve, and commands match repository behavior.
- Integration: request shapes, runtime boundaries, audio handling, and limitations are explained; local checks do not masquerade as live service tests.
- Delivery: requested files and indexes exist, and the result follows the user's current archive or publication instruction.

Run `node scripts/validate.mjs` and `node scripts/rank.mjs`. If ranking inputs intentionally changed, run `node scripts/rank.mjs --write` before repeating the relevant checks. Record actual outcomes in `.agents/evidence/validation.md`, including failures and the checks repeated after fixes.

Return the spec to InProgress if changes are required. Mark Done only after acceptance criteria and requested delivery are satisfied. Update `specs/README.md` and `.agents/state/project.json` consistently. Report any remaining limitation plainly; never fabricate completion evidence.
