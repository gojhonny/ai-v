# Spec 003: Canonical TypeScript Voice Provider Adapters

**Status:** Done

**Created:** 2026-09-08

**Study:** `research/003-typescript-voice-adapters/README.md`

**Delivery:** Dated English Markdown research and TypeScript companion code in a pull request against `jonatassales/ai-v` main. The project archive was delivered previously.

## Objective

Determine how the ten highest-naturalness voices from the previous study can be configured through TypeScript and whether the top five can share a canonical web component contract.

## Scope

Preserve the previous ten-model cohort, verify current primary API sources, distinguish literal top-five membership from implementation availability, and demonstrate configuration import, native request translation, response normalization and a generic component boundary. Include Google and the user's OpenAI configuration as explicit interoperability extensions. Update the study index and harness.

## Exclusions

Private product information, provider credentials, paid synthesis, a new listening benchmark, production deployment, merging the new pull request, and rewriting existing remote Git history. Native realtime conversation sessions are a separate interface from TTS.

## Acceptance criteria

- [x] Explain the ten models, exact API identities, voice selection, transports and evidence gaps.
- [x] Answer the literal top-five feasibility question and identify substitutions explicitly.
- [x] Implement and type-check canonical configuration, supported native transformers and response adapters.
- [x] Exercise meaningful contract, audio, failure and cancellation tests without paid calls.
- [x] Date the research, cite consequential claims, and deliver the study and companion package.
- [x] Publish the reviewed Study 003 changes on a topic branch and open a pull request against main.

## Verification plan

Run repository validation and ranking reproduction. Run TypeScript strict checking and mocked adapter tests; verify the final archive, links and public-content scope. Do not describe mocked audio, structural Markdown validation or documentation review as live synthesis, audible quality testing or browser playback verification.

## Authorization and workflow

Draft and Ready scope checks completed on 2026-09-08 before implementation. The research and archive delivery completed before the follow-up request to create a pull request on 2026-09-08. That request explicitly authorizes publishing these changes to a topic branch in `jonatassales/ai-v` and opening a pull request against main. The established collection format remains English Markdown with a dated study. No additional approval is needed for this publication; merging is outside this follow-up request.

## Implementation and evidence

Research complete: 44 primary/benchmark sources, ten-model cohort, canonical importers, eight hosted-provider adapters, a separate Breeze example and web component boundaries. Strict TypeScript compilation and 14 offline tests passed. Repository structural checks passed. The dated Markdown/TypeScript archive and patch were delivered against the inspected base commit. [Pull request #1](https://github.com/jonatassales/ai-v/pull/1) delivers the study from that same base, verified against current main. The PR remains open for review; completion here means the requested PR was created, not that it was merged. No live synthesis or browser playback was performed.

## Risks and open questions

Luna's public material lacks a fully verified deployable API contract. Breeze self-hosting has commercial-use restrictions. Similar configuration fields do not imply equal voice identity, language coverage, prompt semantics, audio framing or cancellation behavior. Provider APIs can change after this evidence date.
