# GTM 3.8.7 PRIVATE preview: captured-track reuse regression

**Do not publish. Physical Steam Deck testing required.**

Steam Gaming Mode can leave an HTML audio element playing while captureStream does not replace its MediaStreamTrack. Earlier GTM builds unconditionally retired the previously captured track when audioEngine.generation changed. That could leave the visualizer permanently disconnected, even if the still-live captured track carried valid music samples.

## Changes
- Preserve an existing, running analyser across a song generation change if its captured track remains present, live and unmuted.
- Prefer a newly added audio track when captureStream does replace one.
- After 750 ms, allow re-probing a still-live retired track instead of blacklisting it forever. Actual FFT data, not a timer, determines whether the signal is healthy.
- Preserve passive capture; do NOT reroute GTM playback through Web Audio or change track selection.
- Expose source-generation and capture-liveness diagnostics via `window.__GTM_AUDIO_CAPTURE_DIAGNOSTIC__` (no URLs or titles), **plus Settings → Interface & Feedback → Visualizer audio connection → Check audio signal** in both settings layouts.
- After multiple seconds of truly silent PCM while playback progresses, discard the old capture stream entirely and reacquire a fresh one, with controlled backoff. This does not change the playing audio element.

## Acceptance gates
- Natural track end -> next song -> visualizer resumes without touching controls, across >= 5 songs.
- Manual skip, repeat and pause/resume.
- Scene switch after song change, no permanent loss of analyser.
- Footer Off continues Ambient playback, no analyser resources.
- Decky update: music continuity survives; visualizer may disappear during reload and should reacquire if browser capture permits.
- If Steam Chromium does not offer capturable audio for the new song, diagnostics must show absence, not pretend to have music signal.

This is a targeted candidate and not an assertion that all Steam Deck capture implementations are fixed.
