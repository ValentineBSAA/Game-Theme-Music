# GTM 4.1.7 Preview Validation Results | November 2, 2026

## Automated checks: PASS

Ran `sh GTM_4.1.7_RUN_REGRESSION.sh` on the packaged source candidate. This includes Python compilation, JavaScript syntax, pack import security and v1/v2 compatibility, 4.1.7 arcade transitions and game registration, 4.1.7 scenery bounds and physics timing, 4.1.6 Store/ambient-playback scope and HUD, championship AI, shuffle, ResonaDeck audio focus, frame governor, controller/suspend logic and audio crossfade.

- Pong's 12-second simulation tested at **5, 16, 30, 60 and 90 rendered FPS**; fixed simulation time remained within ~32ms of elapsed wall time at all rates. Long suspend/wake stalls do not trigger unbounded physics replay.
- Default post-match pause **1.5s**; post-championship pause **3s**. Custom 0.5/1-second choices and auto-advance verified in source simulation.
- A dummy future Skee-Ball game registers with **independent score metadata** using the shared `create/step/draw` lifecycle. This is a registration test only: **Skee-Ball is not playable in 4.1.7**.
- Ten procedural arenas passed bounded-draw tests. Music set to Off leaves ambient motion autonomous and independent from audio packets.
- Desktop Chromium Canvas2D, at 1280x200 (60 draws plus Pong simulation), showed approximately **0.12 to 0.30 milliseconds per rendered frame for Pong + sample scenery** in the measured cases (machine-specific, NOT a Steam Deck performance prediction).
- Existing Store and Plugin Store playback **scope** tests passed, but real Deck playback was not executed in this environment.
- Added read-only performance telemetry in Pong Studio showing estimated drawn FPS, per-frame cost, quality scaling, physics steps, physics lag. This is instrumentation for real hardware debugging, not proof of stable frame rate.

**Historical note:** Original 4.1.4 and 4.1.5 monolithic snapshot tests contain hardcoded option-count expectations (13 and 14). They are preserved but will fail that obsolete assertion after adding 4.1.7 settings. The current 4.1.7 regression script contains current behavior tests and is the supported release gate.

## Not yet verified

- Actual Steam Deck/Samsung TV smoothness and scene appearance.
- Whether display throttling, high background load, CSS Loader or another Decky plugin still reduces real Pong render FPS below acceptable levels.
- Controller navigation through the two new dropdowns and live performance panel on physical Deck.
- Actual Steam Store and Decky Plugin Store music playback, and ResonaDeck coexistence, on physical Deck.
- Real-world flash-free scene transition on TV.

**Recommendation:** 4.1.7 is a **private Preview candidate**, not a stable release. Keep 4.1.6 available to roll back. On Deck, measure Pong Studio → Live Performance while the ball appears slow and include FPS, render cost, quality and physics lag with the report. Do not continue feature expansion until acceptance tests pass.
