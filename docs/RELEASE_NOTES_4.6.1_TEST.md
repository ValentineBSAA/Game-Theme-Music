# Game Theme Music 4.6.1 TEST · Changelog

**Status:** Private test build, awaiting physical Steam Deck verification. Not a public Stable release.

## Improvements requested by the developer
- Removed experimental toggles for **TitleDeck**, **Change Artwork**, and **Developer**. GTM no longer attempts to hide third-party or native Steam commands.
- Retained the three physically verified GTM-owned switches under **Settings → Library Context Menu**:
  - **Change Music**
  - **Change Ambient Music Playlist**
  - **Change Store Music Playlist**
- Each shortcut can be shown or hidden independently. All default ON; existing preferences continue to be respected.
- Hiding any shortcut does **not** stop music, delete playlists, or disable the associated editor in GTM.
- Clarified the descriptions so the options say what they affect.

## Navigation & accessibility
- Reordered the **actual** Quick Menu page rail and LB/RB cycle alphabetically: **Ambient Music, Arcade Spectator, Game Card Music, Health, Music Library, Now Playing, Settings, Store Music, Visualizers**.
- Kept stable page IDs so previously saved tabs and controller navigation still work.
- Added an **A–Z · LB/RB to browse** hint to make the page order self-explanatory.
- Preserved the smooth 65 ms ON/OFF feedback introduced in the 4.6.0 test.
- Improved the version badge's legibility on the **live GTM banner**, including contrast against both light and dark surrounding Steam themes.

## Welcome screen
- The once-per-version Steam Home welcome now displays the **4.6.1** changes, instead of stale 4.5.8 highlights.
- Explains menu visibility, alphabetical navigation and improved visual feedback.
- Keeps the single Continue action and the original controller-focus safeguards.

## Test results and follow-up
- The developer physically verified in 4.6.0 that combinations of the three GTM context-menu switches work as expected and switch animations do not flash.
- This 4.6.1 revision must still pass an independent regression run and on-device review, especially the alphabetical LB/RB order and welcome-once behavior.
- The test installer is built from the verified **4.5.8** public payload plus the 4.6.1 test-branch runtime and manifests. Reconcile any unpublished 4.5.9 changes before publishing a Stable build.

## Recommended Deck acceptance test
1. Update over 4.6.0 and verify saved menu visibility choices.
2. Open the Steam game context menu with one, two, and all three GTM shortcuts OFF; reopen and turn them ON.
3. Confirm TitleDeck, artwork actions, and Developer are **not** modified by GTM.
4. Use LB/RB across all nine pages; verify A–Z order, focus, and wrap-around.
5. Read welcome changelog once after install, dismiss with A/Cross, and verify it does not reappear on ordinary restarts.
6. Test light/dark CSS Loader themes, version badge, and switch lighting.
7. Verify ambient/store playback, game soundtracks, ResonaDeck compatibility, and sleep/resume are unchanged.

**No public release is created by this test branch.**
