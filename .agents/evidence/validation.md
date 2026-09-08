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
