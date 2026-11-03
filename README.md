<p align="center"><img src="assets/game-theme-music-glyph.webp" width="120" alt="GTM logo"></p>
<p align="center"><img src="assets/game-theme-music-banner.webp" width="680" alt="Game Theme Music"></p>

# 🎵 Game Theme Music
### 4.4.2 Music-First Preview (development branch only)

**Soundtracks for your Steam Deck. Music-reactive visual worlds. No built-in Arcade games.**

This isolated preview begins from the **exact published 4.4.1 Public Beta runtime**, removes the playable Arcade subsystem, and keeps the useful visuals and audio features. It has **not** been merged into `main`, published as stable, or verified on physical hardware. The original [4.4.1 prerelease](https://github.com/ValentineBSAA/Game-Theme-Music/releases/tag/V4.4.1) remains available.

**[4.4.2 music-first migration and checks](docs/MUSIC_FIRST_4.4.2_PREVIEW.md)** · [4.4.1 historical beta notes](docs/RELEASE_NOTES_4.4.1.md) · [Source integrity](SOURCE.md) · [Install instructions](docs/GETTING_STARTED.md)

> **Download safely:** Use only a properly packaged GTM plugin ZIP, not GitHub's automatically generated “Source code” ZIP. This feature branch has not been declared a stable release. The `main` runtime still tracks an older snapshot pending controlled integration.

## 🎶 Music first, always

- **Game theme music:** Steam and non-Steam soundtracks, assignments, playlists, volume, shuffling, and optional crossfade.
- **Home / Ambient:** Background audio and sleep/wake choices with playback focus handling.
- **Steam and Decky Store music:** Dedicated playlist, volume, and transport settings.
- **Music Library:** Imported and downloaded music, organization and caching.
- **Now Playing and mini-player:** Existing UI and non-intrusive controls.
- **ResonaDeck compatibility:** Optional shared telemetry and cooperative music playback ownership.
- **Visual Worlds:** Preserved animated Canvas2D effects, custom packs, music-reactive colors, overlays, and visualizer shuffle.
- **Steam Deck navigation:** Controller-friendly tabs and familiar visual styles.

[Music setup](docs/GETTING_STARTED.md) · [Visualizer pack guide](docs/VISUALIZER_PACKS_4.0.4.md) · [Screenshots](docs/SCREENSHOTS.md)

## ✨ What happened to the Arcade visuals?

The playable games, controller combat/competition, AI, chess logic, game settings and Arcade tab have been removed in this preview.

The art is still useful. The music-first edition preserves **12 core Visual Worlds**, including passive neon court scenes, and adds **five non-interactive experiments** inspired by Arcade: Beat Trails, Orbital Prism, Event Horizon, Neon Target Grid and Neon Checkboard. The scenes react to audio without running games, claiming gamepads, or showing scores. Saved scene IDs remain compatible.

[See the exact migration map and validation results](docs/MUSIC_FIRST_4.4.2_PREVIEW.md).

## 🧪 Testing and history

Crossfade, Ambient/Store focus, ResonaDeck handoff, sleep/wake, adaptive rendering, and scene pack checks run in GitHub Actions. **Hardware verification is still required.** The 4.4.1 Arcade experience and reports remain documented in [historical release notes](docs/RELEASE_NOTES_4.4.1.md), but those game features are not present in 4.4.2.

To compare the published legacy releases, see [GitHub Releases](https://github.com/ValentineBSAA/Game-Theme-Music/releases). The `main` branch is not automatically the same runtime as the latest release; see [SOURCE.md](SOURCE.md).
