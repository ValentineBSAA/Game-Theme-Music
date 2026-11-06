# Validation — 3.4.8

Static release checks:

- JavaScript syntax passes Node `--check`.
- Python backend compiles with `py_compile`.
- `package.json` and `plugin.json` parse and report 3.4.8.
- Game-tab preview calls `local_audio_url` before provider resolution.
- Edit Track preview calls `local_audio_url` before provider resolution.
- Main game-track A action calls Preview, not Set Active.
- Set Active remains an explicit secondary action.
- Track card status distinguishes ACTIVE and PREVIEWING.
- Update ledger is included in the plugin archive.
- 3.0.7 live-theme / adaptive-theme / physical-LB-RB source blocks match the locked baseline.
- `main.py`, yt-dlp, and QuickJS are unchanged from 3.4.7.
- ZIP integrity test passes.

Hardware validation still required for exact Deck focus geometry and local-preview startup feel.
