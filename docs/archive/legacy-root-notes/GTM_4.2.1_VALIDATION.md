# 4.2.1 validation handoff

- Script: `./GTM_4.2.1_RUN_REGRESSION.sh` (includes new tests and skips superseded 4.2.0 prototype-ID and 4.1.6 18vh assertions; original legacy tests are unchanged).
- Code checks: Python compile; Node checks for bundle and trusted behavior modules.
- 5 new trusted games: 120 second fixed-timestep simulation each; no uncontrolled object growth, projected gravity only when enabled; 30 frame canvas render each.
- Pong: rear goal, exactly one score, championship persistence, both player cooldowns.
- Power HUD: only in top score bar with compact meter in Default View; visual Chromium render at 208px/115px; no bottom-court bar.
- Scene and performance/music regression tests: run; see `GTM_4.2.1_REGRESSION_LOG.txt`.
- Remaining acceptance: Steam Deck Game/Couch layout and menu focus; six games visible; two PS4 controllers with Steam Input; controller reclaim; music/Store/ResonaDeck focus and user settings.
