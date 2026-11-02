<p align="center"><img src="assets/game-theme-music-glyph.webp" width="130" alt="GTM logo"></p>
<p align="center"><img src="assets/game-theme-music-banner.webp" width="680" alt="GTM banner artwork"></p>

# 🎵 Game Theme Music

> **Upcoming beta candidate: Game Theme Music 4.1.2.** Steam Deck maintainer testing confirms delayed Ambient playback after both sleep/wake and restart, smoother visualizer performance, and working ResonaDeck audio cooperation. **The 4.1.2 release ZIP is not on GitHub yet**; the maintainer will upload and publish it separately. [4.1.2 release notes](docs/RELEASE_NOTES_4.1.2.md) · [Hardware/automated validation](docs/VALIDATION_4.1.2.md). The published [4.0.4 beta](https://github.com/ValentineBSAA/Game-Theme-Music/releases/tag/V4.0.4) and [3.7.0 stable](https://github.com/ValentineBSAA/Game-Theme-Music/releases/tag/V3.7.0) remain available until a new release is published.

## 🌈 Visual Worlds + Sleep/Wake | 4.1.2 Beta Candidate

A music and soundtrack companion for **Steam Deck Gaming Mode**: per-game soundtracks, Ambient Home music, unified Store Music, and colorful music-reactive footer visualizers.

**[⬇ Download GTM 4.0.4 Public Beta](https://github.com/ValentineBSAA/Game-Theme-Music/releases/download/V4.0.4/Game-Theme-Music-4.0.4-PUBLIC-BETA-RC4-PACK-SHUFFLE-PINBALL.zip)** · **[Release notes](https://github.com/ValentineBSAA/Game-Theme-Music/releases/tag/V4.0.4)** · **[Download screenshots](https://github.com/ValentineBSAA/Game-Theme-Music/releases/download/V4.0.4/GTM.Visualizers.Screenshots.zip)**

> **Release channels:** **4.0.4 is a prerelease/public beta**. [3.7.0 remains the previous stable version](https://github.com/ValentineBSAA/Game-Theme-Music/releases/tag/V3.7.0). Install the *named release asset ZIP*, **not** GitHub's automatically generated Source code ZIP.

### Previously published: What's new in 4.0.4
- 🎶 **Prebuffered 8-second automatic crossfade**, optional On/Off, improved cached playback and safer track handoffs.
- 🌈 **22 built-in music-reactive visualizers** spanning four categories, with smoother animation and a flexible Canvas 2D Home-footer renderer.
- 🎨 **Music Reactive • Dynamic Spectrum** by default on new installs, preserving existing custom palette settings. Adjustable brightness, bass impact, footer blending and height.
- 🔀 **Shuffle All Visualizers**, optionally switching to a different scene as songs change, including imported visualizers.
- 📦 **Visualizer Pack Manager** with validated ZIP imports, custom pack browsing, category integration, scene previews and safe removal confirmation.
- 🎼 **No more 15-track limit** for Ambient, Store, game soundtracks and compatible imports.
- 🛍️ **Unified Store music** for native Steam Store + Decky Plugin Store, independent of Ambient and per-game soundtracks.
- 🎮 Preserved mini-player HUD toggle, Steam Deck controls and cooperative ResonaDeck audio focus.
- 🔗 **ResonaDeck visualizer integration now supported in the 4.1.2 beta candidate**, paired with ResonaDeck 1.4.1; version 4.0.4 alone does not receive live Plex audio telemetry.

### Four Visual Worlds collections
**Retro Ambient • 2000s (10):** Ambient Light, Alchemy Rings, Silk Ribbons, Plasma Bloom, Neon Oscilloscope, Starlight Nucleus, Retro Kaleidoscope, CRT Pulse Field, Liquid Chrome, Disc Prism XL.

**Classic Rhythm (5):** Classic Spectrum, Prism Skyline, Beat Pinball, Neon Pong, Seismic Mountains.

**GTM Signature (5):** Pulse Engine, Arc Reactor, Resonance Crown, Mechanical Iris Array, Chromatic Event Horizon.

**Anime Worlds (2):** Sakura Tempest, Tidal Bloom.

**22 built-in scenes**. Imported packs can add more. The rejected experimental Sword Duel, Spirit Blade and Prism Forge were intentionally removed.

### 📸 Real Steam Deck screenshot showcase

These show real GTM footer animations captured during development. **Some captures have earlier preview/version labels**, so they are visual examples and not final 4.0.4 settings UI documentation.

| Colorful ribbon effect | Reactive color scene | Spectrum visualizer |
| :---: | :---: | :---: |
| ![GTM footer ribbons](docs/screenshots/visual-worlds/IMG_9285.JPG) | ![GTM glowing footer](docs/screenshots/visual-worlds/IMG_9279.JPG) | ![GTM reactive spectrum](docs/screenshots/visual-worlds/IMG_9281.JPG) |

[View the complete 11-screenshot gallery](docs/SCREENSHOTS.md) · [Download original ZIP](https://github.com/ValentineBSAA/Game-Theme-Music/releases/download/V4.0.4/GTM.Visualizers.Screenshots.zip)

### Installation / custom packs

Install `Game-Theme-Music-4.0.4-PUBLIC-BETA-RC4-PACK-SHUFFLE-PINBALL.zip` using Decky Loader's manual/developer plugin installation. Keep existing playlist and settings data.

Visualizer Packs → Import ZIP → Refresh. Imported scenes appear both in their parent visualizer category and in scrollable **Custom Packs**. To uninstall: **Manage custom packs → Choose pack → Review removal → Confirm**.

[Getting started](docs/GETTING_STARTED.md) · [Visualizer pack author guide](docs/VISUALIZER_PACKS_4.0.4.md) · [Testing](TESTING.md) · [SteamOS matrix](docs/STEAMOS_COMPATIBILITY.md)

### Community & development

[Request a feature](https://github.com/ValentineBSAA/Game-Theme-Music/issues/new?template=feature_request.yml) · [Support an idea](https://github.com/ValentineBSAA/Game-Theme-Music/issues/2) · [Vote on priorities](https://github.com/ValentineBSAA/Game-Theme-Music/issues/3) · [Report a bug](https://github.com/ValentineBSAA/Game-Theme-Music/issues/new?template=bug_report.md). Requests are reviewed for feasibility; **suggestions and votes are not promises of implementation**.

GTM contains editable Python and a **compiled** JavaScript frontend; the original TypeScript/React source project is not available as a reproducible build. [Source and integrity](SOURCE.md) · [Release manifest](docs/RELEASE_MANIFEST_4.0.4.md) · [License](LICENSE) · [Third-party notices](THIRD-PARTY-NOTICES.md).

Maintained by Valentine, continuing the GPL-licensed OMGDuke → MegalonVII → Valentine project lineage with AI-assisted, maintainer-directed development and real Steam Deck testing. Thanks to Dollet for the earlier mini-player HUD request.
