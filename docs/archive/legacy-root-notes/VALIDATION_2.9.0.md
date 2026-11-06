# Game Theme Music 2.9.0 Validation

Final feature-baseline validation completed before packaging.

## Code / metadata

- `dist/index.js` passes `node --check`.
- `main.py` passes Python compilation.
- `package.json` and `plugin.json` parse as valid JSON.
- Backend code is unchanged from 2.8.7 except the release version string.
- Frontend diff from normalized 2.8.7 is limited to Media Bridge v1, its Health Center row, UI-mode state publication, and bridge install/uninstall hooks.

## Media Bridge v1

- Smoke-tested bridge installation and cleanup with a mocked Gaming Mode renderer.
- `window.GameThemeMusicBridge` appears at install and is removed at dismount.
- Protocol reports version 1.
- `getState()` returns the expected Home/idle snapshot in the smoke test.
- State subscribers receive an immediate snapshot and can unsubscribe.
- Audio telemetry subscribers receive an immediate inactive packet and can unsubscribe.
- Ready/state/unavailable events dispatch successfully.
- Audio telemetry is not started without a telemetry subscriber.
- Media Bridge exposes no playback-control methods.

## Install-safe archive

- Bundled `bin/yt-dlp` and `bin/qjs` are ZIP_STORED and Unix executable (`0755`).
- ZIP has no duplicate entries, no symlinks, and no bundled font files.
- Full CRC validation passes.
- Local Decky-style extraction benchmark is approximately 0.03 seconds on the build host.

## Hardware validation still required

2.9.0 intentionally preserves the user-confirmed 2.8.7 playback architecture. On Deck, verify installation, normal Gaming Mode playback, MW/non-Steam playback, Ambient return, Desktop Mode hard silence, Auto-DJ access, and the Health Center `Wallpaper / Media Bridge v1` row. The future live-wallpaper plugin will provide the first end-to-end hardware consumer test of real bridge audio telemetry.
