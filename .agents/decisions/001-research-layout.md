# ADR 001: Keep Each Study Self-Contained and Reproducible

**Status:** Accepted for the initial collection structure  
**Date:** 2026-09-06

## Context

The repository will contain multiple public AI Voice Engineering studies. Readers need one entry point, stable links, and a clear separation between a study's findings and the process used to maintain them.

## Decision

Keep the study index in the root README. Store each study in `research/NNN-topic/` with its own README, methodology, sources, structured inputs, and study-specific integration material. Put reusable concepts in `docs/` and templates in `templates/`.

Keep task specifications in `specs/`. Store working rules, prompts, decisions, state, and evidence under `.agents/`, with `AGENTS.md` as the agent entry point. Study IDs and spec IDs use independent three-digit sequences because several specs may refine one study.

Use dependency-free Node.js utilities for local validation, table generation, and spec allocation. Archive delivery includes this harness so the project can be maintained after download. External publication is a separate action governed by the user's current authorization.

## Consequences

Each research folder can be read independently while shared guidance stays concise. Stable study paths survive revisions; dated source records and revision logs explain changes. Contributors must update the study and spec indexes when applicable and keep generated tables aligned with their inputs.

The harness documents a review workflow. It does not imply that a research result, code example, or external API was tested. Validation evidence records what actually happened.

## Alternatives considered

A single growing README would make navigation and dated evidence harder to maintain. A folder per provider would scatter the evidence for one comparison across the repository. Keeping complete documents only as binary exports would reduce reviewability and reproducibility.
