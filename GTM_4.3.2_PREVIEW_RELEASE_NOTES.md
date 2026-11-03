# Game Theme Music 4.3.2 Preview
## Pong AI/human seamless handoff, final focused interruption repair
**Baseline:** GTM 4.3.1 Preview. **Status:** Automated regression passed; physical Steam Deck test not completed. **Release type:** Private Preview, not Stable.

### What was observed
During the 4.3.1 Chaos AI-vs-AI demonstration, briefly taking control caused a momentary stoppage; the game recovered and continued at normal speed. The user clarified this was a plugin-renderer/Arcade behavior, not a Steam Deck system reboot, and requested one final targeted fix before moving on.

### Root causes identified in source
- Every intentional controller claim advanced `matchJoinEpoch`. The Pong runtime responded by deleting the persistent championship and **creating a new match with a 0.68-second stationary serve**, even when an AI rally was already moving. This made a brief player interruption visibly look like a freeze and unnecessarily discarded score, rally and power state.
- The 15-second intentional right-stick human ready-up used the same global `paused` flag as actual gameplay pauses, holding Pong physics stationary for the full wait. That prolonged the apparent stop if a player intended only a brief interruption.
- Suppressing an entire match during a second-player ready-up could take control away from the first player. The new handoff logic explicitly preserves previously accepted controller ownership while the next player gets ready.

### Fixes
1. **No join-triggered match recreation:** Preserve ongoing Pong match state, score, live ball, effects and ability cooldowns when a controller claims a side. True rules/mode changes still create new game state based on the existing signature system.
2. **Live demo while readying:** While a *new* human waits or completes the 15-second right-stick countdown, the AI keeps playing the pending slot. The timer remains 15 seconds. When ready, control transfers into the ongoing rally without forced re-serving.
3. **Independent two-controller transitions:** When a second player joins, Player 1 keeps control during Player 2's countdown. When both finish, both play normally. The existing pause and disconnect handling remain intact.
4. **Clean shoulder-button edges:** Switching a paddle from AI to a human does not treat held LB/RB/X as brand-new ability presses. A genuine release and new press activates the power normally.
5. **Clearer readout:** Pong's join/ready messages occupy a compact lower strip while live AI gameplay continues. Intentional pause/disconnect warnings retain their established larger treatment.
6. **Source and ZIP parity:** Edited source matches the shipped JavaScript runtime and controller bridge. Version metadata, banner, backend and Arcade manifest now agree on `4.3.2`.

### New regression coverage
- Full real Pong loop: mid-rally AI → ready countdown → human without ball reset, score reset or physics stop.
- AI continues playing during a pending join, preserving the current match object.
- Held LB on handoff does not fire an accidental morph; a new LB press does.
- P1 remains a human when P2 begins the separate join/ready process.
- An intentional human pause remains intact if only the other human exits; final manual handoff returns to AI without a new serve.
- All inherited renderer-failure, long-run Pong, crossfade, music focus, power, visualizer, low-FPS and wake checks passed.

### Preservation and scope
- Preserves five active Arcade games and all six Pong modes, the 4.2.10 organized Quick Menu, 4.3.0 renderer safety and 4.3.1 stalled-ball recovery, existing power effects, and the planned seven-game roadmap.
- **Does not** implement Chess, Pinball, Blockfall, universal Adaptive AI 2.0 or the gameplay rebuilds. Those remain the subsequent development phases.
- No GitHub/NAS store changes were made.

### Hardware acceptance (short)
1. Start Chaos in AI-vs-AI, watch a moving rally and its score.
2. Hold Triangle on one PlayStation controller to join: confirm **AI keeps playing** while the player readies the right stick. The live score should not reset.
3. After countdown, verify the same match continues under human control and LB/RB activate only when deliberately pressed.
4. Pause and hand back with Square: confirm AI resumes without a fresh 0.68-second serve or frozen paddle.
5. If the Decky renderer still visibly stutters, stop iterating on this minor symptom until a real SteamUI/Decky log can identify what remains. The current patch isolates one confirmed cause; it cannot guarantee physical rendering stability.
