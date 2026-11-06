# Game Theme Music 3.6.9 — ResonaDeck Audio Focus bridge validation

Status: **STATIC VALIDATED · HARDWARE UNVERIFIED**

Source baseline: user-supplied Game Theme Music 3.6.8 ZIP.

Only the cooperative external audio-focus seam and version/docs were changed. Existing GTM library, playback, artwork, Store, notification, theme, playlist, and backend behavior are otherwise preserved.

## Bridge contract
- Protocol/event: `resonadeck:audio-focus:v1`.
- GTM listens on both `window.message` and same-name CustomEvent.
- `active=true`: if GTM is audibly playing, remember exact owner/track and pause it.
- While focus is active, GTM AudioEngine will not restart soundtrack playback.
- `active=false`: resume only when GTM was paused by ResonaDeck and the same owner/track is still loaded and paused.
- Plugin unload releases focus so GTM is not stranded paused.
- Existing read-only media bridge remains `playbackControl:false`; capability adds `externalAudioFocus:true`.

## Passed
- `dist/index.js` JavaScript syntax.
- `main.py` Python compile.
- Package version is 3.6.9.
- AudioEngine active-focus gate is present.
- Listener install/uninstall paths are present.
- External audio-focus capability is advertised.
- Original user-supplied GTM 3.6.8 archive remains unchanged.
