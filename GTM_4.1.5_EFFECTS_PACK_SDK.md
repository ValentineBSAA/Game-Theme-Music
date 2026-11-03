# Game Theme Music 4.1.5 Preview | Effects Pack SDK v2

> **Developer handoff / source of truth.** 4.1.5 is a private test build, not a public release. The active plugin UI is bundled in `dist/index.js`, with a separate developer-editable behavior module in `src/visualizer-behaviors/runtime-414.js`.


## 4.1.5: Music-Reactive Scenery Engine (read this first)

All ten trusted procedural backdrops support continuous **ambient motion** and music-driven changes. Bass makes environments pulse, midrange changes speed and drift, treble lights fine details, beats add bounded localized highlights, and RMS influences the solid-color breathing glow. These are graphical changes only; championship physics continue to use a fixed-step 90 Hz clock.

**Pong Studio → Music-reactive scenery**: Off (still animates ambient scenery), Subtle, Balanced (default), Dynamic. When playback is paused, all music-derived values go to zero while the scene's independent slow animation continues. No full-screen flash is permitted. The new renderer paints the opaque scene first, so canvas resets should not expose the white browser background.

Add the following optional `background` block to any **format 2** scene in its JSON pack manifest:

```json
"background": {
  "style": "stars",
  "base": "#100c2e",
  "accent": "#d78dff",
  "density": 1.2,
  "motion": 0.65,
  "reactivity": 1
}
```

Styles allowed: `solid`, `arcade`, `storm`, `stars`, `nebula`, `aurora`, `ocean`, `sunset`, `forest`, `city`. Hex colors must use `#RRGGBB`. Density must be 0.3–1.5; motion 0–1; reactivity 0–1.5 (0 disables music influence for this pack scene). Unrecognized fields, scripts, remote assets, invalid colors, and nonfinite values are rejected by `main.py` during import. This is safe manifest data, not imported JavaScript. Existing v1 packs and v2 packs without backgrounds remain compatible.

**Exact source map for scenery:**

- `src/visualizer-behaviors/scenery-415.js` is the trusted canonical procedural scenery renderer. Edit this source to add *new* scenery algorithms.
- `main.py`: update `VISUAL_SCENERIES`, backdrop field validation, and numeric bounds when extending the pack schema.
- `dist/index.js`: `GTM415_SCENERY` frontend allowlist and `gtm404RegisterPacks` sanitize the scene manifest; `gtm404RenderPacked` calls the scenery painter once per visual frame.
- `src/visualizer-behaviors/runtime-414.js`: Pong Studio dropdowns and the common paddle / ball / champion HUD. Backdrop cosmetics must not change `gtm414PongSignature` or reset championships.
- `dist/index.js`: `defaultSettings` and `normalizeSettings` define and validate user controls including `homeReactiveVisualizerPongBgReactivity`.
- **Build sync:** `python3 tools/sync_visualizer_behaviors.py` copies both trusted source modules into the actual installed `dist/index.js` bundle. Do not edit only the source and expect changes to appear in-game.
- **Tests:** `sh GTM_4.1.5_RUN_REGRESSION.sh` checks legacy compatibility, visual differences, all 10 reactive styles, pause behavior, single frame-tick invariant, pack validation and championships. Physical Steam Deck acceptance is still required.

**Critical rendering invariant:** only **one call to `gtm404FrameState(canvas,mode)` per painted frame**. Re-entering the frame-clock function after the background draws can make the 90 Hz Pong simulation appear frozen. Both scene painter and game simulation must share that `frame` object. Keep the existing frame governor and footer-only Canvas2D stage.

**Performance and accessibility:** No independent audio analyzers, fullscreen shaders, white-screen flashes or unrestricted user scripts. Reuse GTM's smoothed audio envelope, cap alpha under .55 for background detail, and keep the high-contrast tournament HUD on top. Default to **Balanced** for reasonable battery / readability; use **Subtle** for low-distraction environments and **Off** for non-reactive scenery.

## Why this architecture exists

An imported ZIP is **content**, not code. A creator can assemble physics scenes, reactive canvases and effects using a constrained JSON manifest. The engine, rendering, safety, and audio ownership stay with GTM. The same engine can produce multiple differently themed Pong arenas and unrelated effects packs without adding duplicate plugins, listeners or media engines.

The frontend renders Canvas 2D inside the existing Home footer; it does not add fullscreen UI, a second audio source, arbitrary JavaScript, remote shaders or unrestricted filesystem access.

## EXACT developer map (open these files first)

