# GTM Community Arcade SDK 4.2.8: Games and Abilities Without a Core Rebuild

This SDK distributes **format-3 JSON**, the public offline validator and an independently importable sample. It does **not** distribute GTM private sources, credentials, the Steam music bridge, or executable code.

## Flux Shield Run: standalone proof

Use the separately packaged `Flux-Shield-Run-Community-Game.zip`. The ZIP has **one root `manifest.json`**. Import via GTM Arcade → Packs, then select the newly registered `Flux Shield Run` game. If the menu or install pathway misbehaves, do not overwrite your stable setup; report the failure and use the private Preview as a test build.

The game has independent P1/P2 ship movement, score and collision state, an AI demonstration, a shield on LB (2.5 seconds active, 15 seconds cooldown), and a dash on RB (2 seconds active, 10 seconds cooldown). Each ability has independent `active`, `cooldown` and `button latch` state registers. The rising-edge latch prevents repeated activation while a button is held. Both powers work without any GTM JavaScript modifications because they compile to allowed `set` and `if` operations in the safe pack VM.

## Editing a game or adding an ability

1. Copy `flux-shield-run-428/manifest.json` and choose a unique `pack_id` and `world_...` scene ID.
2. Define numeric state registers, e.g. `shield1`, `shieldcd1`, `lb1`; no code objects, script strings, imported files or URLs are allowed.
3. In the `update` stage decrement the active/cooldown values with `max(0, value - dt)`; detect the rising edge `p1lb > 0 && lb1 < 0.5 && shieldcd1 < 0.01`. On activation set active to 2.5 and cooldown to 15; then always assign `lb1 = p1lb`.
4. In your gameplay, use the active register to determine collision or movement behavior, not only visuals. Draw a visible effect and a useful HUD indication inside the footer.
5. Duplicate for P2 using `p2lb` and independent state registers. AI mode uses `human1/human2` and needs a playable demonstration behavior.
6. Run `python3 pack_validate.py manifest.json my-game.zip`. Import the resulting ZIP. Revisions to the pack do not require building or reinstalling GTM.

## Security, performance, and limitations

- All effects must use existing primitives: arithmetic, conditions, bounded state, and 2D draw operations. VM limits include 32 state registers, bounded nested expressions and draw budgets.
- No arbitrary scripts, eval, networking, file access, custom physics engines, or shaders. New engine primitives, or a general-purpose ability pack that modifies a **trusted built-in** game, still require a trusted GTM core update.
- Keep cooldowns real, fair and independent, obey controller ownership and avoid A/Cross and Triangle/Y, which are reserved for Steam UI/join/pause.
- Test on a physical Steam Deck and preserve music playback ownership. A validated pack proves format safety, not polished hardware gameplay.
