# Game Theme Music 4.2.10 Preview

**Private Steam Deck Preview | November 2, 2026**

## Why this build exists

The 4.2.9 Arcade features were functional but settings were buried inside nested controls. Both directions of Arcade resizing were especially difficult to find. This release reorganizes the existing GTM Quick Access UI, rather than introducing new gameplay, controller-bridge behavior, audio features, or new pop-up windows.

## Quick Access layout

The existing eight pages remain on the LB/RB page rail, preserving the current order and saved last-page choice:

| Page | What is immediately visible | What is grouped |
| --- | --- | --- |
| **Now Playing** | Owner/source, current track, playback controls, master volume | No new submenus; already concise |
| **Game Music** | Playlist coverage and Soundtrack Manager | Game playback/fades, source discovery, controller shortcuts, manual Steam App ID |
| **Ambient** | Current track, queue, playlist editor, play/volume, shuffle | Wake and interruption rules, supported Steam pages, runtime diagnostics, playlist maintenance |
| **Store Music** | Current Store track, playlist editor, play/volume | Shuffle, runtime diagnostics, playlist maintenance |
| **Music Library** | Existing browser, filters and downloadable music controls | No destructive change to the existing functional library view |
| **Arcade** | Game picker, **Default Size**, **Couch / TV**, AI difficulty, Pong game mode | Four direct categories: Rules, Abilities, Visuals, Players. Controller Bridge and packs stay under Advanced |
| **Settings** | Theme controls and everyday interface/notification toggles | Visualizers/Footer, Downloads/Helpers, Advanced/Recovery, Overrides/Backups |
| **Health** | Diagnostics and troubleshooting | Retains its existing dedicated page |

## Arcade essentials are no longer hidden

Open GTM -> Arcade:

1. **Choose Game** expands the game list inline within Quick Access, no context menu or floating modal. Choosing a game closes the list and shows that game's own settings.
2. **Game Size** has two separate, visible controller-focusable buttons: **Default Size** and **Couch / TV**. The active choice is highlighted. This uses the existing `homeReactiveVisualizerArcadeView` setting (`standard` or `couch`) and affects the current game without deliberately restarting it.
3. **AI difficulty** is directly visible for built-in games; Pong uses its existing Pong difficulty value, and the other built-in games keep their independent game-specific difficulty. Community packs do **not** falsely claim they support the built-in AI option.
4. Pong's six gameplay modes are directly accessible on the overview, including Morph Battle, Mindball and Chaos.
5. **Rules | Abilities | Visuals | Players** are four direct category controls laid out as two focusable rows. One group at a time is displayed. A game switch selects its Rules category and retains the saved tuning for each game.
6. **Advanced -> Controller Bridge** is still collapsed by default; community pack management is independent from the currently selected category, so opening packs no longer makes the game-category navigation appear missing.

All Arcade tuning and controller selectors stay inside the Decky panel. The release deliberately does not add native Steam dropdown/context popups or layered Arcade modals.

## Playback-first pages

Game Music's Soundtrack Manager remains one click away, while less common provider, App ID and key-chord controls are behind clear inline expandable sections. Ambient and Store surfaces retain their same music controllers and state subscriptions while splitting their visible panels into practical groups. Settings separates everyday notifications and theme controls from the much longer visualizer configuration and maintenance. A section opens with A/Cross; it does not navigate away, stop music, or reset an Arcade match.

## Compatibility retained

- GTM 4.2.9 functionality, six built-in games, morphing Pong, Mindball, community game packs and previously added per-game settings.
- Adaptive difficulty defaults, 15-second readiness, intentional Triangle join, return-to-AI and disconnect guard.
- Prior sleep/wake protection, audio ownership, crossfade and ResonaDeck coexistence.
- Saved GTM settings and local game tuning. No forced settings reset.
- Existing Steam Input LB/RB tab navigation, A/Cross selection, B/Circle close.

## Validation performed

`bash GTM_4.2.10_RUN_REGRESSION.sh` passes, including frontend syntax, python syntax, sandboxed pack validation, game simulations, controller ownership, Pong morphs, audio-focus, crossfade, wake/sleep and visualizer performance tests.

New tests:

- `node tests/arcade_430_layout_visibility.cjs` asserts game selection, both size controls, AI, Pong modes, four direct settings categories, per-game tuning and Controller Bridge are reachable by the intended UI path.
- `node tests/arcade_430_all_tabs.cjs` verifies the Ambient, Store and Settings grouping preserves all original controls and keeps primary music controls visible.

**Not yet verified:** actual SteamOS Quick Access focus, readability on a television, CSS Loader skins, native focus restoration after changing categories, physical PS4 controller navigation, update-to-first-frame latency and continuous music during real hardware installation. This is a private Preview, not a Stable release.

## Suggested on-Deck check

Update from 4.2.9. Return to Home and confirm AI demonstration resumes without the unintended Waiting for Players state. In Arcade, select Default Size, then Couch / TV, and confirm both resize without touching music or the match. Switch Pong mode to Morph Battle, open Abilities, switch to racing, and confirm its own Rules/Abilities/Visuals/Players appear. Use a controller to step between the four category buttons. Next, check Game Music, Ambient, Store, Library, Settings and Health for readable, reachable controls. Check that scene playback does not obscure Quick Access or Steam context menus.
