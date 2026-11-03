# GTM 3.8.3 Private Preview: Audio-reactive recovery and Skyline Bass

Private only. Does not change public GitHub stable 3.7.0.

- Audio telemetry now rebinds on real audio source changes even when the HTML Audio element is reused.
- Handles ended capture tracks, failed initial capture, and stuck zero-valued analysis with bounded retry and cleanup. No audio playback start/stop or track-resolver changes in this patch.
- Reconnects on supported audio lifecycle events, with timed retries only while someone subscribes to telemetry.
- Prism Skyline buildings physically rise/fall on bass and onset events, and rooftops glow on strong beats. Classic Spectrum remains a separate style.
- All music source, playlist and auto-advance behavior is otherwise preserved from 3.8.2.

## Required Steam Deck tests
1. Automatic Ambient track 1→2→3 with one visualizer enabled. Verify animation resumes each time without scene change.
2. Repeat with manual Next and Previous, another scene, visualizer Off, and multiple audio sources.
3. Silence/quiet passage: prevent infinite analyser restart loops; Off removes telemetry subscriptions.
4. Watch Skyline buildings rise on bass kicks; confirm menus hide footer and game cards remain unobscured.
5. If any stall persists, collect diagnostics and compare transport without the visualizer. Do not make this public without Deck testing.

## Screenshot gallery
The companion 3.8.3 gallery is generated from exact Canvas2D rendering code with SIMULATED audio. It is promotional reference artwork, not physical Deck screenshots.
