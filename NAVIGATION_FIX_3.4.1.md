# Game Theme Music 3.4.1 — Native Single-Step Navigation Fix

## Root cause
3.4.0 registered a raw `SteamClient.Input.RegisterForControllerInputMessages` listener for D-pad and left-stick directions while the same controls were already inside Decky `Focusable` trees. A single physical direction press therefore had two independent focus owners:

1. Steam/Decky native navigation moved one item.
2. GTM's spatial listener moved again.

The visible result was exactly the on-device behavior: skipping the adjacent option, jumping from one pane to another, and occasionally moving the viewport.

## 3.4.1 rule
There is now one owner for each controller job:

- **D-pad / left stick:** Decky native `Focusable` navigation only.
- **LB / RB:** GTM's proven 3.0.7 shoulder handler only.
- **A / B:** native Steam/Decky activation/back behavior.

The manager keeps explicit `flow-children="right"` groups for horizontal rows and `flow-children="down"` groups for vertical lists/panes. No custom directional controller hook is active.

## Layout ownership
- Games root: left/right pane flow.
- Games filters/source actions/track actions: horizontal flow.
- Game list/playlist/library/search results: vertical flow.
- Find Music toolbar: horizontal flow.
- Import actions: horizontal flow.

## Regression lock
Do not reintroduce a second raw controller listener for Up/Down/Left/Right. Physical-controller behavior must be validated on Deck because Steam's gamepad navigation tree, not DOM order alone, is authoritative.
