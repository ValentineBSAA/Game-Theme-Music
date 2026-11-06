# Game Theme Music 3.3.0 — Couch View Soundtrack Manager

## Goal

Make the Soundtrack Manager readable and predictable from a TV/couch distance without changing the verified 3.0.7 live theme engine or the working playback stack.

## Interaction model

- Only one manager section is visible at a time.
- Physical **LB/RB** cycles: Games → Ambient → Store → Library → Find Music → Import.
- The header always shows the current section and position, for example `Library · 4 of 6`.
- A selects/opens, B returns, and visible focus always uses the active CSS Loader/Steam theme accent.
- Library, Find Music, and Import show one current assignment destination rather than three competing destination buttons.

## Couch-view rules

- Large primary type and large focus targets.
- One-column track/result lists for readable names.
- Minimal chrome before content.
- Stable rows: selecting a track changes its state in place rather than remounting or jumping.
- Persistent bottom status and controller-hint bars remain in the same location across sections.
- Destructive actions remain visually distinct.

## Section layout

### Games
Two panes: a readable game browser on the left and the selected game's soundtrack on the right. Library / Find Online / Import Local are the only primary soundtrack-building actions.

### Ambient / Store
Full-width ordered playlist editor with three source actions and large reorder/remove controls.

### Library
Full-width downloaded-music browser with search/filter, large track cards, stable multi-select, status chips, and a single batch Add action.

### Find Music
Search source + search field + a large one-column result list. Press A to download and add to the current destination.

### Import
Single centered import task with a start-folder selector and two actions: Import to Library or Import + Add.

## Baseline lock

The following are intentionally unchanged from 3.0.7:

- `gtmV307BootstrapTheme`
- `GtmV301AdaptiveThemeRuntime`
- `useGtmV301ShoulderNavigation`
- Python backend
- bundled yt-dlp
- bundled QuickJS
