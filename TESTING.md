# GTM 4.4.9: testing and verification

## Steam Deck observations (maintainer, November 3, 2026)

- **PASS (reported):** the version 4.4.9 welcome appears full-screen on Steam Home, with Valentine's message and a Continue to Home action.
- **PASS (reported):** AI-versus-AI Neon Paddle produced a genuine goal on physical hardware after the 4.4.9 scoring update.
- **Still to verify:** long-term spectator variety and learning progression; persistence after full reinstall and multiple restarts; all Quick Menu nested sections, TV/Couch styles, SteamOS themes, ResonaDeck and Ambient/Store playback on each supported configuration.

## Automated release checks

The release preparation workflow reconstructs the ZIP from the checksum-verified V4.4.1 binary plus the immutable GTM 4.4.9 delta and verifies individual modified file hashes against the tested ZIP. It then runs `node --check dist/index.js`, `python -m py_compile main.py`, `GTM_4.4.9_PONG_SCORING_REGRESSION.cjs`, `GTM_4.4.9_ALL_MODES_REGRESSION.cjs`, and `tests/GTM_4.4.6_SHUFFLE_REGRESSION_TEST.cjs`. The package must contain 555 direct-installable plugin files, with aligned 4.4.9 metadata.

**Hardware confirmation is scoped to the specific observations above.** Do not represent automated results as comprehensive Deck hardware acceptance.

