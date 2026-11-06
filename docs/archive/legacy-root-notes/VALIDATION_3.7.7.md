# GTM 3.7.7 Preview: Curated Visual Worlds validation

## Package
- Preview version is 3.7.7 across bundled JS, Python backend fallback, and package metadata.
- Based on 3.7.6 Living Scenes preview; existing transport and bundled third-party executables unmodified.
- Ten curated scenes + Off: Living Starfield, Solar Orrery, Living Particle Orb, Sonic Nebula, Liquid Light, Bass Floor, Pulse Engine, Prism City Skyline, Holographic Dragon, Arc Reactor.
- Old saved modes map to supported alternatives (e.g., Wave Ribbon -> Liquid Light, Ringed Planet -> Solar Orrery). Off stays Off.

## Local validation October 29, 2026
- JavaScript and Python syntax: PASS.
- 10/10 mode selection and rendering via headless browser Canvas fallback: PASS.
- Browser JavaScript runtime exceptions: NONE in scene test.
- Context menu visible / removed detection: PASS.
- Renderer image previews captured with simulated high-energy audio; they are not physical Steam Deck images.
- Timed browser draw median of 30 samples per mode at 1280x800 viewport: 0.1-3.7 ms for most modes; Prism City Skyline p95 9.1 ms. These are *environment-only measurements*, not Steam Deck FPS.
- Off and retired preference migration sample tests: PASS.
- Unchanged binary bundles: ZIP comparison verifies all files except modified five and added preview docs are byte-identical to 3.7.6.

## Not hardware verified
- SteamOS 3.9.5, exact CSS Loader visual stacking, physical OLED FPS, GPU context reinitialization and long-run resource usage, actual music-reactive synchronization, controller navigation with every theme, settings survive Deck restart.
- The five new scenes use 3D coordinate projection onto Canvas for compatibility, not a large imported 3D engine. The footer remains compact rather than full-screen.

This is an experimental ZIP. Do not promote to stable until Steam Deck hardware verification.
