# Game Theme Music 4.4.6 | Spectator visualizer release candidate

**Channel: private release candidate.** This is based on the complete user-tested 4.4.5 Spectator Quick Menu + Shuffle Persistence build, not the earlier stripped-down 4.4.2 preview.

## Display and spectator fixes
- Pong scoreboard now uses **AI 1 / AI 2** identities. Labels remain stable as paddle skins, colors and ball powers rotate. The team labels are tinted with the **currently rendered paddle colors**.
- The Pong HUD changes outdated **RB/LB** action prompts into **automatic POWER/DEFENSE** meters. Actual game physics and the power engine remain unchanged.
- Shared AI spectator HUD now identifies **AI 1 / AI 2** and displays spectator-oriented instructions and automatic power-up labels instead of controller commands.
- Original 32 ball/paddle power effects, 12 match-physics modes, 16 paddle skins, multiple arenas, AI learning and the original music-reactive visuals remain. No player-controlled modes have been re-enabled.

## Quick Menu cleanup and quality of life
- **Visualizers** owns regular scene selection, saved color palettes/gradients, reactions, shuffle, packs and footer layout.
- **Arcade** owns AI vs AI scene selection, match difficulty, spectator powers, arena customization and learning status.
- Both visualizer pages now open with focusable **Quick Actions** for Visualizer ON/OFF, track-change Shuffle ON/OFF and persistent Default / Couch-TV footer switching.
- **Settings** is no longer a duplicate visualizer manager with a fragile automatic sorter. It holds only appearance, general playback/interface, download/update/recovery and safety controls. Crossfade and mini-HUD controls were retained.
- The Arcade page now displays AI learning metrics and a **confirmation-protected Reset AI Learning** action; no training data is reset during upgrades.
- Exposed settings continue to use the existing saved keys, preserving preferences, per-scene options, local learning and cached music.
- Shuffle uses its prior per-user persistent sidecar and serialized save queue. It is not forced ON by the update.

## Verification
- Frontend JS parse and Python compilation passed.
- JS runtime regression: 120 seconds (7200 simulated frames) of actual spectator Pong, with goals, returns and misses, bounded ball velocity, and saved/reset learning.
- Track-change shuffle OFF/ON, stale-update protection, serialized settings writes and backend atomic sidecar persistence passed.
- Package verification: same one-folder Decky ZIP layout; all original auxiliary assets and binaries retained; direct archive ZIP integrity and 4.4.6 metadata, frontend, backend, and bundled pack identities checked.
- **Not yet tested on physical Steam Deck**. In particular, verify controller focus and CSS rendering of the Quick Menu and Default/Couch-TV footer with your installed Decky and Steam UI versions before declaring a public stable release.

## Upgrade guidance
Upload the **direct** `Game-Theme-Music-4.4.6-SPECTATOR-RELEASE-CANDIDATE.zip` to your private NAS Deck Store's Preview channel. Run Validate & Publish, reconcile your catalog if an older 4.4.5 card is cached, then test the new build on your physical Deck. Keep 4.4.5 available as a rollback.
