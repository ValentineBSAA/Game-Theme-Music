#!/bin/sh
set -eu
python3 -m py_compile main.py
node --check dist/index.js
node --check src/visualizer-behaviors/runtime-414.js
python3 GTM_4.0.4_PACK_VALIDATION_TESTS.py
python3 GTM_4.1.4_PACK_TESTS.py
node GTM_4.1.4_REGRESSION.cjs
node GTM_4.1.4_AI_TOURNAMENT_SIM.cjs
node GTM_4.1.4_SHUFFLE_PACK_PINBALL_TESTS.cjs
node GTM_4.1.4_FOCUS_INTEGRATION.cjs
node GTM_4.0.9_RENDER_PERFORMANCE_TESTS-413-414.cjs
node GTM_4.1.3_POWER_CONTROLLER_TESTS-414.cjs
node GTM_4.1.3_SLEEP_MODE_TESTS-414.cjs
node GTM_4.1.3_SUSPEND_POWER_REGRESSION-414.cjs
node GTM_4.0.4_CROSSFADE_REGRESSION_TESTS-413-414.cjs
printf '\nPASS: focused GTM 4.1.4 source-level regression suite. Physical Deck testing still required.\n'
