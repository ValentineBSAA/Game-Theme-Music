# Game Theme Music 3.0.0 — Adaptive UI Architecture

Game Theme Music 3.0.0 separates the presentation layer from the proven 2.9.12 playback engine.

## Adaptive Theme Intelligence
GTM does not identify CSS Loader themes by package name. When the Quick Access panel is open it reads computed colors from the currently rendered Steam/Decky host, samples nearby surfaces and controls, derives a semantic palette, checks contrast, and writes GTM-only CSS variables. A debounced MutationObserver rescans when Steam theme classes/styles change.

The generated palette includes background, raised surfaces, primary/secondary/muted text, accent/focus, borders, success, warning, danger, and text-on-accent. Primary text is corrected to at least roughly WCAG AA 4.5:1 against GTM surfaces; the diagnostic card exposes the measured primary contrast ratio.

The adaptive system is presentation-only. It never changes CSS Loader, Steam theme files, Steam Input, or audio ownership. If disabled or sampling fails, GTM uses its internal dark fallback palette.

## 3.0 pages
- **Now**: active Game/Ambient/Store owner, artwork, state, transport, Up Next, master volume.
- **Game**: per-game defaults, provider search preference, fades, shuffle/loop behavior, STEAM-button controls, direct App ID route.
- **Ambient**: existing 2.9.12 Ambient controller and playlist workshop.
- **Store**: existing dedicated Store playlist/controller.
- **Library**: downloaded/imported audio and assignment actions.
- **Settings**: adaptive appearance, HUD, notifications, storage, maintenance, safe mode, backups.
- **Health**: existing integration diagnostics plus adaptive-palette diagnostics.

## Compatibility contract
3.0.0 intentionally preserves the working 2.9.12 audio engine and backend behavior. The major-version change is an interface architecture change, not a playback rewrite.
