# Getting started with Game Theme Music 4.4.9 🎵

**Developer: Valentine.** GTM is a music-first Decky Loader plugin for Steam Deck, with custom soundtracks, Ambient/Store music, reactive visualizers and **watch-only** AI spectator scenes. There are **no playable Arcade modes or local multiplayer controls** in 4.4.9.

## Install or update

1. Download the **`Game-Theme-Music-4.4.9.zip`** asset from the [official 4.4.9 release](https://github.com/ValentineBSAA/Game-Theme-Music/releases/tag/V4.4.9).
2. Use Decky Loader's manual ZIP installation option. **Do not select the auto-generated GitHub source ZIP**; it is not a complete installer.
3. Leave Decky's persistent settings in place when upgrading to keep your playlists, palettes, shuffle preference and AI learning.
4. Return to **Steam Home** and close Quick Access. GTM's full-screen thank-you from Valentine appears once per version on Home. Press **A / Cross** to continue; it is not a page inside Quick Access.

The public ZIP is self-contained and **does not require a previous GTM version**. The attached `SHA256SUMS.txt` file can be used to verify the download. [Release index and rollback](RELEASE_INDEX.md).

## Music

- **Game Music:** Configure soundtracks for Steam and non-Steam titles.
- **Ambient:** Steam Home music. Sleep/wake delay and related controls live under **Full Manager → Ambient**. A prior 4.1.2 release introduced a configurable 5–60-second delay (12 seconds by default).
- **Store:** Music for Steam and Decky Store browsing.
- **Playlists / crossfade:** Playlist management and optional prebuffered crossfade.
- **ResonaDeck:** GTM can visualize supported Plex telemetry from the separately installed [ResonaDeck](https://github.com/ValentineBSAA/ResonaDeck). Each plugin handles its own playback and audio focus.

## Visualizers are optional: music works without visuals

To **hide the visualizer footer without stopping the music**, use **Quick Access → GTM → Visualizers → Enable Home visualizers → OFF**. Switch it **ON** to display visualizers again. Music playback, Ambient/Store soundtracks and playlists are independent of this display switch. **Shuffle All on Track Change** is a different control: OFF prevents automatic scene switching, but leaves visualizers themselves available.

See the [real 4.4.9 screenshot gallery](SCREENSHOTS.md) for the controls and 15 selected visuals. These screenshots **do not show every visualizer**.

## Visualizers Quick Menu

Open **Quick Access → GTM → Visualizers**. Browse **Retro Ambient**, **Classic Rhythm**, **GTM Signature**, **Anime Worlds** and other available collections. Opening a collection browses the entries; activate an individual scene to switch the footer. GTM shows a distinction between **ACTIVE** (currently used) and **SAVED** (remembered choice).

- **Visualizer ON/OFF:** Controls whether the footer visualizer is displayed.
- **Shuffle All on Track Change:** Optional. **Off** is a valid saved preference and must not be silently changed by an update.
- **Colors and effects:** Use palette, multi-color/custom-gradient, intensity and music reactivity controls; actual appearance varies by visualizer.
- **Layout:** Choose **Default** for a smaller footer or **Couch/TV** for a larger, more readable presentation. The choice is persistent.
- **Packs:** The Visualizer Pack Manager imports supported custom scene packs; historical playable game packages are not a supported 4.4.9 feature.

## Arcade Spectator (watch-only)

The **Arcade Spectator** Quick Menu page controls optional automatic exhibitions. Neon Paddle has Classic, Thunder and Starlight versions. AI 1 and AI 2 play without human input; paddle colors, arena backgrounds, ball appearances and effects can change automatically. The system includes **32 ball powers** and adaptive AI.

There are **no player-versus-AI, player-versus-player, controller claiming or matchmaking controls** in the current 4.4.9 edition. "Arcade" refers to visualizers, not playable games.

## Need help?

Check [hardware compatibility and limitations](STEAMOS_COMPATIBILITY.md), [testing scope](../TESTING.md), or [report a bug](https://github.com/ValentineBSAA/Game-Theme-Music/issues/new?template=bug_report.md). Include what you expected, what happened and the GTM version, plus Deck/SteamOS details when available. Screenshots are optional; remove private data.

[Back to GTM homepage](../README.md) · [Release notes](RELEASE_NOTES_4.4.9.md)
