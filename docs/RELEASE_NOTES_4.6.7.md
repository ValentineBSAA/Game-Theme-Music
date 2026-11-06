# 🎵 Game Theme Music 4.6.7 | Stability, Performance & Customization

**Stable public release · November 6, 2026 · Developer: Valentine**

[⬇ Download the named installable ZIP](https://github.com/ValentineBSAA/Game-Theme-Music/releases/download/V4.6.7/Game-Theme-Music-4.6.7.zip) · [Checksum](RELEASE_ASSET_SHA256_4.6.7.txt)

Hey everyone, Valentine here! This release focuses on getting the music-first experience dependable again: smoother Quick Menu navigation, more customizable Library shortcuts, reliable playback in both Stores, and better coordination with ResonaDeck.

## Fixes and improvements

### Library context-menu visibility (fixes [Issue #10](https://github.com/ValentineBSAA/Game-Theme-Music/issues/10))
Independently show or hide **Change Music**, **Change Ambient Playlist** and **Change Store Playlist** in the Steam Library context menu. Mixed combinations are supported. Hiding one doesn't disable the underlying playlist or affect TitleDeck's own entries. This was tested on the maintainer's Steam Deck.

### Quick Menu controls
**Browse all pages · A–Z** lets you jump to a section without paging. LB/RB remains supported, with fewer competing focus and scroll operations. GTM reduces unnecessary CSS Loader theme observations and redundant background storage writes.

### Native Steam Store and Decky Plugin Store reliability
Store Music now starts in both the native Steam Store and the **Decky Plugin Store**, including the latter appearing over stale Steam Home navigation. The native Store exit logic was tightened so leaving for Home/Library no longer keeps old Store music running unnecessarily. The Store player can also recover a READY-but-silent state after an update while respecting manual pause.

GTM yields to **ResonaDeck audio already playing** rather than playing Store music over it.

### GTM ↔ ResonaDeck 1.5.7
A saved ResonaDeck visualizer ON preference is no longer treated as an explicit startup toggle. Visualizers stay hidden without eligible playback, even when permitted in Settings, then may show when music begins. A deliberate OFF selection hides visuals without pausing audio.

**Audio-reactive caveat:** actual frequency-driven response was restored during physical testing by switching ResonaDeck's GTM sharing control OFF and ON. A completely automatic first-time audio-capture handshake has **not been proven reliable in all cases**. If the animation appears but isn't following music, refresh the switch in ResonaDeck and see [its support guide](https://github.com/ValentineBSAA/ResonaDeck/blob/main/SUPPORT.md).

### Everything preserved
Game soundtracks, Ambient/Home Music, both Store music modes, playlists, crossfades, visualizer libraries and packs, CSS Loader support, AI-only Arcade Spectator and **the bundled YT-DLP/QuickJS downloader** remain available. No human-playable multiplayer is advertised.

## Maintainer test record

| Check | Result |
| --- | --- |
| Individual GTM Library context-menu visibility | **PASS**, physical Steam Deck |
| A–Z dropdown and LB/RB navigation | **PASS**, maintainer observations |
| Decky Plugin Store Music starts/stops | **PASS**, physical Steam Deck |
| Native Steam Store Music starts and stops on exit | **PASS**, physical Steam Deck, final 4.6.7 |
| Install/update test without restarting Deck | **PASS**, final Store checks |
| GTM respects ongoing ResonaDeck playback | **PASS**, physical Steam Deck |
| Home visualizer idle/playback visibility | **PASS**, physical Steam Deck |
| ResonaDeck-driven frequency response | **PASS after manually refreshing its share toggle**; automatic initial handshake not universally verified |
| Syntax, focused navigation regressions, ZIP integrity, YT-DLP/QuickJS preservation | **PASS**, targeted offline checks |
| Every SteamOS/Decky release, theme, media format and extended session | **Not universally tested** |

## Install / update

Under the [4.6.7 GitHub Release](https://github.com/ValentineBSAA/Game-Theme-Music/releases/tag/V4.6.7) select **Game-Theme-Music-4.6.7.zip** under **Assets**. Do not install the auto-generated source ZIP. Existing settings should persist during a normal update. A full Steam Deck restart is **not normally required**; if stale UI hooks remain after a hot update, close/reopen Quick Access and restart Steam only if necessary.

[Getting started](GETTING_STARTED.md) · [Testing](../TESTING.md) · [Compatibility](STEAMOS_COMPATIBILITY.md) · [Changelog](../CHANGELOG.md)

Thanks for all your testing and feedback! ❤️  
**Valentine**
