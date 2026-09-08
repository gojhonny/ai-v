# TypeScript Voice Adapter Reference Implementation

**Research date:** 2026-09-08

A documentation-derived companion to [Study 003](../README.md). It demonstrates canonical configuration, strict configuration import, provider request plans, bounded audio decoding, a server route and a browser playback helper. It uses Node.js 24 or newer and native `fetch`/`WebSocket`; TypeScript is a development dependency only. No provider calls are made by the tests.

## Run the checks

From this directory:

```bash
npm ci --ignore-scripts
npm run check
```

`npm run check` runs strict TypeScript checking and offline contract tests. Node 24 executes the erasable TypeScript syntax in these examples. Browsers need your application's normal TypeScript bundler; do not serve `.ts` files directly as browser JavaScript. The package pins the compiler version in its lockfile.

From the repository root, also run:

```bash
node scripts/validate.mjs
node scripts/rank.mjs
node scripts/memory-cost.mjs
node --test research/003-typescript-voice-adapters/integrations/test/*.test.mjs
```

## Source map

| File | Responsibility |
| --- | --- |
| [contracts.ts](src/contracts.ts) | Canonical schema, runtime validation, simple aliases and native importers |
| [profiles.ts](src/profiles.ts) | Reviewed model profiles and documented stock voice examples |
| [plans.ts](src/plans.ts) | Server-only upstream URLs, credentials, version headers and request shapes |
| [audio.ts](src/audio.ts) | Bounded audio handling, JSON/base64 extraction, WAV checks, PCM wrapping, dialogue accumulator |
| [engine.ts](src/engine.ts) | HTTP and one-session dialogue WebSocket execution, deadlines and abort handling |
| [server.ts](src/server.ts) | Framework-neutral authenticated profile boundary |
| [browser.ts](src/browser.ts) | Complete-audio playback, cancellation, stale-result protection and autoplay retry |
| [breeze-local.ts](src/breeze-local.ts) | Separate self-hosted multipart example; restricted model license |
| [Contract tests](test/contracts.test.mjs) | Provider mapping, audio decoding, protocol termination, abort and server policy |
| [Playback tests](test/browser.test.mjs) | Fake-audio lifecycle tests; these are not browser playback tests |

## Configure and synthesize

```ts
import { profiles } from './src/profiles.ts';
import { synthesize } from './src/engine.ts';

// SERVER ONLY. Supply this value from the host's secret configuration.
const credential = process.env.CARTESIA_API_KEY;
if (!credential) throw new Error('Configure the Cartesia credential');

const result = await synthesize(
  profiles.cartesia,
  { requestId: crypto.randomUUID(), text: 'Welcome. How can I help?' },
  credential,
);
// result.bytes is complete audio; result.mediaType declares its format.
```

This example performs a paid/provider call if executed with valid credentials. It was not executed during this research. The test fixtures inject fake HTTP/WebSocket responses instead. There is no implicit network request when importing a profile or creating a request plan.

## Mount an application route

```ts
import { createSpeechHandler } from './src/server.ts';
import { profiles } from './src/profiles.ts';

export const POST = createSpeechHandler({
  profiles: [profiles.cartesia, profiles.inworld, profiles.inworldFlash],
  authorizeAndReserve: async (request, profile) => {
    // Implement your existing session authorization and quota reservation here.
    return authorizeVoiceRequest(request, profile.profileId);
  },
  credentialFor: async profile => getServerCredential(profile.provider),
});
```

`authorizeVoiceRequest` and `getServerCredential` are explicit **host integration hooks**, not functions shipped by this package. Mount the handler at `/api/voice/speech`. Use the public profile object on the client; the request body sends only `profileId`, text and request ID. Browser-controlled provider URLs, arbitrary models and keys do not become upstream authority.

The server hook reserves quota; the host must also settle usage and release reservations after failure. Actual idempotency, rate limits, session authentication, CSRF integration, storage and telemetry remain application responsibilities. The `Origin` check is supplementary and is not authentication. Verify your framework propagates disconnects to `Request.signal`.

## Behavior and limitations

- Eight hosted adapters support nine documented model configurations: Cartesia, two Inworld models, Speechify, ElevenLabs, Google, OpenAI, Smallest and Soniox. The initial five-model shortlist uses Cartesia, both Inworld models, Speechify and ElevenLabs.
- Luna is not assigned invented identifiers. Breeze has a separate, documented self-hosted example, not a hosted canonical profile.
- Results are buffered. Upstream transport streaming does not imply incremental browser playback in this reference.
- Application limits are 1,800 UTF-16 code units of text, 16 MiB of decoded audio and a default 60-second synthesis deadline. They are conservative reference policies, not universal vendor quotas.
- Model and voice catalog membership is partly static; verify live compatibility and account access before deployment. No voice cloning or cross-provider voice identity conversion is performed.
- Abort stops this operation locally and closes/aborts its transport. Provider billing cancellation is not promised.
- Browser autoplay rejection retains synthesized audio for a later user-initiated `play()`. Stop/dispose clears buffered playback and invalidates delayed results.
- WAV structure and PCM metadata are checked; these checks do not establish codec fidelity or audible completeness in all network failures. MP3 frames are concatenated only within the documented single dialogue stream, not across independent syntheses.
- Native importers accept only the documented configuration subset and reject extra fields. Add a namespaced option and its adapter test before supporting another provider feature.

## Verification scope

Strict compilation and all included offline tests passed on the research date. The fixture audio is synthetic and the browser media element is mocked. No live synthesis, real WebSocket server, real audio device, runtime account discovery, listening assessment or real browser was used. The source URLs and unresolved contracts are recorded in [the study source register](../sources.md).
