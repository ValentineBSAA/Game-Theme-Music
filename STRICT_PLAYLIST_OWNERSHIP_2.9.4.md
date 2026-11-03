# Game Theme Music 2.9.4 — Strict playlist ownership

This stability release closes a cross-game playback leak.

## Rules

1. A specific Steam game detail page is never an Ambient surface.
2. If a game has an explicit playlist, only IDs in that playlist may play.
3. A missing local copy may be re-resolved only by the exact assigned media ID.
4. Automatic game-theme discovery/playback is retired; saved `automatic` modes behave as Manual.
5. Suggest-and-ask may search only when the game playlist is empty and never auto-plays.

These rules prevent unrelated Ambient or discovery tracks from appearing under games such as Demonologist or The Last of Us while preserving Ambient for normal Steam browsing.
