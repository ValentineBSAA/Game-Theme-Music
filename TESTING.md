# GTM 4.0.4 Public Beta testing

## 4.1.2 beta candidate: latest validation

- **Physical Steam Deck accepted:** delayed Ambient playback after sleep/wake and full restart; improved visualizer smoothness, ResonaDeck cooperation, and explicit visualizer OFF/ON.
- **Automated regressions:** GTM 4.1.2 power-controller/suspend tests, audio-focus ownership, visualizer frame pacing, crossfade, playlist and pack tests were passed during packaging. The separate regression files are in the maintained developer handoff and prepared installation ZIP; **the GitHub test tree is not yet an exact 4.1.2 mirror**.
- **Archive validation:** `python3 tests/verify-beta-4.1.2.py Game-Theme-Music-4.1.2.zip` (download the named beta asset after the maintainer uploads it). See [validation](docs/VALIDATION_4.1.2.md) and [checksum](docs/RELEASE_MANIFEST_4.1.2.md).
- **Do not overclaim:** ResonaDeck Plex's automatic resume after full reboot was not tested; only GTM Ambient's reboot delay was hardware-confirmed. No universal FPS benchmarks recorded.

The historical 4.0.4 test matrix follows.


[Current beta](https://github.com/ValentineBSAA/Game-Theme-Music/releases/tag/V4.0.4) · [Previous stable](https://github.com/ValentineBSAA/Game-Theme-Music/releases/tag/V3.7.0)

**Reported physical Steam Deck successes:** 8-second crossfade, Ambient playlists above 20 songs, pack import/removal, Pong stabilization, Sakura Tempest, Tidal Bloom, Disc Prism, Mechanical Iris, custom pack manager, Shuffle All and Pinball refinements. SteamOS/Decky exact versions and full hardware frame-rate measurements were not recorded.

## Regression checklist
1. Record Steam Deck OLED/LCD, SteamOS release/channel, Steam Client version, Decky Loader, GTM, CSS Loader theme and related plugins.
2. Upgrade in place, verify existing song downloads and playlists persist.
3. Test native Steam, non-Steam game, Ambient, and both Store surfaces. Stores now **share** their Store Music session.
4. Add 20+ Ambient songs and reload; check no truncation.
5. Let several songs crossfade, toggle crossfade OFF/ON, try Next/Previous, sleep/resume and ResonaDeck audio-focus transitions.
6. Test all four visualizer categories, color palettes, CSS footer blending, controller selection, and actual performance.
7. Turn on Shuffle All and verify changes only at song transitions; turn off and verify manual scene persists.
8. Install two custom packs, check category integration, confirm removal dialog and correct pack removal.
9. Check mini-player HUD toggle and unrelated music playback unaffected.
10. Do **not** claim ResonaDeck-to-GTM Plex visualization is verified until ResonaDeck receives and tests its corresponding update.

Report: **SteamOS/Decky version, GTM version, playlist owner, selected scene, imported packs, shuffle/crossfade status, steps, expected/observed behavior, sanitized logs.** Never post tokens or credentials.

[Bug form](https://github.com/ValentineBSAA/Game-Theme-Music/issues/new?template=bug_report.md) · [SteamOS matrix](docs/STEAMOS_COMPATIBILITY.md)
