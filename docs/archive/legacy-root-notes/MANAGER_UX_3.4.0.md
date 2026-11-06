# Game Theme Music 3.4.0 — Controller Navigation + Manager UX Rebuild

3.4.0 rebuilds the Soundtrack Manager around the actual Steam Deck use case: a controller, a television, and no patience for web-form navigation.

## Locked baseline

The proven 3.0.7 live theme engine remains protected. `gtmV307BootstrapTheme`, `GtmV301AdaptiveThemeRuntime`, and the physical LB/RB shoulder handler are unchanged from 3.0.7.

## Navigation contract

- LB/RB always changes the top-level manager section.
- D-pad and left-stick digital directions use spatial navigation inside the current section.
- Up chooses the nearest logical control above, Down below, Left to the left, and Right to the right.
- A control at an edge stays at the edge instead of throwing focus into an unrelated row or shifting the viewport.
- Games is a real two-pane workspace. After opening a game, Right from the selected game enters its soundtrack actions; Left returns to the selected game.
- Focus is the only state that receives the full CSS Loader highlight. Persistent selection uses a small marker/chip instead of pretending to be focused.

## Game name intelligence

The manager no longer treats raw numeric IDs as names.

Name resolution order:
1. live Steam app overview,
2. non-Steam `shortcuts.vdf` display name,
3. a previously resolved GTM name,
4. cached resolved name.

If Steam no longer has enough information to identify an old entry, the manager shows `Unknown game` and keeps the App ID as secondary diagnostic text rather than presenting the number as a title.

## Page behavior

### Games
- Search field.
- Simple All / Has Music / Needs Music filters.
- Refresh Names action.
- Game list on the left, soundtrack on the right.
- Music Library / Find Online / Import Local are reachable as an actual horizontal action row.

### Ambient / Store
- Same consistent ordered-playlist editor.
- Large source actions at the top.
- Track actions use Move Up / Move Down / Remove language.

### Library
- Large one-column music rows.
- Search, view filter, target switcher, and refresh are in one toolbar.
- Multi-select is stable in place and visibly separate from focus.

### Find Music
- Search, source, destination, and Search form one predictable row.
- Source cycles Automatic / YouTube / KHInsider without a cramped dropdown.

### Import
- Current destination is explicit.
- Start folder is a simple cycle control.
- Import to Library and Import + Add to Target are the two primary actions.

## Theme behavior

3.4.0 consumes the semantic colors produced by the 3.0.7 live theme engine. It does not introduce a second palette, persist theme colors, or hide the UI while waiting for theme detection.
