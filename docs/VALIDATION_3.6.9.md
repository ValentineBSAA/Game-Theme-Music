# Game Theme Music 3.6.9 — ResonaDeck Audio Focus validation

**Build-time status:** STATIC VALIDATED · originally marked HARDWARE UNVERIFIED

Source baseline: Game Theme Music 3.6.8.

Only the cooperative external audio-focus seam and version/docs were changed. Existing GTM library, playback, artwork, Store, notification, theme, playlist, and backend behavior were otherwise preserved.

## Bridge contract

- Protocol/event: `resonadeck:audio-focus:v1`
- GTM listens on both `window.message` and the same-name CustomEvent.
- `active=true`: if GTM is audibly playing, remember the exact owner/track and pause it.
- While focus is active, GTM AudioEngine will not restart soundtrack playback.
- `active=false`: resume only when GTM was paused by ResonaDeck and the same owner/track is still loaded and paused.
- Plugin unload releases focus so GTM is not stranded paused.
- Existing read-only Media Bridge remains `playbackControl:false`; capability adds `externalAudioFocus:true`.

## Static validation passed

- `dist/index.js` JavaScript syntax.
- `main.py` Python compile.
- Package version is 3.6.9.
- AudioEngine active-focus gate is present.
- Listener install/uninstall paths are present.
- External audio-focus capability is advertised.

The packaged 3.6.9 tester has subsequently been installed on the developer’s Steam Deck. Wider independent hardware coverage is still requested.
