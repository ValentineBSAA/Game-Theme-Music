# Game Theme Music 3.7.0 | Optional Mini Player HUD

**Stable release | October 28, 2026 | Steam Deck / Decky Loader**

## What's new
Game Theme Music 3.7.0 adds **Show mini player HUD** at **Settings → Interface & Feedback**. The setting is **ON by default** to preserve the familiar SAO-style Now Playing ribbon.

Turn it **OFF** to hide the mini player while game, Ambient, Steam Store and Plugin Store soundtracks continue to play normally. Turn it **ON** to restore the mini player for new playback events.

- The preference survives a Steam Deck restart.
- Hiding the HUD never turns off soundtrack playback.
- The visibility switch is independent of theme notifications, HUD position and visualizer.
- Disabling the HUD clears pending and interrupted popups, including queued Quick Access events.
- GTM 3.6.9's cooperative ResonaDeck audio focus is preserved.

## Physical Steam Deck checks
Developer-tested with **Catherine Classic** (Steam game), **Need for Speed: Most Wanted (2005)** (non-Steam shortcut), the **native Steam Store**, the **Decky Plugin Store**, and **Ambient music on the Home screen**. Music continued while the mini player was hidden. The OFF preference survived a **full Steam Deck restart**, and re-enabling the HUD restored its popups.

These are tests on one developer-owned Steam Deck, not a guarantee of compatibility with every Decky, SteamOS or CSS Loader combination.

## Community credit
**Special thanks to Dollet** for reporting the missing mini-player visibility control in the Game Theme Music Discord bug-reports channel. The feedback directly inspired this release.

## Installation
Download **Game-Theme-Music-3.7.0.zip** from this release's Assets and install through Decky Loader's manual/developer plugin installation flow. Existing settings and playlists are designed to be preserved. Report unexpected behavior in GitHub Issues.

## Development and licensing
Game Theme Music continues the GPL-licensed OMGDuke → MegalonVII → Valentine lineage. This release was developed with AI-assisted coding under Valentine's direction and physically tested on Steam Deck. The published repository contains the editable Python backend and compiled JavaScript frontend, but not the original TS/TSX source needed for a fully reproducible frontend build. See SOURCE.md and THIRD-PARTY-NOTICES.md.
