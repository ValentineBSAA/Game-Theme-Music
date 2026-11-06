# GTM 4.1.8 Preview | Validation

Environment: automated source and VM tests on Linux, Node 22 / Python. **These results are NOT a Steam Deck hardware certification.**

Command: `bash GTM_4.1.8_RUN_REGRESSION.sh`
Result: **PASS**, exit status 0 on final run (2026-11-02).

Tested: backend ZIP v1/v2 backward compatibility; format-3 manifest installation/update/removal; rejection of non-manifest ZIP extras, unsafe expressions, unrecognized operations, unsafe fields and excessive loops; sample pack with three independent scenes; pack-defined dropdown persistence; graphics work limits; Quick Menu-only A pulse; six gameplay inputs; simulated right-stick & two-controller mappings; 800ms pause and resume hold; 10-second disconnect and cancel; AI takeover and explicit rearm; separate music/game pause; cross-scene state retention; 5/16/30/60/90 FPS Pong simulation; ten scenery cost bounds; Ambient, Store and audio focus regression suites; original crossfade and sleep/wake scripts.

Known compatibility adjustment: copied 4.1.7 rendering harness to `GTM_4.1.8_BUDGET_AND_SCENERY_TESTS.cjs` and loaded the new controller source before isolated arcade functions. This was a test-harness dependency change, not a production-code workaround. All original prior tests are retained.

Remaining hardware risks: Decky WebView can have different Gamepad API availability or SteamOS button routing; Quick Menu layout/readability and real-world 60 FPS cannot be established by these checks; occasional disconnects require real hardware verification; live Store/Plugin Store playback and pack import require a Deck test.
