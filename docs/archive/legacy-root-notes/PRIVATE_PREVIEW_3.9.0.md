# GTM 3.9.0 PRIVATE PREVIEW: Faster Ambient Transitions

No GitHub release. The user requested a whole milestone version (3.9.0).

## Why

Physical Steam Deck testing of 3.8.10 confirmed the CORS fix and smooth footer fade but observed about 10–15 seconds of silence from track end until the next song begins. Before 3.9.0, Ambient playback began resolving the next song *after* the current one stopped. Slow local lookup, provider resolution, or media startup could therefore create dead air.

## Changes

- Prepare the **next known Ambient track URL** while the current song is still playing. Supports cached local files and provider-based sources. Prefetch is metadata/URL only; no secondary audio player and no large Blob download.
- At natural or manual track advancement, use the matching, unexpired prepared URL. Do not reuse it after a playlist reorder/change; refresh after 3 minutes.
- Keep the same 3.8.9 CORS settings and 3.8.10 footer transition smoothing.
- Export the last 12 anonymous Ambient transition timings under `ambientTransition` in Desktop/GTM JSON diagnostics, including whether the next track was prepared, URL resolution ms, load ms, first playing ms, and source category. No URLs or titles.
- Maintain original audio transport priorities, game-focus rules, playlist navigation and Decky update continuity.

## Physical Steam Deck acceptance

1. Play Ambient music and allow a normal track handoff after at least 5 seconds of playback so GTM can prepare its next URL.
2. Observe whether the 10–15 second gap improves. Test 5 automatic advances including both cached and provider tracks if available.
3. Verify the footer is smooth and the visualizer reacts to each new song.
4. If a gap still occurs, open GTM Settings → Interface & Feedback → Capture JSON and share the JSON; `ambientTransition` isolates URL resolution time from HTMLAudioElement startup.
5. Try manual Next, Pause/Resume, Off, menu open/close and a Decky update to ensure continuity.

This is code-validated only, not physically verified on Steam Deck. Source playback may still take time for network/decoder reasons, which the timing log can distinguish.
