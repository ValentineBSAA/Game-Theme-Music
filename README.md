<div align="center">

![Game Theme Music banner](assets/game-theme-music-banner.webp)

# 🎵 Game Theme Music
### Make your Steam Deck sound as good as it looks.

**4.6.7 · Stable · Active maintenance · Steam Deck / Decky Loader**  
**Developed by Valentine**

[**⬇ Download 4.6.7**](https://github.com/ValentineBSAA/Game-Theme-Music/releases/tag/V4.6.7) · [Release notes](docs/RELEASE_NOTES_4.6.7.md) · [Getting started](docs/GETTING_STARTED.md) · [Real screenshots](docs/SCREENSHOTS.md) · [Report an issue](https://github.com/ValentineBSAA/Game-Theme-Music/issues/new/choose)

**💬 [Tell me how you're using GTM](https://github.com/ValentineBSAA/Game-Theme-Music/issues/2)**

</div>

> **Current published release:** [Game Theme Music 4.6.7](https://github.com/ValentineBSAA/Game-Theme-Music/releases/tag/V4.6.7), November 6, 2026. Install the named **[Game-Theme-Music-4.6.7.zip](https://github.com/ValentineBSAA/Game-Theme-Music/releases/download/V4.6.7/Game-Theme-Music-4.6.7.zip)** from the release's Assets, **not** GitHub's automatically generated source-code ZIP.

**Game Theme Music (GTM)** adds customizable game soundtracks, Steam Home Ambient music, native Steam Store and Decky Plugin Store music, and music-reactive visual worlds to Steam Deck Gaming Mode. Its optional **Arcade Spectator** scenes are AI-versus-AI entertainment: **not human-playable multiplayer**.

## ✨ What's new in 4.6.7?

| Improvement | What changed |
| --- | --- |
| **Library context-menu switches (fixes [#10](https://github.com/ValentineBSAA/Game-Theme-Music/issues/10))** | Independently show or hide **Change Music**, **Change Ambient Playlist** and **Change Store Playlist**. Hide shortcuts without disabling music or deleting playlists. |
| **Quick Menu navigation** | **Browse all pages · A–Z** dropdown alongside LB/RB page switching; less competing auto-scroll and focus jumping. |
| **Native Steam Store** | Better Store entry/exit recognition, including when Steam's navigation information is stale; reduced lingering Store Music on returning Home/Library. |
| **Decky Plugin Store** | More reliable visibility detection and Store Music startup without rebooting Steam. |
| **Playback coordination** | GTM yields to ResonaDeck audio already playing. Store Music resumes when appropriate, without overriding a deliberate pause. |
| **Visualizer control** | Paired with **ResonaDeck 1.5.7**, saved startup preferences no longer force visuals ON. Enabled visuals can appear with eligible music, not on an idle Home screen. |
| **Lower background overhead** | Reduced redundant playlist state writes, narrowed theme monitoring and improved hook/listener cleanup. |
| **Downloader retained** | **YT-DLP and QuickJS remain bundled** in the installable ZIP; downloading was not removed. |

The maintainer tested the final **4.6.7** Store workflow on a physical Steam Deck **without restarting after installation**, including both Store surfaces, returning to Home and interaction with ResonaDeck. Earlier 4.6.x tests covered the individual context-menu switches, navigation and visualizer visibility. ResonaDeck frequency-reactive output was observed working after toggling its sharing control OFF/ON; universal automatic first-connect behavior is **not claimed**. Details: [release notes](docs/RELEASE_NOTES_4.6.7.md) and [hardware test record](TESTING.md).

## 📦 Install or update

1. Open the [4.6.7 release](https://github.com/ValentineBSAA/Game-Theme-Music/releases/tag/V4.6.7) and download **[Game-Theme-Music-4.6.7.zip](https://github.com/ValentineBSAA/Game-Theme-Music/releases/download/V4.6.7/Game-Theme-Music-4.6.7.zip)** under **Assets**.
2. In Decky Loader, use its manual **Install Plugin from ZIP** option. Keep your saved preferences when upgrading.
3. Open **Quick Access → GTM**. The per-version welcome may appear on Steam Home when Quick Access is closed; press **A / Cross** to continue.
4. No full Steam Deck reboot is normally necessary. If Steam keeps old menu hooks or interface state after a hot update, close/reopen Quick Access, then restart Steam if needed.

[Verify ZIP SHA-256](docs/RELEASE_ASSET_SHA256_4.6.7.txt) · [Full setup guide](docs/GETTING_STARTED.md) · [Release and rollback index](docs/RELEASE_INDEX.md)

## 🎮 Main features

| Feature | Experience |
| --- | --- |
| Game Music | Soundtracks for Steam and non-Steam games, playlists and crossfade options. |
| Ambient / Home | Background music while browsing Steam Home, with separate on/off and sleep/wake options. |
| Store Music | Music for **Steam Store and Decky Plugin Store**, with better surface detection and audio priority. |
| Visual Worlds | Retro, rhythm, signature, anime and AI spectator scenes, custom visualizer packs and CSS Loader-aware colors. |
| Arcade Spectator | **Watch-only** AI-vs-AI scenes including Pong. Not local multiplayer or player-controlled Arcade games. |
| Controller navigation | A–Z direct page picker, LB/RB paging and customizable music shortcuts. |
| ResonaDeck integration | Shared visualizer toggle and music-reactive telemetry when connected to compatible [ResonaDeck 1.5.7](https://github.com/ValentineBSAA/ResonaDeck/releases/tag/1.5.7). |

### 🎛️ Context-menu customization

In GTM's Settings, control the visibility of **Change Music**, **Change Ambient Playlist** and **Change Store Playlist** individually. Turning a menu entry OFF only hides that shortcut. It does **not** shut down the music feature, erase your playlist, or edit another plugin's context-menu options (including TitleDeck).

### 🌈 Visualizers are optional

Open **Quick Access → GTM → Visualizers → Enable Home visualizers**. **OFF** hides the visualizer without stopping audio; **ON** permits it during eligible playback, not while idle. **Shuffle All Visualizers on Track Change** is a separate setting.

If a ResonaDeck-powered scene appears but doesn't react to the beat, try the **GTM Visualizers** sharing switch OFF/ON in ResonaDeck to refresh audio capture. See [ResonaDeck support](https://github.com/ValentineBSAA/ResonaDeck/blob/main/SUPPORT.md).

## 📸 Historical real Steam Deck screenshots (4.4.9)

These are **15 genuine earlier-version captures**, not a claim that they show every 4.6.7 setting or effect.

| AI spectator | Traditional visualizer | Earlier visualizer controls |
| :---: | :---: | :---: |
| [![Pong Thunder Court](docs/screenshots/gtm-4.4.9/spectator/neon-paddle-thunder-court.jpeg)](docs/SCREENSHOTS.md) | [![Multicolor equalizer](docs/screenshots/gtm-4.4.9/music/colored-equalizer-bars.jpeg)](docs/SCREENSHOTS.md) | [![Controls](docs/screenshots/gtm-4.4.9/controls/visualizer-power-shuffle-couch-layout.jpeg)](docs/SCREENSHOTS.md) |

[Browse all 15 screenshots](docs/SCREENSHOTS.md)

## 🎧 Tell me how you're using GTM

**I'd love to hear what GTM is actually like on your Steam Deck.** ❤️

Downloads tell me GTM is reaching people, but they don't tell me which parts you enjoy, what you actually use, or what could be better. Whether you've been using GTM for months or just installed it, you're welcome here.

> **💬 [Join the GTM community conversation →](https://github.com/ValentineBSAA/Game-Theme-Music/issues/2)**  
> No bug report needed. Share your experience, a favorite feature, a screenshot, a small frustration, or simply say hello.

A few things I'm curious about:

- 🎵 Do you mostly use game soundtracks, Home/Ambient music, Store Music, visualizers, or ResonaDeck?
- ✨ What's working especially well for you?
- 🛠️ What's confusing, unreliable, or something you'd change?

**Honest feedback is welcome, including criticism.** A quick sentence is enough. I'm focusing on stability, everyday usability and music-first improvements, so I can't promise every suggestion will become a feature.

If you've found something broken and can reproduce it, please [open a bug report](https://github.com/ValentineBSAA/Game-Theme-Music/issues/new/choose) so I can track it separately.

*Thanks for listening and helping me make GTM better.*  
**Valentine** 🎵

---

## ❤️ Maintenance and community

GTM is **actively maintained**, not abandoned. Current priorities are reproducible bug fixes, SteamOS/Decky compatibility, audio reliability, controller usability and focused polish. There is no promised feature schedule. [Maintenance policy](docs/MAINTENANCE.md) · [Contributing](CONTRIBUTING.md).

- [Report a reproducible bug](https://github.com/ValentineBSAA/Game-Theme-Music/issues/new/choose). Include GTM version, SteamOS/Decky versions, affected Store surface and steps to reproduce.
- [Share your GTM experience](https://github.com/ValentineBSAA/Game-Theme-Music/issues/2), an open thread for everyday feedback and conversation.
- [Compatibility limitations](docs/STEAMOS_COMPATIBILITY.md), [testing record](TESTING.md), [changelog](CHANGELOG.md).
- [Development archive](docs/archive/README.md) contains historical experiments and earlier versions. Historical notes aren't current installation instructions.

## Source and packaging

**The published 4.6.7 installer ZIP is the canonical installable artifact.** The repository's checked-in frontend/backend source snapshot may lag behind that ZIP; do not treat the automatic GitHub source archive as a self-contained plugin or assume the checkout is byte-identical to the 4.6.7 runtime. See [SOURCE.md](SOURCE.md) for accurate provenance and [third-party notices](THIRD-PARTY-NOTICES.md).

**Maintainer:** Valentine ([ValentineBSAA](https://github.com/ValentineBSAA)) · **License:** GPL-3.0-only ([LICENSE](LICENSE))

Thanks for listening, testing and helping GTM improve. ❤️
