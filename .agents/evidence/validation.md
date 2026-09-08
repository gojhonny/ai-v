# AI-V Validation Evidence

**Review date: 2026-09-06 (UTC).**

**Result: Passed local validation.**

**Deliverable: `ai-v-research-2026-09-06.zip`.**

## Commands and review results

| Check | Outcome | Scope |
| --- | --- | --- |
| `node scripts/validate.mjs` | Passed | 37 project files, 20 titled Markdown documents, internal links, table columns, JSON, 66 source records, 15 TTS entries, dates, derived tables and harness state. |
| `node scripts/rank.mjs` | Passed | Reproduced the combined table and sensitivity leaders from structured inputs. |
| JavaScript syntax checks | Passed | All 9 `.mjs` files, including research examples and harness tools. |
| `node --experimental-strip-types --check research/001-cost-vs-naturalness/integrations/voice-contract.ts` | Passed on Node.js 24.19.0 | Syntax parsing of the proposed TypeScript interface; not SDK type-checking. |
| Spec allocator behavior | Passed | Isolated sequence allocation, existing-file preservation, malformed input, allocation-lock handling, exhaustion/cleanup, symlink destination refusal, and help output. |
| WebSocket lifecycle review | Passed with mock transport | Connecting cancellation is handled; late audio is discarded after settlement; successful output resolves; premature closure rejects. |
| Independent arithmetic review | Passed | Fixture lengths, Soniox token estimate, and native Google/OpenAI fresh-audio calculations. |
| Public-content review | Passed | No private product names, proprietary implementation material, embedded credentials, internal citation IDs, or workspace paths in delivered files. |
| Archive integrity and contents | Passed | ZIP CRC check and byte-for-byte comparison of all 37 project files; research, harness, specs and workflow included. |

Temporary fixtures and review scripts stayed outside the delivered collection. The archive contains one `ai-v/` project directory with no Git history, local dependencies, credentials, or generated recordings.

## Review corrections

The review corrected two WebSocket cancellation races: a connecting socket could be terminated before its error listener existed, and late buffered messages could reach the audio callback after completion or cancellation. Mock transport checks verified these specific fixes.

The proposed TypeScript interface was expanded so advertised incremental text, steering and timestamp capabilities have corresponding request/event fields. A redundant naturalness-weight configuration was removed; naturalness uses the complement of the configured cost weight.

Repository validation found missing Murf profile navigation and source registration. The profile and its sources were added, then the affected gates passed. Research dates are explicit in the study, both ranked tables, profiles, methodology, integration guide, source records and revision log.

## Verification boundaries

This is a documentation and code-example collection, not a deployed voice application. No paid provider API calls, recorded listening evaluations, production latency measurements, installed-SDK integration checks, or remote GitHub Actions runs were performed. Syntax checks do not establish that an account can access a model, that a voice ID is valid, or that a package version implements a changing SDK contract.

Markdown was reviewed structurally; a hosted GitHub rendering was not visually inspected. External sources were reviewed as documentation evidence rather than subjected to a separate automated uptime/link crawl. Source gaps remain documented in the research.

## Reproduce after extraction

```bash
node scripts/validate.mjs
node scripts/rank.mjs
```

The included GitHub Actions workflow runs these checks after the project is added to a repository. It does not run the optional paid synthesis examples.


## Study 002: Deterministic Memory Controls

**Review date:** 2026-09-06 (UTC).

**Local result:** Passed.

**Publication:** Blocked by GitHub integration access; no remote branch, PR or merge was created for this study.

| Check | Actual outcome | Scope and limitation |
| --- | --- | --- |
| `node scripts/validate.mjs` | Passed | Repository structure, titled Markdown, internal links, table columns, JSON, dates, source registers, JavaScript syntax and harness consistency; includes the new study's validation. |
| `node scripts/rank.mjs` | Passed | Reproduces Study 001's existing ranking; its research files and inputs were unchanged. |
| `node scripts/memory-cost.mjs` | Passed | Six hypothetical scenarios; an unfavorable case increases total cost. |
| Study 002 arithmetic review | Passed | Hand-calculated reference values, conditional cache hits, write premiums, output charges, background costs after bypass and invalid-input rejection. |
| Citation review | Passed with corrections | 29 dated sources; corrected TReMu author attribution and Palimpzest's exact title; checked critical numerical claims against versioned papers. |
| Public-content review | Passed | Reviewed all changed/new repository files for confidential names or architecture, embedded credentials, private context, local workspace paths and internal citation identifiers. |
| `git diff --check` | Passed | No patch whitespace errors. |
| Markdown rendering | Structural review passed; visual review unavailable | A local HTML preview was generated, but the installed Playwright package had no browser executable. Mermaid rendering was unavailable. No hosted GitHub rendering was inspected. |
| GitHub publication | Blocked | Read access succeeded; branch creation returned HTTP 403, `Resource not accessible by integration`. User publication/merge authorization is already recorded in the spec. |
| Live provider/voice tests | Not performed | No paid calls, production memory benchmark, recorded speech evaluation or latency measurement. |
| Remote CI | Not run for this change | No PR/head could be published; local success is not reported as a remote Actions result. |

