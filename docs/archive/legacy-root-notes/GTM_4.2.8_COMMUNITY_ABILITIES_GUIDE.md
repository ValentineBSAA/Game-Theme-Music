# Community ability authoring | GTM 4.2.8 Preview

External packs can add game logic and abilities using validated format-3 JSON. Each pack owns its own state, and each state register is a bounded finite number. **The current engine does not import ability-only ZIPs or grant the ability to change a built-in game without shipping a trusted GTM update.**

## Tested example: Neon Dodger

Use `Neon_Dodger_Community/manifest.json`. Controller right stick controls movement. Holding LB on its rising edge activates a two-second shield; this sets `shield` (remaining duration) and `shield_cd` (12-second recharge). RB similarly activates a short dash (`dash`, `dash_cd` 8 seconds). `last_lb`/`last_rb` latch buttons so holding does not repeatedly activate. The collision condition checks `shield` before reducing lives, and scoring advances for completed falling-object cycles.

To add another ability to **your own external pack** without rebuilding GTM, declare state fields in the pack's `program.state`, handle input and cooldown in its `program.update`, implement actual gameplay consequences in its state program, and draw a visual cue in `program.draw`; then validate/re-ZIP only your manifest. Keep within v3 state (32 registers), expression depth, draw, and per-frame operation budgets. Treat game physics, cooldown, rendering, and AI decision as one ability feature: a colored overlay alone is not enough.

Use `python3 pack_validate.py Neon_Dodger_Community/manifest.json my-community-game.zip` to validate and package. ZIP root must contain `manifest.json` only. A/Cross remains Steam Quick Menu confirmation. `p1lb`, `p1rb`, `p1lt`, `p1rt`, `p1xbtn`, and `p1ybtn` are provided by the approved input bridge.

Do not add external JS, Python, shaders, network calls, media files, or executable scripts to a pack. This SDK does not expose unrestricted engine hooks. Future designs may enable trusted, validated ability capability slots shared by multiple built-ins, but those require separate implementation and security testing.
