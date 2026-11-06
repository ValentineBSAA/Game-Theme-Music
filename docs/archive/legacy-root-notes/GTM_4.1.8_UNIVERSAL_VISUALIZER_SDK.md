# Game Theme Music 4.1.8 | Universal Visualizer Pack v3 SDK

**Private Preview, not Stable.** This is a reproducible source map for the new pack system, controller bridge and arcade lifecycle. Keep 4.1.7 available for rollback. Do not publish until acceptance testing on actual Steam Deck hardware.

## What you can distribute without a GTM core update

Format-3 ZIP packs can contain **up to 32 independently selectable scenes**. A scene can include music-reactive visuals, optional team/player-controlled simulations, AI-driven display logic, a background chosen from ten scenery templates, up to four existing overlay effects, and up to eight scene-specific Quick Menu dropdowns. A pack can mix non-game visuals with interactive scenes and can participate in Shuffle All. You can create 2D arcade-style games, procedurally projected pseudo-3D effects, orbit systems, dashboards, rhythmic geometric animations, particles and novel procedural scenes using the arithmetic/trigonometric instruction set. The *same* package can hold multiple kinds of scenes.

The included `GTM_4.1.8_UNIVERSAL_VISUALIZER_LAB.zip` demonstrates **Pulse Atlas (non-game), Beat Catcher (solo/autoplay), and Dual Orbits (two-player/AI interactive art)**. These are proof-of-format examples, not full commercial-style arcade games.

**Honest limitation:** This is a bounded 2D JSON-program runtime, not unrestricted JavaScript, a WebGL shader compiler, an asset loader or a full game engine. A genuinely new primitive, 3D engine, media codec, low-level controller API, or native asset type can still require a trusted core update. It would be inaccurate to promise that every imaginable future visualizer can be built with zero core updates. All supported JSON instructions and existing effects can be combined without new releases.

## Pack ZIP layout

The only file in an importable ZIP is the root `manifest.json`. No nested folder, JavaScript, HTML, Python, DLL, SVG, shaders or additional files. Maximum ZIP 1 MB; maximum manifest uncompressed 128 KB. There are no executable add-on permissions. Import and removal run through the existing Quick Menu **Visualizer Packs** interface.

Minimal example:

```json
{
  "format": 3,
  "pack_id": "my_reactive_pack_001",
  "name": "My Reactive Pack",
  "author": "Your Name",
  "version": "1.0.0",
  "description": "Music-reactive procedural effects",
  "scenes": [{
    "id": "world_my_first_scene",
    "title": "My First Scene",
    "category": "signature",
    "layers": [],
    "background": {"style":"stars", "base":"#080b22", "accent":"#877dff", "motion":0.5, "reactivity":0.3},
    "options": [{"id":"speed","label":"Animation speed","choices":[{"value":0.4,"label":"Calm"},{"value":1,"label":"Normal"}]}],
    "program": {"version":1,"state":{"angle":0},
      "update":[{"do":"set","var":"angle","value":["add",["get","angle"],["mul",["get","dt"],["get","opt_speed"]]]}],
      "draw":[{"do":"circle","x":0.5,"y":0.5,"r":0.08,"color":{"hsl":[["get","low"],0.9,0.65]}}]}
  }]
}
```

Use unique `world_...` scene IDs; pack IDs and scene IDs are permanent ownership identifiers. Updating the same pack ID is permitted. Overwriting a different pack's scene ID is rejected. Prior formats 1 and 2 remain valid.

## Core virtual machine, not arbitrary code

The `program` object requires `version:1`, `state`, `update`, and `draw`.

- **State registers:** up to 32 named finite numbers; `set` updates declared state only.
- **Control flow:** `if` and fixed `repeat` loops (1–96 iterations); nesting and total operations are bounded.
- **Arithmetic:** `get`, add/sub/mul/div/mod/pow, atan2, min/max, comparisons, Boolean operations, sin/cos/tan, abs/sqrt/floor/ceil/round/fract/hash, clamp/mix/smoothstep.
- **Drawing:** normalized canvas `rect`, `circle`, `line`, and `text`; literal `#RRGGBB` or bounded HSL expressions; alpha, sizing and line width. The host clips output to the footer.
- **Audio inputs:** `low`, `mid`, `high`, `beat`, `rms`, `energy`, `band0` ... `band11`, and `audio_paused`. Smoothing is applied to broad bands. `time` and `dt` advance independently of music.
- **Per-pack options:** up to 8 dropdowns with 2–10 numeric choices each. Options appear as `opt_<id>` inputs. Values persist in local storage per scene; pack updates preserve matching option IDs where possible.
- **Interactive inputs:** `p1x`, `p1y`, `p2x`, `p2y` right-stick axes; `p1lb`, `p1rb`, `p1lt`, `p1rt`, `p1xbtn`, `p1ybtn` and matching player-2 inputs. `p1a`/`p2a` are **Quick Menu button pulses**, not physical A/Cross. `human1`, `human2`, `mode` (0 AI/AI, 1 player/AI, 2 player/player, 3 solo), `player1_side` (0 left, 1 right), `connected1`, `connected2`, `paused` (game state), `disconnect_countdown` (integer remaining seconds).

An interactive scene declares `interaction` such as:

```json
"interaction": {
  "kind":"game",
  "modes":["ai_ai","player_ai","player_player"],
  "default":"ai_ai",
  "action_label":"Fire"
}
```

`kind` may be `game` or `interactive_art`. Unsupported modes are hidden from the menu. Pack authors must implement their own simulated opponent/demo behavior in JSON state/update logic when AI/autoplay is enabled. The core supplies the inputs, pause lifecycle and player switching, **not the opponent intelligence of each new game**.

## Controller contract and disconnect behavior

