# GTM 4.0.4 RC4 — Custom Packs, Shuffle All, Pinball Polish

This is a private release candidate for user testing; it is NOT a published release.
The plugin version is kept at 4.0.4. No major-version increment.

## What the Steam Deck tester confirmed in RC3
- Importer works.
- Pong and imported Pong scene work smoothly.
- Sakura Tempest, Tidal Bloom, Disc Prism XL, Mechanical Iris Array, and other established visualizers look good.
- Beat Pinball has potential, but delayed target disappearance and similar-colored balls required correction.

## Changes
- New **Custom Packs** management area with a capped, scrollable list of imported packs. Each row can preview the pack's first scene.
- Imported scenes also automatically appear inside their assigned category (Retro Ambient, Classic Rhythm, GTM Signature, or Anime Worlds).
- Uninstall is now **Manage custom packs** > **Choose pack to remove** > dropdown > **Review removal** > explicit confirmation. Built-in pack cannot be removed.
- Added opt-in **Shuffle all visualizers on track change**. Draws without replacement from all installed scenes and categories, avoids repeating the currently selected scene, and changes only on real playing-track changes from Ambient, Store, and Game Themes.
- Installed packs are included in Shuffle All after refresh; removed packs are excluded.
- Beat Pinball now detects collisions every animation frame using a swept path segment, hides impacted targets immediately, respawns in new positions, and uses separate vivid hues for balls with Music Reactive/multicolor palettes.

## Architectural safety
- 4.0.3 automatic crossfade audio engine and 4.0.4 ResonaDeck bridge are unchanged.
- Unlimited playlists and Store Music routing are unchanged.
- `homeReactiveVisualizerShuffleAll` defaults to false for existing installations and persists through GTM settings.
- A fresh installation of this release candidate will not unexpectedly shuffle the scene of an already-playing song; the next actual track change initiates Shuffle All.
- No new dependencies, audio streams, network requests, WebGL, or executable visualizer packs.

## Real device testing checklist
1. Install RC4 over RC3, confirm existing music, visualizer settings, and 8-second crossfade.
2. Re-import the RC3 Visual Worlds Remix Demo pack if you removed it.
3. Verify imported scenes appear under their parent category and in the scrollable **Custom Packs** list.
4. Test two or more imported packs; choose which one to remove, cancel at the confirmation dialog, then actually remove only the chosen pack.
5. Turn on **Shuffle all visualizers on track change**. Allow several Ambient song transitions; switch to Store music and then a game theme, confirming changes only on actual track changes.
6. Turn Shuffle All off and confirm your current visualizer stays selected across songs.
7. Watch Beat Pinball for 3+ minutes: bumpers should disappear immediately on hit, then respawn in a new location. Check differently colored balls with **Music Reactive • Dynamic Spectrum**.
8. Verify Pong, Sakura Tempest, and the ResonaDeck audio-focus behavior remain intact.

## Test coverage
- `GTM_4.0.4_RC4_SHUFFLE_PACK_PINBALL_TESTS.cjs`: simulated scene registration, shuffle behavior, pack management structure, ball/bumper collision and colors.
- `GTM_4.0.4_RC3_MOTION_AND_IMPORT_TESTS.cjs`: 420-frame Pong simulation and importer functionality.
- `GTM_4.0.4_CROSSFADE_REGRESSION_TESTS.cjs`: prebuffer and audio focus.
- `GTM_4.0.4_PLAYLIST_REGRESSION_TESTS.cjs`: unlimited playlists, routing and stale-request safety.
- `GTM_4.0.4_VISUAL_WORLDS_TESTS.cjs`: 22 built-in scenes and passive telemetry bridge.
- `GTM_4.0.4_PACK_BACKEND_TESTS.py` and `GTM_4.0.4_PACK_VALIDATION_TESTS.py`: import/uninstall safety.

Older `GTM_4.0.1_*` / `GTM_4.0.2_*` historical test scripts check exact old version strings and are archived, not intended to run directly against 4.0.4.

### Limitations
Desktop simulations do not prove controller scrolling performance or full 60 FPS on the physical Steam Deck. Those remain part of the beta approval test.

### Deferred
A detailed racing/city visualizer pack remains a future importer test, not part of RC4.
