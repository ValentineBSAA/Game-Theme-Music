# GTM 4.0.2 Private Preview: Unlimited Playlist Lengths + Track Handoff Refinement

**Release status:** Private test only. Builds from the working 4.0.1 test archive, not the public stable release. No GitHub release or update to the NAS store.

## Requested changes

**Playlist limits removed from all three contexts:**
- Ambient: no 15-track save/load, picker, import, or quick-add limit.
- Unified Store Music: no 15-track save/load, picker, import, or quick-add limit; native Steam Store and Decky Plugin Store remain one Store session.
- Game Themes: no 15-track assignment, save, smart builder, or local import limit.
- Counts now show actual total tracks, not X/15; duplicates are still prevented by existing de-duplication and track-selection logic.

No new fixed playlist cap was substituted. Download storage limits and the safe *batch size for speculative preview URL lookups* are independent of playlist lengths and remain in place. With unusually large playlists the UI may become slower because it has not been stress-tested with thousands of items; the code no longer truncates saved playlists to 15.

## Track transitions

A pending next-track URL resolution can overlap with the active playback request. In 4.0.1 the overlap could trigger another provider/Decky lookup. In 4.0.2 both callers share an in-flight Promise, preventing duplicate work and avoiding wasted provider requests. Prefetch wait increases from 200/250ms to 1,200ms, after which normal resolution shares ongoing in-flight work. Once a provider URL is resolved, it is **not** cached indefinitely (URLs can expire). This targets avoidable lookup delays; remote audio/CDN buffering and Chromium decode latency can still add gaps.

The earlier suspected repeated song was retracted by the user, so shuffle and next-track ordering are deliberately unchanged.

## Preserved

Working 4.0.1 reactive visualizers, native footer background matching, HUD toggle, Decky/Steam Store playback session, Ambient and per-game separation, saved queue/shuffle settings, streaming from local cached files, update session continuity, controller navigation, and ResonaDeck audio focus.

## Checks

- `node --check dist/index.js`
- `python -m py_compile main.py`
- `node GTM_4.0.2_REGRESSION_TESTS.cjs`: verifies 62-track Ambient and Store persistence, removal of picker/game/import quota logic, coalescing of concurrent remote URL requests, 4.0.1 Store/Ambient stale-request protections, local audio URL playback path, and core surface/visualizer markers.
- ZIP integrity and file layout verification.

**Important:** These are synthetic/browser-syntax checks, not measured real Steam Deck audio-gap tests. The provided input ZIP contains the shipping compiled frontend but not the original TypeScript source tree/build dependencies. The runtime bundle was patched directly.

## Steam Deck acceptance test

1. Add at least 20 tracks to Ambient. Save, exit, restart Decky, and confirm every track remains. Repeat with the Store playlist and a game soundtrack.
2. Import several local files beyond item 15. Confirm no silent truncation and preserved ordering.
3. Allow at least five natural transitions in Ambient and unified Store Music; record the silence length for downloaded versus non-downloaded songs.
4. Rapidly press Next/Previous to confirm older fetches never override selection. Observe whether any track really repeats unexpectedly.
5. Move between native Steam Store and Decky Plugin Store without unintended next-track triggers. Return Home and check Ambient resumes.
6. Confirm reactive footer stays aligned to CSS theme, doesn't flash/reset, and mini player HUD remains independent.
7. For a slow gap, capture Settings → Interface & Feedback → Capture JSON; compare `ambientTransition.resolveMs`, `ambientTransition.playingMs`, `storeTransition.resolveMs`, and `storeTransition.playingMs`.

**Rollback:** Reinstall the saved 4.0.1 private ZIP if needed. Do not delete GTM data or saved music.
