# Game Theme Music 4.0.4 • Public Beta Candidate (PRIVATE TEST)

This is a **release candidate**, not a GitHub public release. Publish only after physical Steam Deck verification.

## Features
- Inherits 4.0.3's verified prebuffered automatic track crossfade (up to 8 seconds).
- Adds user switch to disable automatic crossfade, while preserving existing ownership/audio focus.
- Keeps unlimited Ambient, Store and game playlists; Plugin Store and Steam Store remain unified.
- Adds 10 distinctly rendered Canvas2D Visual Worlds effects, grouped with the 12 existing scenes into 4 categories.
- Adds safe Visualizer Pack ZIP import, Refresh and Remove Selected Imported Pack actions. Built-in Volume 1 cannot be removed.
- Uses Music Reactive • Dynamic Spectrum for **new installs**. Existing color choices are not overwritten.
- Introduces a passive ResonaDeck telemetry protocol v1, without Plex audio, file access or playback control.

## Important limitations
- ResonaDeck itself needs a later change to publish telemetry; 4.0.4 is consumer-ready, not full Plex end-to-end verified.
- Visual World scenes require supported engine effect IDs; adding a totally new drawing algorithm still needs a GTM update.
- Pack ZIPs hold only a root manifest.json, no images, plugins, scripts or arbitrary JavaScript.
- Imported pack manifests persist in Decky runtime directory, not the install folder.
- Effects are Home-footer only. They do not cover library/game cards and they do not start audio.
- The physical Steam Deck FPS, memory, controller focus and long-running crossfades are **not yet verified**.

## Beta tester sequence
1. Upgrade over 4.0.3. Confirm saved playlists (including more than 20 Ambient tracks), playback, original favorite visualizers and CSS footer colors.
2. Open both GTM settings views; select each of the four categories and each new scene (10 distinct visuals).
3. Set colors to Music Reactive; ensure bass, highs, impact flashes change with real music; check silence and pause fade out.
4. Let Ambient finish 5+ tracks naturally and Store finish 5+; verify no repeated/skipped queue advancement, crackle or two permanently playing streams.
5. Disable then enable crossfade; confirm off results in sequential transitions and on restores the 8-second prepared overlap.
6. Test moving Steam Store <-> Plugin Store and Home and returning, no spontaneous track changes or cross-playlist bleed.
7. Import the sample custom pack from Downloads using pack manager; Refresh, choose the new scene, then remove the selected imported pack. Do not overwrite built-in Volume 1.
8. Leave plugin running 30+ minutes, inspect CPU responsiveness, frame pacing, Deck controller behavior, QAM menus and animation footer fit.
9. Open ResonaDeck and verify GTM music pauses correctly; live ResonaDeck-reactive visuals remain UNVERIFIED until a ResonaDeck publisher update is installed.
10. If all tests pass, promote this same 4.0.4 ZIP to Public Beta with appropriate release notes.

## Rollback
Reinstall the known-working 4.0.3 ZIP for playback regressions; imported packs and saved settings are kept in runtime rather than plugin folder.
