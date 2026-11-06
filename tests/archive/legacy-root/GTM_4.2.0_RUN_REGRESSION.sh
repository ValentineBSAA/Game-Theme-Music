#!/bin/sh
set -eu
python3 -m py_compile main.py
node --check dist/index.js
node --check src/visualizer-behaviors/controller-418.js
node --check src/visualizer-behaviors/pack-program-418.js
python3 -m py_compile gtm_pack_v3.py
node --check src/visualizer-behaviors/runtime-414.js
node --check src/visualizer-behaviors/scenery-415.js
python3 GTM_4.2.0_PACK_VALIDATION_TESTS.py
python3 GTM_4.2.0_PACK_TESTS.py
python3 GTM_4.1.8_PACK_SECURITY_TESTS.py
node GTM_4.1.8_UNIVERSAL_ENGINE_TESTS.cjs
node GTM_4.1.7_ARCADE_LIFECYCLE_REGRESSION.cjs
node GTM_4.1.8_BUDGET_AND_SCENERY_TESTS.cjs
node GTM_4.1.6_AUDIO_AND_CLOCK_REGRESSION.cjs
node GTM_4.1.6_SCENERY_AND_HUD_TESTS.cjs
node GTM_4.1.4_AI_TOURNAMENT_SIM.cjs
node GTM_4.1.4_SHUFFLE_PACK_PINBALL_TESTS.cjs
node GTM_4.2.0_FOCUS_INTEGRATION.cjs
node GTM_4.2.0_RENDER_PERFORMANCE_TESTS.cjs
node GTM_4.1.3_POWER_CONTROLLER_TESTS-414.cjs
node GTM_4.2.0_SLEEP_MODE_TESTS.cjs
node GTM_4.1.3_SUSPEND_POWER_REGRESSION-414.cjs
node GTM_4.2.0_CROSSFADE_REGRESSION_TESTS.cjs
node GTM_4.2.0_CONTROLLER_GOAL_UI_TESTS.cjs
node GTM_4.2.0_GOAL_AND_POWERS_TESTS.cjs
python3 GTM_4.2.0_BUILTIN_BACKEND_TESTS.py
node GTM_4.2.0_BUILTIN_GAMES_TESTS.cjs
printf '\nPASS GTM 4.2.0 combined regression suite; physical Deck testing still required.\n'
