# GTM 4.6.7: physical Steam Deck verification (November 6, 2026)

**Latest stable:** [V4.6.7](https://github.com/ValentineBSAA/Game-Theme-Music/releases/tag/V4.6.7) · [Release notes](docs/RELEASE_NOTES_4.6.7.md).

| Test | Observation |
| --- | --- |
| All three independent GTM Library context-menu visibility switches | **PASS**, including mixed ON/OFF combinations |
| Browse all pages A–Z and LB/RB navigation | **PASS** during maintainer testing |
| Decky Plugin Store music starts and stops | **PASS** |
| Native Steam Store music starts and stops when leaving | **PASS** after 4.6.7 exit-detection fix |
| Final Store tests after installing 4.6.7, without reboot | **PASS** |
| GTM yields Store audio to ResonaDeck already playing | **PASS** |
| Enabled Home visualizer hidden without eligible music, then shown with music | **PASS** |
| ResonaDeck music-frequency response | **PASS after manually toggling sharing OFF/ON**; universal automatic first-connect still requires monitoring |
| Syntax, ZIP integrity, focused Store navigation tests, YT-DLP/QuickJS preservation | **PASS** in packaging checks |
| Every SteamOS/Decky build, CSS Loader theme, streaming format and extended play session | **Not universally verified** |

A full Steam Deck restart is **not normally required**. A Steam restart can still clear stale plugin hooks after a hot update, if needed.

**Source / CI scope:** The main-branch tracked runtime snapshot still reflects an older version, so passing older fixed-version GitHub Actions checks does not automatically prove parity with the published 4.6.7 ZIP. See [SOURCE.md](SOURCE.md).

## Historical testing archive

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
