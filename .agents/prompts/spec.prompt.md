# Prompt: Define a Research Specification

Read `AGENTS.md`, `.agents/rules/research.md`, the current task, and the relevant study. Identify the research question, audience, public-information boundary, intended files, acceptance criteria, verification commands, and requested delivery.

For a new material task, run:

```bash
node scripts/new-spec.mjs "Descriptive research task title"
```

Replace the generated template's open sections with specific, reviewable requirements. Add the spec to `specs/README.md` and point `.agents/state/project.json` at the active task when appropriate. Spec IDs and study IDs are separate sequences.

Move Draft to Ready once the scope is concrete and the task provides the needed authorization, then to InProgress when work starts. Do not make routine transitions an approval gate. Ask a concise question only when a material unresolved ambiguity prevents useful progress or an action exceeds the user's authorization.

Record assumptions as assumptions. Never claim an implementation or validation result before it exists. Include the user's current delivery preference so a local archive task cannot silently become repository publication.
