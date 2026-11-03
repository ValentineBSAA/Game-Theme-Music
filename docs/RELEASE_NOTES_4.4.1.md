> **Historical 4.4.1 development document.** This is **not the current GTM release**. Version 4.4.9 is music-first with AI spectator visuals, and its complete installer is available at [V4.4.9](https://github.com/ValentineBSAA/Game-Theme-Music/releases/tag/V4.4.9). The old V4.4.1 Git tag is preserved for history, but **its prerelease installer is not currently published and must not be restored or advertised as available**. Statements below describe the earlier development period only.

# GTM 4.4.1 | Public Beta release notes 🎵🎮

**Status:** Public Beta candidate; obtain the installable ZIP from Releases after the maintainer publishes it. **Version:** 4.4.1. **Previous candidate:** 4.4.0. **Primary product:** music playback + music-reactive visualizers. **Arcade:** optional experimental feature.

## Why an Arcade in a music plugin?

An interactive neon Pong visualizer began as a playful experiment: can a reactive visualization also be something you play on a Steam Deck? It grew into six built-in Arcade visualizers. This is **not an announcement that Game Theme Music is changing direction into a gaming platform**. Music and the original GTM visualizer experience remain the core product. We'd like honest feedback on which, if any, games should remain.

## 4.4.1 highlight: larger Chess display

- Neon Chess Championship now gets a **taller, non-fullscreen Chess stage in Couch / TV view**, with a much larger square board and a separate side panel for game status and controls.
- Synthetic layout measurement: approximately **302px** board at a typical 1280px-wide Couch View, versus approximately **150px** in 4.4.0. Actual screen layout varies.
- The maintainer reports that the larger board now displays and works on a physical Steam Deck.
- **Chess is still VERY EARLY ALPHA**: it has basic playable mechanics but is not presented as an enjoyable, finished, fully verified chess game. Its AI, interactions and completeness need considerable work. It may be reworked or removed.

## Experimental Arcade visualizers

| Game | Physical-device notes |
| --- | --- |
| **Neon Paddle Championship** | Verified working with multiplayer; AI, Chaos, morph and Mindball extras. Known brief controller/AI handoff hitch. |
| **Orbital Duel** | Maintainer-verified, including multiplayer. |
| **Orbit Defenders** | Maintainer-verified, including multiplayer. Space-invaders-inspired game. |
| **Neon Strike Gallery** | Reported working; multiplayer status not confidently verified. |
| **Beat Catcher** | Included, including Piano Lanes; comprehensive physical testing still pending. |
| **Neon Chess Championship** | Very early alpha. Bigger board works, overall game remains bare-bones. |

**No promise of future Arcade expansion:** More games, community SDK features or a permanent Arcade direction are exploratory ideas, not release commitments.

## Original GTM visualizers and music

Existing music features, Ambient/Home playback, game tracks, Store music, playlists, crossfade, Visual Worlds, visualizer packs, scene shuffle and ResonaDeck integration remain in the beta. The 4.4.x line also corrected nested visualizer navigation: **“More choices” no longer leads to a disappearing dropdown page**, and paging controls are accessible from the list itself. The maintainer reports that the original visualizers work on the Steam Deck.

## Known limitations

- **Chess:** very early alpha, may be revised or removed. A larger board does not mean completed game design.
- **Neon Paddle:** short human/AI handoff stutter can still appear. This is a renderer/transition hitch, not an observed OS crash.
- **Beat Catcher / Neon Strike multiplayer:** not every mode has physical-device confirmation.
- Other SteamOS/Decky versions, controllers, themes and display sizes may behave differently.
- Automated tests passing is not the same as exhaustive Deck hardware testing.

## Release installation and integrity

**For the published 4.4.1 release**, install the **Game-Theme-Music-4.4.1-PUBLIC-BETA-CHESS-FOCUSED-BOARD.zip** asset from [GitHub Releases](https://github.com/ValentineBSAA/Game-Theme-Music/releases); the generated source archive is not a valid installer.

Expected ZIP SHA-256: `f287d2f85eb5e52ec64b38eb4e6702292139e6db128ea379899db88b956cb537`.

**Important:** The GitHub main branch still contains the older **4.1.2 runtime snapshot** until its source is synchronized from the exact 4.4.1 release. This documentation update does not publish or upload the 4.4.1 binary.

## Your opinion matters

**[GTM 4.4.1 beta feedback and Arcade survey](https://github.com/ValentineBSAA/Game-Theme-Music/issues/4)**. Tell us which Arcade visualizers are fun, whether they improve GTM, what breaks, and whether Chess is worth continuing.

[Game status](BETA_4.4.1_GAME_STATUS.md) · [Testing](../TESTING.md) · [Screenshot gallery](SCREENSHOTS.md) · [Source integrity](../SOURCE.md)
