> **4.4.0 beta milestone:** Neon Chess Championship implemented with complete core chess rules, local two-player support, AI Exhibition, clocks, board themes, and reset. Original visualizer navigation fixed. **Chess960, puzzles, full tournament system, stronger worker-based Chess AI, Neon Pinball Reactor, and Blockfall Reactor remain future work.**

> **4.3.5 progress:** Mindball tactical receiving-paddle prediction and a real opt-in Piano Lanes mode for Beat Catcher implemented. Adaptive AI 2.0, the renderer architectural rewrite, and the three approved future games (Blockfall, Chess, Pinball) are still planned, not shipped.

> **Roadmap status, 2026-11-02:** GTM 4.3.1 begins Phase 0 (Pong freeze and renderer stability). Later features, including full Adaptive AI 2.0 and Chess/Pinball/Blockfall, are planned but not shipped in 4.3.1.

# Game Theme Music — Arcade Master Upgrade Plan
**Planning baseline:** GTM 4.3.0 Preview. **Status:** For developer review; NO implementation authorized by this document alone. **Release policy:** Private Preview builds, physical Steam Deck OLED / couch / two PS4 controller acceptance before stable release.

## AT A GLANCE
**End-state: seven enjoyable, genuinely playable built-in games.**
1. **Neon Paddle Championship (Pong):** Complete flagship with stable physics, full morph abilities, independently enabled yellow Mindball steering, genuinely adaptive opponents, 6 modes, beautiful readable arenas.
2. **Beat Catcher Reborn:** Proper four-lane rhythm game with taps, long holds, chords, slides, accuracy and combos, latency calibration, authored/community charts.
3. **Orbit Defenders Evolution:** Formation-based wave survival with meaningful enemy types, objectives, carriers, bosses, weapons, resource upgrades, and tactical AI.
4. **Orbital Duel Evolution:** Ship combat with real multi-module bases, offensive/defensive choices, arenas, gravity and smarter AI.
5. **Blockfall Reactor:** NEW falling-block puzzler replacing underwhelming Neon Strike Gallery; classic, power battle, co-op/versus, endless, AI exhibition.
6. **Neon Chess Championship:** NEW complete rules, AI, local PvP, timed play, puzzles/tournaments, AI exhibition, several board themes.
7. **Neon Pinball Reactor:** NEW real pinball simulation with flippers, ramps/targets, multiball, themed tables, AI exhibition, music-reactive light shows.

**Retired/archived, not deleted:** Neon Drift Circuit and Neon Strike Gallery. **Future candidate:** Neon Maze Heist; not part of this seven-game commitment.

## NON-NEGOTIABLE RELEASE GATE 0 — STABILITY & PONG FREEZE
### Confirmed reproduction: stale AI-demo pause
Source `src/visualizer-behaviors/controller-418.js`, `gtm418ReadPlayers`: when `session.manualPause=true`, a transition from requested human mode to `ai_ai` updates session's mode/ready state but does NOT clear manualPause. The return value still contains `paused:true`. `src/visualizer-behaviors/runtime-414.js`, `gtm413RunBehavior` then returns early, drawing a stationary ball instead of advancing Pong. Reproduced using the actual 4.3.0 controller bridge in an isolated VM: `{mode:'ai_ai',paused:true,manualPause:true,status:'GAME PAUSED'}`. This is a confirmed possible unintended AI-versus-AI freeze, though not proven the user's exact observed trigger.

**Fix contract:**
- Distinguish game mode preference, actual human ownership, intentional pause, disconnect takeover, match-transition hold, and renderer suspension.
- When the final human slot is relinquished/disconnected, AI Demo must resume automatically unless the user expressly requested a persistent *AI Demo Pause*; define this separately, visible on HUD and restorable.
- Unclaimed controllers disconnecting must do nothing. Two PS4 controllers and Steam Deck pad must never get mistaken for each other or cause duplicate starts.
- Pong movement must remain active during normal AI demos. Serve pauses, the 0.84-second post-goal hold, and match transitions must have visible countdown/state and bounded exit, even across frame stalls and mode changes.
- Add in-game telemetry: `PLAYING`, `READY`, `GOAL CELEBRATION`, `SERVING`, `INTENTIONALLY PAUSED`, `RENDER SUSPENDED`; measure ball displacement and simulation ticks. If the ball is stationary mid-rally without a permitted reason for longer than a threshold, log state and recover safely without awarding phantom points.
- Check scene-specific timer advancement and simulation accumulator; do not let rendering/particle quality alter score or physics. Correct the reported stutters before enabling ambitious scenery.
- Preserve and instrument existing fault containment and safe fallback so a bad Arcade scene doesn't repeatedly crash Decky's plugin renderer.

**New regression tests:** AI demo after plugin reload / post human join / post human pause / controller disconnect / controller return-to-AI / mode switching, with no frozen ball; finite intentional goal and serve holds; pause toggling; 5/15/30/60/90 FPS plus 100–500ms stalls and sleep/wake; game switching; throw-injected scenery, physics and invalid community content; repeated mount/unmount with no duplicate timers or listeners; Default→Couch/TV→Default; QAM open/close and overlay focus; audio focus with ResonaDeck. Add actual ball motion assertions, not merely finite-number checks.

