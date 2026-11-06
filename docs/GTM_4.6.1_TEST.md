# GTM 4.6.1 · Steam Deck test notes

This is a test build for the November 6, 2026 user-feedback cleanup. It is not a published Stable release.

## What changed
- Settings → Library Context Menu now contains **only three** independent controls: Change Music, Change Ambient Music Playlist, and Change Store Music Playlist.
- Every switch defaults ON; OFF hides only its corresponding GTM shortcut. Saved music, playlist contents, and playback remain untouched.
- Removed all 4.6.0 experimental handling of TitleDeck, Change Artwork, and Steam Developer context-menu entries. Other plugins and native Steam entries are untouched.
- Nine Quick Menu pages now appear A-Z: Arcade Spectator, Ambient Music, Game Card Music, Health, Music Library, Now Playing, Settings, Store Music, Visualizers.
- The six Full Manager sections also appear A-Z. Page route IDs and saved page keys have not changed.
- More descriptive labels, guidance for hidden shortcuts, and an A-Z page hint accompany navigation.
- Version-specific Steam Home welcome now summarizes 4.6.1 changes. The **actual Quick Menu banner** version badge has theme-aware text and background. The tested fast switch light response is preserved.

## What the maintainer verified previously in GTM 4.6.0
- The three GTM shortcut visibility switches worked on a physical Steam Deck.
- Any combination, including Change Music plus Store only, rendered correctly when reopening a game menu.
- ON/OFF switch lighting responded without the unwanted flashing.

## Validate 4.6.1 before public release
1. Install the test ZIP from the **Actions artifact**, not GitHub's auto-generated source archive.
2. Confirm all three GTM menu switches are ON by default and work in all eight combinations.
3. Confirm **Edit with TitleDeck**, **Change Artwork**, and **Developer** options remain controlled entirely by their own providers.
4. Reopen a Steam game context menu and a non-Steam game's menu; verify each GTM shortcut appears or disappears independently.
5. Change one switch, restart Decky, and confirm the preference persists and music still plays.
6. Check alphabetical LB/RB navigation for the nine Quick Menu pages and six Full Manager sections, including after restoring saved page preferences.
7. Verify the refreshed Home welcome appears only once for **4.6.1**, its Continue button is focused, and it does not block the Quick Menu.
8. Verify active banner version contrast on both light and dark CSS Loader themes; confirm switches still light up quickly without flashing.
9. Verify B to exit, controller focus/scrolling, sleep/resume, ResonaDeck interoperability, crossfade and playlist management.

Automated checks: `node --check dist/index.js && node tests/gtm_461_navigation_menu.cjs && python3 -m py_compile main.py`.

## Packaging
Build from the SHA-256 verified **4.5.8** published installer, replacing only the frontend runtime and versioned metadata. This preserves the executables missing from GitHub's ordinary source archive. If a separate 4.5.9 release exists outside the public repo, reconcile it before public 4.6.1.

The branch and artifact must **not** be labeled Stable or merged into main without physical verification.
