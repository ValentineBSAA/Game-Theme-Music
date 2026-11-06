# GTM 4.6.0 TEST: Library Context Menu

**Status:** private test branch. **Do not merge or publish as Stable before physical Steam Deck verification.**

This branch is based on the currently published GitHub 4.5.8 runtime. If the maintainer has an unpublished 4.5.9 baseline, compare and integrate those changes before publishing 4.6.0.

## Changes
- Six individually saved visibility switches under **Settings → Library Context Menu**. All default ON.
- GTM-owned rows: **Change Music**, **Change Ambient Music Playlist**, **Change Store Music Playlist**.
- Experimental exact-match third-party/Steam rows: **Edit with TitleDeck**, **Change Artwork**, **Developer**.
- The foreign-row filter is deliberately limited to the Steam game context menu and does not change TitleDeck, SteamGridDB, Steam settings, playlist content or playback.
- Faster 65 ms ON/OFF switch light feedback; new adaptive high-contrast version badge in the Quick Menu banner and legacy preview strip.
- All preferences survive a GTM settings reload. A disabled shortcut does not disable playback, modify a playlist or delete data.

## Limitations and acceptance criteria
The third-party switches are **best-effort**: a plugin that injects its row *after* GTM's patch can re-add it, or may use a different label. These are not advertised as guaranteed cross-plugin controls until verified on the Deck with the actual plugin versions. The Developer filter applies only to the exact Developer row in a game context menu.

### Test on physical Steam Deck
1. Confirm all six entries initially appear when their providing plugins are installed; do not count absent providers as failures.
2. Turn off each toggle and reopen the **same game's** Steam context menu. Verify only the chosen matching shortcut disappears.
3. Reopen the GTM Quick Menu and restart Decky; verify saved visibility preferences.
4. Turn GTM playlist shortcuts off and verify playback, playlist editor (through GTM's own UI) and game soundtrack operation still work.
5. Check Steam game, non-Steam game, and another game's context menus to catch stale App ID or patch-order regressions.
6. Test with TitleDeck installed/enabled, then absent, and both plugin loading orders if practical.
7. Confirm artwork plugin can still edit artwork in its own UI and Steam's Developer functions remain available elsewhere when hidden.
8. Check switch focus and 65 ms glow, light/dark CSS Loader themes, version legibility, and B / LB / RB controller navigation.
9. Check 4.5.8/4.5.9 saved settings migration, GTM + ResonaDeck visualizer sharing, playback and sleep/resume.
10. If a third-party row reappears, record the plugin/version and menu ordering; treat as a known experimental limitation, not an excuse to broadly remove Steam menu nodes.

Run `node --check dist/index.js && node tests/gtm_460_context_menu.cjs && python3 -m py_compile main.py` before installation.

No public GitHub release should be created from this test branch.
