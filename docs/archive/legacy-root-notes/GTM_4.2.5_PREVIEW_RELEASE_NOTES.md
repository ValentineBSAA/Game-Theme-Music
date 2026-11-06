# Game Theme Music 4.2.5 Preview | Arcade Reliability and Neon Drift Circuit

**Build date:** November 2, 2026  
**Distribution:** Private testing Preview; not published to GitHub or NAS.  
**Baseline:** 4.2.4 Preview, carrying existing audio, visualizers, two-controller joining, and community-pack validation.

## What has changed

### Six built-in games, including the new Neon Drift Circuit

Prism Bastion has been retired from the active built-in Arcade collection and replaced with **Neon Drift Circuit**, an original overhead five-track racing championship. The new game runs a bounded 60 Hz physics simulation with two independent cars, acceleration, braking, lateral grip, barriers, collisions, three-lap heats, five different circuit dimensions, AI competitors, and championship points.

Racing controls use the right stick: Up accelerates, Down brakes, Left/Right steers. RB drift, RT nitro, LB ice trail, X/Square lightning, LT shield. Triangle/Y remains reserved for join and pause; A/Cross remains Steam menu confirmation. Specials have real effects on speed, handling, hazards, opponents or protection rather than being decorative particles. AI demonstration and two-controller racing are supported. Music continues independently.

Retired Bastion is no longer registered or selectable. Older saved Bastion mode and game selection migrate to Neon Drift Circuit. Five additional JSON-only Arcade manifest scenes remain packaged and are synchronously embedded in the frontend, even if the Decky backend pack RPC is late.

### Adaptive AI and ability improvements

- Both Arcade and Pong now default to **Adaptive**, including saved-setting validation fallbacks. Explicitly saved older difficulty selections are honored, not silently overwritten.
- Pong Adaptive now uses smoothed human score/rally signals for movement speed, prediction noise, and timing. Normal, Hard, Easy/Casual and Extreme/Expert alternatives remain available in their respective menus.
- Other built-in games have smoothed, bounded adaptive AI based on human input motion, progression, success and damage/miss signals. AI demonstrations use a separate consistent baseline.
- Beat Catcher gains LT **Score Surge**, doubling caught-note points for its active duration.
- Orbit Defenders gains LT **Seeker**, targeting a strong visible enemy.
- Orbital Duel gains LT **Phase Shift**, a short protective maneuver.
- Neon Strike Gallery moves Overdrive to LT, keeping Triangle/Y reserved for the join/pause controller bridge.
- Shared ability recharge bars now use each power's actual cooldown instead of treating every power as an 18-second ability.

### Arcade menu and controller integration

- **Select a Game** opens a larger, opaque two-column Arcade Library dialog with controller-focusable choices instead of forcing the user to navigate a cramped game dropdown while watching moving graphics behind it.
- Duplicate Previous Section / Next Section buttons are removed. The persistent Arcade section switcher remains.
- Diagnostics is removed from the ordinary Arcade section cycle. Old saved Diagnostics position safely falls back to Play, preventing an invalid-section crash.
- Successful human joins to AI demos and manual reclaims start a fresh round for the current game. Returning an individual controller to AI while paused preserves the running match. The 15-second intentional right-stick ready countdown and individual controller ownership remain intact.

### Update/startup recovery

- On a valid hot-update transport handoff, GTM avoids incorrectly applying the 12-second **power/wake startup grace** that is intended for real restarts and wake events. Normal wake protections remain active.
- Stream endpoint adoption now has an **1,800 ms bounded wait** with a diagnostic when the backend stalls. This prevents that single RPC from indefinitely holding up the settings and audio-controller initialization chain.
- Existing ResonaDeck audio-focus ownership, update-continuity quarantine, and crossfade protections remain in place. The bounded timeout is not a guarantee of audio playback and does not bypass external audio focus.
- These are targeted fixes. Real Decky update and Steam Deck hardware timings must still be measured before claiming the original 5–15 second startup symptom is eliminated under all conditions.

## Validation

`bash GTM_4.2.5_RUN_REGRESSION.sh`

The integrated automated suite passes Python validation, frontend syntax and manifest registration, AI game simulations, racing championship progression and bounds, gameplay abilities, human join/reset/handoff, Pong physics and scoring, crossfade, ResonaDeck focus, power/wake protection and visualizer frame-budget tests. See `GTM_4.2.5_REGRESSION_RESULTS.log`.

**Still pending physical Steam Deck testing:** game-library modal focus/B dismissal; fullscreen/couch legibility at TV distance; new racing feel with physical PlayStation controllers; LT versus trigger mapping; updated AI difficulty pacing; actual audio update-recovery times on the Deck; sustained performance alongside music and ResonaDeck. Do not mark this build Stable or publish it as a verified release before these checks.

## Next work, explicitly not claimed complete in 4.2.5

- Beat-mapped note generation with audio latency calibration for Beat Catcher (current note generation remains procedural/music-reactive, not validated rhythm charting).
- Expanded mission/progression trees for Orbit Defenders, Orbital Duel and Neon Strike Gallery beyond the tested new abilities.
- Additional racing circuits/championship customizations, more power effects, optional dedicated visualizer suppression while Steam Quick Menu is open, and a future seventh game.
- A hardware-proven startup timing fix for every hot-update/wake scenario.

## Installation and rollback

This ZIP contains a `Game-Theme-Music/` folder. Install as a **Preview** using the same Decky workflow as the existing GTM Preview and keep a working 4.2.4 backup. Do not install as an additional separate plugin beside GTM. Existing plugin configuration is preserved. The package is provided for local test; no GitHub or private NAS changes have been made.
