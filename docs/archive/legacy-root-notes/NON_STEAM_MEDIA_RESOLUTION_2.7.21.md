# Non-Steam Media Resolution — 2.7.21

## Hardware evidence
The 2.7.20 flight recorder showed MW AppID 3923877808 mounting through the reconstructed 1.9.1 Library player and loading a three-track configuration with selected media ID `86khmc6y1yE`. No `legacy191-theme-start` event followed and Ambient remained audio owner.

## Root cause
The modern `useThemeMusic` resolver had been changed to game-page local-only playback: it called `local_audio_url(track.id)` and returned false if the file was not already in Download Storage. The older 1.9.1 code resolved a configured media ID through its provider via `getAudioUrlFromVideo`, so a configured non-Steam theme did not depend on the newer local-download cache.

## 2.7.21 contract
1. Every game first attempts the fast local file.
2. Native Steam games stop there, preserving the proven 2.7.20 behavior.
3. A Steam shortcut whose local file is missing resolves the configured media ID through its stored/provider resolver.
4. The resulting URL is handed to the existing singleton AudioEngine and the normal 1.9.1-style ThemePlayer mount.
5. No new route, DOM, or AppID ownership system is introduced.

## Diagnostic events
- `shortcut-audio-local-hit`
- `shortcut-audio-local-miss`
- `shortcut-audio-provider-ready`
- `shortcut-audio-provider-miss`
- `shortcut-audio-provider-error`
