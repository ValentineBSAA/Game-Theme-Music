# GTM 3.7.10 Retro Ambient — private preview

**Based on:** GTM 3.7.9 Home-only safety hotfix (not the unsafe 3.7.8 fullscreen build).

## Design

Inspired by the feeling of Winamp AVS and Windows Media Player Alchemy/Ambience, not copies of their original implementations. CPU Canvas2D only, bounded resolution and adaptive 45/30 FPS. The audio input remains the passive existing GTM Media Bridge telemetry; no changes to audio transport or cross-plugin focus.

## Ten presets

Ambient Light, Alchemy Rings, Silk Ribbons, Plasma Bloom, Neon Oscilloscope, Starlight Trails, Classic Spectrum, Prism Skyline, Pulse Engine, and Arc Reactor. Off is separate. Older modes are migrated to their closest new equivalents.

## Safety constraints

Home screen only, no full-screen Showcase, no WebGL creation, canvas is pointer-events none, suppress under Steam context menus and Quick Access, never cover library game cards, automatic cleanup on unmount, setting persists by existing Settings layer, CSS theme matching and manual palettes remain available.

## Test matrix to complete on hardware

- Confirm Decky shows version 3.7.10, setting Off, and migration from 3.7.8 visualizers.
- Test all ten presets with Ambient Home music, silence and strong kicks.
- Open and close Steam game context menu: footer hides and returns.
- Test CSS Loader light/white footer and Blend Ambient/High Contrast; confirm controller prompts remain usable.
- Confirm settings persist after reboot, B navigation is unaffected, ResonaDeck audio focus remains correct.
- Test performance on OLED/LCD with and without CSS theme, sleep/wake, and selected network/local music sources.

Do not advertise as physically verified until this matrix is tested on the target Deck.
