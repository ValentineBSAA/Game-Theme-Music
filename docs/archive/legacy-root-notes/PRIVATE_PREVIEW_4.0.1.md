# GTM 4.0.1: PRIVATE Track-Handoff and Cache Preview

**Build:** 4.0.1 (based on user's 3.11.0 private build), 2026-11-01. No GitHub publication. The 3.11.0 baseline was specifically retained for rollback.

## What was wrong

- Local songs entered a HEAD + full-file GET + Blob creation path, potentially waiting for a file as large as 96 MiB before audio could begin. A `fastLocal` exception existed only for some Ambient transitions.
- Ambient prefetched the URL for its next track, but Store Music still resolved a new URL only *after* a handoff began. URL readiness and decoder/CDN playback readiness are different.
- When old asynchronous resolution completed after a newer manual Next/Previous, an older request could still attempt to load audio if its track happened to remain in the playlist.

## 4.0.1 changes

1. **Stream cached music immediately.** Downloaded/imported tracks use the protected loopback server and HTTP Range support; playback no longer awaits full-file browser Blob mirroring. If an existing continuity Blob is already prepared, it can still be used directly. The existing optional mirroring helper remains but is not a blocking playback step. Decky update endpoint-adoption logic remains present.
2. **Store next-track preparation.** Unified Store Music resolves its upcoming item during playback, independently from Ambient's existing preparation. Plugin Store and Steam Store remain two surfaces of *one Store Music session*, so switching between them never advances the queue just to change surfaces.
3. **Stale-request protection.** An obsolete Store or Ambient resolution cannot overwrite a newer Next/Previous selection or a changed playlist. Older completion handlers also cannot clear the newer request's in-flight guard.
4. **Privacy-safe diagnostics.** Capture JSON now includes `storeTransition` with anonymous prepared/resolved/playing timings. It continues including the existing `ambientTransition` timing history. No song titles, audio URLs or stream tokens are logged in the new fields.
5. **Conservative versions.** New fixes use 4.0.2, 4.0.3 and so on. Feature additions may use 4.1.0; no automatic major jumps.

## Preserved behavior

- Ambient/Home playlist, unified Store Music playlist and per-game Game Themes remain distinct. Game Music has priority. Exiting Store restores Ambient from its saved track/time; Store remembers its own position and queue.
- Decky Plugin Store and native Steam Store share their Store Music owner, while ordinary Decky QAM panels do not unexpectedly start Store Music.
- The opt-in Canvas2D Live Footer remains below cards, respects CSS Loader's actual footer color and hides when switched Off. Its CORS reactive audio capture and animation continuity are unchanged.
- Optional mini-player HUD, ResonaDeck audio-focus gate, notifications, settings persistence, and Decky updates are retained.

## Simulated checks

`node GTM_4.0.1_REGRESSION_TESTS.cjs` validates version markers, preserved surface classification and visualizer hooks, streaming without a full-file Blob wait, Store URL prefetch, and stale requests in Ambient/Store. `node --check dist/index.js` and `python -m py_compile main.py` validate syntax. These are *not* physical Steam Deck tests.

## Physical Deck checks

1. Start Ambient on Home, let five tracks change naturally (both downloaded/local and remote sources). Note every gap. Try manual Next/Previous in rapid sequence.
2. Test Decky Plugin Store and native Steam Store, including a direct store-to-store switch. Track and elapsed position should be preserved. Next/Previous inside Store should not wait for whole-file copying.
3. Return Home from Store: resume the same Ambient track/position. Enter a game: its Game Theme takes priority.
4. Switch Live Footer Off and On; verify music continues when the effect is off, remains theme-matched when on and never flashes the underlying footer on song changes.
5. Confirm downloads, playlist ordering, shuffle, game assignments and ResonaDeck focus are intact after restarting Decky.
6. If any handoff is still slow, capture GTM JSON and inspect `ambientTransition` or `storeTransition`: `resolveMs` indicates URL work; a much larger `playingMs` indicates HTMLAudioElement/media/CDN startup. Do **not** assume remote buffering can be fixed offline.

**Limitation:** The uploaded ZIP contains the compiled front end, not its original TypeScript sources/build environment. The compiled shipping bundle is directly patched and syntax-tested. Further source-level development should recover the actual project source tree for reproducible builds.