| Change | Canonical location | What to edit |
|---|---|---|
| Plugin/backend pack rules, install, remove, persistence | `main.py` | `VISUAL_EFFECTS`, `VISUAL_OVERLAYS`, `_validate_visualizer_pack`, `list_visualizer_packs`, `install_visualizer_pack`, `uninstall_visualizer_pack`. Keep the parser fail-closed. |
| Built-in pack scenes and arena variants | `visualizer-packs/volume1/manifest.json` | Pack v2 manifests. Changes take effect after pack reload. |
| Community pack reference | `visualizer-packs/sdk-examples/manifest-v2.json` | Copy scene entries, change the unique IDs. ZIP must contain ONLY `manifest.json` at root. |
| Trusted behavior/power engine and settings panel | `src/visualizer-behaviors/runtime-414.js` | Register `create`, `step`, `draw`, `signature`, `options` functions. Implement new AI, collisions or real gameplay here. |
| Publish behavior changes into installed bundle | `tools/sync_visualizer_behaviors.py` | Run after modifying `runtime-414.js`. Do **not** assume the stand-alone source is loaded automatically. |
| Pack scene registry, shuffle category insertion | `dist/index.js` | `gtm404RegisterPacks`, `gtm404AllSceneIds`, `gtm404PickShuffledScene`. Shuffle keys off individual unique scene IDs. |
| Shared procedural overlay renderers | `dist/index.js` | `gtm414DrawOverlays`, `gtm414AudioParam`; use a bounded Canvas 2D primitive, avoid per-frame allocations/remote assets. |
| Packed scene draw/physics orchestration | `dist/index.js` | `gtm404RenderPacked`; it calls `gtm413RunBehavior` first, then composable overlays. Footer clipping and frame governor remain intact. |
| Playback Pause/Resume (1/7 Quick Menu) | `dist/index.js` | `GtmV3NowPlaying`, `gtm414ManualTransport`, `AmbientController.sync`, `gtm411ResumeOwnAudio`. Never bypass ResonaDeck focus or sleep guards. |
| Persistent preferences/normalization | `dist/index.js` | `defaultSettings`, `normalizeSettings`, `setGlobalSetting`, `useSettings`. Every new setting needs default and normalization! |
| Pong Studio/dropdowns/history | `src/visualizer-behaviors/runtime-414.js` | `Gtm413VisualizerBehaviorSettings` uses a behavior's validated options. It appears for scenes using that behavior, including imported Pong packs. |
| Frame-rate budget and fallback quality | `dist/index.js` | `gtm409QualityScale`, `gtm409CreateGovernor`, `gtm409ObserveVsync`, `gtm409RecordCost`. Do not remove this governor. |
| Validation | `GTM_4.1.5_SCENERY_HUD_TESTS.py`, `GTM_4.1.5_SCENERY_RENDER_TESTS.cjs`, `GTM_4.1.5_REGRESSION.cjs` | Include safety, pack compatibility, behavior logic, shuffle, pause, reset tests for each addition. |

### Fast path: add a new scene that uses existing effects

1. Copy `visualizer-packs/sdk-examples/manifest-v2.json` and give your pack a unique `pack_id`.
2. Give each scene a unique `world_*` ID, `title`, category, one-to-three known `layers`, zero-to-four known `overlays`. Optionally modulate layer parameters using audio.
3. Create a ZIP containing exactly **one root file, `manifest.json`**. No folders, binaries, scripts, audio clips or images.
4. In Decky, open Game Theme Music → Visualizer Packs → Import ZIP, then Reload visualizer packs. Select the scene inside the matching category, or under Custom Packs.
5. Check playback, shuffle, CPU/GPU cost, color contrast and controller navigation on a physical Steam Deck. Disable visualizer if needed, without stopping audio.

### Pack v2 scene format

A sanitized example exists in `visualizer-packs/sdk-examples/manifest-v2.json`.

```json
{
  "format": 2,
  "pack_id": "gtm_demo_reactor",
  "name": "Demo Reactor",
  "author": "Community",
  "version": "1.0.0",
  "description": "An audio-driven Canvas effect scene",
  "scenes": [{
    "id": "world_demo_reactor",
    "title": "Demo Reactor",
    "category": "signature",
    "layers": [{
      "effect": "supernova_bloom",
      "scale": 1, "speed": 1, "density": 1, "intensity": 1, "hueShift": 0,
      "audio": {
        "intensity": {"source": "low", "amount": 0.7},
        "speed": {"source": "beat", "amount": 0.2}
      }
    }],
    "overlays": [
      {"effect": "lightning", "trigger": "beat", "color": "auto", "density": 0.8, "speed": 1, "intensity": 0.7}
    ]
  }]
}
```

**Scene categories**: `retro`, `rhythm`, `signature`, `anime`.

**Allowed base effects**: `crt_pulse`, `liquid_chrome`, `disc_prism`, `beat_pinball`, `seismic_mountains`, `mechanical_iris`, `sakura_tempest`, `supernova_bloom`, `neon_pong`, `tidal_bloom`.

**Available overlay effects (17)**: `sparks`, `lightning`, `rings`, `stardust`, `comets`, `scanlines`, `confetti`, `orbits`, `hexagons`, `laser`, `snow`, `embers`, `grid`, `waves`, `shards`, `flares`, `bubbles`.

**Overlay triggers**: `always`, `beat`, `bass`, `treble`. They use existing passive telemetry, not a new analyzer.

