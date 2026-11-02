# Game Theme Music 4.1.2 • Testing

## Verified on physical Steam Deck
- **PASS:** Ambient does not immediately blast after sleep/wake; delayed recovery works.
- **PASS:** Ambient comes back correctly after a full Deck restart, subject to the configured delay.
- **PASS, subjective:** the updated footer visualizer pacing appeared smooth during actual play.
- **Previously confirmed:** ResonaDeck and GTM cooperate on visualizer/audio focus; both plugins were working on Deck as of the final testing session.

This is a **maintainer-reported hardware acceptance**, not independent laboratory measurement. Exact SteamOS/Decky build numbers, logged frame times and calibrated audio delay measurements were not recorded. Do not describe a 60 or 90 FPS target as a guaranteed measured FPS result.

## Offline checks run against the 4.1.2 package

- **PASS:** JS syntax, Python syntax and plugin ZIP CRC/version consistency.
- **PASS:** all **nine** version-matched scripts linked below, re-run against the final compiled frontend/backend.
- Sleep/wake paths: suspend and wake sequencing, missed visibility events, Linux BOOTTIME fallback, startup delay, late audio events, cleanup and Plex audio-focus priority.
- Playback regressions: prebuffered eight-second crossfade, long playlists, audio handoffs, stale request blocking.
- Visualizer regressions: scene shuffle, live Plex focus, no-flash transitions, refresh-rate governor and audio-envelope interpolation.

Run in the repository root:

```bash
node --check dist/index.js
python3 -m py_compile main.py
for t in tests/*-412.cjs tests/GTM_4.1.2_*.cjs; do node "$t"; done
python3 tests/GTM_4.1.2_BACKEND_POWER_TESTS.py
```

Older tests in `tests/` may intentionally pin older version numbers; the **-412** copies are the regression targets for 4.1.2.

## Important boundaries
ResonaDeck has its own [Plex sleep/wake setting](https://github.com/ValentineBSAA/ResonaDeck). **GTM 4.1.2 restart playback was verified; ResonaDeck automatic playback on a full restart was not.** No claim of verified hardware performance for every scene, imported pack or SteamOS release.

[Release notes](docs/RELEASE_NOTES_4.1.2.md) · [Integrity](docs/RELEASE_MANIFEST_4.1.2.md)
