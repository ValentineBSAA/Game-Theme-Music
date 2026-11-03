# Game Theme Music 4.4.2: Music-First Preview

**Status:** Isolated, unmerged preview branch. Not a stable release and not yet verified on a physical Steam Deck.

## Why this change exists

GTM 4.4.1 Public Beta explored playable Arcade games in the Home visualizer. This preview removes that game subsystem and returns the Quick Menu to soundtracks, Ambient/Store music, playback, and Visual Worlds. The music/audio runtime is taken from the exact 4.4.1 release ZIP with SHA-256 `f287d2f85eb5e52ec64b38eb4e6702292139e6db128ea379899db88b956cb537`. The original ZIP and public release are unchanged.

## Removed

- The dedicated **Arcade** Quick Menu page, game selector, tournament options, scoreboards, and dedicated game configuration.
- Interactive Pong championship, physics, powers, matchmaking/AI difficulty, chess and other built-in game simulations.
- Universal Arcade-specific multiplayer/gamepad claiming, ready-up/pause/reconnect handling, and controller competition settings.
- Playable format-3 game scenes and bundled game-only pack demonstrations. New community packs with `interaction.kind: "game"` are explicitly rejected by the backend.

**Not removed:** Steam game themes and their controller-friendly management. “Game Music” refers to soundtracks, not the Arcade game subsystem.

## Kept

- Steam and non-Steam soundtrack assignment, music library, caching, imported and downloaded audio, crossfade, search, and Now Playing.
- Home Ambient, Store music, volume/shuffle and separate playlist owners.
- ResonaDeck shared audio telemetry and focus arbitration.
- Steam Deck menu navigation, theme adaptation, update continuity, and wake/sleep controls.
- Reactive Canvas2D engine, existing Visual Worlds effects, custom packs, multi-color palettes, overlays, animated backgrounds, scene shuffle, and 30fps caps/renderer safeguards for complex scenes.

## Visual Experiments

All **12 original Volume 1 scenes** remain, including classic, thunder and starlight neon courts as **passive, auto-animated visualizers** (not competitive Pong).

Five additional aesthetic scenes are derived from the 4.4.1 game art and preserved with the same underlying scene IDs for saved-configuration continuity. Their output is music-reactive, not an exact screenshot or rendering of the old games.

| Former Arcade scene | New passive music-reactive scene |
| --- | --- |
| Beat Catcher | Beat Trails: Rhythm Lights |
| Orbital Duel | Orbital Prism: Starfield |
| Orbit Defenders | Event Horizon: Defense Nebula |
| Neon Strike Gallery | Neon Target Grid: Pulse Field |
| Neon Chess | Neon Checkboard: Luminous Grid |

These five now belong to the **Visual Experiments** collection. Previous Arcade-specific preferences remain stored but are not used by the visualizer runtime. Downgrading remains possible without intentionally erasing user preferences. Visual worlds use the user-selected footer height again rather than forcing a giant chess/game stage.

## Validation

Automated checks cover the exact input ZIP hash, JavaScript parsing, Python compilation, all 17 built-in scene structures, prohibition of interactive scenes, audio-engine crossfade/focus tests, adaptive renderer quality, Steam UI transition safety, and suspend/resume behavior. A dedicated backend test validates both built-in scene packs and safe ZIP imports.

**Limitations:** Automated checks are not a substitute for installing the candidate on an actual Steam Deck and checking Home, Quick Menu, Steam Store, Ambient sleep/wake, ResonaDeck, and various visualizer selections. Nothing here is a 4.4.2 stable release. The repository does not currently include a fully reproducible React/TypeScript source project; the validated transformation targets the exact compiled release runtime.

## Branch and release process

The working branch is `refactor/gtm-441-music-first`. Work should be reviewed and tested before merging to `main` or publishing a new release. The original `V4.4.1` prerelease remains a rollback reference.
