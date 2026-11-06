# GTM 3.8.6 PRIVATE Preview: Persistent Audio Track Bridge

Never publish without explicit developer permission and Steam Deck hardware verification.

## Actual ResonaDeck 1.3.1 reference
ResonaDeck has a persistent HTMLAudioElement-based playback engine and explicit event subscriptions, but NO Web Audio analyser or FFT. This release borrows the durable subscription lifecycle, not a nonexistent ResonaDeck analyser.

## GTM fix
- Capture HTMLAudioElement once per stream lifecycle and listen to its MediaStream `addtrack`/`removetrack` and track `ended`/`mute`/`unmute` events.
- Track identity follows the captured MediaStreamTrack, not merely the reused HTML audio element or stale metadata.
- Retire the previous track on automatic source handoff, and attach Web Audio analysis to the newly captured track via `createMediaStreamTrackSource` when supported.
- Preserve the existing Web Audio context without routing, muting, rewinding, reloading or otherwise modifying playback.
- If Chromium does not produce track events, use periodic checks and capped reacquisition, with diagnostics; failed captures should not require scene cycling.
- Free stream event handlers, analyser nodes, intervals, and shared audio context when the final visualizer subscriber disconnects.

## Verification requirements
- 5+ natural Ambient automatic track finishes, no manual input; visualizer follows each new song.
- 5+ manual Next/Previous changes, without scene controls.
- Reinstall/update Decky while music is playing; music should continue according to existing continuity contract, visualizer may briefly hide then reattach.
- Visualizer off retains Ambient sound and stops sampling.
- Quiet music doesn't generate synthetic beat signals.
- Different CSS Loader theme and ResonaDeck focus integration.
- Browser diagnostic in window.__GTM_AUDIO_CAPTURE_DIAGNOSTIC__, no source URLs exposed.

Only JavaScript audio telemetry changed; no edits to track selection or playback transport.
