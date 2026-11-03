# GTM 4.0.9 Private Test | Smooth Visualizer Performance

This is a focused visualizer-performance update over the user-tested GTM 4.0.8, not an audio or feature redesign. ResonaDeck 1.3.5 remains unchanged.

## Improvements
- Replaces GTM 4.0.8's fixed 45-ish FPS scheduling with refresh-aware rAF pacing. At 60 Hz target 60 frames; at 90 Hz choose 90 for light scenes or 45 for medium scenes, never 60 uneven frames on a 90 Hz display. Includes 40/30 Hz Deck frame cap detection.
- Monitors actual Canvas draw cost. Under sustained load the renderer reduces render resolution to 83%, then 72%, before moving to an economical frame rate. Hysteresis/hold times prevent rapid changes.
- Removes an expensive full-canvas CSS drop-shadow filter; each visualizer retains its own colorful Canvas glow effects.
- Smooths the 12-band PCM data between packets so color/shape animation no longer visibly steps at the audio telemetry update frequency.
- Avoids scanning Steam menus when GTM itself changes the opacity of its visual-transition overlay.
- Adds estimated drawing FPS, sampled display refresh, average render time and render-quality tier to the existing **Visualizer audio diagnostics → Capture JSON** report. To share: Steam Deck Desktop Mode → Desktop/GTM/GTM-visualizer-diagnostic-....json.

## Unchanged behavior
- Existing AudioEngine and crossfade, Plex audio focus, GTM Ambient fallback and ResonaDeck bridge remain unmodified.
- All 22 visualizers, imported packs, scene shuffle, 520 ms fade and stable canvas keys remain.
- Preserves saved settings and audio library. No new FPS settings or extra overlays.

## Verification
- Offline syntax checks and 11 focused/integration regression suites passed; exact audio engine, ResonaDeck shuffle transport and focus ownership blocks match 4.0.8.
- A simulated refresh governor passed tests for 30,40,60,90 Hz and quality fallback. Real frame rates and smoothness still require Steam Deck testing.

## Hardware test
Install as a manual Decky plugin ZIP over 4.0.8. Keep ResonaDeck 1.3.5 and its working analyser fallback. Play ResonaDeck music and view visualizers on Home: Starlight Nucleus, Prism Skyline, Sakura Tempest, Beat Pinball, Disc Prism XL. Compare visual smoothness; let Shuffle All change tracks, then pause/resume ResonaDeck to confirm Ambient recovers. If stutter persists, create a diagnostics JSON while the footer is visible and share it. If needed, use the 4.0.8 installer to roll back.

**Private test; not published to GitHub.**
