# GTM 4.2.2 Preview: Built-In Arcade Library Recovery

## Why this hotfix exists

4.2.1 included all six Arcade games in the ZIP, but the GUI displayed only **one** (Neon Paddle Championship). The five new games were registered only after an asynchronous backend pack RPC succeeded. On Steam Deck, that call may fail or provide a partial list, leaving Arcade in a permanently incomplete state. A Decky/Python module-path difference could also make the optional format-3 validator unavailable.

## Changes

- **Six games available immediately:** GTM now registers both trusted, validated built-in manifests inside the frontend before Decky initializes, even if pack-list RPC has not completed.
- **Partial pack responses cannot erase built-ins:** the optional pack RPC merges imported packs into the canonical embedded built-ins instead of replacing the built-in list. Real user-imported pack validation still happens on the Python backend.
- **Fallback validator:** the format-3 validator can load from GTM's installed plugin path even when Decky's Python search path is missing that directory.
- **GTM Arcade is the game browser:** the music Settings category dropdown no longer lists GTM Arcade or its game entries. The Arcade page continues to host game selection, Pong arena, view modes and game controls.
- **Accurate built-in count:** only six official games count toward “built-in” status; later community scenes won't inflate that number.
- **Version labels:** frontend and backend correctly identify 4.2.2 Preview.
- All 4.2.1 game behavior, local multiplayer, current arena art, Couch/Default View, Pong power gauges, music focus and shuffle behavior are otherwise preserved.

## Installation and testing

This is an installable Preview ZIP. Keep 4.2.1 for rollback. The new `GTM_4.2.2_RUN_REGRESSION.sh` includes a test that deliberately simulates pack service failure, an empty response, and partial response. In all cases, all six games remain registered. Older gameplay, controller and playback tests are still included. Actual Steam Deck/UI validation is required before Stable promotion.

**On the Steam Deck:** Open GTM Arcade, confirm the game dropdown lists Neon Paddle Championship, Beat Catcher, Orbital Duel, Orbit Defenders, Target Roll, and Prism Bastion. If it still shows one, verify 4.2.2 is active, restart Decky and inspect the displayed error details. Do not repeatedly reinstall packs; the six are built in.
