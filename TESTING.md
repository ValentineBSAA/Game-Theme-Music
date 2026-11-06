> **Next stable build under release preparation: GTM 4.6.5.** The maintainer's Steam Deck checks confirm individually hidden/visible Library context-menu entries, Store Music playback restored, and paired ResonaDeck 1.5.6 visualizers staying hidden at idle and appearing with eligible music. These are **reported physical hardware observations**, not universal performance measurements or a claim that all SteamOS/CSS themes were tested. Offline regression coverage included navigation, storage/state preservation and shared visualizer commands. The actual 4.6.5 release asset has not yet been uploaded; **V4.5.8 remains the published GitHub download**. [New release notes](docs/RELEASE_NOTES_4.6.5.md).

> **Current stable release:** GTM 4.5.8 ([published installer](https://github.com/ValentineBSAA/Game-Theme-Music/releases/tag/V4.5.8)). This document preserves the 4.4.9 hardware and physics regression history below. The current GitHub Actions check validates 4.5.8 metadata, JavaScript/Python syntax and published-runtime synchronization; the older fixed-version Pong test files are not automatically rerun against 4.5.8. The maintainer separately verified 4.5.8 ↔ ResonaDeck visualizer controls on Steam Deck. For the newest changes, see [4.5.8 release notes](docs/RELEASE_NOTES_4.5.8.md).

# Game Theme Music 4.4.9: testing and maintenance verification

**Maintainer: Valentine.** GTM is feature-complete for its current music-first direction and is **actively maintained**, not abandoned. See the [maintenance policy](docs/MAINTENANCE.md).

## Steam Deck observations (November 3, 2026)

- **Observed on hardware:** GTM 4.4.9's welcome appeared full-screen on Steam Home with Valentine's message and Continue to Home.
- **Observed on hardware:** Neon Paddle AI-versus-AI produced a genuine goal after the 4.4.9 scoring fix.
- **Not fully verified:** Every scene, all CSS palettes, different Decky/SteamOS versions, multi-hour AI sessions, sleep/wake and reboot persistence, imported packs, TV/Couch sizes and ResonaDeck/Ambient/Store integrations.

These observations do **not** certify universal stability or every hardware configuration.

## Active read-only CI

The repository's **GTM version-aware source and regression checks** GitHub Action runs on pull requests and pushes to `main`. For the existing **4.4.9** source it checks:

- `plugin.json` and `package.json` version agreement, developer attribution and compiled runtime hash.
- `node --check dist/index.js` and `python3 -m py_compile main.py`.
- `node GTM_4.4.9_PONG_SCORING_REGRESSION.cjs` (real-goal rules and high-skill match behavior).
- `node GTM_4.4.9_ALL_MODES_REGRESSION.cjs` (all 12 physics modes).
- `node tests/GTM_4.4.6_SHUFFLE_REGRESSION_TEST.cjs` (saved shuffle ON/OFF behavior).

**CI does not publish releases, rewrite the installed plugin or validate every Steam Deck interaction.** The former one-shot workflows that wrote old 3.x/4.x release contents back onto `main` have been retired to protect the maintained 4.4.9 source.

## Existing installer and historical build record

The previous published [V4.4.9 ZIP](https://github.com/ValentineBSAA/Game-Theme-Music/releases/tag/V4.4.9) remains a historical standalone Decky installer. The archived *historical build provenance* described in [SOURCE.md](SOURCE.md) references a previous 4.4.1 beta installer that is no longer a published GitHub release asset. **Do not restore or republish 4.4.1 as a prerequisite**. No older installer is needed to install 4.5.8.

For future bug-fix releases, validate current sources and the resulting installable ZIP separately, including device verification when possible. A new version should ship only when there is a real fix worth delivering; there is no fixed release cadence.

[Compatibility checks](docs/STEAMOS_COMPATIBILITY.md) · [Report a bug](https://github.com/ValentineBSAA/Game-Theme-Music/issues/new?template=bug_report.md) · [Maintenance policy](docs/MAINTENANCE.md)
