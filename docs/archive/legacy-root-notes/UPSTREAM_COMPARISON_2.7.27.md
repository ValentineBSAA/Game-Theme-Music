# Game Theme Music 2.7.27 vs current upstream 1.8.2

Compared against MegalonVII/SDH-GameThemeMusic main/release 1.8.2 on 2026-08-27.

## Upstream focus

The upstream project remains a compact per-game theme music plugin: game-page injection, theme search/customization, per-game settings, cache/download maintenance, YouTube/KHInsider providers, and non-Steam support.

## Valentine 2.7.27 additions

- Up to 15 tracks per game with playlist ordering, active/resume cursor, shuffle, and loop behavior.
- Ambient music across Steam Home/Library surfaces with exact resume/restart/next interruption modes.
- Independent Steam Store music system with its own playlist, shuffle, volume, and Previous/Next.
- Shared Download Storage, local import/playback, loopback streaming, bounded storage, and background materialization.
- Bundled yt-dlp and QuickJS for self-contained reinstallability.
- Restored 1.9.1-style game-page mount/injection behavior for stable Steam and non-Steam playback.
- Dedicated non-Steam media resolution fallback plus persistent resolved-URL acceleration and local materialization.
- Global Decky mini player with SAO-inspired white/yellow presentation and left/right positioning.
- Event-aware mini-player behavior that ignores routine Steam navigation, same-track resume, and ordinary stop events.
- Controller-first playlist focus groups and premium full-screen game configuration UI.
- Health Center, route/theme flight recorder, diagnostics ZIP export, backend health checks, and safe recovery tooling.
- Performance work that keeps expensive provider/download housekeeping off Decky's startup critical path.

## 2.7.27 final behavior

- Mini player is shown for genuine new playback/track changes and playback errors.
- Ordinary stops are silent.
- HUD display window is 4 seconds.
- Working playback, non-Steam handling, playlist focus, Ambient, Store Music, and provider resolution are unchanged from 2.7.26.
