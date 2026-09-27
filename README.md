# Game Theme Music

**Controller-first soundtrack management for Steam Deck Gaming Mode.**

Game Theme Music gives Steam and non-Steam games their own soundtrack playlists, plus separate Ambient and Steam Store music. It is built around Steam Deck controls, local/offline playback, artwork, and a full-screen Soundtrack Manager instead of a mouse-first settings page.

> **Current public tester:** v3.6.9  
> This repository is the public home for Valentine’s continuation of Game Theme Music. Wider independent Steam Deck testing is welcome.

## What it does

- Up to **15 tracks per game**, with ordered playlists, active-track selection, preview, shuffle, looping, timing, and fades.
- Separate **Ambient** and **Steam Store** playlists with independent playback behavior and volume.
- **Find Music** with preview-before-download.
- Import audio you already own.
- Local-first playback and cached/embedded artwork for offline use.
- Full-screen **Soundtrack Manager** for Games, Ambient, Store, Library, Find Music, Import, Settings, and diagnostics.
- Controller-first navigation designed for Gaming Mode.
- CSS Loader / Steam-theme-aware presentation.
- Non-Steam shortcut support.
- Optional read-only media bridge for companion visual plugins.
- Cooperative audio-focus support for **ResonaDeck** in v3.6.9.

## What changed in 3.6.9

v3.6.9 preserves the stable 3.6.8 playback/artwork baseline and adds a small cooperative audio-focus bridge for ResonaDeck.

When ResonaDeck reports that it has audio focus, GTM can pause its current soundtrack and remember the exact owner/track. When focus is released, GTM resumes only when that same soundtrack is still the valid paused owner. The existing Media Bridge remains read-only.

See [the 3.6.9 validation notes](docs/VALIDATION_3.6.9.md).

## Download and install

Game Theme Music is a Decky Loader plugin.

**Current release:** [Game Theme Music 3.6.9](https://github.com/ValentineBSAA/Game-Theme-Music-/releases/tag/V3.6.9)

**Direct ZIP:** [Game-Theme-Music-3.6.9.zip](https://github.com/ValentineBSAA/Game-Theme-Music-/releases/download/V3.6.9/Game-Theme-Music-3.6.9.zip)

SHA-256:

`84364fe71ef5a65b9fae513ba0e8449cf670017f9d51b2da2807df9186d6a1df`

### Install steps

1. Install and open Decky Loader.
2. Open Decky settings and enable the Developer options required for manual plugin installation.
3. Download `Game-Theme-Music-3.6.9.zip` from the release above.
4. Install the ZIP through Decky’s manual/developer plugin installation flow.
5. Reload Decky if prompted.

**Use releases from this repository or tester packages linked by Valentine. Do not install similarly named mirrors.**

## Decky Plugin Explorer

The repository contains a root-level `plugin.json` matching Decky’s plugin metadata shape. The community Decky Plugin Explorer scans public GitHub repositories for compatible `plugin.json` files and refreshes its index nightly.

Explorer: https://safetzahirovic.github.io/decky-plugins-explorer/

## Testing status

- v3.6.9 package: published on GitHub and installed and running on the developer’s Steam Deck.
- Core playback/artwork behavior is inherited from the tested 3.6.8 baseline.
- The 3.6.9 ResonaDeck audio-focus bridge has static validation and needs broader independent hardware coverage.
- Community tester reports are welcome, especially around Store playback, notifications, artwork, non-Steam games, controller focus, and coexistence with other audio plugins.

## Trust and transparency

Decky plugins can run with significant access on a Steam Deck. Review code and metadata before installing third-party plugins.

Game Theme Music uses AI-assisted development under Valentine’s direction, with iterative hardware testing and versioned validation notes. AI assistance does not replace release testing or developer responsibility.

This project continues the GPL-licensed SDH Game Theme Music lineage and preserves upstream and third-party notices.

## Lineage

- Current developer: **Valentine**
- Original project lineage: **OMGDuke / SDH-GameThemeMusic**
- Continuation lineage: **MegalonVII / SDH-GameThemeMusic**

Historical attribution is separate from the current public developer identity.

## License and third-party components

Game Theme Music is distributed under the GNU General Public License v3 lineage of the project. See [LICENSE](LICENSE).

Bundled/runtime third-party components include:

- **yt-dlp** — The Unlicense
- **QuickJS** — MIT
- **Mutagen** — GPL-2.0-or-later
- ThemeDeck research attribution — BSD 3-Clause

See [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md).

## Feedback

If you test GTM on real Steam Deck hardware, open an issue with:

- SteamOS version
- Decky Loader version
- GTM version
- whether the game is Steam or non-Steam
- what you expected
- what actually happened
- screenshots or logs when useful

That kind of report is gold. It turns “works on my Deck” into something the community can actually trust.
