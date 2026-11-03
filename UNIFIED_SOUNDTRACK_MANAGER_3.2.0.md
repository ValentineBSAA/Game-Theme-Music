# Game Theme Music 3.2.0 — Unified Soundtrack Manager

## Why this release exists

3.1.0 proved that adding more playlist controls is not the same thing as designing a usable playlist manager. The old Playlist Studio and Soundtrack Assignment Center were dense, modal-like, duplicated the same jobs in several places, and could turn track rows into walls of text.

3.2.0 replaces that interaction model with one full-screen, controller-first Soundtrack Manager.

## UX rules used

The manager follows a few strict rules:

1. **One task, one workspace.** Playlist editing, library browsing, online search, and local import live in one route instead of separate modal tools.
2. **Persistent context.** The current assignment destination is always visible: a game, Ambient, or Store.
3. **LB/RB changes the major section.** Games → Ambient → Store → Library → Find Music → Import. The proven 3.0.7 shoulder-button implementation is reused unchanged.
4. **D-pad follows the screen.** Focus order mirrors the visual layout. A selects. B backs out.
5. **Focus cannot be subtle.** Focus uses the live CSS Loader theme accent with a border/outline and filled soft highlight.
6. **Selection does not destroy the list.** Library multi-select is staged. Cards remain in place while being marked; one action adds the marked set.
7. **Short text first.** Track cards show title, source, compact status chips, and only the information needed for the current task.
8. **No duplicate assignment centers.** Ambient, Store, Game pages, and Music Library launch the same manager.

These rules are based on controller/10-foot UX guidance: consistent navigation and predictable focus order, highly visible focus, D-pad-first operation, important controls near the beginning of the layout, and single-task/drill-in structures for handheld/TV controller experiences.

## Manager sections

### Games
A two-pane layout. Choose a known GTM game configuration on the left; edit its ordered soundtrack on the right. A direct App ID field is available as a fallback for a game that has not been configured yet.

### Ambient
Edits the Ambient playlist directly in the manager.

### Store
Edits the Store playlist directly in the manager.

### Library
Search downloaded/imported tracks. Filter All / Available / In target / Needs names. A marks/unmarks a track. **Add Selected** applies the entire batch without causing selected rows to disappear or jump.

### Find Music
Searches the configured online providers with explicit Auto / YouTube / KHInsider source selection. Selecting a result downloads it and assigns it to the currently visible destination while keeping the result on screen.

### Import
Imports local audio from Downloads, Music, or Home. The user can either import into the local library or import and add to the current destination.

## Persistent destination bar

The destination bar remains visible while moving between Library, Find Music, and Import. It can point to:

- selected game
- Ambient
- Store

This removes the old question of “where is this track going?”

## Game playlist controls

Each playlist row has a stable position number, title, provider/status metadata, and compact actions. Game tracks additionally expose active-track selection and the existing per-track playback tuning UI.

## Theme baseline lock

3.2.0 deliberately does **not** rewrite the 3.0.7 theme engine. The following functions are unchanged from the 3.1.0 package that carried the verified 3.0.7 implementation:

- `gtmV307BootstrapTheme`
- `GtmV301AdaptiveThemeRuntime`
- `useGtmV301ShoulderNavigation`

The Soundtrack Manager uses only semantic live-theme variables such as `--gtm-bg-1`, `--gtm-panel`, `--gtm-control`, `--gtm-text`, and `--gtm-interactive-accent`. It does not introduce a cyan/blue manager palette.

## Removed duplication

The old per-game assignment tabs are reduced to one Soundtrack Manager launcher plus Game Settings and About. Ambient/Store edit buttons and Music Library entry points all open the same full-screen manager.

## Scope intentionally not changed

The established playback engine, Ambient/Store controllers, Desktop Mode block, Media Bridge, session-armed STEAM-button controls, yt-dlp, QuickJS, and 3.0.7 live theme behavior are not redesigned in this release.
