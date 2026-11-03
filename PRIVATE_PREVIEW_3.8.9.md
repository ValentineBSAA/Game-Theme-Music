# GTM 3.8.9 Private Preview: Cross-origin audio capture repair

**PRIVATE. Do not publish.** Based on GTM 3.8.8 and real Steam Deck JSON diagnostics.

## Root cause from the user's actual Steam Deck

GTM 3.8.8 played music normally while `audio.captureStream()` rejected with `SecurityError: Cannot capture from element with cross-origin data` after an automatic Ambient track change. Its local audio server sends `Access-Control-Allow-Origin: *`, but the persistent HTMLAudioElement lacked `crossOrigin=anonymous`. Previous 3.8.2 automatic advances sometimes bypassed Blob preparation and loaded the local server URL directly, exposing this mismatch.

## Narrow repair

- Before `AudioEngine.load` installs the new URL, set `audio.crossOrigin = 'anonymous'` for GTM's tokenized, CORS-enabled localhost audio, import-audio, and preview routes and browser-owned blob/data media. Do this only AFTER removing/loading the old source, BEFORE setting the next source. Never mutate an actively playing source just for capture.
- Remove `crossorigin` when loading unknown/external provider media; some external services lack CORS and must still play normally, even if their FFT cannot be captured.
- Preserve the fast local transition, player ownership, playback engine, Decky update-continuity handoff, and all 12 visualizers.
- Keep `Capture JSON` to `~/Desktop/GTM/`. Add privacy-preserving `cors` diagnostics: source class, expected/actual CORS mode, and capture policy; no URLs or tokens.

## Hardware acceptance

1. Install while music is playing to verify transport handoff and subsequent local song transitions.
2. Select Prism Skyline and let 5+ Ambient songs advance automatically without intervening.
3. Verify animation resumes on every song and music starts promptly.
4. If a freeze remains, capture JSON during the failure. Inspect `frontend.cors`, `frontend.captureError`, `frontend.audioElement`, and `frontend.telemetry`.
5. Try a source that is NOT locally cached. If its server lacks CORS, audio must play without risking loading failures; the visualizer may remain unavailable for that track. This is a deliberate playback-first tradeoff.

**Do not claim hardware validation from synthetic tests.**
