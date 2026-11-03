# GTM / SteamOS compatibility and known limitations

## Latest maintainer observations: 4.4.1 Public Beta candidate

The maintainer reports on a **real Steam Deck**:
- **Original visualizers:** function and are navigable.
- **Neon Paddle Championship:** working, including local multiplayer; occasional brief controller ↔ AI handoff stutter remains.
- **Orbital Duel and Orbit Defenders:** working, including multiplayer.
- **Neon Strike Gallery:** working in basic use; multiplayer not confidently confirmed.
- **Chess:** enlarged board now displays and functions visually in Couch / TV; **game remains very early alpha**, not a completed chess experience.
- **Beat Catcher:** included but no complete, game-by-game physical acceptance reported.

These are qualitative observations, not calibrated performance or cross-hardware coverage. A beta candidate build and its docs are available, while publication of the 4.4.1 GitHub installer is pending.

## Earlier 4.1.2 hardware checks

Ambient recovery after sleep/wake and a full Steam Deck restart were physically confirmed with the configurable delay. The maintainer also accepted visualizer pacing and ResonaDeck integration. This does not prove that ResonaDeck resumes playback automatically after a full reboot.

## Reporting a compatibility problem

Include GTM version, Steam Deck OLED/LCD, SteamOS channel/version, Decky version, whether you use an external controller, visualizer/game and mode, Couch / TV setting and exact steps. Screenshots/logs are helpful **but optional**. Remove passwords, tokens and private account data.

**A passing offline test does not establish stable frame rates on every SteamOS build.** Major AI and renderer work may still be experimental.

[Testing matrix](../TESTING.md) · [Release notes](RELEASE_NOTES_4.4.1.md) · [Beta feedback](https://github.com/ValentineBSAA/Game-Theme-Music/issues/4)
