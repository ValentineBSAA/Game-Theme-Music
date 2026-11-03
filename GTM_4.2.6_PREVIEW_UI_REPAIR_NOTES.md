# GTM 4.2.6 Preview | Steam Deck Arcade UI & Controller Ownership Repair

**Date:** November 2, 2026  
**Type:** Private Preview / corrective update to 4.2.5  
**Hardware acceptance:** Not yet verified on a physical Steam Deck; automated suite passed.

## Why this corrective preview exists

The 4.2.5 Arcade Library looked and behaved incorrectly on a real TV. Steam's default white context pop-ups clashed with CSS Loader / Quick Access theming, while a custom Library modal could be overdrawn by GTM's always-on Pong footer. The previous Arcade section switcher had overlapping text and controls. The `View controller setup` button changed the section without bringing the relevant controls into view, and users could not readily find the Adaptive difficulty selection. A controller turning off could show an AI takeover even after the corresponding player slot was already returned to AI.

## Corrections implemented

1. **No standalone Arcade Library modal.** The game list expands inside the main themed Quick Access page and uses normal, controller-focusable `DFL.ButtonItem` rows. Only one built-in game is activated at a time. Closing the library does not stop music.
2. **No native context dropdowns in the built-in Arcade page or its game settings.** Pong arena, Arcade view, play mode, controller assignments, AI difficulty, abilities and game-pack options shown through `Gtm413VisualizerBehaviorSettings` use inline one-button cycling. This avoids popups behind GTM's overlay. Community pack-manager controls were not redesigned.
3. **Section switcher no longer uses three side-by-side columns.** The new single-row selector inherits Quick Access theme and is controller-focusable.
4. **Controller Setup shortcut now changes the visible section AND attempts to scroll the Quick Access controls into view.** This behavior still requires a SteamOS hardware check.
5. **Adaptive is discoverable.** A top-of-Arcade shortcut shows the current value for the selected game. Pong has its own setting, while the other games use the shared Arcade AI setting. Both have an explicit control in Play settings. Defaults remain Adaptive for new profiles, and deliberately saved alternatives remain untouched.
6. **Footer stacking reduced from `zIndex:2147482900` to `20`** so GTM's non-interactive canvas is less likely to overdraw Steam menus. The existing menu-hide gate remains; the new layering needs visual verification on real SteamOS / CSS Loader themes.
7. **Phantom AI takeover eliminated.** Merely connecting or powering off a non-claimed controller cannot trigger the disconnect recovery. When a human hands the last slot to AI, stale human ownership and disconnect timers clear. Disconnected *active human* controllers still get the configurable failover countdown.
8. Reduced forced dark styling of two Arcade controller-info boxes so they inherit the active Quick Access color scheme.
9. Previous 4.2.5 features are retained, including Neon Drift Circuit, adaptive gameplay, power effects, 15-second join readiness, and hot-update audio safeguards.

## Automated acceptance

Run `bash GTM_4.2.6_RUN_REGRESSION.sh` from the extracted `Game-Theme-Music` folder. Includes 4.2.6 UI structure, three controller-disconnect situations, existing dual-controller and Arcade gameplay tests, 4.2.6 version-consistency tests, audio-focus, crossfade, wake/sleep and render-performance checks. Full log: `GTM_4.2.6_REGRESSION_RESULTS.log`.

## Physical Steam Deck acceptance checklist (required)

- Open GTM Arcade in Gaming Mode, using an installed CSS Loader light/dark theme. Confirm the game menu and settings inherit the theme, have no clipped controls, and are fully readable from a TV.
- Select Game Library, navigate all six titles with the D-pad, select one, and close the expandable list using the same Game Library button. B/Circle exits the Steam Quick Access panel. No separate white dialog or footer overdraw should occur.
- Open Pong arena and AI difficulty, change options with A/Cross, and verify there are no native context menus or focus traps.
- Select **View Controller Setup** near the top; confirm the Controllers section scrolls into view and controller assignments can be changed.
- With AI-vs-AI already playing, power off an unclaimed PlayStation pad. The match and scoreboard must continue, with no AI takeover or countdown message.
- Join as P1, hand your slot back to AI while paused, resume, then power off the controller. No second takeover; the AI game keeps running. Repeat with two controllers and one genuine human slot remaining.
- Disconnect a controller that is **actively playing**. The countdown should appear and AI should take over only after the configured timeout.
- Verify music, crossfade, visualizer readiness after updating, and interaction with ResonaDeck. The previous playback-delay fix has not yet been proven on hardware.

**Rollback:** Keep the known previous ZIP. This is a private Preview, not a Stable release or a GitHub/NAS publication.
