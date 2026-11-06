# Game Theme Music 4.1.8 | Private Preview

**Major extension-framework preview. Not Stable. Not published to GitHub.**

- New Universal Visualizer Pack **format 3**: safe JSON-only bounded numerical state machines, loops, conditions, 2D drawing, music inputs, preset-option dropdowns, and scene-local state retained across Shuffle All. Format-1 and format-2 packs are still accepted.
- Three-scene sample ZIP proves a visualizer world, a solo/autoplay arcade game, and a multiplayer interactive visual are possible **without installing a new GTM core update**.
- Universal game input normalization: right stick, LB/RB, L2/R2, X/Square, Y/Triangle across standard-mapped controllers; A/Cross remains Quick Menu confirmation. AI versus AI is the default.
- Hold Y/Triangle 800ms for gameplay-only pause, Quick Menu Pause/Resume, 10-second visible controller-disconnect countdown, automatic AI takeover and deliberate Take Control on reconnection.
- Pong controller support: right stick, RB power, LB shield, LT precision, RT boost, X quick dash, short Y power, hold Y pause. Championship data survives opponent/team switches.
- Retains Store/Plugin Store playlist and Ambient/ResonaDeck regression safeguards, Pong performance governor and music-reactive scenery.
- **Limitations:** no arbitrary JS, shader, WebGL, arbitrary binary assets or full external physics runtime. Novel simulation logic must fit the bounded expression VM; other functionality needs a trusted core revision. Actual Steam Deck Gamepad API access is not verified.

Detailed reference: `GTM_4.1.8_UNIVERSAL_VISUALIZER_SDK.md`.

Acceptance required on real Deck: 10-second countdown, controller input, true pause, Store playlist playback, pack import/shuffle and footer performance.
