# GTM 3.11.0 PRIVATE PREVIEW: Store Music Context Routing

The Decky Plugin Store and native Steam Store are distinct locations that both use the existing unified **Store Music** playlist and playback owner. Home/Ambient and per-game Game Themes keep their separate playlist assignments.

- The focused Decky Plugin Store now triggers Store Music even when the underlying Steam window URL remains Home. Generic Decky QAM pages do not.
- Steam's native Store continues to use the same Store Music playlist.
- Moving directly Plugin Store -> Steam Store (or back) does not restart, advance, or shuffle the Store song.
- Returning Home releases Store Music, remembers its track/timestamp/queue, and resumes the previously playing Ambient song at its saved timestamp.
- Game Theme priority, disabled Store Music, manual Pause/Stop/Next and ordinary Ambient shuffling are retained.
- Retains 3.8.9 CORS playback capture fix, 3.10.0 CSS Loader matching footer and seamless handoffs, 3.9.0 prepared-next-track, and Desktop/GTM diagnostics.

## Real Deck test
1. Ambient Home -> Decky Plugin Store -> Home. Verify Store soundtrack starts; Ambient resumes same song/time after exit.
2. Ambient Home -> native Steam Store -> Home, with the same expected behavior.
3. While Store music plays, switch Plugin Store <-> native Steam Store. Store song and elapsed position must not change.
4. Ordinary QAM/Decky settings must not activate Store Music. Game Themes still override both playlists while games run.
5. Confirm natural song handoffs and footer appearance remain stable.

PRIVATE build, NOT published to GitHub. Hardware validation pending.
