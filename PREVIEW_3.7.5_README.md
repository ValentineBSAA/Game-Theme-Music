# Game Theme Music 3.7.5 PREVIEW | Premium Live Footer

**Experimental Steam Deck / Decky preview, not stable.** Latest stable public release is [GTM 3.7.0](https://github.com/ValentineBSAA/Game-Theme-Music/releases/tag/V3.7.0). The preview does **not** alter the stable release or its download.

## What's in this single build
- 13 distinct visualizers: Spectrum, Wave Ribbon, Sci-Fi, Tunnel, Aurora, Helix, Skyline, Orbit, Bass Floor, Pulse Engine, Prism, Arc Reactor, and **Holographic Dragon**. Each uses separate geometry instead of sharing the same 3D mode under another name.
- Four live-footer foundations: Glass, Holographic Trench, Framed Rail, and Projected Platform.
- Compact footer heights of **66/84/104 CSS px**, additionally capped to 12vh, to keep the effect below game cards.
- Footer disappears during visible Steam menus/dialogs and Quick Access. The overlay does not accept controller or mouse input.
- Auto CSS accent sampling, manual palettes, Blend/Dominate, brightness, reactivity, bass impact and height settings retained.
- **Improved real-audio response:** 2048-point FFT, faster analyser response, adaptive bass-weighted spectral flux and amplitude/transient onset detection. No invented beats or synthetic rhythm during unavailable/silent audio.
- A read-only audio-tap recovery check for SteamOS audio stream readiness/suspend. The music transport and ResonaDeck audio focus are unchanged.
- Renderer aims for 60fps, adaptively reduces to ~30fps when expensive, and rebuilds graphics if WebGL context was lost. Independent hardware measurement is required.

## Try it
1. Install **Game-Theme-Music-3.7.5-PREVIEW-PREMIUM-REACTIVE.zip** via Decky manual ZIP installation.
2. In **GTM → Settings → Interface & Feedback**, enable the **Home reactive visualizer**, pick a style (try Pulse Engine or Holographic Dragon), then adjust base, palette, strength and Blend/Dominate.
3. Start Ambient Home music. It must stay within the footer, vanish for menus and reappear after closing them.
4. Compare a bass-heavy track, quiet song, and a track with a silent section. The animation should follow real transients; not simply bounce on a timer.

## Preview safety
- The setting defaults **OFF** for newcomers; prior preview preferences may persist.
- No new song metadata widget. Existing mini-player HUD toggle remains independent.
- The system does not capture game audio, only GTM's own captured music stream when browser audio capture is available.
- If the browser cannot expose a usable audio stream, the effects must settle rather than pretend to detect beats. This is a limitation, not a playback failure.
- These effects are not yet physically verified in GTM 3.7.5 on your OLED Steam Deck. CSS Loader themes and SteamOS versions must be tested.
- Roll back to 3.7.3 Preview or 3.7.0 Stable if required.

## Technical notes
- Package derives from the 3.7.4 premium preview, itself a derivative of the 3.7.3 test build. Bundled third-party helpers and music backend remain as before apart from version metadata.
- No code from projectM, Butterchurn, CAVA or audioMotion is bundled. Their publicly discussed visualizer techniques were research references only.
- AnalyserNode behaviour: https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/smoothingTimeConstant
- Animation frame pacing: https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame
- See PREVIEW_3.7.5_TESTS.md for tests completed and the hardware checks still required.
