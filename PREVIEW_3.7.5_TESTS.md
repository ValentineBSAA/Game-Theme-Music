# GTM 3.7.5 Preview: validation and hardware checklist

## Static/package checks (automated)
- JavaScript and Python syntax
- ZIP CRC, all unique paths, version parity
- No change to third-party helper binaries
- WebGL 2D fallback rendering of all 13 distinct visualizer modes
- Silent/strong-bass visual differences
- Visible menu detection and dismissal
- Real-only onset algorithm isolated test with synthetic frequency bands

## Pending physical Steam Deck checks
- Confirm actual version 3.7.5 and persistence across a reboot.
- Verify styles stay strictly in the footer with the installed CSS Loader theme, including real game and non-Steam tiles.
- Context menu, library dropdowns, Quick Access and modal dialogs hide visuals immediately and restore afterward.
- Verify 13 distinct looks, including Holographic Dragon, and visually stable WebGL after suspend/resume.
- Verify bass kicks versus cymbals, low-intensity material, and silent sections; do not assume real capture from synthetic tests.
- Test game/Store/Ambient playback, local imports, playlists, controller focus, GTM mini HUD, ResonaDeck coexistence and Decky reload.
- Watch frame pacing and battery performance during longer Ambient sessions; compare Blend and Dominate.
- Record exact SteamOS, Steam Client, Decky Loader, OLED/LCD and CSS Loader version/theme.

**No hardware verification is claimed until the developer physically tests this ZIP.**