**Acceptance:** An AI demonstration cannot silently stop during a normal rally. The plugin renderer survives bad effects and repeated scene changes. Steam Deck OLED, TV, and two-controller tests pass. If failure happens, diagnostic capture identifies a stage rather than just reporting "stutter".

## FOUNDATION 1 — UNIVERSAL ADAPTIVE AI 2.0
- **All seven games**, not just Pong. No shared fake "movement = skill" calculation.
- A stable common API: observations, skill estimate, bounded challenge profile, confidence level, reason, and per-game adjustments. Use moving windows/hysteresis and adjustable speed of adaptation; avoid fluctuating after each individual mistake.
- Game-specific evidence: Pong rally and return quality; Beat Catcher hit timing/misses/holds; Orbit Defenders survival/base damage/accuracy/positioning; Orbital Duel tactical objectives/collisions/base defense; Blockfall height/holes/combo efficiency; Chess tactical quality and recent play; Pinball flipper timing, drains and target control.
- Three user-selectable adaptive styles: Relaxed, Balanced Adaptive (default), Challenging; separately selectable fixed difficulty. Show a small optional HUD and explanation "Current challenge / trending / why".
- Never predetermine a winner or secretly violate physics, cooldowns, score, legal moves, piece generation, or collision rules.
- AI-vs-AI has its own entertaining, stable demonstration policy. Two human players bypass human-vs-AI balancing. Idle demos automatically continue after hot-update.
- Test weak/average/strong human traces, fluctuating user, mode switches, restarts, side swaps, AI demos and local PvP, with measurable but non-obvious adaptation.

## FOUNDATION 2 — MODULAR ARCADE ENGINE AND COMMUNITY SDK
- Separate game *lifecycle*, fixed-step physics, AI, abilities, effects, audio reactivity, HUD, menu schema, per-game settings persistence, and input ownership from the app shell.
- Per-game registration contract `id/version`, supported modes, current settings schema/defaults/migrations, controller map, AI capabilities, quality tiers, assets budget, save schema, diagnostics and tests.
- **Abilities as plug-in components**: type, slot, cooldown, charge, activation conditions, collision/physics interactions, visual cue, deterministic outcome, AI usage policy and available modes. Bind safely to host-supported extension points with version checking.
- Community game packages remain bounded and declarative; do NOT execute unrestricted imported JavaScript or let community packs reach Steam/Decky internals. Advanced built-in modules may use trusted code but must be resource-bounded and isolated.
- A genuinely external sample game plus an independently packaged sample ability must install/uninstall and demonstrate real game impact without rebuilding GTM. Do not falsely mark built-in ability injection complete until tested.
- Menu pages generated from selected game's schema: **Choose Game, Default Size, Couch/TV Size, Adaptive AI, Mode**, then Rules / Abilities / Visuals / Players. Keep Controller Bridge in Advanced. Controller focus, back behavior, readable couch design and theme integration are acceptance requirements.

## GAME SPECIFICATIONS
### 1. Pong flagship
- Fix spontaneous stationary-ball bug, controller join/pause/return-to-AI, and all match phases first.
- Keep six distinct core modes (Classic, Competitive, Power Battle, Morph Battle, Mindball, Chaos) but allow *independent modifiers* so Morph + Mindball does not require Chaos mode.
- Ball yellow/gold with trajectory glow **only while steering is actually active**; visible priority when other ball powers occur. Mindball personalities Curious / Hunter / Trickster / Survivor / Adaptive, with Off/Subtle/Normal/Aggressive/Adaptive turn strength; predictable steering limits and no sudden goal-line redirects.
- Physical morph geometry, animation and cooldown parity for both human and AI. Fortress full barricade 3s / 20s cooldown; Mirror, Thunder, Cryo, Inferno, Gravity and Magnet. Keep Classic free of abilities. Use LB/RB two-slot loadout; show "activated", "recharging", "blocked" messages and controller input tester.
- A self-consistent palette-safe, cinematic, readable court; scalable effects and no giant allocations at every frame.

### 2. Beat Catcher Reborn
- Four lanes, tap, long hold, simultaneous chords, optional slides, note speed and spacing. Proper judgements and input latency calibration; meaningful score, combos, failure/continues, chart end.
- Authored chart support through safe packs; autogenerated patterns only when reliable beat data exists. Distinguish genuine chart sync from approximate reactive patterns.
- AI demo with realistic timing errors and per-player adaptive difficulty. Scenery: music-reactive concert venue without burying judgment line.

### 3. Orbit Defenders Evolution
- Formations and enemy roles: scouts, interceptors, bombers, shield drones, carriers, hunters, phased bosses; meaningful wave goals and upgrading between waves.
- True skill-based AI and local co-op. No endless indistinguishable swarm or overdraw; cinematic fleet/background layers with budget controls.