The review covered Study 002's README, source register, structured inputs, cost model and evaluation protocol; the new arithmetic scripts; and changed root index, glossary, spec/state and validation files. Its roughly 5,000-word main report is desk research with engineering proposals and executed arithmetic, not a production-performance claim.

The repository remains InReview because the requested PR and conditional merge have not been delivered. The next step is restoring integration write access, publishing this scoped change, checking required statuses for the submitted head, and merging only after they pass. No permission or validation gate was bypassed.

## 2026-09-08: Study 003, TypeScript voice configuration and adapters

Reviewed the previous ten-model cohort against the benchmark publisher and 44 registered primary/benchmark sources. Read-only remote inspection confirmed the current main tree at `6d91e20fc33cc8956d996de509814de41856b800`; Study 003 was prepared on an isolated local branch from that commit. No remote branch, pull request, merge, provider synthesis, or credential discovery was performed for this task.

- `node scripts/validate.mjs`: passed. The collection has 68 files, 29 titled Markdown documents and 168 internal links; Study 002 arithmetic and Study 003 dated-source/cohort/contract checks passed. The validator checks 15 JavaScript module syntaxes.
- `node scripts/rank.mjs`: passed; Study 001 ranking reproduced without changing its inputs.
- `node scripts/memory-cost.mjs`: passed; all six Study 002 scenarios reproduced.
- `npm install --ignore-scripts --no-audit --no-fund` in Study 003 integrations: dependency installation completed without lifecycle scripts. Strict checking used TypeScript 7.0.2 and Node.js 24.19.0.
- `npm run check` in Study 003 integrations: strict compilation and all 14 offline tests passed. Tests cover input mapping, unsupported capabilities, server authorization boundaries, provider response shapes, PCM/WAV handling, WebSocket finalization, local cancellation, stale responses and autoplay recovery. Breeze's multipart example is fixture-tested separately.
- Independent review found three lifecycle/policy defects: discarding audio after blocked autoplay, reserving quota before input validation, and playback after a reentrant stop callback. All were corrected and covered by focused tests.
- `git diff --check`: passed for tracked changes; the staged patch is checked again during packaging.
- Public-content review: all 68 repository files inspected by a targeted pattern scan; no private product names, credentials, internal citation markers or workspace paths found. Source-to-claim and Markdown structure review completed.
- Visual limitations: no local Chromium/Chrome executable was available. Markdown was structurally checked; no rendered browser or audible playback result is claimed. Browser tests use a fake media element and synthetic bytes.

Reviewed paths: the complete `research/003-typescript-voice-adapters/` tree; root README and package metadata; Study 003 specification; spec index; project state; this evidence log; `scripts/validate.mjs`; `scripts/validate-voice-adapters.mjs`. Provider contracts that remain unresolved are retained in the study's source register. Remote CI was not run for this new study. The deliverable is a dated Markdown/TypeScript archive and a patch against the inspected base commit, not a production SDK.

Packaging verification: the initial 70-entry archive passed ZIP CRC checks and byte comparison with all 68 repository files. `git apply --check` and actual application against the inspected base succeeded; the resulting 68 files matched the prepared snapshot exactly. The final archive includes the complete snapshot, a patch and delivery instructions; installed dependencies, Git metadata and private research working notes are excluded. Metadata-only evidence updates are checked again when the final patch/archive is rebuilt.


## 2026-09-08: Study 003 pull request preparation

The follow-up request authorizes a topic branch and pull request against `gojhonny/ai-v` main. Read-only inspection confirmed main remains at `6d91e20fc33cc8956d996de509814de41856b800`, matching the prepared study base, with no open pull requests. The specification, index and active state now reflect this delivery request.

Repository validation and ranking reproduction passed again. Study 003 strict TypeScript checking and all 14 offline tests passed again. The study content and implementation are unchanged from the reviewed archive. The existing limits on live provider calls and real browser playback still apply. Remote publication and CI outcomes will be recorded after they occur.

A bounded publication review found no blocking scope, privacy, navigation or evidence-claim issues in the 28 changed files. `git diff --cached --check` passed. GitHub topic-branch creation succeeded for `docs/SPEC-003-typescript-voice-adapters`; commit upload and PR creation are the remaining delivery steps.

Publication succeeded: commit `dabba776df2b38b6a722330c758dfc96d5e1db3d` was published to the topic branch and [pull request #1](https://github.com/gojhonny/ai-v/pull/1) was opened against main. It contains the 28 reviewed files. No merge was performed. The active specification is Done because the current delivery request was to create the PR. Remote CI results are separate from the local checks above.

GitHub Actions passed for the initial published study commit: the [pull request run](https://github.com/gojhonny/ai-v/actions/runs/34212719976) and [push run](https://github.com/gojhonny/ai-v/actions/runs/34212685770) both completed successfully. These workflows run the repository validation and ranking checks; strict TypeScript checking was performed locally. The final delivery-record update also passed local repository validation and staged whitespace checks.
