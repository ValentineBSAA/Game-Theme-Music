# GTM 4.2.3 Revised Preview: Validation Summary

Automated suite executed locally: `bash GTM_4.2.3_REV2_RUN_REGRESSION.sh`: PASS.

- Python backend pack v3 validator: all five additional game manifests valid; Arcade library returns six games including trusted built-in Pong; no unsupported fields or unknown option references.
- Frontend built-in library: persists all six games when backend fails/returns partial data.
- Simulation: five non-Pong games survive 120 seconds, powers affect real score or defense and remain per-player.
- Pong: LB deflection, RB pre-contact-only boost, expert AI shield, rear goal freeze and exactly one point, cinematic goal FX fades, couch-readable GOAL overlay.
- Controllers: AI auto-start, hold Triangle/Y join, 15-second after-intent ready wait for 1P and PvP, no unintended pause from joining.
- Previously verified GTM playback focus, crossfade, sleep/wake, clock and renderer performance tests pass with version-correct R2 test copies; v3 pack security regression passes.
- Chromium: five new games render; reference benchmark at 1280x240 shows < 0.3ms average per frame for each in the local Chromium run; Pong goal celebration ~0.14ms average in a local 50-frame drawing test. **Neither benchmark predicts physical Deck hardware performance.**
- Historical version-pinned 4.1.8 and 4.2.0 test files remain unchanged; their old readiness/version assumptions are intentionally superseded by R2 tests. Do not report the unmodified historical test launcher as green.

NOT VERIFIED: physical Steam Deck visuals, multi-controller input and menu focus, Bluetooth reconnections, prolonged gameplay or wattage/thermal use. Treat as Preview until device testing passes.
