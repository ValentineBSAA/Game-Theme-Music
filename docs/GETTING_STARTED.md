# Getting started with Game Theme Music 3.7.0

**A friendly, controller-first guide for Steam Deck owners.**  
**Current stable release:** [3.7.0](https://github.com/ValentineBSAA/Game-Theme-Music/releases/tag/V3.7.0) · [Main README](../README.md) · [Report an issue](https://github.com/ValentineBSAA/Game-Theme-Music/issues)

Game Theme Music (GTM) gives Steam and non-Steam game entries their own soundtracks. You can also use separate music for **Ambient/Home** and **Steam Store** browsing. GTM runs as a Decky Loader plugin in Steam Deck Gaming Mode.

## Current SteamOS status

Valve released **SteamOS 3.9.5 Stable** on October 23, 2026. GTM 3.7.0 has not yet been documented as tested on that exact version. Check the [SteamOS compatibility tracker](STEAMOS_COMPATIBILITY.md) and [open issue #1](https://github.com/ValentineBSAA/Game-Theme-Music/issues/1) before interpreting a SteamOS update as GTM-certified. SteamOS, Steam Client, Decky Loader and GTM have independent versions.

## Before you install

- You need a Steam Deck with **Decky Loader** installed and working.
- GTM is distributed via a **manual Decky installation**, not as a promise that it appears in the official Decky Store.
- Use the ZIP attached to the **official GTM GitHub release**. A repository source ZIP is not a Decky installation package.
- SteamOS/Decky versions and third-party CSS Loader themes can affect behavior. The 3.7.0 mini-player switch was tested on the developer's Deck; other configurations are welcome to report results.

## Install 3.7.0

1. From the Steam Deck, open the official [GTM 3.7.0 release](https://github.com/ValentineBSAA/Game-Theme-Music/releases/tag/V3.7.0).
2. In **Assets**, download **`Game-Theme-Music-3.7.0.zip`** (not GitHub's automatically generated *Source code* archive).
3. Open Decky Loader's settings and locate its **Developer / manual plugin installation** option. Turn it on if needed. The exact wording or location may vary with Decky Loader versions.
4. Use Decky's provided **manual ZIP/plugin installer** and select the downloaded GTM ZIP. Follow the prompts displayed by your version of Decky.
5. Reload Decky if requested, then open **Game Theme Music** from the Decky Quick Access menu.

Don't extract the ZIP into arbitrary Steam folders, manually overwrite plugin internals, or delete GTM's settings to update. If Decky does not expose a manual installation option, consult your Decky Loader version's own instructions rather than guessing at file locations.

## Existing GTM user? Upgrade from 3.6.9

Install the **3.7.0 release asset** through the same manual Decky installation method. GTM 3.7.0 is designed to preserve your existing music settings and playlists, and the mini-player remains **ON by default**. A regular update should not require manually deleting the old plugin's music library or settings.

For added confidence, note your current playlists and settings before upgrading. If anything behaves differently, report your GTM/SteamOS/Decky versions and what changed. The prior [3.6.9 release](https://github.com/ValentineBSAA/Game-Theme-Music/releases/tag/V3.6.9) remains available.

## Start here: the main music features

| Where you want music | What to explore in GTM |
| --- | --- |
| An individual Steam game or non-Steam shortcut | **Games** / game-specific playlist and track assignment |
| The Steam Deck Home environment | **Ambient** playlist and its Home/surface options |
| The Steam Store | **Store** music playlist |
| Music files you already own | **Import / Local Import** |
| Finding and previewing music | **Find Music**, then assign a chosen track |
| Managing multiple tracks | **Soundtrack Manager**, playlist order, shuffle, repeat and volume |

GTM supports **up to 15 tracks per game**. Browse the Soundtrack Manager using the Deck's controller. LB/RB navigates manager sections where shown; the D-pad or stick moves through the active controls. Layout and labels may differ with interface mode and Decky themes.

**Important:** previewing or browsing a music result is not the same as intentionally adding it to a playlist. Confirm the selected game or destination before assigning tracks. Import or download only media you have permission to use.

## New in 3.7.0: hide the mini-player, not the music

Navigate to **Settings → Interface & Feedback → Show mini player HUD**.

- **ON (default):** the SAO-inspired Now Playing mini-player appears for supported playback events.
- **OFF:** the mini-player is hidden, but the game, Ambient, and Store audio still plays normally.
- The choice **survives restarting the Deck**. Turn ON again to restore future mini-player popups.
- HUD visibility is separate from music playback, theme notifications, and HUD/visualizer settings.

The developer physically verified OFF, restart persistence and re-enabling with **Catherine Classic**, **Need for Speed: Most Wanted (2005)**, the **native Steam Store**, **Decky Plugin Store**, and **Home Ambient** music. This is not a claim that all combinations of SteamOS/Decky/themes have been tested. [See the test record](VALIDATION_3.7.0.md).

## GTM and ResonaDeck

The [3.6.9 audio-focus bridge](RESONADECK_AUDIO_FOCUS_3.6.9.md) helps GTM cooperate with ResonaDeck: when ResonaDeck takes audio focus, GTM can pause its active soundtrack and only resume it when the correct session remains valid. 3.7.0 preserves the bridge. Cooperation on every third-party configuration is not guaranteed.

## Troubleshooting

**No sound?** Check that the relevant game/Store/Ambient playlist has an assigned track, that playback and volume controls are enabled, and that another audio plugin is not holding audio focus.

**Mini-player still appears?** Confirm **Show mini player HUD** is OFF in GTM, rather than only turning off the visualizer or theme notifications. Try a fresh supported playback event. Include steps and system versions in your issue if it persists.

**Artwork looks unusual or controls move twice?** Report the specific game, SteamOS and Decky versions, and any CSS Loader or other audio/UI plugins. If possible attach a cropped screenshot without private information.

**Something broke after upgrading?** Identify whether it also happens on the existing 3.6.9 release, then file a detailed [GitHub issue](https://github.com/ValentineBSAA/Game-Theme-Music/issues). Please don't erase your existing local music files to troubleshoot.

## More information

- [Full feature summary and latest download](../README.md)
- [3.7.0 release notes](RELEASE_NOTES_3.7.0.md)
- [Testing checklist](../TESTING.md)
- [Source code, licensing and build limitations](../SOURCE.md)
- [Showcase images: what is available and how to contribute captures](SCREENSHOTS.md)
