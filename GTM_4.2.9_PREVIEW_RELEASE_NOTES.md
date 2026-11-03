# Game Theme Music 4.2.9 Preview

**Private Steam Deck Preview · November 2, 2026**

## Purpose

This is a focused usability and game-settings repair on top of 4.2.8. Version 4.2.8 added Pong modes, morphs and Mindball internally, but failed to expose the new controls in the GTM Arcade Quick Menu. The old page filtered Pong's game-mode option into an unrelated championship section, and the other built-in games lacked an accessible per-game tuning interface. These issues made otherwise functional gameplay appear missing.

## Where to find everything

Open **GTM → Arcade**. The **Selected Game** panel offers **Choose Game** (expandable, inline, no Steam modal) and **[Game Name] Settings**, which is expanded by default. Use **Settings category** to cycle among **Rules & Modes**, **Abilities**, **Visuals & Scenery**, and **Play & AI**. Only one group is shown at a time to avoid a long scroll list. The **AI Difficulty** shortcut in the overview jumps directly to that game's AI settings.

Open **Advanced → Controller Bridge** for Player 1/2 controller slots, team placement, Triangle hold-to-join timing, disconnect recovery, and a controller-count/status hint. Device labels are refreshed while the Bridge subsection is open. This submenu is collapsed by default.

All Arcade selections use focusable, theme-friendly ButtonItems. They do not use the Steam native dropdown or context-menu overlay that obscured the visualizer during the 4.2.5 regression.

## Selected-game settings now change gameplay

| Game | Rules / modes | Abilities & AI | Visuals |
| --- | --- | --- | --- |
| Neon Paddle Championship | Classic, Competitive, Power Battle, Morph Battle, Mindball, Chaos Championship, scoring, series and ball speed | Fortress, Gravity, Magnet, Thunder, Mirror, Cryo, Inferno morph selection; Pong-specific Adaptive AI | Existing arena, color, palette and effects controls |
| Beat Catcher | Note tempo; hazards on/off | Per-game AI difficulty and ability cooldown speed | Per-game cinematic scenery detail |
| Orbit Defenders | Enemy movement speed; starting base durability | Per-game AI difficulty and ability cooldown speed | Per-game cinematic scenery detail |
| Orbital Duel | Hull strength per round; existing black-hole option | Per-game AI difficulty and ability cooldown speed | Per-game cinematic scenery detail |
| Neon Drift Circuit | 1/3/5 laps, 3/5/7 championship races, vehicle grip | Per-game AI difficulty and ability cooldown speed | Per-game cinematic scenery detail |
| Neon Strike Gallery | Target movement, miss allowance | Per-game AI difficulty and ability cooldown speed | Per-game cinematic scenery detail |

All five non-Pong built-in games now use **independently stored per-game difficulty and ability recharge**, instead of forcing one shared Arcade difficulty. New choices are validated against an allowlist and remain in browser localStorage, separate for each game. Game engine runtime reads these choices; they are not cosmetic labels. Arcade selection persists using the existing GTM saved-setting key.

For independently imported **community games**, the Arcade panel displays the pack's own validated format-3 options. It does **not** falsely claim that built-in-only cooldown or AI controls apply to a third-party game.

## Existing functionality intentionally retained

- Six built-in games, including Neon Drift Circuit; Prism Bastion remains removed.
- Pong morphing, six modes, Mindball and championship physics from 4.2.8.
- AI demonstration after a plugin update, including when human play modes are saved. No automatic Waiting for Players without a deliberate join.
- Triangle hold-to-join, 15-second readiness, Square return-to-AI, no false AI takeover when unused controllers disconnect.
- Steam game focus, Ambient/Store audio ownership, crossfade, sleep/wake protections and ResonaDeck coexistence.
- Separate community game pack format and sandboxed program VM.

## Validation

Run `bash GTM_4.2.9_RUN_REGRESSION.sh` from the plugin folder. The suite passes syntax checks, built-in pack validation, physics simulation, Pong and controller regression, UI component render testing, per-game saved-option persistence and gameplay effect tests, audio-focus, crossfade, sleep/wake and performance regressions. The accompanying log records these checks.

**Not verified:** physical Steam Deck Quick Menu focus behavior, live TV readability, controller hot-plugging on SteamOS, actual first-frame latency and full real-world music playback after updating. This remains Preview, not Stable.

## Known SDK boundary

The community SDK continues to let creators ship new standalone games with their own restricted logic and power cooldowns without rebuilding GTM. New settings for GTM's six *built-in* games can be adjusted through the UI; however, adding an entirely novel third-party ability into an existing built-in game's physics remains a separate extension API project. No arbitrary executable code loading has been introduced.

## Recommended Steam Deck acceptance

1. Update 4.2.8 → 4.2.9. Return to Home: AI-vs-AI game keeps playing, no Waiting for Players screen.
2. Open GTM → Arcade. Confirm **Pong game mode** is visible under the default Rules & Modes group. Change to Morph Battle and choose each morph under Abilities.
3. Choose Neon Drift Circuit and confirm laps, races, and handling options replace Pong's options immediately.
4. Change the racing AI difficulty to Hard, return to Beat Catcher, and confirm its AI difficulty still defaults to Adaptive.
5. Open Advanced → Controller Bridge. Test physical PS4/PS5 controllers and verify toggling off a controller while AI-vs-AI does nothing.
6. Open/close Steam Quick Access and game context menus. No Arcade canvas may cover menu controls, and music playback must continue.
7. Check sound startup after an update with and without existing music, and ensure ResonaDeck keeps audio ownership when active.

Keep the preceding Preview for rollback until hardware checks pass.
