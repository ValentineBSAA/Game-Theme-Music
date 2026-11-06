# Game Theme Music 4.2.8 Preview: Morphing Pong and Community Game Proof

**Private Preview, not Stable. Hardware approval required before public promotion.** Built on the 4.2.7 idle-AI startup repair. No GitHub or NAS changes were made.

## Shipped and implemented

### Pong: six modes
- **Classic**: plain court play, no morphs or autonomous steering.
- **Competitive**: higher-pressure vanilla play.
- **Power Battle**: original randomized twenty-power system retained.
- **Morph Battle**: physical paddle transformations with configurable LB defense and RB attack.
- **Mindball**: limited autonomous course corrections, without morphs.
- **Chaos Championship**: Mindball steering, morphs, and passive random power effects on rallies.

### Morphs and fair cooldowns
- LB **Fortress**: real full-height collision barrier for 3.0 seconds, 20.0-second recharge; the transformed paddle has a full-height animated collision presentation. It does not disappear after the first block.
- LB **Gravity**: 2.4 seconds active, 18 seconds recharge, ball trajectory attraction toward paddle.
- LB **Magnet**: 2.4 seconds active, 16 seconds recharge, stronger approach attraction.
- RB **Thunder**: 2.1 seconds active, 12 seconds recharge, accelerates a paddle return.
- RB **Mirror**: 2.0 seconds active, 15 seconds recharge, reverses the vertical component on contact.
- RB **Cryo**: 2.2 seconds active, 14 seconds recharge, briefly slows the opposing paddle on contact.
- RB **Inferno**: 2.1 seconds active, 13 seconds recharge, speeds up returned shots.
- One morph at a time on each paddle; two independent recharge slots. Human and AI obey the same cooldowns. A/Cross remains Steam's menu confirmation and Triangle/Y retains join/pause behavior.
- Morph loadouts appear under **Arcade → Powers & Actions** using themed inline selectors; modes appear in **Championship** settings.

### Mindball fairness
- The ball retains forward horizontal travel and can only bend its vertical trajectory gradually.
- Corrections occur only while the ball is between 26% and 74% of the court width, not at the goal line.
- Max turning acceleration is 0.13 normalized units/second² and vertical speed remains bounded.
- An illuminated trajectory cue is drawn in Mindball/Chaos mode.
- Existing scoring, rear-goal hold, fixed-step simulation and AI vs AI startup are preserved.

### Cinematic background foundation
- The other five trusted Arcade games share a low-cost multi-layer moving sky with music-reactive clouds and subtle parallax, drawn behind game objects.
- Pong retains its distinct animated arena worlds, with morphs/ball and HUD above scenery.
- This is the **first cinematic scenery pass**, not a full scene/camera/biome overhaul. No shader pipeline, texture loading or soundtrack ownership changes were made.

### An actual external community game
- **Flux Shield Run** is authored as a standalone format-3 manifest and ZIP, not registered as trusted built-in JS. It is an independent survival game for AI, solo or two local players, with scoring, moving hazard, ship controls, a 2.5-second LB shield and 15-second recharge, and a 2-second RB dash with 10-second recharge.
- Its rules and abilities are entirely declarative JSON, validated through GTM's existing bounded expression/game VM, and may be edited/reimported without rebuilding the plugin. The validator prohibits arbitrary code, network access, arbitrary images, OS APIs or new engine primitives.
- The SDK contains the importable game, public validator, and ability authoring instructions.
- **Limitation**: external packs cannot inject new custom JS physics into built-in games. Adding arbitrary new abilities to built-in Pong or other trusted built-ins still requires trusted core extension hooks; the format-3 VM supports only existing primitives. A future versioned ability-pack API can make common built-in modifiers data driven.

## Retained 4.2.7 and earlier fixes
- Saved human play mode never pauses AI demonstrations on hot update or returning Home without an explicit Triangle/Y join.
- AI-owned controller disconnects do nothing, and human ownership is separate from preferred game mode.
- Inline Arcade controls, corrected menu layering, visible Adaptive AI difficulty and controller setup navigation remain in place.
- Preserve audio/ResonaDeck focus ownership, crossfade, wake protection and bounded stream recovery.

## Automated acceptance
- `bash GTM_4.2.8_RUN_REGRESSION.sh`: PASS, including old replay, audio-focus, sleep/wake and FPS checks; new Fortress, Mirror, Classic and Mindball assertions; and an independent community game VM simulation covering AI scores, LB/RB cooldowns and drawing budgets.
- `python3 pack_validate.py visualizer-packs/sdk-examples/flux-shield-run-428/manifest.json output.zip`: VALID, format 3, 1 scene.
- **Still unverified on physical Steam Deck**: Quick Access focus, docked couch readability, right-stick join, game/menu canvas layering, cinematic performance, adaptive playfeel and music startup. Do not promote Stable based solely on code tests.

## Suggested hardware test sequence
1. Install 4.2.8 Preview with 4.2.6 rollback saved; return to Home and confirm AI demo is already playing, not frozen at 00:00.
2. Open Arcade → Championship and cycle all six modes using PS4 or Deck controls, without a native popup obscuring gameplay.
3. Open Powers & Actions, select Fortress and Mirror. Hold Triangle to join a player slot, then move right stick to start 15-second ready-up. Activate LB on a missed shot and confirm full-height protection and 20-second recharge.
4. Switch to Mindball and verify course corrections are readable and cannot reverse horizontal direction; Classic must behave normally.
5. With AI vs AI already running, turn off each unclaimed controller, then test a genuine human disconnect and paused Square handoff. No phantom takeover.
6. Import the **separate** Flux Shield Run ZIP from Arcade → Packs, select the new game, verify AI scores, and claim each controller. Confirm shield, dash, per-player scoring and no effect on other visualizers.
7. Verify music, ResonaDeck focus, sleep/wake, updated-plugin startup and visual performance for at least 15 minutes.
