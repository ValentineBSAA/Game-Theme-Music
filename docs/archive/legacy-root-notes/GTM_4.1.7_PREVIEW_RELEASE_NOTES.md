# GTM 4.1.7 Preview | Pong Performance, Scenery and Arcade Lifecycle

**Private test build; not public Stable.** Based on 4.1.6 Preview Hotfix. Keep 4.1.6 as backup.

### Fixes
- Corrects 90Hz Pong physics to catch up to render stalls without slowing the ball, within a bounded 24-step allowance per rendered frame; avoids huge catch-up after >400ms sleep/wake gaps.
- Quiet Pong targets a 30fps refresh budget, rather than idling around 16fps (subject to real Steam Deck frame pacing).
- Re-arts ten procedural scenery styles to remain recognizable without music. Environments animate independently; audio changes lighting and detail rather than moving the whole world.
- Separates transitions from game rendering: 1.5s between matches and 3s for the championship celebration by default, with independent settings (0.5 to 5s between matches; 1 to 10s for champion display).
- Adds a trusted generic arcade-game registration and transition lifecycle to prepare future built-in games such as Skee-Ball without duplicating Pong's state.
- Preserves manual-pause, Ambient, ResonaDeck audio focus and Store/Decky Plugin Store playback logic from 4.1.6.

### Not yet included
- Skee-Ball physics or playable Skee-Ball game.
- Executable community-pack code. Packs can only assemble allowlisted trusted effects/behaviors.
- Physical Steam Deck performance approval.

### Acceptance order
1. Steam Store and Decky Plugin Store music play; manual pause stays paused with Ambient enabled.
2. Pong moves smoothly and at realistic speed; note any real FPS drops on the actual Steam Deck.
3. Storm, starfield and arcade environments have obvious independent identities and calm motion with music Off, then subtle accents with music On.
4. Finish multiple Pong rounds and a whole championship; watch 1.5s and 3s defaults, standings/history, clean reset and no flashing.
5. Browse and shuffle other original visualizers; verify no regressions, game controls, focus or state loss.

See `GTM_4.1.7_ARCADE_ENGINE_SDK.md` and `GTM_4.1.7_VALIDATION_RESULTS.md`.
