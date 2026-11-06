# GTM 4.1.5 Preview | Steam Deck acceptance handoff

## Reported by user on 4.1.4

Thunder Championship and Starlight Rivalry appeared nearly identical. The match timer and series were difficult to read on the television. Pong resets could flash the entire background white before returning black. The black backdrop needed real animated scenery, and every backdrop should respond to music.

## Addressed in code

- Separate procedural worlds: arcade floor grid, moving storm with localized lightning, drifting starfield. Additional optional backgrounds: solid breathing gradient, nebula, aurora, ocean, sunset, forest, city.
- Scenery renderer receives **the same smoothed GTM music bands** as other visualizers, with low/mid/high/beat/RMS control and Off, Subtle, Balanced, Dynamic options in Pong Studio. Paddles and ball add small music glows. Music reactions fall silent with paused audio while natural ambient animation remains.
- Custom backdrop base and accent hex colors, with a safe `background.reactivity` scalar in imported v2 manifests. Older packs remain valid.
- Full-width top HUD, larger default Pong footer, higher-contrast timer/match standings, last winner, and champion countdown.
- Opaque background is painted before all effect layers, no fullscreen white scoring wash, small team-color edge pulses on points.
- Corrects an early 4.1.5 draft double-frame-state call that could starve Pong simulation. One frame tick is shared between scenery and game physics.

## Validation / known limits

`sh GTM_4.1.5_RUN_REGRESSION.sh` passed automated validation for pack schema safety, all ten reactive environments, no phantom music during pause, single-frame-state tick, all 20 powers, AI championship sim, shuffle, audio focus, Ambient pause, suspend/wake and frame cadence. These tests are **not** proof of visual quality, TV legibility, battery usage or real FPS. No physical Deck run was possible here.

Pack-provided scripts, custom GLSL shaders, arbitrary imported images and arbitrary new gameplay algorithms remain unsupported for safety; add new trusted behaviors through code updates. This preview is not a stable/public release.

## Manual Deck checklist

1. Keep 4.1.4 ZIP for rollback. Install 4.1.5 Preview locally.
2. Choose the three Signature Pong scenes one by one. Verify obvious scenery differences in real gameplay.
3. Test Pong Studio scenery override: stars, storm, nebula, ocean, forest, city, etc.; test custom base/accent colors.
4. Play a bass-heavy song and a treble-heavy song. Test Music-reactive scenery at Off, Subtle, Balanced, Dynamic. Confirm movement and details react; lighting never flashes white and scorer stays readable.
5. Pause from Quick Menu 1/7 while Ambient is enabled. Confirm music stays paused, music reactive effects stop, backdrop still animates, and manual Resume restores normal reactions.
6. Complete two best-of-3 championships, observing match clock, score, winner, countdown, tournament reset and scoreboard readability at typical couch distance.
7. Shuffle between Pong and non-Pong. Check champion progress and all prior backgrounds. Import and uninstall starter ZIP; confirm imported effects respond to music and that unsafe script packs remain rejected.
8. Test 40/60/90 Hz on actual Deck, sleep/wake and ResonaDeck focus. Watch for FPS spikes, excessively bright effects, frozen Pong simulation, Audio focus errors and sound interruption.
