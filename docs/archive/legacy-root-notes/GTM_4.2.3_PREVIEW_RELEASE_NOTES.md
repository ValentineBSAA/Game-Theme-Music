# Game Theme Music 4.2.3 Preview: Arcade Presentation, Powers & Accessibility

**Release tier: Preview / local device acceptance required.** This is a developer build, not a public Stable release.

## Built-in Arcade

All six playable games remain built directly into GTM Arcade: Neon Paddle Championship, Beat Catcher, Orbit Defenders, Orbital Duel, Prism Bastion and Target Roll. No separate ZIP is needed. The Arcade page keeps game-specific settings together and the synchronous built-in registry recovery from 4.2.2.

## Visual pass

The five newer games now use original bounded procedural Canvas graphics rather than mostly rectangular/circular placeholders: vector starships with engine trails, multi-segment invading crafts, ringed shaded planets, black-hole rings, tower silhouettes with barrel fire, rhythm lanes, and rolling targets. Animated space environments, player feedback and controls render in both Default View and Game/Couch View. These are *optimized 2D procedural visuals*, not pre-rendered photoreal 3D art; visual mockup images from design discussions are not included as game assets.

## Gameplay abilities (per player, independent cooldowns)

- **Neon Paddle Championship:** RB/R1 arms a Power Shot and boosts the next outgoing return (including a just-hit return); LB/L1 projects a deflection shield which intercepts a ball, redirects its bounce, and is consumed. Power Battle mode required. Individual charge indicators stay beside the score.
- **Beat Catcher:** RB magnet extends collection distance temporarily; LB combo guard prevents dropped notes from breaking combos while active.
- **Orbit Defenders:** RB retains ordinary autofire when held, with an additional triple-bolt burst on a fresh press; LB Aegis intercepts incoming invaders near the player; X/Square gravity pulse damages and pushes back nearby attackers.
- **Orbital Duel:** RB retains ordinary fire while also triggering a triple plasma volley on press; LB Aegis shields against hits; X/Square temporarily strengthens black-hole gravity when the black-hole hazard is enabled.
- **Prism Bastion:** RB build/upgrade and LB sell remain unchanged; X/Square overcharges defense towers with more damage and faster attacks; Y/Triangle (short press only) repairs the core, spending credits.
- **Target Roll:** RB/RT still throws; LB activates a curve assist for the next throw; X/Square slows target movement for precision; Y/Triangle (short press only) doubles points on the next successful throw.

Powers are constrained by cooldowns and bounded by the existing entity and projectile budgets. Each Arcade game has a compact HUD for its ability button mapping and READY/cooldown state; shared Couch/Default layouts remain available. Y/Triangle long-press still pauses gameplay independently of music.

## Navigation and intelligence

Arcade section, Pong difficulty and other frequently adjusted game options use persistent Previous/Next controls instead of native Steam dropdown dismissal. The Arcade AI menu offers Easy, Normal, Hard, Extreme and Adaptive, and Pong's AI has equivalent tiers. Adaptive difficulty observes local gameplay only during the current session; no player behavior is uploaded or stored. The Deck's 11-item contextual dropdown limit remains protected in menus that still use native dropdowns.

## Tests and known limits

Automated GTM 4.2.2 compatibility regression suite passes, new tests cover all thirteen distinct new Arcade ability inputs and meaningful gameplay effects, Pong shield redirect and Power Shot speed, and all five additional built-in games rendering in Chromium. Browser render benchmark mean <1ms per 1280x240 frame in this development environment. **This is not a measured Steam Deck performance result.** Actual Deck input focus, Steam Input device mapping, sustained thermal performance, and Couch/Default TV legibility must be tested on the physical device.

Rollback: retain 4.2.2 Preview; do not promote 4.2.3 to Stable until hardware acceptance.
