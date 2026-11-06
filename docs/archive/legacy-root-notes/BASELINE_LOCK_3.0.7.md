# Game Theme Music 3.0.7 Baseline Lock

All releases after 3.0.7 must preserve these verified Steam Deck behaviors unless a later hardware test explicitly replaces them:

- Live CSS Loader / Steam theme sampling on mount. Never hide the GTM root while waiting for theme detection.
- Never replay a persisted GTM background/text palette from a previous session.
- Physical LB/RB page navigation uses Steam input button values 30 / 31 and the rendered panel's owner document context.
- CSS Loader focus/accent learning remains live and semantic. New UI must use the `--gtm-*` semantic variables rather than hard-coded GTM cyan/navy colors.
- Ambient and Store playback continue to use the existing singleton AudioEngine and ownership rules.
- STEAM-button media controls remain session-armed only.
- Desktop Mode playback blocking, non-Steam support, Media Bridge, mini-player/HUD behavior, and existing game playback ownership remain intact.
- yt-dlp, QuickJS, and the Python backend must not be replaced merely for UI work.

3.1.0 extends the UI and per-track playback options without replacing this baseline.
