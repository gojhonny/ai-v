# Prompt: Research a Public AI Voice Engineering Study

Read `AGENTS.md`, `.agents/rules/research.md`, the active spec, and existing study material. Work within the spec's public scope and current authorization.

Investigate the question using official provider sources and the original publishers of independent evaluations. Verify exact model identifiers, product category, availability, language coverage, pricing denominators, applicable tiers, and integration contracts. Record access dates and explicitly bound gaps. Do not pad a comparison with invented models or unsupported rankings.

Write the study with a descriptive English title, a dated README, source register, methodology, and any necessary provider profiles or integration examples. Use structured data for calculations. Explain voice quality, conversation quality, and complete system costs separately when their evidence differs. Language availability is not proof of benchmark quality in that language.

JavaScript examples must state runtime, credential boundary, dependencies, expected audio/event format, and live-test status. A generic interface is a proposed design unless actually implemented and verified; preserve provider differences in adapters.

Run `node scripts/rank.mjs --write` after intentional ranking-data changes, followed by `node scripts/rank.mjs` and `node scripts/validate.mjs`. Move the spec to InReview for verification, record actual evidence, and deliver in the format the user requested. Do not publish without the explicit authorization relevant to the current task.
