# GTM 4.0.8 Private Test: ResonaDeck focus at GTM hot-update + reduced visualizer flicker

- On GTM reload, read ResonaDeck's **current shared focus state** before Ambient starts, not merely the lost playing event.
- Keep a bounded reconciler while mounted, and use current validated ResonaDeck PCM as an isolated-window secondary ownership indicator.
- Skip stale release events when the actual ResonaDeck owner still says playing.
- No artificial audio-focus release during GTM plugin teardown.
- Gate Ambient start, resume, asynchronous resolving and post-load play on external ownership; prevent new Ambient tracks from overlapping live Plex music.
- When ResonaDeck really pauses/stops, release the focus and restore Home Ambient safely under existing game/Store preferences.
- Keep the footer through up to 18 seconds of confirmed ResonaDeck track handoff; explicit Stop clears it, with no fake audio signal.
- Old visualizer scenes now use a continuous wall clock even during a quiet/transition moment instead of jumping to time=0.
- Seed newly shuffled scenes with the latest validated external PCM, and avoid sampling temporary modal colors as the CSS footer background.
- Existing eight-second GTM and ResonaDeck crossfade engines unchanged. ResonaDeck 1.3.5 does not require an update.

## Steam Deck tests

1. With Plex playing, update GTM to 4.0.8, return Home. GTM Ambient MUST NOT begin until ResonaDeck really releases focus.
2. Pause/Stop Plex while Home: Ambient should resume without visiting any game tile.
3. Resume Plex, and repeat after another GTM reload; only one audible playback source at a time.
4. Let 3+ natural Plex track changes shuffle GTM's visuals; watch for abrupt blank background / frozen frames.
5. During a deliberately slow Plex track load, check footer remains stable for the bounded focus handoff, but clears normally after stopping playback.
6. Verify no Ambient starts while on Store, in a game, or with Ambient disabled.
7. Check the Web Audio fallback remains enabled in ResonaDeck as before.

Status: private, automated regression validation only. Await physical Steam Deck confirmation. Nothing published to GitHub.
