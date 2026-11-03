# Game Theme Music 4.2.4 Preview: Version Consistency + Two-Controller Arcade Control

**Build:** 4.2.4 Preview. Supersedes the 4.2.3 Revised Preview ZIP; adds controller join/AI handoff without changing the six-game lineup.

## Fixes

- `plugin.json` and `package.json` now identify 4.2.4.
- The main Decky GTM brand banner visibly reads **PREVIEW · v4.2.4**.
- The main page footer derives its displayed version from `GTM_VERSION` instead of using a stale hard-coded 4.2.0 label.
- The plugin identity version row now explicitly reads `v4.2.4 · Preview`.
- Python's fallback plugin version and the built-in Arcade manifest are aligned to 4.2.4.
- Automated identity checks catch future differences between metadata, UI banner, footer, and built-in manifest versions.

## Physical controller ownership and AI handoff

- **Hold Triangle/Y on the first connected controller** to claim Player 1 while an Arcade game is running as an AI demo. Only the connected controller making the hold becomes that player.
- **Hold Triangle/Y on a different controller** to claim Player 2, only in games with supported two-player modes. Steam Deck virtual/Xbox input and external PlayStation controllers remain distinct Gamepad API devices.
- The existing **15-second ready countdown** remains active after deliberate right-stick engagement when a human enters a match. AI-only demos require no countdown.
- Once playing, **hold Triangle/Y to pause or resume** Arcade gameplay, independently of music playback.
- **Only while manually paused**, pressing **Square/X** from a joined controller releases **that player's slot** to AI. The controller stays connected. The other player may remain human. If everybody exits, the AI demo resumes.
- Paused Square handoff is also supported when a human mode was explicitly chosen from the Arcade menu; a fresh hold Triangle/Y on an assigned controller can reclaim a released slot.
- Gamepad-button state is edge-triggered for Square, preventing accidental repeated handoff. A single-player-only title cannot be joined by a second player.
- Arcade controller-help copy describes the new shortcuts. New regression coverage simulates sparse two-PlayStation-controller indices, active-play Square immunity, paused Square AI substitution, and explicit menu mode recovery.

## Carried forward from 4.2.3 Revised Preview

Six games: Neon Paddle Championship, Beat Catcher, Orbit Defenders, Orbital Duel, Prism Bastion, and Neon Strike Gallery (replacing Target Roll). Carries the 15-second human-ready countdown, AI-demo Triangle/Y join, Pong pre-contact RB activation, and upgraded goal celebration, plus the previously implemented game visuals and abilities.

**Preview only:** Physical Steam Deck performance, controller focus, and gameplay remain subject to on-device validation. No GitHub/NAS publication is included in this ZIP.
