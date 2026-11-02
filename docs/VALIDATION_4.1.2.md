# GTM 4.1.2 | Validation snapshot

**Date:** 2026-11-02. **Type:** maintainer-reported Steam Deck hardware checks and offline regression checks; not an external certification.

| Case | Evidence |
| --- | --- |
| Ambient resumes after real Deck sleep/wake | **Hardware pass**, maintainer confirmation |
| Ambient delayed start after real Steam Deck restart | **Hardware pass**, maintainer confirmation |
| GTM 4.0.9+ smoother footer rendering | **Hardware pass**, maintainer reported visibly smoother operation |
| GTM + ResonaDeck play cooperatively | **Hardware pass**, maintainer confirmed both plugins functioning together |
| ResonaDeck visualizer toggle OFF/ON | **Hardware pass**, maintainer confirmed combined fixes |
| Automatic crossfade, playlists and packs | **Automated regression pass** from build handoff; earlier crossfade/pack behavior was hardware accepted |
| Exact FPS sustained on every scene | **Not measured**; adaptive governor aims for stable display-paced rendering |
| Every SteamOS channel / LCD device | **Not tested** |

**Configuration caveat:** Exact SteamOS/Decky versions and quantitative frame-time captures weren't recorded. Results describe the tested setup only.

**Important product distinction:** GTM's successful restart playback test does **not** verify ResonaDeck automatically resumes Plex after a full reboot. ResonaDeck's tested behavior is sleep/wake recovery.

**Release status:** [Published GTM 4.1.2 beta](https://github.com/ValentineBSAA/Game-Theme-Music/releases/tag/V4.1.2); asset checksum verified against local tested ZIP.