**Layer modulation audio sources**: `low`, `mid`, `high`, `beat`, `rms`, `energy`. Audio keys may target `scale`, `speed`, `density`, `intensity`, `hueShift`. Each `amount` is bounded from -1 to +1. Runtime clamps final parameters back to their safe ranges.

**Hard limits**:

- 48 installed custom packs plus built-in Volume 1; one pack may have up to 32 scenes.
- 1–3 base effect layers per scene; 0–4 overlays per scene.
- Each overlay renders no more than 32 procedural primitives, scaled by the existing performance governor, except small bounded curves/paths within each primitive. Overlays are clipped away from the top scoreboard region.
- ZIP under 1 MiB, one root `manifest.json` under 128 KiB, no extracted files and no executable scripting.
- Scene and pack IDs are validated. New packs cannot replace the built-in pack or steal scene IDs from existing packs. Own-pack upgrades can preserve IDs.
- The legacy `format: 1` pack is still accepted without overlays/audio parameters.

**Limits and non-capabilities:** v2 pack ZIPs cannot introduce arbitrary executable JS behavior, custom game physics, user-supplied shaders, arbitrary external media or new effect names. To introduce an *entirely new* gameplay behavior or procedural overlay algorithm, update the **trusted engine allowlists and implementation** in a future GTM build. This is intentional. The v2 SDK can already produce new combinations and colors without engine upgrades, and it supports real independently selectable import packs.

## Fast path: add a new gameplay effect (trusted GTM source)

1. Open `src/visualizer-behaviors/runtime-414.js` and add an effect to `GTM413_EFFECTS` (new Pong power) or register a new safe behavior using `gtm413RegisterBehavior('effect_name', {create,step,draw,signature,options})`.
2. Add its name to both allowlists: `main.py` → `VISUAL_EFFECTS` and `dist/index.js` → `GTM404_EFFECTS`.
3. Use bounded update steps and a compact state structure; keep per-frame effects independent from audio ownership. Do not use `setInterval` in a behavior, do not dispatch media playback, and do not draw over Steam game tiles.
4. Expose any user option in the behavior's `options` array and define a corresponding normalized setting (`defaultSettings` and `normalizeSettings`). Appearance-only options must not accidentally change behavior `signature` or reset tournament scores.
5. Run the sync script. Add to both regression suites. Measure on physical Deck before publishing.

### Lifecycle / stability contract

- `create(env)` may reuse a state from a stable singleton pool (Pong preserves its series when visualizer shuffle leaves and returns). It is **in-memory session state** and not a durable save file.
- `step(state, 1/90, env)` uses fixed 90 Hz ticks, at most four ticks per rendered frame. A wake or long render stall is *not* simulated in a giant catch-up loop.
- `draw(state, env)` can only draw to supplied footer Canvas2D and must leave context state restored.
- `signature(env)` must include only gameplay-affecting options that truly require a new simulation; colors and cosmetic effects should not reset scores.
- Existing `gtm404` renderer and `gtm409` frame governor remain the outer performance and isolation mechanisms.
- If imported packs are removed, invalid world IDs are cleaned from the menu, but unrelated audio, playlists and other installed packs remain untouched.

## Pre-publish physical Steam Deck QA (required)

1. Install this preview over a backup; verify 4.1.3 preferences and legacy v1 packs survive.
2. Check Quick Menu 1/7 Pause with Ambient enabled, including 2-minute pause, sleep/wake, switch section, ResonaDeck focus, manual Resume, Next track and Store priorities.
3. Select three Signature Pong arenas, then shuffle from Pong to a non-Pong scene and back. Confirm match points, match history, timers and series survive scene switches without a background physics loop.
4. Play Best of 3 and Best of 5 to completion. Confirm winning paddle, score, timer, countdown, next match, trophy and reset, then endless mode.
5. Check all team presets, random matches, custom hex input via Deck controller, independent paddle effects and bright/multicolor settings. Confirm readable names and white ball.
6. Import `GTM_4.1.5_Starter_Effects_Pack.zip`; check 3 scenes, every effect layer, beat-triggered overlays, shuffle, scene selection, removal and re-import.
7. Run on OLED Deck at 40/60/90 Hz profiles with low/mid/high effects, screen awake and suspend/wake. Capture actual frame time and audio stability. **No device measurements are claimed in this ZIP.**
8. If the preview fails, restore the separately saved 4.1.3 ZIP. Do not label 4.1.5 Stable until physical acceptance.

## Release freeze policy

This is a **preview**. Source-level tests passed, but no physical Deck testing has been performed here. It is meant to establish a reliable extension contract before GTM enters a maintenance period. Subsequent externally distributed scene packs can use this v2 format without changing the GTM core, provided they only select known behavior and overlay effects. The source is not a full buildable TypeScript/React project: it contains a precompiled UI bundle and a separately editable 4.1.4-compatible behavior module, so modifications to unrelated UI may require reconstructing the original frontend source in a future development cycle. Preserve both copies and validation instructions in backups.
