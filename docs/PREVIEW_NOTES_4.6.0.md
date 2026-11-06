# Game Theme Music 4.6.0 Preview (testing only)
Developer: Valentine

This is an EXPERIMENTAL Steam Deck test build based on the published, checksum-verified GTM 4.5.8 installer. It does not replace the stable installer and is not yet approved for public release.

## Changes
- Three separate Steam Library game context-menu visibility switches under GTM > Settings > Steam Library Context Menu:
  - Show Change Music
  - Show Change Ambient Music Playlist
  - Show Change Store Music Playlist
- All three default to ON for existing installations. Turn OFF to hide a shortcut without disabling the corresponding player, deleting playlists, or changing stored music.
- Faster ON/OFF illumination response (55 ms) and a smaller glow, respecting reduced-motion preferences.
- Improved version badge contrast in the large artwork banner and Quick Menu header using the live Steam/CSS Loader theme's accent + on-accent color pair.
- All UI preferences are stored through the existing serialized settings queue.
- TitleDeck's Developer and Change Artwork entries belong to TitleDeck, not GTM. This GTM build does NOT remove or change menu items owned by other plugins.

## Test steps
1. Back up your current Decky plugin configuration and install the preview ZIP manually.
2. Open GTM > Settings > Steam Library Context Menu.
3. Turn OFF one GTM shortcut and close the settings panel.
4. Open a Steam or non-Steam game's context menu and check that ONLY the selected GTM entry is gone.
5. Try all three OFF, then switch them back ON. Check other plugin entries, especially TitleDeck, remain intact.
6. Restart Decky and Steam Deck, and confirm the three preferences persist.
7. Verify Ambient, Store, and game soundtrack playback still function while their menu shortcuts are hidden.
8. Change between dark/light Steam or CSS Loader themes: check header/banner version labels and switch lighting/contrast.
9. Try a PS4 or Xbox controller: focus, D-pad, B dismissal, and LB/RB paging must keep working.
10. Check Quick Menu opening time, no duplicate menu items, and GTM/ResonaDeck cooperation.

## Build source
This is a public repository, so the preview branch and Actions artifact are visible on GitHub; this is **not** a private distribution channel. Only the GitHub preview branch `preview/4.6.0-context-menu-controls` is modified. The packaging workflow downloads the original 4.5.8 official release ZIP, validates its SHA-256, and overlays the preview runtime and matching metadata. It uploads a 4.6.0 Preview test ZIP as a GitHub Actions artifact, NOT an official GitHub Release. GitHub Actions artifacts expire after 14 days.

## Verification
Automated syntax and injection tests do not replace physical Steam Deck testing. No claims of hardware compatibility or an official 4.6.0 Stable release are made here.
