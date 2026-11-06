# GTM 4.1.7 Preview | Arcade Game and Effects Pack Developer Map

**Status:** private preview source / NOT a Steam Deck acceptance certificate. Keep 4.1.6 as rollback. This handoff is intended to prevent future improvements from repeatedly breaking unrelated playback or visualizers.

## What was fixed in 4.1.7

- **Pong ball time scaling:** Previously, Pong simulated at most 4 x 1/90-second steps for *every displayed frame*. At 5 displayed FPS it could advance only 0.044 real seconds each 0.2s frame, making the ball appear drastically slowed. Pong now performs up to 24 bounded 90Hz steps per frame and preserves small timing remainders. A >400ms sleep/wake gap is discarded instead of trying to replay several seconds of physics. The background and gameplay use the same visual timeline.
- **Low-refresh Pong:** In the absence of music, Pong's footer renderer now targets approximately 30 FPS instead of the old ~16 FPS limit, subject to the device's actual browser paint scheduling and power governor. This does not guarantee 30 FPS on physical hardware.
- **Scenery:** Stable movement independent of audio; bass/treble/beat affect brightness and accents, not coordinates or global scale. Arcade, storm, starlight and other backgrounds have their own compositions and constrained draw loops.
- **Reset delays:** The old *deliberate* delays were **5 seconds after each match** and **10 seconds after a championship**. New defaults are **1.5 seconds** and **3 seconds**, respectively. Pong Studio exposes independent choices for both. `homeReactiveVisualizerPongResetSec` is retained as a legacy stored setting but no longer controls the new timing. The initial serve animation adds approximately 0.78s before ball travel resumes.
- **Shared arcade lifecycle:** The trusted `gtm417RegisterArcadeGame` contract supports independently registered future games with their own `create/step/draw` hooks and scoring metadata. `gtm417ArcadeBeginTransition` / `gtm417ArcadeAdvanceTransition` handle frame-rate-independent round transitions; Pong uses them today.

## Exact ownership map

| Goal | Authoritative file / function | Rule |
| --- | --- | --- |
| Arcade game physics and AI | `src/visualizer-behaviors/runtime-414.js`; `gtm413RunBehavior`, `gtm413PongStep` | Simulations use bounded 90Hz `step()` updates; never drive gameplay from a CSS animation or the music beat count. |
| Register a new trusted game | `src/visualizer-behaviors/runtime-414.js`; `gtm417RegisterArcadeGame(effect, hooks, metadata)` | A game owns its own state and score model. Do not reuse Pong's pool or championship state. |
| Start / finish game rounds | `gtm417ArcadeBeginTransition` and `gtm417ArcadeAdvanceTransition` | All countdowns are independent of audio; callbacks fire once. Do not reset entire visualizer canvas. |
| New game settings / UI | behavior `options` in `runtime-414.js`; `Gtm413VisualizerBehaviorSettings` | Each game declares its controls. Extend the panel carefully for game-specific score panels; Pong fields should not appear in Skee-Ball. |
| Defaults and persisted preferences | `dist/index.js`; `defaultSettings` and `normalizeSettings` | Add an explicit default and allowlist/clamp for every new setting. Don't reuse old keys with different meanings. |
| Scene backgrounds and music reactivity | `src/visualizer-behaviors/scenery-415.js`; `gtm415DrawSceneBackground` | Slow autonomous movement, smoothed audio highlights, no global shaking or whole-screen flashing. |
| Only one frame clock | `dist/index.js`; `gtm404FrameState` and `gtm404RenderPacked` | Exactly one `gtm404FrameState()` call per render; pass the same `frame` to scenery and game. |
| Frame pacing and instrumentation | `dist/index.js`; `gtm409CreateGovernor`, `gtm409RecordCost`, `__GTM_RETRO_VISUALIZER_DIAGNOSTIC__` | Check `estimatedDrawFps`, `averageRenderCostMs`, `pongPhysicsSteps`, `pongPhysicsLagMs` on Deck. Never raise caps before benchmarking. |
| Pack install / validation | `main.py`; `VISUAL_EFFECTS`, `_validate_visualizer_pack` | Packs are JSON only. No JavaScript, code execution, external downloads, or unrestricted shaders. |
| Trusted effect allowlist and pack shuffle | `dist/index.js`; `gtm404RegisterPacks`, `gtm404PickShuffledScene` | Register only finished, tested built-in effects; pack scene IDs must remain unique. |
| Publish changes into installable plugin | `tools/sync_visualizer_behaviors.py` | Sync developer-owned `runtime-414.js` and `scenery-415.js` into `dist/index.js`, then run the tests. |
| Music and audio focus | `dist/index.js`; Store/Ambient controllers and manual-pause latch | **DO NOT** change these while adding an arcade game. Preserve Store, plugin Store and ResonaDeck source ownership. |

