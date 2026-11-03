# Game Theme Music 4.3.3 Preview

**Release class:** Private Preview, not Stable. **Baseline:** 4.3.2 Preview. **Physical Steam Deck verification:** Pending.

## Main UX correction: full-screen ready-up is back
The old 4.3.2 small Pong ready-up strip was unreadable at couch distance. Both **WAITING FOR PLAYERS** and the **15-second GET READY** countdown now use a high-contrast, full-canvas overlay with large text: **CLOSE QUICK MENU**, **MOVE RIGHT STICK TO READY UP**, and **AI MATCH CONTINUES IN BACKGROUND**. This is a visual-only change: the AI demo still advances live behind it; the original seamless AI-human handoff, match score, and pause rules remain. This full-screen panel will intentionally obscure the active rally during ready-up so the instructions are legible.

## Pong: visible Mindball activation
- When autonomous Mindball logic **actually changes the ball trajectory** in the middle steering zone, the ball turns bright yellow with a yellow ring and glow, not just a tiny trajectory indicator.
- No yellow indicator when steering is inactive, at goal-line exclusion zones, during serve/goal pauses, or outside Mindball and Chaos modes.
- Game physics, steering strength, score rules and fairness bounds are unchanged.

## Pong: explicit human morph feedback
- Pressing a morph shoulder button while another morph is active now shows **MORPH ALREADY ACTIVE**.
- Pressing during cooldown now shows the selected morph name and remaining recharge time.
- AI's unsuccessful internal morph decisions do not spam the human notification display.
- The existing LB defense / RB attack mapping and cooldown/activation rules remain unchanged.

## Universal Arcade Adaptive AI: first game-aware upgrade
The non-Pong games previously inferred difficulty partly from stick movement and generic progress counters. The 4.3.3 Adaptive AI reads **per-game outcomes** over a rolling seven-second observation window, with bounded changes rather than abrupt rubber-banding.
- **Beat Catcher:** note-score gain and actual misses; weaker performance reduces AI challenge.
- **Orbit Defenders:** cooperative AI increases defensive support as the base becomes threatened. Co-op AI should not punish a struggling player by becoming weaker.
- **Orbital Duel:** human rounds won relative to opponent rounds won.
- **Neon Strike Gallery:** human target hits relative to missed targets.
- **AI demonstration:** fixed competitive baseline, not a fake human skill estimate.
- Fixed difficulties remain fixed. No score, piece, shot or collision rigging. This is a first stage of game-specific adaptation, **not** the full Adaptive AI 2.0 planned for later.

## Beat Catcher: first sustained-note mechanics
- Some falling notes are now **blue long notes**, with a visible tail/progress fill.
- Stay aligned under the blue note to complete its 0.45-second hold and earn a higher bonus; moving away early fails the note and breaks the combo.
- Existing normal/gold/hazard notes and bounded note counts remain.
- This is a *first-pass long-note mechanic for the current catcher gameplay*, not a complete four-lane piano rhythm game. Authored beat charts, calibrated press timing, simultaneous notes and full keyboard/controller input patterns remain on the approved roadmap.

## Safety and regression testing
Added `tests/arcade_433_couch_and_gameplay.cjs` to verify full-screen readiness, balanced canvas state, yellow Mindball active/inactive rendering contract, valid midcourt steering, human morph cooldown messages, per-game adaptive responses, AI-demo stability and Beat Catcher hold/completion/fail behavior. Retained the 4.3.2 handoff test and all earlier audio, visualizer, SteamUI renderer-safety, long-session, low-FPS, wake, controller and SDK tests. **The complete automated suite passes.**

### Known limits
The minor physically observed Pong handoff stutter was accepted as a low-priority known issue. This update is **not** a claim it is fully eliminated. Steam Deck renderer and real controller testing remains essential; simulated gameplay tests do not certify hardware performance. Chess, Pinball, Blockfall, Beat Catcher Reborn and the new modular renderer are **not included**; they remain planned.

## Quick Deck acceptance
1. Start AI-vs-AI Pong Chaos and use Triangle to join. Confirm the ready-up is big enough to read from the TV and counts down after right-stick ready.
2. Confirm the ongoing AI match resumes seamlessly when you finish joining; scores are not reset.
3. Switch Pong to Mindball or Chaos: the ball should visibly go yellow during active autonomous midcourt steering, then return to normal near the paddles.
4. In Morph Battle, trigger LB, then attempt it during the cooldown and check the explanation. Repeat with RB.
5. Switch to Beat Catcher, watch for blue sustained notes and test staying under one instead of tapping past it.
6. Try each other game's Adaptive mode; judge whether it responds naturally. Check ResonaDeck/audio and scene switching.

**No GitHub or NAS store publication performed.**
