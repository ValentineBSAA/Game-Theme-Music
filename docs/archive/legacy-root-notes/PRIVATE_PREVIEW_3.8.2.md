# Game Theme Music 3.8.2 PRIVATE PREVIEW — Track-transition and visual distinctness correction

This build is **not public** and does not modify the GitHub stable release.

## Targeted changes
- Prism Skyline is no longer a variant of Classic Spectrum. It draws a layered neon city with silhouettes, lit windows, rooftops, antennas and a music-responsive transport line.
- Ambient natural end-of-track transitions skip synchronous whole-file Blob mirroring when a local audio URL is available but a pre-existing mirrored Blob is not. Already prepared Blobs remain reusable. Normal initial loads keep the existing continuity path.
- If an Ambient transition takes more than 1.5 seconds to resolve and start, a timing warning is logged (without personal file paths or music URLs).
- The Home footer renders at only ~8 FPS while its captured audio is inactive, reducing UI-thread work during playback transitions. When audio resumes, the prior 45/30 FPS target returns.
- Preserves standalone visualizer On/Off switch, dynamic music colors, Blend Ambient stage, theme controls and existing music engine.

## Known tradeoff
When the direct local URL fast path is needed on an automatic track advance, that particular new track may not yet have a browser-owned Blob copy for the rare Decky-update handoff case. Cached copies are still preferred, and ordinary initial loads retain persistent-copy behavior. No other audio owners were modified.

## Hardware test
1. Confirm auto-advance timing with visualizer **Off** and **On**, same two local tracks and same repeat/shuffle settings. A wait over 1.5 seconds should log a timing warning.
2. Test manual Next and automatic end for both downloaded/local tracks and online-only tracks. If online-only content is slow, this patch cannot speed up the remote provider.
3. Test a game-specific playlist, Store playlist, ordinary Ambient playback, and ResonaDeck focus. These paths have not been changed beyond the Ambient fast-path.
4. Compare Classic Spectrum vs Prism Skyline, and check no game card interference.
5. Test a full Decky reload and Steam Deck sleep/wake.

**This build has passed code/package and simulated rendering tests, not physical Deck hardware verification.**
