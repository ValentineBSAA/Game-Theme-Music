# Game Theme Music 4.2.1 Preview • Arcade Playability

## Installable preview, not a Stable release

This single GTM plugin includes six games (Pong + five additional trusted built-in scenes). No separate community pack is needed. Keep your previous working build for rollback.

## Game/Couch View, Default View, and Pong HUD

- Arcade > Display Layout: Default View or Game/Couch View. Both have restore buttons. The new Couch View expands the footer for arcade play while ordinary visualizers retain normal sizing.
- Pong's RB Power and LB Shield cooldown indicators are **small team-colored meters under/next to the corresponding scores**, never bulky overlays on the court. Couch View shows READY, ACTIVE and remaining cooldown seconds. Default View uses abbreviated charge meters to avoid overlapping the condensed scoreboard.
- The opaque bottom-court power bars are removed. Goal scoring still registers only at the rear goal line with a brief localized glow.

## Six genuinely interactive built-in games

1. Neon Paddle Championship: AI versus AI, single-player versus AI, two-player competition, tournament, special powers and three arenas.
2. Beat Catcher: falling notes, combos, two scoring lanes, progression, auto demonstration.
3. Orbit Defenders: infinite escalating space waves, bosses, co-operative input and optional gravitational black hole.
4. Prism Bastion: tower construction, credits, tower attacks, survival waves and AI demonstration.
5. Orbital Duel: two-sided projectile combat, shields, score rounds and black hole gravity affecting trajectories.
6. Target Roll: aiming, timed rolling shots, rounds and two-player alternating turns.

These games have different basic scoring and control systems but remain iterative 2D Arcade prototypes. They have not been validated on physical Steam Deck hardware. Avoid claiming full commercial-game polish.

## Navigation and play control

- All games appear in the dedicated GTM Arcade game browser, separate from general music visualizer settings. Arcade is refreshed on entry if the library loads late.
- Pong game selection and separate arena selection, with existing game state preserved when changing scenery.
- Seven grouped Arcade Quick Menu sections, compact dropdown paging to avoid >11 visible options, controller labels and assignment shortcuts.
- Player-controlled matches wait for deliberate right-stick input before beginning. Game simulation continues as a passive AI demonstration only when in AI modes.
- Original controller rules preserved: up to 3 detected gamepads, assigned ownership, disconnection countdown and deliberate right-stick reclaim.
- The existing Shuffle All Visualizers option is preserved, and was not modified because the observed switching was settings-driven.

## Engine, pack and legal boundaries

The new five games are compiled into the trusted plugin, not exposed as separately installable SDK packs. Format 1/2/3 declarative community-pack compatibility remains. These samples use original titles/procedural graphics, not third-party sprites or soundtracks. This does not constitute a trademark clearance opinion.

## Test status

Full 4.2.1 regression suite passed in container on November 2, 2026, including 120-second fixed-step simulations for each new game, checks for the black-hole trajectory, built-in pack loading, and Couch/Default HUD. Browser screenshots created of the Pong power meters at 208px and 115px display heights.

**Not yet verified:** physical Steam Deck gameplay FPS, PS4 Bluetooth assignment and Steam Input focus behavior. Do not publish to Stable without these tests.
