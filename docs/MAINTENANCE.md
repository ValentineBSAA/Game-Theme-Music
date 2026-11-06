# GTM Maintenance Policy | 4.6.7 stable

**Developer and maintainer: Valentine**  
**Project status: Feature-complete for the current music-first direction. Actively maintained.**

Game Theme Music has reached the point where I want to focus on keeping the features people already use working reliably. **I'm not abandoning GTM and I'm not announcing an end-of-life date.** I'm ending the continuous cycle of adding new features to the current release line.

This is a **project direction**, not a claim that every device, theme, controller or plugin combination is already flawless.

## What active maintenance includes

- **Bug fixes:** crashes, freezes, broken menu navigation, corrupted or lost settings, missing music, audio focus and visualizer behavior that doesn't match the UI.
- **SteamOS / Decky compatibility:** regressions introduced by platform changes, including CSS Loader and integration behavior where GTM is involved.
- **Reliability and performance:** playback/sleep-wake recovery, high-CPU rendering, AI spectator simulation and genuine score integrity, long-running use.
- **Accessibility and small quality-of-life repairs:** clearer controls, correct state indicators, readable default and Couch/TV layouts, visual contrast, persistent ON/OFF switches.
- **Security and dependencies:** reasonable maintenance when a specific issue is discovered.
- **Documentation and tests:** keep user instructions, screenshot captions, release assets and automated checks accurate.

A maintenance fix may require some small internal refactoring or carefully scoped UI changes. This is **not a promise to add a new subsystem or redesign the app for every request**.

## What isn't on the current feature roadmap

No new human-playable Arcade, multiplayer systems, unrelated modes, extra games, major visualizer expansions, or broad feature requests are currently scheduled. **The current Arcade Spectator scenes are watch-only.** Custom visualizer-pack support remains available, but new packs are not automatically part of the maintenance roadmap.

Ideas are welcome as observations, but I may defer or decline them. Votes and suggestions are not commitments, and there is **no announced development timetable** for new functionality.

## User choice: visuals are optional

Use **Quick Access → GTM → Visualizers → Enable Home visualizers → OFF** to hide the visualizer footer. Game, Ambient/Home and Store music remain available. Turning **Shuffle All** off is independent of visualizer power: it stops automatic track-change scene switching without hiding the selected scene. Users can choose Default or Couch/TV footer sizing.

## Reporting a reproducible issue

Use the [bug report form](https://github.com/ValentineBSAA/Game-Theme-Music/issues/new?template=bug_report.md). Please include:

1. GTM version (currently **4.6.7**), Steam Deck OLED/LCD, SteamOS and Decky Loader versions if known.
2. What happened, what should have happened and steps to reproduce.
3. The affected area: game soundtrack, Ambient, Store, visualizer collection, AI spectator, pack manager, CSS theme, or ResonaDeck integration.
4. Relevant settings: visualizers ON/OFF, Shuffle All, Default/Couch-TV, palette, selected scene, sleep/wake or controller details.
5. Screenshots and logs **only if convenient**, with credentials and personal details removed.

I may ask for a confirmation on real hardware before considering a change fully verified.

## Release approach

- **4.6.7 is the current public stable release.** The maintenance policy does not itself require further version changes.
- Patches are released when a real fix or compatibility update is ready and verified. There is **no fixed release cadence**.
- Existing functions and settings should be preserved unless a documented bug or compatibility issue requires a change.
- Run relevant automated checks and actual Steam Deck testing where possible. Automated tests alone do not prove universal hardware compatibility.
- Keep published releases and downloadable assets intact. Historical experimentation stays available as documentation, not an invitation to restore old beta installers.
- Avoid restoring the historical **4.4.1** prerelease. The current 4.6.7 installer is standalone.

## Getting involved

[Bug reports](https://github.com/ValentineBSAA/Game-Theme-Music/issues/new?template=bug_report.md) and well-scoped bug-fix pull requests are useful. For code contributions, see [CONTRIBUTING.md](../CONTRIBUTING.md). Feature suggestions can go through the [suggestion form](https://github.com/ValentineBSAA/Game-Theme-Music/issues/new?template=feature_request.yml), but they are not an active roadmap or a guarantee of implementation.

Thank you for using GTM, reporting problems and helping me make it better.

**Valentine**
