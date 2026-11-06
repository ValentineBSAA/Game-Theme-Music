# GTM 3.8.5 PRIVATE Preview — Automatic Track Capture Recovery

**Do not publish.** Built from 3.8.4. Not hardware-verified.

## Addresses
- After automatic Ambient next track, visualizer sometimes stops until a manual Next/Previous or scene change.
- Bridge now validates the *actual* audio currentSrc and AudioEngine generation, waits for media readiness and clock advance before connecting, and treats muted/ended capture tracks and prolonged silent analyser input as recoverable errors.
- Backoff is enforced even after retiring a bad session. This avoids immediate recapture of the same stale stream.
- A stalled sampling timer can be recovered by the demand-driven bridge watchdog.
- No changes to track selection, music playback, user playlists, mini HUD or Canvas visualizer geometry.

## Physical Deck acceptance
1. Install over 3.8.4 without touching playback controls; visualizer should return after Decky reload.
2. Play 5+ automatic Ambient song transitions with visualizer on, then switch songs manually.
3. Verify all transitions recover without pressing scene controls. A short pause in animation while the new track buffers is expected, but not a permanent freeze.
4. Verify silence is correctly calm and does not lead to repeated aggressive capture attempts.
5. Verify music continues even when visualizer is turned off, and that disabling the visualizer stops capture.

## Note
Some Steam Chromium/DRM audio sources may not expose capturable audio. Recovery only works when a fresh capturable audio stream becomes available. Media element playback is never routed through Web Audio nor restarted by this patch.

## AudioContext continuity fix (critical)
A single AudioContext is now reused across automatic track changes. Only the captured MediaStreamSource is replaced, avoiding automatic creation of a brand-new AudioContext from an `ended` event that Chrome may suspend until another user gesture. Context is closed only when the last visualizer telemetry subscriber leaves or the bridge is uninstalled. Also reject sources when `audio.src` and `audio.currentSrc` disagree.
