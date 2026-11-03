#!/bin/sh
set -eu
cd "$(dirname "$0")"
python3 -m py_compile main.py gtm_pack_v3.py
node --check dist/index.js
for file in src/visualizer-behaviors/{controller-418,pack-program-418,arcade-421,runtime-414,scenery-415}.js; do node --check "$file"; done
python3 tests/arcade_backend_422.py
python3 GTM_4.1.8_PACK_SECURITY_TESTS.py
node tests/arcade_startup_422_REV2.cjs
node tests/arcade_mechanics_421_REV2.cjs
node tests/arcade_abilities_423_REV2.cjs
node tests/pong_timing_rev2.cjs
node tests/pong_abilities_423.cjs
node tests/ready_and_goal_423_rev2.cjs
node GTM_4.2.1_AUDIO_AND_CLOCK_REGRESSION.cjs
node GTM_4.1.8_BUDGET_AND_SCENERY_TESTS.cjs
node GTM_4.2.3_FOCUS_INTEGRATION.cjs
node GTM_4.2.3_CROSSFADE_REGRESSION_TESTS.cjs
node GTM_4.2.3_SLEEP_MODE_TESTS.cjs
node GTM_4.2.3_RENDER_PERFORMANCE_TESTS.cjs
printf '\nPASS 4.2.3 Revised Preview integrated suite. Hardware acceptance remains pending.\n'
