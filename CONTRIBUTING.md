# Contributing Research to AI-V

## Add a study

1. Pick the next research ID from the [index](README.md#research-index).
2. Create `research/NNN-short-topic/README.md` from the [template](templates/research-template.md).
3. Add supporting methodology, sources, data, and examples only when they help reproduce or assess the findings.
4. Add the study to the root index and run `node scripts/validate.mjs`.
5. Open a pull request explaining the question, evidence, changes, and verification limits.

## Writing and evidence

Every Markdown file must start with a descriptive level-one title. Write in English. Use relative links within the repository and descriptive HTTPS links to external sources. Cite consequential claims near the text and record access dates for changing information.

Prefer a model's exact API identifier over a marketing family name. Separate model providers, speech components, native speech agents, orchestration platforms, and hosting services. Record preview status and source discrepancies. Do not invent a score for an option whose required evidence is missing.

Prices need their currency, unit, billing tier, minimum spend, and inclusions. A synthesis-only rate cannot be presented as the complete cost of a conversation. Benchmark confidence intervals and language limitations must remain visible.

Keep public examples independent of any private implementation. Do not include proprietary designs, internal repositories, user conversations, credentials, account identifiers, or private business information. Use synthetic prompts and environment variable placeholders.

## Revise a study

Update the evidence date, affected sources, and revision log together. Keep structured data and rendered tables consistent. Explain changes to scoring separately from changes to provider performance. Do not silently re-label an older benchmark result as a newer model version.

Executable examples should identify runtime requirements and dependencies, check errors, and keep long-lived API credentials on the server. State clearly when code was reviewed against documentation but not executed with provider credentials.
