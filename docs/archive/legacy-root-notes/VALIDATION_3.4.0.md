# Validation — 3.4.0

The release build is checked for:

- JavaScript syntax (`node --check`).
- Python compilation.
- JSON manifest parsing and package version 3.4.0.
- Synthetic binary `shortcuts.vdf` parsing, including signed-to-uint32 shortcut App IDs.
- Presence of the 3.4 spatial-navigation controller handler.
- D-pad and left-stick digital button mappings.
- No dropdown-based manager navigation for Games / Library / Find / Import.
- No raw `App <number>` title fallback in the 3.4 manager.
- Root width/overflow guards that prevent the RB rail from pushing the viewport sideways.
- Byte-for-byte equality of the protected 3.0.7 live-theme functions and physical shoulder handler.
- Byte-for-byte equality of bundled yt-dlp and QuickJS binaries with the 3.0.7 baseline.
- ZIP integrity.

`main.py` intentionally changes in 3.4.0 to add read-only Steam `shortcuts.vdf` name resolution. Playback/download behavior is otherwise left intact.
