# GTM 4.1.6 Preview: Store Playback and Pong Visibility Hotfix

**Status:** Private Preview, not stable. Based on 4.1.5; keep your working 4.1.3 or other confirmed-good build for rollback until real Deck playback tests pass.

## What changed

1. The Store playback controller no longer references Ambient's nonexistent local `sleepSurface`, which could abort playback when Ambient was enabled. This affects Steam Store and Plugin Store because they share the controller. Intentional Store Pause now has a Store-scoped guard, and Ambient pause keeps its separate ownership guard.
2. Stars, comets, nebula motion and storm rain are visibly animated at normal couch viewing distance. Pong's silent backdrop uses a modest ~16 FPS redraw cadence; unrelated visualizers are unchanged.
3. The footer has a readable match HUD with separately framed scores, team names, a dedicated 00:00 timer, match number, series standings, champion/next-match countdown and serve countdown. This is a dark, opaque high-contrast panel rather than blended text over scenery.
4. The game court is shifted below the HUD, including paddles, ball, trails, powers and victory particles, so the scoreboard does not hide gameplay.
5. The match clock is corrected against the elapsed wall time even when simulation is capped for performance. Suspend jumps remain bounded.

## Steam Deck acceptance checks

- On the Steam Store, with Ambient **enabled**, verify assigned Store Playlist music begins, plays and advances. Repeat in the Decky Plugin Store. Try leaving and returning to each Store.
- Open Quick Menu and intentionally pause/resume, then confirm switching music owners still works without restarting. Verify Ambient and Game music are unaffected.
- In GTM Signature, select **Starlight Rivalry**, check obvious star and comet drift before playing music and stronger music-driven activity when music plays. Test Thunder Championship rain/lightning.
- Watch a complete Pong match and confirm the timer advances at normal speed, the announcement remains readable, all gameplay stays below the HUD and the series countdown resets correctly.
- Verify no white flash on scoring, resetting or shuffle transitions. Check controller usability, frame pacing and battery impact.

## Limitations

Source-level Node regression tests and browser canvas rendering checks have been run, but this is **not** a physical Steam Deck acceptance pass. Actual Steam Store and Plugin Store playback could still be affected by other SteamUI integration problems. Do not publish stable until physical tests pass.
