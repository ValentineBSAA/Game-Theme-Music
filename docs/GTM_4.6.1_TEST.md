# Game Theme Music 4.6.1 TEST

**Status:** Private test build. Do not publish as Stable until physical Steam Deck verification.

## What changed
- **Library Context Menu** now has only the three GTM-owned visibility switches: Change Music, Change Ambient Music Playlist, and Change Store Music Playlist.
- Each shortcut can be hidden independently. All default ON; existing 4.6.0 selections persist.
- Removed the experimental options for TitleDeck, Change Artwork and Developer and removed the code that filtered those external menu items.
- All nine Quick Menu pages are now alphabetical, preserving their original IDs and LB/RB navigation.
- A collapsed **Browse all pages · A–Z** button reveals a 3×3 controller-friendly jump list for direct navigation.
- The version-specific one-time Steam Home welcome explains the 4.6.1 changes.
- Preserved the 4.6.0-tested fast, nonflashing ON/OFF lighting and improved the actual banner version badge in both light/dark adaptive themes.

## Tested before this build
Developer physically verified in GTM 4.6.0 that independently hiding/showing GTM menu entries works in mixed combinations and that the Quick Menu switches no longer flash. That verifies the underlying feature, **not** all changes in 4.6.1.

## Physical Deck checklist
1. Install 4.6.1 over the test version without clearing settings.
2. Check all three visibility settings persist, including mixed OFF/ON combinations after reopening game context menus.
3. Confirm TitleDeck, Change Artwork and Developer entries behave exactly as their own providers intend, even if previously disabled in 4.6.0.
4. Browse the nine pages with LB/RB and check alphabetical order: Ambient, Arcade Spectator, Game Card Music, Health, Music Library, Now Playing, Settings, Store Music, Visualizers.
5. Expand **Browse all pages · A–Z**, use a controller to jump to Health or Settings, then verify B and LB/RB still work.
6. Confirm the new one-time welcome appears on Steam Home and the Continue action can be activated with A/Cross.
7. Check the banner version text in both a dark and light CSS Loader theme, including focus.
8. Check GTM audio, playlists, ResonaDeck integration and sleep/resume remain unchanged.

**Build base:** last public verified V4.5.8 ZIP plus 4.6.1 changed runtime files. Any unpublished 4.5.9 work must be reconciled before promoting 4.6.1 to public Stable.

**Install source:** use the named 4.6.1 test ZIP from the successful Actions workflow artifact, not GitHub's auto-generated source ZIP.
