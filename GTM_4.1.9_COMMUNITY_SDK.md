# GTM Community Creator SDK 4.1.9 (format 3)

## Public authoring scope and privacy
This community-facing SDK exposes **only the approved JSON pack contract, example manifests, and an offline validator**. It intentionally does **not** redistribute GTM's audio engine, Store/Library integrations, Decky plugin source, credentials, proprietary layouts, or compiled renderer code. Note: any installed Decky plugin's distributed client code may still be inspectable; withholding it from this SDK is not encryption or a guarantee that installed assets are secret.

## Build and distribute a pack
1. Copy `manifest-v419.json` and edit the pack ID, name, version, scene IDs, title, category, and layer parameters.
2. Set scene `category` to `arcade` for games or interactive experiences; use `retro`, `rhythm`, `signature`, or `anime` for non-game visuals.
3. Use declarative format-3 `program` with numerical `state`, bounded `update`, and `draw` commands. No imports, eval, remote URLs, shaders, script files, external assets, or platform APIs are permitted.
4. Add optional `interaction` modes for games, controller right-stick input, LB/RB/L2/R2/X/Y actions, and game-specific configuration. **A/Cross is reserved for Quick Menu confirmation.** Games that require entirely new engine primitives still need a trusted core addition.
5. Run `python3 gtm_pack_v3.py` by using the included `python3 pack_validate.py manifest-v419.json output.zip` command.
6. ZIP **only** a root `manifest.json`. Do not ZIP a folder containing the manifest. The example `GTM_4.1.9_COMMUNITY_ARCADE_LAB.zip` is importable as-is.
7. Import the ZIP through the GTM Quick Menu's **Arcade → Packs** section. A compatible game appears under **GTM Arcade**. A static visualizer appears under its selected category. Shuffle All can include installed scenes.
8. Test music stopped, beat spikes, sleep/wake, controller disconnects, low frame rate, scene shuffle, and uninstallation before distributing your pack.

## Controller contract
On the primary Gamepad API device assigned to player 1 or 2, the right stick controls analog movement (`p1x`, `p1y`, `p2x`, `p2y`). Available action signals include `p1lb`, `p1rb`, `p1lt`, `p1rt`, `p1xbtn`, `p1ybtn` and their P2 equivalents. `p1a`/`p2a` remain zero because confirmation belongs to Steam's Quick Menu. Player mode signals include `human1`, `human2`, `mode`, `connected1`, `connected2`, `disconnect_countdown`, `paused`. Manual game pause is independent of music playback. A confirmed player disconnect triggers a visible 10-second countdown before AI/demo fallback, when supported. AI versus AI remains the default for supported competitive games.

## Music contract
The engine supplies normalized bounded `low`, `mid`, `high`, `beat`, `rms`, `energy`, twelve `band` values, and a frame time. Smooth gradual changes in your declarative state; do not jump whole-scene positions directly to every beat. Sound is supplied by GTM only. Packs may not read media files or launch playback themselves.

## Scene layout and UI
Keep arena effects inside the footer and leave HUD/scoreboard clear. Use declarative background and overlay names supported by the validator. Pack settings are surfaced in Arcade/Visualizer settings without adding a separate top-level Quick Menu tab for each pack. Choice lists larger than the 11-item Steam menu visibility limit are paged by GTM.

## Security and compatibility
Only format-1, format-2, and format-3 validated data packs are accepted. Per-scene budgets constrain state registers, operations, loops, draw commands, and instruction depth. Unsupported content fails import; do not bypass the validator. Imported packs cannot supply raw JavaScript/Python, native libraries, or arbitrary new 3D renderers. The format is versioned so creators can target compatibility rather than depending on internal GTM code locations.

## Example files
`manifest-v419.json`: a procedural music visualization plus two interactive game examples.
`pack_validate.py`: validates the JSON and creates an importable root-manifest ZIP.
`gtm_pack_v3.py`: reference validation rules, published separately from GTM's source.

## Test and release checklist
Validate unique pack and scene IDs, use only approved categories, audit option ranges and contrast, keep all action buttons optional, test both no-controller and three-controller scenarios, verify disconnect and reclaim, test 5/16/30/60 FPS simulation, never modify GTM's audio playback ownership, and keep file size predictable.

## Maintenance promise
This SDK is **not** a claim that any imaginable renderer or game is possible without a core update. It supports the existing programmable 2D scene VM and registered capabilities, which are intended to be reusable. New low-level graphics technologies require a trusted core change.
