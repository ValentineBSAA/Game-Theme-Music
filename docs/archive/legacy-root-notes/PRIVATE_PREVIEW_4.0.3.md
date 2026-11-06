# Game Theme Music 4.0.3 private track prebuffering test

**Private preview; not uploaded to GitHub or NAS store.** Built from the user's confirmed 4.0.2 ZIP.

The user verified Ambient playlists with more than 20 songs work. Changes to unlimited playlists are deliberately NOT modified.

## Optional overlap behavior
The warm/prepared second audio element enables true overlapping audio on **natural** transitions, without changing audio-focus owners. When a prepared song is buffered, GTM begins the next song up to 8 seconds before the previous one ends (or no more than 20% of a short song). Each element has an independent fade envelope. If preloading fails, GTM keeps normal end-of-track behavior. This prototype has no UI settings switch yet and must be verified with physical Steam Deck tests. To rollback, reinstall 4.0.2.

## What changed
The 4.0.1/4.0.2 next-song preparation resolved a URL ahead of time but left the audio element entirely empty until the last song finished. Thus `playingMs` could still be high due to fetch, buffer, decode and Steam Chromium media initialization.

4.0.3 keeps one silent, non-playing HTMLAudioElement loaded with the *upcoming* GTM loopback media. On Next/natural ending, the playback engine **promotes** that existing element. It avoids calling `load()` on that element again, retaining actual network and decoder preparation. On missed prefetch, expired URL or unsupported external source, the existing single-element fallback remains.

Media event guards ensure a retired element cannot emit stale `pause`/`ended`/`playing` into GTM. The existing captureStream visualizer sees the new active audio element through the media bridge and recaptures it. No speculative audio is played until the next song becomes the active transport; only a ready next song is allowed to overlap the outgoing one.

## Diagnostics
Capture JSON includes `nextTrackBuffer` with anonymous warmup status, readyState and elapsedMs, as well as ambientTransition and storeTransition. If the delay persists, collect Capture JSON; compare `resolveMs` and `playingMs`. No song titles or audio URLs in these counters.

## Test on physical Deck
1. Ambient/Home with 20+ songs: allow 5 natural transitions, compare gap lengths to 4.0.2.
2. Confirm visualizer reacts on the next song without having to turn scenes off/on. Watch for flashes and silence.
3. Next and Previous rapidly; verify no stale audio and stable playlists.
4. Test unified Steam Store / Decky Plugin Store playlist and navigation; Home ambient separation still intact.
5. Test downloaded/local songs as well as remote previews, and ResonaDeck audio focus.
6. If the visualizer or playback regresses, reinstall the saved 4.0.2 ZIP without deleting any settings.

**Validation limit:** Syntax and synthetic JS harness tests cannot measure Steam Deck media decoding / network startup. No performance numbers are claimed.

## Important crossfade boundaries
- Only Ambient-to-Ambient or Store-to-Store natural next-song transitions, not navigation between contexts.
- Prepared media must have browser `readyState >= 3` before overlap. A provider that refuses preloading will use existing non-overlap fallback; this build cannot guarantee elimination of every 10–15 second network stall.
- During an update from older GTM, a legacy singleton audio element may have older event listeners; GTM suppresses overlap until a safely-bound new media element has become active.
- Not enabled for manual Next/Previous and not enabled for game-theme/preview handoffs.
- The crossfade is on by default as a private experiment (up to 8s or 20% of shorter tracks). No settings UI toggle yet.
