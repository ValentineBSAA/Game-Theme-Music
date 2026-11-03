# Getting started with Game Theme Music 🎵

GTM is a **music-first Steam Deck Decky Loader plugin**. It provides music for games, Steam Home, and Steam/Decky Store pages alongside reactive visualizers. Its **4.4.1 Public Beta** also contains an optional, experimental Arcade.

## Install or update

1. Open [GitHub Releases](https://github.com/ValentineBSAA/Game-Theme-Music/releases) and download the actual maintainer-uploaded **Game Theme Music plugin ZIP** for the version you want.
2. **4.4.1 is awaiting maintainer upload.** Until then, [4.1.2](https://github.com/ValentineBSAA/Game-Theme-Music/releases/tag/V4.1.2) is the newest published release asset.
3. Install the plugin ZIP through Decky Loader's manual plugin install flow. Do **not** use GitHub's generated "Source code" ZIP.
4. Preserve your playlists/settings when updating. For 4.4.1, see the [candidate checksum](RELEASE_MANIFEST_4.4.1.md).

## Music and original visualizers

**Game music:** Per-game tracks for Steam and non-Steam titles. **Ambient:** Steam Home soundtracks and sleep/wake recovery. **Store:** shared Steam/Decky Store soundtrack controls. GTM supports long playlists and optional crossfade.

The original Visual Worlds collections cover **Retro Ambient, Classic Rhythm, GTM Signature, and Anime Worlds**, with packs, scene shuffle, palettes and Couch / TV display sizing. The 4.4.x visualizer selection UI replaces unreliable nested “More choices” pagination with directly selectable entries and visible page controls.

For Plex-reactive visualizers, pair GTM with a compatible [ResonaDeck](https://github.com/ValentineBSAA/ResonaDeck) release and enable the audio telemetry bridge. GTM manages Ambient audio focus separately from ResonaDeck's playback.

**Ambient Sleep Mode** (introduced in 4.1.2) is under **Full Manager → Ambient** with a configurable 5–60 second wake/restart delay, default 12 seconds.

## Optional 4.4.1 Arcade beta 🎮

The Arcade is an experiment in adding interactivity to music-reactive visualizers; it is not the main purpose of GTM. Open Arcade settings through GTM's Quick Menu, choose a game visualizer and its modes, then return to Steam Home to play or watch an AI demonstration.

- **Neon Paddle Championship:** AI, human multiplayer, morphs and Mindball.
- **Orbital Duel / Orbit Defenders:** Arcade action; local multiplayer reported working on Deck.
- **Neon Strike Gallery:** working in basic maintainer testing; multiplayer less certain.
- **Beat Catcher:** includes an experimental Piano Lanes mode.
- **Neon Chess Championship:** **VERY EARLY ALPHA**; the focused board layout is larger, but the game is not finished or polished.

For Couch / TV, Chess automatically uses a taller, non-fullscreen board layout. The standard game visualizer footer continues for the other games. **Known Pong issue:** brief controller-to-AI handoff stutter.

The Arcade may be substantially changed or removed based on user feedback. **[Tell us what should stay](https://github.com/ValentineBSAA/Game-Theme-Music/issues/4).**

[Game-by-game status](BETA_4.4.1_GAME_STATUS.md) · [4.4.1 notes](RELEASE_NOTES_4.4.1.md) · [Real historical screenshots](SCREENSHOTS.md) · [Testing](../TESTING.md)
