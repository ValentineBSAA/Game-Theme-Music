# GTM 4.2.3 Revised Preview: Six-Game Flagship Arcade

**Build identification:** 4.2.3 Revised Preview (R2). This is a NEW ZIP with the same semantic version requested by the developer. It supersedes the earlier 4.2.3 Flagship Arcade preview; do not assume Decky automatically replaces an installed same-version preview. **Not Stable / not published.**

## Built-in games
Exactly six games inside the main GTM plugin; no separate downloads: Neon Paddle Championship, Beat Catcher, Orbit Defenders, Orbital Duel, Prism Bastion, and **Neon Strike Gallery**. The latter replaces Target Roll, with an original shooter with separate P1/P2 reticles, moving/elite targets, scoring, endless escalation, and cooldown-bound abilities. No shared rolling platform or alternating Target Roll turns.

## Gameplay and AI
- **Pong:** RB Power Shot must be armed before paddle contact, not after an already-returned ball; LB intercepts and deflects. AI uses powers more deliberately, including shields. Existing championship, scoreboard meters, paddle speeds and three arenas preserved.
- **Orbit Defenders:** Increased formation pressure and more enemy activity subject to a fixed active-entity budget. Original enemy ship silhouettes and black-hole hazards preserved.
- **Orbital Duel:** Defensive bases and coverage zones add a tactical objective to the existing gravity-driven ship fights.
- **Beat Catcher:** Gold notes and hazard notes produce distinct scoring effects; music-reactive lane, score, and combo play preserved.
- **Prism Bastion:** Tower upgrades, wave progression and overcharge/repair powers retained.
- **Neon Strike Gallery:** Original score-chasing arcade shooter with separate per-player aim and movement, targets, waves, special powers, and AI-demo mode.
- AI difficulty choices remain Easy / Normal / Hard / Extreme / Adaptive, with bounded session-only adaptive behavior rather than unbounded self-learning.

## Ready and join controls (all six games)
- **AI vs AI/AI demos:** start immediately without a countdown.
- **Player vs AI, Player vs Player, Solo:** after selecting the human mode, move an assigned right stick intentionally to begin a **15-second ready countdown**. Gameplay stays frozen until it completes; music continues normally. This gives time to close the Decky Quick Menu.
- **Hold Triangle/Y during an AI demo:** opt into the selected game's supported human mode with that physical controller. A 15-second ready-up follows the deliberate right-stick gesture.
- **Hold Triangle/Y during human gameplay:** pause/resume game only, without pausing music. Short button actions remain game-dependent.
- Existing 10-second controller disconnect takeover, explicit assignments, and deliberate right-stick reclaim are retained. Controller slots may differ between boots.

## Pong goal celebration
After a missed ball actually travels behind the paddle into the rear goal zone, the game freezes for 0.84 seconds, emits localized goal-mouth light, two expanding rings, bounded spark rays, and a couch-readable GOAL! / team scores +1 callout. The point increments **once**, and the event fades within 1.28 seconds. The existing **Pong special effects** Low/Normal/High option controls particle density. No full-screen white flash; no physics-speed changes from visual quality.

## Menus, visuals and performance
Persistent left/right setting choices stay in Arcade sections rather than dismissing the submenu. All six experiences use original procedural 2D/2.5D vector art for ships, invaders, planets, defensive structures and HUDs. Game/Couch and Default layouts remain accessible. Imported packs are still validated using the format-3 safe program VM; trusted game renderers are internal and are not included in the public SDK.

## Validation
See `GTM_4.2.3_REV2_VALIDATION.md` and `GTM_4.2.3_REV2_RUN_REGRESSION.sh`. Tests cover startup under partial/failed backend load, backend manifest validation, all five non-Pong simulations and abilities, Pong power timing, right-stick-ready 15s countdown, Y/Triangle join from AI demo, PvP wait, rear goal single scoring, lifetime-limited celebration, pack security, playback/audio-clock/focus/sleep/crossfade, and Chromium rendering.

**Known limit:** physical Steam Deck FPS, controller mapping, actual Steam Quick Menu focus, and readability in couch mode remain unverified; preserve the previous known-working ZIP for rollback. This does not contain the generated cinematic concept art as game assets.
