# Game Theme Music 4.1.4 Preview: validation record

**Status:** PRIVATE PREVIEW / source-level test pass, **physical Steam Deck tests NOT RUN**. Not a public or stable release.

## Input and output

- Source baseline: user-provided `Game-Theme-Music-4.1.3-PREVIEW.zip`.
- Preview: `Game-Theme-Music-4.1.4-PREVIEW.zip`.
- Standalone importable demo: `GTM_4.1.4_Starter_Effects_Pack.zip` (also inside `visualizer-packs/sdk-examples/`).
- Developer API and exact module guide: `GTM_4.1.4_EFFECTS_PACK_SDK.md`.

## Automated validations passed

Run from the plugin directory: `sh GTM_4.1.4_RUN_REGRESSION.sh`.

- Python backend compile and bundled frontend/behavior JavaScript syntax checks.
- Legacy v1 and new v2 pack loading, scene count, upgrade/removal, persistent pack files, collisions, and invalid/malicious ZIP rejection.
- All 17 Canvas2D overlay commands exercised in a mock canvas.
- All 20 Pong powers in the registry; AI state, match points, champion resets, color-changing without game reset.
- **Natural** simulated AI championship completion in Classic and Power modes.
- Shuffle imported packs, category registration, per-frame collision, beat input and non-repeat selection.
- Quick Menu manual Pause/Resume latch interacting with Ambient auto-resume; simulated ResonaDeck focus, sleep/wake, timeouts, Store/Game ownership.
- 30/40/60/90 Hz frame-pacing and adaptive quality simulation, crossfade callbacks and power-controller regression coverage.

## What these tests do NOT prove

- Real Steam Deck OLED/SteamOS Decky Loader behavior, input controller focus, or sustained 40/60/90 Hz performance.
- Actual multicolor readability and menu layout on a Deck display.
- Whether physical suspend/wake, external Plex handoff and import selection feel correct end-to-end.
- Full functionality on a fresh installation beyond mocked backend and behavior tests.

## Go / no-go before publishing as Stable

Keep the original 4.1.3 Preview ZIP as rollback. Follow `GTM_4.1.4_EFFECTS_PACK_SDK.md` → `Pre-publish physical Steam Deck QA`, including a 2-minute manual pause with Ambient enabled, importing the starter ZIP, actual performance measurement and one complete Best-of-5 tournament. Do not publish as Stable without a physical acceptance pass.

## Architectural contract

Visual pack ZIPs contain **declarative JSON content only**. They can combine approved gameplay scenes, audio-modulated base effects, and pre-approved visual overlays; they cannot introduce arbitrary executable JavaScript, physics algorithms or shaders. New core algorithms require editing the trusted engine and re-running validation. No separate media player or unrestricted script loader was introduced.
