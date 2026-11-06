# Game Theme Music 4.3.0 Preview | Arcade and Renderer Stability

**Private testing build, not Stable.** Based on 4.2.10 and its organized Quick Menu. **Do not publish until Steam Deck acceptance.**

## Why this exists
Two physical Steam Deck renderer/game crashes were reported, including crashes in Pong and Neon Drift Circuit (the latter while playing). A user also rejected the racing game as unfun. The exact OS/GPU cause cannot be proven from source inspection or a simulated browser run.

## Changes

- Guaranteed Canvas2D `restore()` after all packed scenery/layer draw calls, including exceptional nested-scene paths, instead of permitting an unbalanced context stack.
- Three consecutive drawing exceptions trigger a circuit breaker. Fifteen consecutively slow >42ms Arcade frames also trigger a temporary scene suspension with a readable safe message. Switching scene/remounting starts a fresh guard state.
- Arcade back-buffer size limited to at most approximately 1000 pixels wide and 550k pixels; active Arcade rendering is limited to around 30fps (physics remain fixed-timestep). Silent Pong also respects this budget.
- Reduced DOM observer wakeups, no full style-attribute mutation monitoring.
- Existing 4.2.10 menu groups, Default/Couch buttons, AI settings, Pong morph modes, music playback, ResonaDeck audio priority and SteamUI focus protection preserved.
- **Neon Drift Circuit RETIRED.** The prototype advanced cars automatically around an oval instead of providing satisfying driving. It is removed from the active built-in list, game manifest, embedded fallback registry and trusted render dispatch. Saved racing/Prism Bastion selection migrates to Pong. Its game logic and archived manifest remain for a complete redesign later, not exposed to play.
- Active Arcade count is now **five**: Pong, Beat Catcher, Orbital Duel, Orbit Defenders, Neon Strike Gallery. Do not interpret this as replacing the sixth game or a seventh new game being completed.


## Adaptive Pong AI correction (added after physical gameplay feedback)

- Fixed a genuine skill-response bug: the old Adaptive AI used a near-Balanced movement floor even after a human fell far behind, and reacted too slowly to the score.
- Adaptive now measures points actually won/lost against a **claimed human paddle** (both left- and right-side ownership supported). A losing player faces less precise predictions, longer AI reaction intervals, and slower paddle tracking. A winning player is met by progressively better AI.
- Deliberate human joins start at a more approachable skill; demo-vs-demo remains competitive. A change in human ownership clears stale skill from the previous configuration. Manual Casual/Balanced/Hard/Expert choices remain untouched.
- New test `tests/arcade_430_adaptive_ai.cjs`: scripted weak/strong player sequences, right-side ownership, AI demonstration, PvP, score resets, and an **integration check using the real Pong step function**. Source and shipped frontend are compared so an editable-only fix cannot pass.
- There is **no artificial goal scripting or changed scoring physics**. Difficulty changes only the AI paddle's perception, response time, tracking speed and tactical choices. Match outcomes are not guaranteed.
- Existing saved non-Adaptive difficulty choices remain saved. In Arcade, check **AI Difficulty → Adaptive** to explicitly enable it.

## Tests performed

- Full 4.3.0 automated regression runner: PASS. Includes Python compilation; package validation; Arcade game and settings behavior; explicit idle/join ownership; input; audio focus, sleep/wake and crossfade tests.
- Fault injection: 100 failed scenery paints plus 100 nested Canvas errors must not leak `save()`/`restore()` balance.
- Render containment: error-streak and sustained-slow-frame circuit breaker simulated.
- Arcade large-TV canvas: bounded backing resolution.
- **Pong**: six modes, fifteen minutes simulated each, gameplay/draw stress with checked finite ball state and bounded visual effect arrays.
- Four other active non-Pong games: ten minutes simulated each with intermittent long stalls. The retired racer remains available only for offline tests.
- ZIP and version consistency verified.

## Hardware gate, not yet proven

Please avoid repeated testing if the whole Deck is hard rebooting; return to a known-working backup first. When testing is safe, install as private Preview and confirm: (1) Pong runs on Home and Library; (2) Default and Couch sizing; (3) all menus cover game footage; (4) AI demo, intentional Triangle join, 15s countdown, AI takeover; (5) music/audio ownership before/after an update; (6) render-health information if a scene suspends; (7) no games crash or reset SteamUI. An actual GPU reset/SteamUI crash requires on-device logs to diagnose.

**Important limitation:** Stopping repeated JavaScript render faults and reducing canvas load may help prevent the observed crashes, but is not proof that the SteamOS/graphics-driver failure is eliminated. If 4.3.0 still reboots, do not test additional build iterations without collecting logs or identifying the affected SteamOS/Decky version.
