# GTM 4.0.7 Private Test | ResonaDeck → Home Ambient recovery

## What changed
- When ResonaDeck pauses/stops and releases audio focus, GTM proactively reconciles the Home Ambient controller, with short follow-ups to accommodate SteamUI returning from Quick Access to Home.
- GTM never starts Ambient while ResonaDeck still owns focus. The async URL resolver also rechecks focus before loading a track.
- Ambient loaded during a previous version's focus hold can now restart from the `ready` state, not just `paused`.
- Recovery respects existing Ambient enabled/playlist/surface, Store priority, running games, desktop-mode blocking, selected interruption mode and track identity.
- A renewed ResonaDeck focus cancels pending recovery checks, and plugin dismount cancels timers.
- Keeps GTM 4.0.6's ResonaDeck telemetry/shuffle, no-flash footer transition, safe packs, and crossfade code untouched. ResonaDeck 1.3.5 does **not** require an update.

## Steam Deck validation
1. Start Plex in ResonaDeck while GTM Ambient is enabled on Home.
2. Pause Plex, close QAM; Ambient should resume on Home without visiting any game tile.
3. Repeat with Stop, including when GTM Ambient did not previously load.
4. Resume Plex while Ambient is playing: GTM must yield immediately, then recover on the next pause/stop.
5. Check with Store or a game page visible: Ambient must not interrupt that owner.
6. Repeat during/after track transitions with ResonaDeck Web Audio fallback and GTM Visual Worlds enabled.
7. Disable Ambient, or remove its playlist: it must not start on external focus release.
8. Confirm GTM eight-second crossfade and external visualizer shuffle still work.

Status: **private, offline regression tested; Steam Deck verification pending.** No public GitHub changes.
