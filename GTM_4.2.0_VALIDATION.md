# GTM 4.2.0 Preview validation record

## Passed automated / desktop checks

- `sh GTM_4.2.0_RUN_REGRESSION.sh` -- PASS combined suite
- `node --check dist/index.js` -- PASS
- `python tools/sync_visualizer_behaviors.py` -- bundle matches editable trusted behavior sources
- `python GTM_4.2.0_BUILTIN_BACKEND_TESTS.py` -- five built-in format-3 scenes load and validate, both native manifests protected from deletion
- `node GTM_4.2.0_BUILTIN_GAMES_TESTS.cjs` -- all five programs simulate 600 frames, finite state and bounded operations; at least two autonomous scoring tests
- Chromium canvas screenshot pass -- classic neon / thunder / starlight visibly distinct, five additional mini-games render after startup. This does not simulate SteamUI.
- Source regression suite -- Store and Ambient audio ownership, controller slots/disconnect/reclaim, Pong scoring/physics, dropdown pagination.

## Not claimed

- Physical Steam Deck FPS, latency, fluidity, controller hotplug order, screen focus, first-run startup timing, power cue behavior and all music playback surfaces were not validated on hardware.
- Legal clearance of names/logos is not certified; a public release should include trademark review and existing third-party license notices.
- Additional five 2D arcade mini-games are small playable prototypes, not complete commercial games.
