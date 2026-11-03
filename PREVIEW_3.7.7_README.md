# Game Theme Music 3.7.7 PREVIEW | Curated Visual Worlds

**Experimental Decky Loader preview for Steam Deck Gaming Mode.** This installer is not the public stable build. The latest stable GitHub release remains 3.7.0.

## Ten curated visualizers

### Featured Worlds (new/rebuilt)
- **Living Starfield**: three-dimensional layered stars with high-frequency shimmer and musical onset meteors.
- **Solar Orrery**: projected 3D planet orbits around a bass-reactive sun. Orbital movement is intentionally calm.
- **Living Particle Orb**: mathematical 3D sphere with 230 rotating particles, depth shading and separate orbiting satellites.
- **Sonic Nebula**: richly layered light volumes, filaments and star dust that breathe with loudness and frequency.
- **Liquid Light**: luminous refractive glass ribbons and brightened droplets, with distinct smooth shapes.

### Retained signature modes
- **Bass Floor**, **Pulse Engine**, **Prism City Skyline**, **Holographic Dragon**, **Arc Reactor**.

The previous large list of experimental designs has been replaced by a curated ten-style collection. Legacy saved style choices are migrated to a similar supported scene, rather than being reset to Off. Existing Off stays Off.

## Interaction and safety
- Home-screen footer only; no song metadata and no input capture.
- Footer masks remain below the game-card region; Steam dialogs and context menus take precedence.
- Animation uses GTM's existing passive Media Bridge telemetry; GTM's audio transport is unchanged.
- Controlled brightness, reactivity and bass impact; effects stop rendering when inactive/hidden.
- 3D objects use efficient mathematical camera projection on a Canvas fallback so dedicated WebGL 2 support is **not required**.
- No third-party visualizer libraries have been copied into this archive.

## Install and rollback
Install the 3.7.7 preview ZIP with Decky manual installation; never manually delete your music library or settings to upgrade. If you see problems, reinstall the last working preview or 3.7.0 stable. Do not publish this preview as stable before hardware validation.

## Testing checklist
1. Try each of the five Featured Worlds with Ambient Home music, then switch to each retained mode.
2. Verify Off stays Off through a full restart; confirm the Dragon selection saves too.
3. Verify selected style survives leave/return to Settings, Decky reload, and full Steam Deck restart.
4. Open/close a Steam context menu while Home music plays; effect should hide and return.
5. Test CSS Loader light/bright footer and ensure controller prompts and game cards remain usable.
6. Test silence, quiet acoustic, bass-heavy, and treble-heavy tracks; music playback must never be interrupted.
7. Observe performance, smoothness, sleep/wake and WebGL context loss with real SteamOS hardware.

**Desktop browser testing cannot certify frame rate or Steam Deck CSS integration.**
