# Game Theme Music 4.4.9 | AI Spectator Scoring Fix

**Developer:** Valentine  
**Version:** 4.4.9  
**Status:** Public regular release (no Beta suffix). Two specific Steam Deck hardware observations confirmed; broader compatibility QA remains ongoing.

## Problem solved

Extremely strong learned Pong AI defenders could exchange 300+ returns without a goal for five minutes or longer. GTM 4.4.9 adds bounded spectator rally pressure after 13 seconds of continuous play: momentary defensive fatigue, reduced prediction accuracy and more challenging corner-directed return shots. The pressure resets after a **real** goal, respects serve/celebration transitions, and does not erase saved AI learning.

**Every goal still requires the ball to pass a paddle and cross the rear goal line.** There is no score timer, score injection or fake goal event. The 90 Hz physics engine, velocity bounds, power effects and recovery logic remain.

## Preserved from 4.4.8

- Valentine's one-time-per-version full-screen **Steam Home** welcome, with controller A/Cross continuation.
- Separate **Visualizers** and **Arcade Spectator** Quick Menu pages, nested browse-only scene categories and ACTIVE/SAVED indicators.
- Colored ON/OFF switches, palettes and CSS Loader colors, reactivity controls, **Default and Couch/TV** layouts, and persistent explicit Shuffle All OFF.
- 17 built-in Visual Worlds, custom visualizer pack management, 32 ball powers and adaptive spectator AI.
- Game soundtracks, Ambient/Store playlists, crossfade, ResonaDeck audio-focus/telemetry cooperation.

**Not included:** Human-playable Arcade games, controller claiming, player-versus-AI or local multiplayer games. Earlier 4.4.1 materials describe historical experiments, not 4.4.9 functionality.

## Verification

- Old defect reproduced: two 300-second, max-learned AI runs ended 0–0 after 342 and 316 successful returns.
- New behavior: corresponding tests recorded 12 and 10 genuine goals.
- Eight 300-second simulations produced goals; maximum tested scoreless interval 45 seconds.
- All 12 physics modes produced goals within 180-second max-skill simulations.
- JavaScript syntax, Python compilation, archive contents, matching version metadata and shuffle persistence checks passed.
- **Steam Deck hardware confirmed:** Valentine photographed the correct Home welcome and witnessed Pong AI scoring in 4.4.9.

These checks **do not guarantee** that every real-world match scores within a fixed interval, nor do they establish universal SteamOS, theme or plugin compatibility.

## Install and help

Download **`Game-Theme-Music-4.4.9.zip`** under Assets on the [4.4.9 release page](https://github.com/ValentineBSAA/Game-Theme-Music/releases/tag/V4.4.9). Do not use GitHub's generated source ZIP. The package installs directly through Decky and does not require an earlier GTM installer. See [Getting Started](docs/GETTING_STARTED.md), [Testing](TESTING.md), and [Report a Bug](https://github.com/ValentineBSAA/Game-Theme-Music/issues/new?template=bug_report.md).

Thank you for trying GTM and helping me make it better. ❤️  
**Valentine**
