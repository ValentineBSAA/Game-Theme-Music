# Game Theme Music 3.5.1 — Continuity + Artwork Reliability

- Rebinds the replacement Python backend to the loopback audio URL already owned by Chromium during an update, preserving the same Audio element, src, and currentTime.
- AudioEngine reattaches controller callbacks/options during the update handoff instead of pause/remove-src/load.
- Persists the Now Playing notification identity across the short replacement window to avoid duplicate same-track notifications.
- Actively backfills local notification artwork and updates an already-visible ribbon when cached art arrives.
- Adds local Steam library/custom-grid artwork discovery for native and non-Steam shortcuts, plus broader Steam CDN fallbacks.
- Uses a wider hero crop in Soundtrack Manager.
- Shrinks the GTM banner and returns page changes to the banner/top instead of scrolling content underneath it.
- Preserves 3.5.0 search paging/R2 search and the 3.0.7 live-theme/audio behavior outside update handoff.
