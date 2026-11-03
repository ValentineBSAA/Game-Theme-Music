# GTM 4.4.9 public release: provenance and validation

**Developer:** Valentine  
**Version:** 4.4.9  
**Published:** November 3, 2026  
**Status:** Regular GitHub release, no Beta suffix.

## Current downloadable release

[**V4.4.9**](https://github.com/ValentineBSAA/Game-Theme-Music/releases/tag/V4.4.9) provides `Game-Theme-Music-4.4.9.zip` and `SHA256SUMS.txt`. The installer is complete and **does not require an earlier plugin ZIP**.

## Exact source notes

- Maintainer-tested prepublication ZIP SHA-256: `a17c6691123f51670e76306590f0b4d247a575085ad2c6af55843070ed786f95`.
- Tested compiled frontend `dist/index.js` SHA-256: `36eef5688c45c538c2c076173dacfbe449f4505807f3ea14807aa9f73e738fa9`.
- The public release archive was constructed from individually validated contents. Archive-level checksums may differ due to ZIP metadata; use the SHA256SUMS attached to the current GitHub release.
- The original build procedure is **historical** and referenced an earlier 4.4.1 beta ZIP that is not currently a public release asset. **Do not restore or republish the 4.4.1 archive.** Keep the existing tag only as development history.

## Hardware evidence

Valentine showed a photograph of the **4.4.9 full-screen Steam Home welcome** on Steam Deck and separately confirmed seeing a genuine **AI-vs-AI Neon Paddle goal** after the scoring fix. No wider physical certification was claimed.

## Automated tests

Eight 300-second Pong spectator runs, all 12 physics modes, JavaScript/Python validation, settings persistence and archive integrity. The UI/AI learning/palette systems are preserved from 4.4.8. **This is not proof of universal reliability**.

## Continue testing

Long-running AI sessions, sleep/wake and restarts, CSS palettes, all nested Quick Menu categories, ResonaDeck music focus, Store/Ambient playback, custom packs and Default/Couch-TV modes deserve additional real-world coverage.

[Main README](../README.md) · [Source and integrity](../SOURCE.md) · [Testing](../TESTING.md) · [Release index](RELEASE_INDEX.md)
