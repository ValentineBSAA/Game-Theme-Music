# Game Theme Music 4.3.5 Preview: Tactical Mindball + Piano Lanes

**Status:** Private Preview. **Baseline:** 4.3.4 Preview. **Hardware testing:** Not yet performed. **Public GitHub and NAS releases:** Not modified.

## New in this build

### Pong: improved Adaptive Mindball targeting
- The **Adaptive Mindball** personality now estimates where the ball will arrive relative to the receiving paddle, considers the paddle's recent movement and rally length, and selects a bounded tactical Y-velocity target. Previously, Adaptive largely chose a random Y-velocity target based on paddle height.
- Three new **Mindball tactical awareness** choices in **Arcade → Pong → Abilities**: **Gentle**, **Strategic** (default), and **Dynamic**. Existing personalities, steering strengths, mode combinations, and bright yellow active steering indicator are preserved.
- Steering remains strictly midfield-only with finite clamped Y velocity, no forced score/goal changes, no teleportation, and no change to ball X velocity. When the ball leaves the steering zone, its active-steering cue now resets explicitly.
- The AI-versus-AI mode continues to use competitive opponents, with no deliberate score rigging. The brief observed handoff stutter is a **known minor issue**, not retested as eliminated.

### Beat Catcher: Piano Lanes (real alternative game mode)
- **Arcade → Beat Catcher → Rules → Rhythm gameplay:** choose between original **Classic Catcher** or **Piano Lanes**.
- In Piano Lanes, **right-stick horizontal selects one of four lanes**. Press **RT** to hit a short note on the timing line; **hold RT** through a blue sustained note and release only after completion. Moving away or releasing early breaks the hold. Gold notes grant bonuses.
- Accuracy feedback includes **Perfect / Great / Good / Miss**, plus independent combo, accuracy and scores for P1/P2. Two separate controllers can play simultaneously. AI Exhibition uses the same generated patterns and timing/collision rules with bounded skill-dependent execution, not scripted fake points.
- Long holds include per-player progress indicators. The renderer generates a finite chart, with **no more than 18 live notes** and no new heavy particle systems.
- Patterns are **procedurally generated**; they are not yet custom music-authored or beat-accurate charts. This is a meaningful playable step toward Beat Catcher Reborn, **not** the completed piano-game system.

### Preserved
- The complete, couch-readable full-screen Ready Up instructions, live AI behind the ready overlay, 4.3.2 controller handoff behavior, Pong morphs and Mindball color, five active built-in games, original Classic Catcher, music playback, adaptive personalities, game menu organization, and existing renderer error protections.

## Automated validation
- Full inherited suite covering Pong physics 5–90 FPS, AI matches and handoffs, morphs, sleep/wake, audio focus and crossfades, GUI settings visibility, pack validation, renderer fault handling and Arcade endurance.
- New tests in `tests/arcade_435_tactical_rhythm.cjs` cover target selection responding to the opposing paddle; all Mindball awareness levels; bounded safe movement; timed RT scoring; wrong-lane prevention; holds and early releases; two-player independence; old Classic Catcher preservation; and a long, bounded AI demo.
- Results: **PASS**, see `GTM_4.3.5_REGRESSION_RESULTS.log`. This does **not** certify actual Steam Deck UI/SteamOS/GPU performance.

## Minimal hardware acceptance
No full Arcade regression is required of the user. If you want to sample the new features, watch Pong with the **Adaptive** Mindball personality and then briefly select **Beat Catcher → Rules → Piano Lanes** to judge its look and readability. The rest remains automated and unverified physically.

## What's next
The bigger future work remains: richer authored/synchronized rhythm charts, per-game Adaptive AI 2.0, stronger Orbit Defenders/Orbital Duel gameplay, then Blockfall Reactor, Neon Chess Championship and Neon Pinball Reactor. **None of these new games are included yet.**
