# Game Theme Music 4.0.4 · Public Beta Candidate RC3

**Private Steam Deck test build. Do not publish until hardware verification.**

## Results carried forward from RC2
- 8-second prebuffered crossfade preserved without changing the engine.
- Unlimited playlists and separated Ambient/Store/Game music remain untouched.
- All 12 original visualizers remain, plus ten Volume 1 scenes.
- ResonaDeck telemetry bridge remains passive/read-only.
- Music Reactive / Dynamic Spectrum remains the default for new users.

## Fixes requested after RC2
1. Neon Pong and imported Petal Pong: removed two connecting lines. The ball now has
   independent, persistent physics, reflection from bounded surfaces and paddles,
   per-frame motion and short trailing afterimages; track clock jumps and bass
   fluctuations cannot teleport it.
2. Add-on selection: imported packs now refresh both settings dropdowns; imported
   scenes appear in a dedicated scene selector for immediate activation, using the scoped persisted settings updater.
3. Beat Pinball: targets are collision-sensitive and disappear on hit, flash briefly,
   and respawn at a different deterministic location as their level advances.
4. Supernova Bloom was rebuilt as **Chromatic Event Horizon**, with a luminous
   panoramic accretion disk, spectral orbits, and bright details for dark Steam
   footers. The internal scene/effect ID remains unchanged for saved settings and
   older add-on compatibility.
5. Kept working Sakura Tempest, Tidal Bloom, CRT Pulse, Liquid Chrome, Disc Prism XL,
   Seismic Mountains, Mechanical Iris and Classic Spectrum/Prism Skyline intact.

## Planned separately
- Car racing / tile city scene stays deferred for a future **importer test pack**.
- Full ResonaDeck audio-driven visualization requires a matching ResonaDeck update.

## Technical details
The canvas renderer has a per-canvas WeakMap clock, keyed by selected scene.
Frame deltas are capped at 45 ms to avoid teleporting when the Deck/overlay is
inactive. Pong velocity and trail states persist across frames, and are isolated
by layer index. Replacing the whole music transport is not required.

The pack registry stores scene IDs for each pack. Both settings views subscribe
to `gtm:visualizer-packs-changed:v1` and remount their dropdown options on refresh.
The visualizer pack manager also exposes `Imported scene · select to preview`.
The backend still accepts only a safe declarative root `manifest.json` in ZIP files;
unknown effects and executable scripts remain blocked.

## Suggested hardware test on Steam Deck
1. Let multiple songs crossfade naturally. Verify no playback regressions.
2. Select Neon Pong for at least one full song and watch for ball teleports,
   disconnected lines, missing paddle hits or boundary escape.
3. Import the included Remix Demo ZIP and select Petal Pong; confirm it appears
   immediately and continues moving smoothly as songs switch.
4. Open Beat Pinball and watch several bumps disappear, flare, then reappear in
   different positions.
5. Inspect Chromatic Event Horizon with a dark footer and Music Reactive color,
   then test on bright CSS themes and in compact/tall footer settings.
6. Verify Sakura, Tidal Bloom, Disc Prism XL and the other known-good scenes.
7. Exercise pack remove/re-import and confirm setting persistence after restart.

## Test limitation
Offline regressions cover JavaScript/Python syntax, importer behavior,
scene rendering with mocked Canvas, deterministic motion and playback guardrails.
They are not a physical Deck performance/appearance benchmark.
