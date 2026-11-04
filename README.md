<div align="center">

![Game Theme Music banner](assets/game-theme-music-banner.webp)

# 🎵 Game Theme Music
### Make your Steam Deck sound as good as it looks.

**Developed by Valentine · Current release: 4.4.9 · Active maintenance · Steam Deck / Decky Loader**

[**Download 4.4.9**](https://github.com/ValentineBSAA/Game-Theme-Music/releases/tag/V4.4.9) · [View 15 real screenshots](docs/SCREENSHOTS.md) · [Getting started](docs/GETTING_STARTED.md) · [Current release notes](docs/RELEASE_NOTES_4.4.9.md) · [Get help](https://github.com/ValentineBSAA/Game-Theme-Music/issues/new/choose)

</div>

**Game Theme Music (GTM)** is a music-first Decky Loader plugin for Steam Deck. Play soundtracks for Steam and non-Steam games, add music to Home and Store browsing, and customize music-reactive visual worlds. GTM also offers optional **AI-versus-AI spectator visualizers** that animate automatically alongside music. **There are no human-playable or multiplayer Arcade games in 4.4.9.**

> **Current direction:** GTM 4.4.9 is **feature-complete for now and actively maintained**. I'm focusing on reliability, bug fixes, SteamOS/Decky compatibility, playback, settings and polish rather than adding more major features. **GTM is not abandoned or end-of-life.** [Read the maintenance policy](docs/MAINTENANCE.md).
>
> **Version 4.4.9** is a regular public release, without a Beta suffix. Valentine verified the one-time Steam Home welcome and a genuine Pong AI spectator goal on physical hardware. Comprehensive compatibility testing across all SteamOS builds, themes, and visualizer configurations is ongoing.

## Get GTM

1. Open the [**4.4.9 release page**](https://github.com/ValentineBSAA/Game-Theme-Music/releases/tag/V4.4.9).
2. Under **Assets**, download **`Game-Theme-Music-4.4.9.zip`**. Use the **attached plugin ZIP**, **not** GitHub's auto-generated `Source code` archive.
3. Install the plugin ZIP through Decky Loader's manual installation option on Steam Deck. Keep a backup before changing versions. Existing preferences are intended to remain intact during normal updates.
4. Open GTM in Quick Access. The one-time welcome displays on **Steam Home** when Quick Access is closed; press **A / Cross** to continue.

The release also supplies `SHA256SUMS.txt` for verifying the download. Full instructions: **[Getting started](docs/GETTING_STARTED.md)**.

## 🎛️ Visualizers are optional

**Want music without animated visualizers? You can turn visualizers OFF.** Open **Quick Access → GTM → Visualizers → Enable Home visualizers** and switch it **OFF**. Game soundtracks, Home Ambient music and Store music continue working; the visualizer footer is simply hidden. Switch **ON** whenever you want the visuals back. **Shuffle All** is a separate setting for automatic scene changes, not the visualizer ON/OFF control.

## What GTM offers

| Feature | Experience |
| --- | --- |
| 🎮 **Game Music** | Soundtracks for Steam and non-Steam titles, playlist management and optional crossfade. |
| 🌙 **Ambient / Home** | Background music while browsing Steam Home, with configurable sleep/wake behavior. |
| 🛍️ **Store Music** | Configure music for Steam and Decky Store browsing. |
| 🌈 **Visual Worlds** | **17 built-in visual worlds**, including original retro, rhythm, signature, anime and spectator-style scenes; optional custom packs. |
| 🏓 **Arcade Spectator** | **Watch-only AI-versus-AI scenes**, adaptive Pong opponents, auto-changing paddles, arenas, ball physics and **32 powers/effects**. No gameplay controls or multiplayer matchmaking. |
| 🎨 **Customize** | Controller-friendly Visualizers and Arcade Spectator tabs, nested scene categories, palette and color settings, music reactivity and Default / Couch-TV footer layout. |
| 🎧 **ResonaDeck** | Compatible audio-focus and music-reactive visualizer integration with the separate Plex player. |

## 📸 Real Steam Deck screenshots from 4.4.9

**A selection of 15 screenshots, not every visualizer.** The gallery shows AI spectator scenes, traditional music visualizers and the Quick Menu, including the ON/OFF switches. Different visualizer packs, colors and effects are not all pictured.

| Autonomous AI spectator | Traditional music visualizer | Visualizer ON/OFF controls |
| :---: | :---: | :---: |
| [![Neon Paddle Thunder Court AI spectator](docs/screenshots/gtm-4.4.9/spectator/neon-paddle-thunder-court.jpeg)](docs/SCREENSHOTS.md) | [![Multicolored visualizer equalizer bars](docs/screenshots/gtm-4.4.9/music/colored-equalizer-bars.jpeg)](docs/SCREENSHOTS.md) | [![Enable visualizers, Shuffle All and Couch/TV switches](docs/screenshots/gtm-4.4.9/controls/visualizer-power-shuffle-couch-layout.jpeg)](docs/SCREENSHOTS.md) |

**[Browse all 15 screenshots by category →](docs/SCREENSHOTS.md)** · [Download the original screenshot ZIP from the release](https://github.com/ValentineBSAA/Game-Theme-Music/releases/download/V4.4.9/GTM.4.4.9.screenshots.zip)

### Find the visualizer controls

Open **Decky Quick Access → GTM → Visualizers** to choose a collection and then a scene. Opening a collection only browses it; select a scene to activate it. The **Arcade Spectator** page controls the autonomous spectator visuals. Both areas expose relevant color, reaction and layout controls. **Shuffle All Visualizers on Track Change** is optional and its explicitly saved Off state is designed to survive updates.

For Couch/TV viewing, choose the larger footer layout; choose Default for a compact Home layout. [Step-by-step controls](docs/GETTING_STARTED.md).

### What's new in 4.4.9?

Earlier learned-max Pong AI opponents could complete five minutes without scoring. The new spectator rally director increases pressure during long rallies, encouraging **real goals** while retaining skill learning and physical ball/paddle collisions. No points are awarded by timer. The 4.4.8 welcome, Quick Menu improvements, visualizer packs, color controls, effects and playback systems remain.

[Full 4.4.9 release notes](docs/RELEASE_NOTES_4.4.9.md) · [Testing and verified hardware observations](TESTING.md) · [Compatibility notes](docs/STEAMOS_COMPATIBILITY.md)

## Active maintenance and community feedback

I'm keeping GTM music-first and maintaining the features already here. Fixes, compatibility work, documentation and meaningful quality-of-life repairs remain welcome; new games and major feature expansions aren't currently planned. **There's no fixed update schedule or promise that every suggestion will be implemented.** For what is in scope, see the [maintenance policy](docs/MAINTENANCE.md) and [contributing guide](CONTRIBUTING.md). The current version stays **4.4.9** until a real software update is needed.

## Need help or have an idea?

- **[Report a bug](https://github.com/ValentineBSAA/Game-Theme-Music/issues/new?template=bug_report.md)**. GTM version, Deck/SteamOS details and reproduction steps are helpful; screenshots and logs are optional.
- **[Request a feature](https://github.com/ValentineBSAA/Game-Theme-Music/issues/new?template=feature_request.yml)** or visit the **[Community Ideas Hub](https://github.com/ValentineBSAA/Game-Theme-Music/issues/2)**.
- **[Read maintenance priorities](docs/MAINTENANCE.md)**. The earlier feature-expansion poll is archived; future fixes are guided by reproducible bugs and compatibility needs rather than a promised feature roadmap.
- **[Browse the visualizer gallery](docs/SCREENSHOTS.md)**. Historical screenshots are labeled; don't mistake concept art for current hardware screenshots.

## Project notes

**Maintainer:** Valentine ([ValentineBSAA](https://github.com/ValentineBSAA)). **License:** GPL-3.0-only (see LICENSE). The repository tracks the 4.4.9 runtime and release tests. Large bundled dependencies are included in the *release installer*, not GitHub's source ZIP. The public **4.4.9 installer is self-contained**; you do not need any earlier GTM release to install it.

[Maintenance policy](docs/MAINTENANCE.md) · [Contributing](CONTRIBUTING.md) · [Source and release integrity](SOURCE.md) · [Version history](CHANGELOG.md) · [Archived development README](docs/DEVELOPMENT_HISTORY.md) · [Release index](docs/RELEASE_INDEX.md)

Thank you for installing, testing, and helping improve GTM. ❤️

**Valentine**