## Future Skee-Ball visualizer: required implementation (not present yet)

1. **Trusted built-in game logic:** Add a separate module or carefully bounded code block implementing `create(env)`, `step(state, dt, env)`, and `draw(state, env)`. Register its effect ID (for example `skee_ball`) via `gtm417RegisterArcadeGame('skee_ball', {...}, {title:'Skee-Ball', scoring:'rings'})`. Never copy `GTM414_PONG_POOL` or Pong's 20 powers into it.
2. **Independent state:** Use its own per-game balls, trajectory, collisions, lane physics, ring targets, shot counter, score, round history and game-over state. Limit maximum active balls, particles, collision samples, draw operations and accumulated time.
3. **Game lifecycle:** Use the shared transition helpers for short round results and configurable rematches. Skee-Ball can implement a separate scoring format, such as balls remaining / points earned; the common lifecycle does not assume left and right paddles.
4. **Render and audio:** Keep within the bottom visualizer, use the existing smoothed music packet for **non-disruptive accents**, and reuse the shared procedural scenery renderer. Physics cannot depend on song loudness unless explicitly enabled as a gameplay mode.
5. **Packs:** Once the trusted Skee-Ball engine is implemented and tested, deliberately add `skee_ball` to the Python backend and frontend effect allowlists. Then content authors can ship Skee-Ball *themes/configurations* as safe ZIP manifests. ZIP imports **cannot** supply arbitrary new physics or JS behaviors.
6. **UI and testing:** Add a game-specific settings section, controller focus handling, readable score HUD, audio/Store regression coverage, deterministic physics simulation at 5/16/30/60 FPS, a suspend/wake test and actual Steam Deck test.

## Performance acceptance matrix (must pass on hardware)

- Check Pong at normal music playback, quiet/silent, Store navigation, Decky Plugin Store, Shuffle All and with Ambient enabled/paused.
- Validate gameplay **and rendered FPS**, not just scoreboard clock accuracy. At 5 rendered FPS, simulation can now remain time-correct but still *look* choppy. Fixing actual frame stalls requires profiling SteamUI/Decky, not inflating physics speed.
- A 30 or 60 FPS target is a goal, not a guarantee. Record the runtime diagnostic fields above plus whether the scene is storm/stars/arcade, music active, and current theme/footer height.
- Test repeated championships and random-color changes; countdown should not reset scores early, replay the same result twice or skip a trophy.
- Confirm no white flashes, backdrop position jumps, unreadable text or scenery drawn over Steam UI.
- Preserve v1/v2 pack imports, existing 17 overlays, audio focus, Store and plugin Store playback, controller LB/RB and B behavior.

## Regression commands

From the plugin root:

```sh
python3 tools/sync_visualizer_behaviors.py
sh GTM_4.1.7_RUN_REGRESSION.sh
```

Older 4.1.4 and 4.1.5 snapshot scripts hardcode the then-current setting count (13 or 14). Those obsolete assertions can fail after intentional option additions; they are retained as historical artifacts, not used as the 4.1.7 release gate. The new lifecycle test verifies the current setting keys and arcade behavior instead.

**Never promote this build to Stable on automated checks alone.** Physical Steam Deck proof is the final acceptance gate.