- Default is **AI vs AI**, no controller needed. Players explicitly choose Player vs AI, Player vs Player or Solo when the scene permits it.
- Standard-mapped PlayStation, Xbox and Steam Deck controllers: right stick moves; **RB/R1, LB/L1, RT/R2, LT/L2, X/Square, short Y/Triangle** are six optional actions. Gamepacks interpret them. A/Cross is reserved for Quick Menu confirm. B/Circle remains native Quick Menu back.
- **Hold Y/Triangle 800 ms** (configurable 650/800/1000) toggles game-only pause; soundtrack continues. The Quick Menu also provides Pause/Resume, Take Control, and per-player action buttons.
- A controller is detected using the browser's `navigator.getGamepads()` API. If a previously connected participating controller is lost, the game pauses and draws **CONTROLLER DISCONNECTED · AI TAKEOVER IN 10 SECONDS**. Countdown defaults to 10 seconds (configurable 5/10/15/30), is based on monotonic elapsed time rather than render frames, and is cancelled on reconnect.
- If the countdown expires, the session switches to AI/autoplay without resetting match state. Reconnecting later does not seize control. **Take Control** in Quick Menu explicitly re-arms human play.
- Human control is optional. Other gamepads should not be sampled while AI vs AI is active. Standard mapping availability in Steam Deck Gaming Mode **must be tested on hardware**. Steam may reserve buttons or hide device data from a Decky WebView. The Quick Menu includes a read-only count of visible Gamepad API devices.
- A game that lacks a playable autonomous mode must declare and implement its own fallback; the engine cannot invent AI for unknown game mechanics.

**Pong-specific mappings:** right stick positions the chosen team paddle, RB activates a power, LB activates a shield, LT precision movement, RT faster movement, X/Square a quick defensive dash and short Y/Triangle triggers a power. Long Y/Triangle toggles pause. The Quick Menu separately has power buttons. Auto-AI powers and tournament settings remain unchanged. Changing opponents or team side should preserve the championship.

## Development ownership: exactly where to change things

| File | Responsibility |
|---|---|
| `gtm_pack_v3.py` | Strict backend validator for format-3 packs, expression limits, state registers, scene-defined settings, interaction metadata. **Edit here first for new pack schema fields.** |
| `main.py` | Install/list/remove ZIPs, reject additional files/code, preserve v1/v2 and scene ownership. Avoid making arbitrary scripts executable. |
| `src/visualizer-behaviors/pack-program-418.js` | Trusted expression VM, draw commands, music inputs, safe state updates, per-scene option persistence, state across shuffle, and frame budgets. Extend primitives here, not inside uploaded manifests. |
| `src/visualizer-behaviors/controller-418.js` | Controller normalization, AI default, input bindings, pause, disconnect countdown, recovery and Quick Menu action queue. |
| `src/visualizer-behaviors/runtime-414.js` | Trusted Pong logic, championship, behaviors, AI, shared arcade step scheduling and gameplay performance. |
| `src/visualizer-behaviors/scenery-415.js` | Reusable animated backgrounds, scene styles, color and music response. |
| `dist/index.js` | Installed precompiled UI. Includes the trusted sections above; also contains settings and imported-scene registration/UI. **The original full TypeScript/React source tree is not available in this handoff.** |
| `tools/sync_visualizer_behaviors.py` | Regenerates the trusted runtime/controller/pack-VM and scenery sections in `dist/index.js` without disturbing the other compiled UI. Run after changing trusted source files. |
| `visualizer-packs/sdk-examples/manifest-v3.json` | Fully validated 3-scene working example; use as the template for new packs. |
| `GTM_4.1.8_RUN_REGRESSION.sh` | Focused compatibility and abuse tests. A physical Deck test is a separate release gate. |

## Build and verification

From the plugin root:

```sh
python3 tools/sync_visualizer_behaviors.py
python3 -m py_compile main.py gtm_pack_v3.py
node --check dist/index.js
bash GTM_4.1.8_RUN_REGRESSION.sh
```

The bundled test suite covers old v1/v2 imports, v3 import/removal and rejection of invalid scripts, VM execution budgets, Gamepad simulated inputs/disconnect/hold, scene state across Shuffle All, Quick Menu pulse routing, Pong physics at 5/16/30/60/90 simulated rendering FPS, Store/Plugin Store playback-path regressions, Ambient/ResonaDeck focus, power and sleep/wake behavior.

## Steam Deck acceptance gates (not yet passed)

1. Check **Steam Store playlist, Decky Plugin Store playlist, Ambient music and ResonaDeck focus** with both autoplay and manual pause. Confirm no regressions.
2. Run Pong AI vs AI for several complete championships; check performance FPS, score/timer, no white flash or huge reset delays. Switch between Signature scenes and return to the same championship.
3. Import the lab ZIP in the GTM pack manager. Verify all three scenes appear in Signature, play alone, shuffle properly, save options, and remove without affecting built-ins.
4. With a physical Deck / PlayStation / Xbox controller, verify actual `Gamepad API` visibility. Select player control and use the right stick, each action button, short Y, **long Y for pause/resume**, and Quick Menu A/Cross. Confirm Steam's normal controls still work.
5. Use two controllers for Dual Orbits and Pong; unplug one mid-match. Verify the 10-second countdown, reconnect cancellation, automatic AI takeover, preserved score/state and explicit Take Control after reconnect.
6. Test with music loud, quiet and paused, plug-in store game navigation, suspend/wake, minimized/hidden overlay, high contrast accessibility and performance at all footer heights. Confirm that packs cannot force a bright full-screen reset or trigger uncontrolled drawing.

**Status:** package implementation and focused automated checks pass. Physical Steam Deck controller/UX acceptance is NOT complete. Retain 4.1.7 for rollback; this remains a private Preview.
