# Non-Steam timing fix — 2.7.22

The 2.7.21 hardware success proved shortcut detection and media fallback. The remaining 10–15 second delay came from resolving a fresh YouTube CDN URL through yt-dlp on every remote-only shortcut visit.

2.7.22 keeps 2.7.21 behavior and adds:

1. Expiry-aware resolved URL cache in the backend.
2. Single-flight resolution so startup warmup and a page visit share one yt-dlp job instead of launching duplicates.
3. Lean `yt-dlp -g` direct URL extraction.
4. Background prewarming of the selected track for configured non-Steam shortcuts.
5. Automatic materialization of the first successful remote resolve into Download Storage.
6. Immediate Ambient release when a configured shortcut theme is recognized.

The intended steady state is local loopback playback on subsequent visits and subsequent plugin starts.
