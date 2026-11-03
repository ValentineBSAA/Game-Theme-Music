# Game Theme Music 3.1.0 Validation

Static validation completed for this release:

- `dist/index.js` passes `node --check`.
- `main.py` compiles with Python.
- `package.json` and `plugin.json` parse successfully.
- 3.0.7 live-theme bootstrap remains present and the root is never hidden while detecting a theme.
- No stale theme-palette read path was reintroduced.
- Physical LB/RB constants remain 30 / 31.
- Ambient/Store Playlist Studio uses stable rows and staged ADD / REMOVE intent.
- Per-game Playlist Studio is mounted inside the same live-theme runtime.
- Per-track start/end/fade fields and AudioEngine end-boundary support are present.
- Smart Playlist Suggestions, known-config playlist coverage, and Music Library filters are present.
- `main.py`, `bin/yt-dlp`, and `bin/qjs` are byte-for-byte unchanged from 3.0.7.

This is static validation only. Steam Deck hardware testing is still required for controller focus, Decky modal behavior, CSS Loader interaction, and real playback timing.
