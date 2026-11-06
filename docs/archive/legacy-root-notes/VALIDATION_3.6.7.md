# Game Theme Music 3.6.7 Validation

- PASS — frontend JavaScript syntax
- PASS — backend Python compilation
- PASS — package/plugin JSON
- PASS — Local Import uses a new `gameart_import_v367_*` cache identity so broken prior cached results cannot overwrite newly resolved artwork
- PASS — Local Import waits for its dedicated resolver before falling back to generic hero candidates, removing the one-frame hero flash/swap race
- PASS — notification presentation identity is separate from Store playback identity
- PASS — native Steam Store CEF visibility can override a stale plugin-Store route for notification presentation
- PASS — mini-player metadata refreshes while Store audio continues so Store-surface changes are observable without restarting audio
- PASS — Store playback rules are otherwise unchanged

Hardware gates: Local Import should no longer flash then turn black; native Steam Store should emit one Now Playing ribbon when it becomes the visible Store surface, while QAM/update adoption of the same surface remains deduplicated.
