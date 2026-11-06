# Game Theme Music 3.4.3 — Preview-First Search + Safe Track Editor

## Locked baseline
- 3.0.7 live theme engine remains the visual baseline.
- 3.4.1 native single-step navigation remains the directional-navigation baseline.
- 3.4.2 manager history, game-aware auto search, grid/list results, and explicit Library destination remain enabled.

## 3.4.3 changes
- Selecting an online result opens a preview modal. Nothing downloads automatically.
- Preview starts automatically after audio resolves. The user explicitly chooses Download + Add or Back.
- The destination is shown in the preview before download.
- Game playlist rows now include Preview in addition to Edit Track, Move Up, Move Down, and Remove.
- Track Settings was replaced by Edit Track: playback range, full-track reset, global/custom fades, Preview Changes, Save Changes, Cancel.
- B is wired to the editor/preview ModalRoot onCancel path. Save and Cancel call the Decky modal handle directly.
- The editor closes itself if the route changes so it cannot remain stranded over Steam after navigation.
- Preview/editor modals copy the current live GTM theme variables from the rendered manager so CSS Loader theme colors remain consistent.
