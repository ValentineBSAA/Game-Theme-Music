#!/bin/sh
set -eu
cd "$(dirname "$0")"
bash GTM_4.2.2_RUN_REGRESSION.sh
node tests/arcade_abilities_423.cjs
node tests/pong_abilities_423.cjs
node --check dist/index.js
node --check src/visualizer-behaviors/arcade-421.js
node --check src/visualizer-behaviors/runtime-414.js
printf '\nPASS GTM 4.2.3 arcade abilities + existing regressions. Physical Deck verification pending.\n'
