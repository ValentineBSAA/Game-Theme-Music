# GTM 4.6.1 TEST | Cleaner menus and alphabetical pages

**Status:** Test build only. Not a public Stable release. Built on the 4.6.0 private test branch, whose underlying installable runtime came from the verified 4.5.8 public archive. Reconcile any separately developed 4.5.9 changes before publishing.

## What changed
- **Three GTM controls only**, under **Settings → Library Context Menu**. ON shows its shortcut; OFF hides it.
  - Change Music
  - Change Ambient Music Playlist
  - Change Store Music Playlist
- **Removed:** experimental TitleDeck, Change Artwork and Developer switches. GTM does not filter those unrelated plugin or Steam entries anymore.
- Each setting persists and can be mixed, such as showing Change Music and Store Playlist while hiding Ambient Playlist. Music playback, playlists and artwork are not erased or disabled.
- **Alphabetical LB/RB pages:** Ambient → Arcade Spectator → Game Card Music → Health → Music Library → Now Playing → Settings → Store Music → Visualizers → Ambient. This changes navigation order only, not page IDs, content, playback, or the default Now Playing start.
- **Welcome message:** Steam Home's per-version welcome now contains 4.6.1's specific changelog rather than 4.5.8 notes. It should appear once for the new version and stay outside the Quick Menu.
- **Polish:** clearer settings labels, A–Z page indicator, 65 ms ON/OFF light feedback from user-verified 4.6.0, and color-mixed adaptive version text on the *active* GTM banner.

## User-verified foundation
The maintainer reported that the 4.6.0 Quick Menu did not flash during switch changes, all three GTM menu switches hid their entries correctly, and mixing ON/OFF preferences showed exactly the desired menu options. These are 4.6.0 physical observations, **not 4.6.1 hardware verification**.

## 4.6.1 acceptance checklist
1. Install the direct ZIP from the GitHub Actions artifact, **not** the source ZIP or the outer artifact ZIP.
2. Check the per-version 4.6.1 welcome on Steam Home (not within Quick Menu). Verify all five update messages are readable and Continue is focusable.
3. In Settings → Library Context Menu, confirm **exactly three GTM switches** and no TitleDeck, Artwork, or Developer switches.
4. Turn just Ambient OFF, keep Music and Store ON; reopen a Steam game's context menu. Only the GTM Ambient shortcut should be absent.
5. Verify the reverse permutations (all ON, all OFF, single ON), persistence after restart, Steam game and non-Steam game, and no duplicated rows.
6. Check that TitleDeck, artwork and Steam Developer entries are unchanged and that their own plugin settings still work.
7. Use LB/RB through nine alphabetic pages, wrap from Visualizers to Ambient, select a saved page, restart GTM, and ensure Now Playing still opens by default on a fresh install.
8. Check UI contrast for light and dark CSS Loader themes and switch lighting. Ensure no Quick Menu flash.
9. Test game playback, Ambient, Store, visualizers, crossfade, ResonaDeck integration, settings persistence and sleep/wake regression.

## Build validation
Run `node --check dist/index.js`, `node tests/gtm_461_menu_and_navigation.cjs`, and `python3 -m py_compile main.py` before packaging. The isolated CI workflow makes the final Decky installer by verifying the official 4.5.8 ZIP's SHA-256 and overlaying the versioned runtime, so the necessary native executables remain in the package.

**Do not publish or merge the test branch until these checks pass on physical hardware.**
