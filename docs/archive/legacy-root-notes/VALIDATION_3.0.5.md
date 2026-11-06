# Game Theme Music 3.0.5 validation

Baseline: 3.0.4 Theme Accent + Health + Navigation Fix.

## Intended changes
- Cache/apply the verified adaptive palette before first paint.
- Preserve learned CSS Loader interaction accent across rescan events.
- Rebuild Ambient/Store multi-track selection as Playlist Workshop.
- Add stable ordering, library filtering, bulk Add Visible/Clear/Reset, and status cards.
- Add Music Library intelligence summary.
- Re-theme and reorganize per-game playlist action cards.

## Regression contract
The AudioEngine, game ownership rules, Ambient/Store controllers, physical LB/RB page handling, STEAM media chords, Desktop Mode hard block, non-Steam handling, Media Bridge, yt-dlp and QuickJS binaries are not intentionally changed.

## Static validation
Run JavaScript syntax check, Python compile, JSON parse, archive integrity, and binary hash comparison against 3.0.4. Hardware validation remains required for Decky focus navigation and CSS Loader rendering.
