# Game Theme Music 4.3.1 Preview
## Pong freeze recovery and Arcade stability, private build
**Date:** 2026-11-02  
**Baseline:** 4.3.0 Preview, including 4.2.10 Quick Menu layout  
**Status:** All automated regression checks passed. **Not physically Steam Deck / dock / controller verified.**

### Why this release exists
A user saw Pong's ball stop before hitting a paddle during AI-versus-AI. An isolated reproduction confirmed a controller-session issue: after a paused human game relinquished its last slot, the game could return to AI-versus-AI while still carrying `manualPause=true`. The render loop would draw a stationary ball and skip physics. The user's precise trigger was not captured, so this is a **confirmed plausible cause**, not a claim that every stationary-ball report has been explained.

### Changes
1. **AI demonstration unfreeze:** Clear the old manual-pause state when the final human participant returns to AI or when a genuinely new game session starts. A saved Player-versus-AI / Player-versus-Player preference cannot auto-join after reload. An explicitly paused AI demo still stays paused until resumed.
2. **Two-controller pause parity:** Returning just Player 2 to AI in an ongoing Player 1-versus-AI game **preserves Player 1's deliberate pause**. Returning the **last** human slot to AI resumes the demo. Disconnect grace periods and Triangle-to-join readiness remain intact.
3. **Stationary/invalid-ball recovery:** If normal in-flight movement is genuinely zero for >1.8 simulated seconds, or ball coordinates/velocity become non-finite, recover to a new finite serve without awarding any goal. Show brief `BALL STALLED · NEW SERVE` or `BALL RECOVERED · NEW SERVE` feedback. Legitimate goal celebrations, serve delays, and championship transitions are explicitly excluded from the stall detection.
4. **Physics/render pacing:** Typical frames use a maximum of 12 Pong physics updates, while severe low-FPS frames may use up to 24 to keep the ball's real-time behavior correct. Gaps greater than 400 ms are discarded as likely suspend/renderer stalls rather than simulated as huge bursts. The rendering budget and fault containment introduced in 4.3.0 remain.
5. **Telemetry:** The render frame reports actual Pong phase (`PLAYING`, `SERVING`, `GOAL CELEBRATION`, `MATCH TRANSITION`, `READY`, `INTENTIONALLY PAUSED`, etc.), physics step count, physics lag, dropped long gaps and ball-recovery count. This helps distinguish real freezes from expected transitions in subsequent debugging.
6. **Source/build parity:** Restored the previously bundled, but missing from editable source, Pong join-epoch reset routine. New tests compare live source and shipped frontend implementations to prevent future divergence.
7. **Version consistency:** plugin metadata, npm package, bundled frontend, backend fallback and Arcade manifest all report 4.3.1.

### Preserved
- Five active built-in games; the archived racing prototype stays retired. Neon Strike Gallery remains active **until** its planned replacement by Blockfall Reactor. No extra game was silently introduced.
- Six Pong modes, existing morphs, Mindball behavior, and 4.3.0 Adaptive AI baseline. This is **not** the full proposed Adaptive AI 2.0 or cinematic/gameplay overhaul.
- Default/Couch/TV size controls, game-specific settings, advanced Controller Bridge, audio focus, crossfades, sleep/wake protections, and community game loading.
- Approved future roadmap includes Beat Catcher Reborn, Orbit Defenders/Orbital Duel expansions, Blockfall Reactor, Neon Chess Championship, and Neon Pinball Reactor. These are **not implemented in 4.3.1**.

### New automated acceptance
- Reproduce paused human game → actual controller disconnect → grace period → AI-vs-AI resumes physics and ball visibly advances on actual game engine.
- Explicit AI-demo pause/resume still works and logs `INTENTIONALLY PAUSED`.
- Handing P2 back to AI does **not** unpause P1's still-active session.
- A legitimately stationary ball recovers without false scoring; nonfinite ball state immediately repairs; goal celebrations award exactly one score.
- Ordinary draw frames keep bounded physics work and very slow 5 FPS frames still run roughly in wall-clock time; >400 ms suspend gaps are discarded.
- Editable controller, update loop, and game step match the shipped frontend code.
- All inherited audio, scenery, controller, Pong endurance and safety tests pass. See `GTM_4.3.1_REGRESSION_RESULTS.log`.

### Physical Steam Deck test recommended
1. Install as **private Preview**; keep known-working ZIP for rollback. On Home, observe Pong AI-vs-AI for several minutes without touching any gamepad. Ball should never stop at midcourt indefinitely.
2. Set Morph Battle, watch the AI use morphs, then intentionally hold Triangle to join with a PlayStation controller; ready up via the right stick. Verify LB/RB powers while playing and confirm whether controls work in physical SteamOS.
3. Pause a human match, return the **last** player slot to AI with Square, and confirm both AI paddles and ball move again. With two humans, hand P2 to AI while P1 is paused and ensure P1 remains paused.
4. Test Default Size ↔ Couch/TV while playing, plus Quick Access open/close. Check whether renderer artifacts/stutters or unexpectedly stationary balls recur.
5. Check audio continues and test sleep/wake. If the **plugin** renderer resets, preserve timestamps and Steam/Decky logs; do not assume SteamOS itself rebooted.

### Important limitation
Automated canvas/VM simulations cannot certify real Decky Loader SteamUI rendering or GPU behavior. If the problem recurs, obtain a log from the physical Deck and refine the exact failing path instead of claiming the renderer is now crash-proof.