### 4. Orbital Duel Evolution
- Bases with core, shield generator, turrets, repairs, damage zones and interactable objectives; weapons including missiles, plasma, EMP, gravity, interceptors.
- Tactical AI with flanking and attack/defend decisions; distinct gravitational arenas. Ensure base and ship collision response are consistent with visuals.

### 5. Blockfall Reactor — replaces Gallery
- Complete falling-block play with rotation, lock delay, fair piece generation, ghost piece, hold/next and row clearing; deterministically testable board state.
- Classic, Reactor Rush, Championship, Vs, Co-op, Power Battle, Endless, AI Exhibition. Power abilities affect only allowed modes and have visible costs, cooldowns and counterplay.
- Controller paging/focus must not collide with Steam Quick Access.

### 6. Neon Chess Championship — new
- Complete legal chess: checks, mate, stalemate, castling, en passant, promotions, repetition, 50/75-move and insufficient-material draws as applicable, move history, undo for relevant modes, save/resume.
- Classic, Adaptive, Blitz, Tournament, Chess Puzzles, AI Exhibition, Chess960; optional fantasy powers *separate* from standard rules.
- AI thinking time must not block SteamUI render thread (worker or safe nonblocking budget). Fully controller navigable. Boards: wood, holographic, gothic, ice, orbital, visually legible from a couch.
- Evaluate third-party chess engine options/licenses at implementation time; do not depend on a network call during play.

### 7. Neon Pinball Reactor — new
- First ship **one truly complete physical table** (Neon Reactor), then expand to Gothic Cathedral, Galactic Collision, Cyber City, Frozen Fortress using reusable table schema.
- Accurate flippers, ball/plunger, ramps, bumpers, drain, launch, tilt policy, scoring, jackpot, multiball, save-ball and bounded collisions; no decorative-only gameplay.
- Classic, Multiball Madness, Reactor Overload, Championship, Survival, Rhythm Pinball and two-player alternating scoring, plus AI Exhibition.
- Optional powers: Magnetic Rescue, Cryo Ball, Inferno, Lightning Chain, Gravity Well, Time Warp, Multiball Surge; consistent cooldown/fairness. Stable physics isolated from music-driven visual effects.

## RENDERER / CINEMATIC QUALITY
- Render stages independently measurable: fixed physics, AI, abilities, scenery, actors, particles, HUD; log frame times, physics lag, particle/object counts, failure counts and last state transition in a bounded ring buffer.
- Hard caps on canvas pixels, gradients, particles, draw calls, object pooling and GPU-submission load. Frame budgets apply before adding cinema.
- User-facing Off / Low / Normal / High / Auto graphics settings. Auto reduces cosmetics ONLY; no gameplay timing or AI changes.
- Each game has its own visual identity; all backgrounds sit behind HUD, physics and Quick Menu. Explicit QAM layering/focus test on physical Steam Deck; no modal/popover over the game.

## STAGED IMPLEMENTATION / RELEASE GATES (not release promises)
**A. Stability hotfix candidate (4.3.x Preview):** pause-state bug, freeze reason telemetry, bounded transition timers, renderer timing/resource caps, real failure-injection tests. No new games. Must pass Deck physical acceptance.

**B. Engine and Pong reference implementation:** common AI 2.0 foundation, modular schema/ability framework, Pong's yellow Mindball, morph effects/input parity, clean direct menu settings. Test AI vs AI and human vs AI on physical controls.

**C. Improve existing content:** Beat Catcher mechanics, Orbit Defenders and Orbital Duel tactical upgrades. Retire Gallery only once Blockfall is playable so game coverage doesn't temporarily drop. Validate fun as well as technical correctness.

**D. New strategy/puzzle games:** Chess then Blockfall (or reverse if easier for SDK validation), with complete rules, saves, controller input, real AI and reusable modes.

**E. New physics-heavy game:** Pinball's first genuinely complete table. Expand tables and powers only after the first has passing collision tests and excellent play feel.

**F. Community certification:** independent game and independent ability packs install/uninstall safely with SDK docs, conformance tests, compatibility tests and example source. No public stable release until all requested hardware tests pass.

### Hardware acceptance on every stage
On Steam Deck OLED and TV, test Default/Couch/TV/restore, gamepad 1 and gamepad 2 separately, controller disconnect, AI takeover, AI vs AI, on/off and restart, theme colors and contrast, opening/closing QAM, background playback and ResonaDeck focus, plugin hot-update, shuffle behavior, sleep/wake, sustained frame timing, and clean rollback. If a plugin-renderer crash recurs, pause shipment and inspect bounded diagnostics; do not mask the failure with a green simulation suite.

## WHAT HAS NOT BEEN IMPLEMENTED YET
This document is a **plan**. No fixes or new game modules in it have been applied to 4.3.0. The verified stale manual-pause repro is evidence for the next fix, not proof that every stationary-ball incident shares that cause. No specific target version of the eventual full seven-game collection is promised.
