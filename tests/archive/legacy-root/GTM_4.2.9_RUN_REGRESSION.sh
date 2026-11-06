#!/bin/sh
set -eu
cd "$(dirname "$0")"
python3 -m py_compile main.py gtm_pack_v3.py
node --check dist/index.js
for file in src/visualizer-behaviors/controller-418.js src/visualizer-behaviors/pack-program-418.js src/visualizer-behaviors/arcade-421.js src/visualizer-behaviors/runtime-414.js src/visualizer-behaviors/scenery-415.js; do node --check "$file"; done
python3 tests/arcade_backend_422.py
python3 GTM_4.1.8_PACK_SECURITY_TESTS.py
node tests/arcade_startup_429.cjs
node tests/arcade_429_mechanics.cjs
node tests/arcade_abilities_425.cjs
node tests/arcade_429_acceptance.cjs
node tests/arcade_429_settings_visibility.cjs
node tests/arcade_429_live_tuning.cjs
node tests/arcade_426_ai_disconnect.cjs
node tests/arcade_427_post_update_idle.cjs
node tests/arcade_428_pong_morphs.cjs
node tests/arcade_428_community_vm.cjs
python3 pack_validate.py visualizer-packs/sdk-examples/Neon_Dodger_Community/manifest.json
node tests/ready_and_goal_423_rev2.cjs
node tests/pong_timing_rev2.cjs
node tests/pong_abilities_423.cjs
node tests/ready_and_goal_423_rev2.cjs
node tests/controller_dual_join_424.cjs
node GTM_4.2.1_AUDIO_AND_CLOCK_REGRESSION.cjs
node GTM_4.1.8_BUDGET_AND_SCENERY_TESTS.cjs
node GTM_4.2.9_VERSION_CONSISTENCY_TESTS.cjs
node GTM_4.2.9_FOCUS_INTEGRATION.cjs
node GTM_4.2.9_CROSSFADE_REGRESSION_TESTS.cjs
node GTM_4.2.9_SLEEP_MODE_TESTS.cjs
node GTM_4.2.9_RENDER_PERFORMANCE_TESTS.cjs
printf '\nPASS 4.2.9 Preview integrated suite. Physical Steam Deck UI acceptance still required.\n'
