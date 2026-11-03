# GTM 3.8.4 PRIVATE Preview — Reactive continuity and bass-driven buildings

**Do not publish.** Based on private 3.8.3. The public stable GTM 3.7.0 remains unchanged.

## Targeted regressions

1. **Disconnected audio:** Captured streams that remain live but yield silence now recover with a bounded exponential backoff rather than permanently stopping after two attempts. Analyser status is reset for the next song, and recovery is passive: GTM's audio transport is never restarted or routed through an AudioContext.
2. **Visualizer bootstrap and Decky handoff:** The footer observes Media Bridge instance replacement and missed telemetry. It binds automatically on initialization and after a bridge-ready event, without requiring a Next/Previous visualizer selection.
3. **Prism Skyline:** Layered buildings raise and lower with bass and kick transients as strongly as an equalizer, while preserving city silhouettes and windows. All geometry remains inside the Home footer.

## Physical Steam Deck tests required
- Install a new preview over the previous plugin while music is playing: observe audio continuity and automatic reconnection of the footer, without pressing Next. Because Decky controls the update's mount/unmount lifecycle, perfect visual continuity during installation isn't guaranteed; it should recover automatically afterward.
- Start music when footer is already selected. Verify animation starts with no manual scene change.
- Let Ambient tracks auto-advance at least five times and manually skip five times. Verify signal follows each new track without freezing. Repeat with quiet passages.
- Check aggressive Skyline movement with a bass-rich track; test that neither menus nor game cards are obstructed.
- Visualizer Off should keep music playing while stopping capture, and re-enabling must rebind.

**Limits:** Audio capture can be unavailable or restricted on certain providers/Steam builds. No fake audio beats are shown when input cannot be captured. The browser tests are not physical Steam Deck validation.
