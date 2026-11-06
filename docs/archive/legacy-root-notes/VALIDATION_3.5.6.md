# Validation — Game Theme Music 3.5.6

## Static checks

- `node --check dist/index.js`
- `python -m py_compile main.py`
- `plugin.json` parses as JSON
- `package.json` parses as JSON

## Regression protections

- Notification artwork remains on the 3.4.8 direct-thumbnail path.
- 3.5.4 artwork-backed Import destination panel remains present.
- 3.5.5 continuing yt-dlp search remains the search baseline; 3.5.6 only increases the honest discovery ceilings/status model.
- No new global D-pad/left-stick listener was added. Import uses Decky-native `onGamepadDirection` only on the currently focused control, with `flow-children="column"` for vertical groups.
- File rows explicitly move Right into the Import Queue and queue rows explicitly move Left back to Available Files; impossible lateral moves are consumed instead of leaking vertically.

## Hardware gates

1. Play a downloaded/local Store, Ambient, or game-theme track. Install 3.5.6 over the prior build and verify position does not jump to zero.
2. Back through Steam Store pages and verify the same Store track is not restarted or duplicated on intermediate routes.
3. Open Import and verify Music is the initial folder.
4. Verify local files appear inside Soundtrack Manager without Decky's single-select file picker.
5. Preview a focused file, queue several tracks, import them to Library, then repeat with Import + Add.
6. Verify Up/Down stays vertical and Left/Right is reserved for horizontal rows/columns.
7. Run a broad YouTube search beyond 200 results. True provider exhaustion must say all available results are loaded; safety ceilings must say more may exist.
