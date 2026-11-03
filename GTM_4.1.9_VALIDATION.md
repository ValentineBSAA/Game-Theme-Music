# GTM 4.1.9 Validation Results (source-level)

**Status: focused automated suite PASS; physical Steam Deck acceptance pending.**

Command: `sh GTM_4.1.9_RUN_REGRESSION.sh` from plugin root.

- Frontend syntax, backend and pack helper compilation: PASS.
- Format-1/2/3 safe pack validation and malicious script rejection: PASS.
- Store playlist owner, Ambient manual pause, ResonaDeck focus and sleep/wake regression tests: PASS.
- Scenery budgets/animation and simulated Pong 5/16/30/60/90 render-FPS time progression: PASS.
- Automatic controller takeover (10 seconds), irrelevant third controller ignored, distinct P1/P2 assigned right-stick reclaims: PASS.
- Changed physical controller at same slot refused: PASS.
- Rear-goal point scoring only after crossing paddle and travelling to rear; brief impact pause and exactly-one-point award: PASS.
- Independent power timers, readable RB/LB availability labels and Player 1/2 identity labels: PASS.
- Category routing to GTM Arcade, multi-page Arcade menu and bounded-choice dropdown layout: source-level PASS, **visual hardware verification pending**.
- Community pack validated with standalone helper and root-manifest ZIP: PASS.

Historical tests remain intact. The 4.1.9 suite uses version-updated copies where older harnesses asserted a literal 4.1.4 version string. No real Steam Deck controller or overlay focus tests have been conducted in this environment. Do not promote to Stable on automated results alone.
