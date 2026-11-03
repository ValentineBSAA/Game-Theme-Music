# Game Theme Music 2.8.0 — ThemeDeck-inspired feature expansion

This build deliberately preserves GTM's proven playback architecture and imports only useful product ideas.

## Added
- Library Auto-DJ with manual read-only Steam scan.
- Installed / uninstalled / all filters.
- Missing-music discovery.
- Controller-first bulk assignment with live progress and cancel.
- GTM scorer/provider system chooses high-confidence themes; each successful assignment downloads exactly one winner so native Steam games have a real local file to play.
- Per-track 0–30 second intro skip.
- Master volume.
- Optional passive SAO HUD analyzer/activity meter.

## Preserved
- 15-track game playlists.
- 15-track Ambient and Store playlists.
- exact Ambient continuity.
- 1.9.1 game-page mount lifecycle.
- permanent non-Steam/MW media resolution and local materialization.
- 4-second event-driven SAO mini player with silent Stop events.
- diagnostics and flight recorder.

## Safety/performance
Library scanning is user-triggered. Installed games are the default scope. Bulk assignment requires confirmation, runs serially, downloads one winner per successful game, never replaces an existing playlist, and can be stopped. The visualizer uses a passive captured stream when available and does not insert nodes into the playback output graph.
