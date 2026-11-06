# GTM 3.8.8 PRIVATE: Desktop/GTM diagnostic capture

**Private build. No GitHub publishing. This build adds diagnostics only; it does not claim to fix Steam Chromium capture.**

## Usage

1. Let the visualizer fail after a natural music track change.
2. Leave the music playing. Do not change scenes or manually skip.
3. Open Decky > Game Theme Music > Settings > Interface & Feedback.
4. Press **Visualizer audio diagnostics > Capture JSON**.
5. Switch to Steam Deck Desktop Mode and open `~/Desktop/GTM/`.
6. Send the newest `GTM-visualizer-diagnostic-*.json` file for investigation.

The backend creates Desktop/GTM if missing and reports a clear success/error toast. It records capture status, the real browser exception when available, media-element readiness, Web Audio context state, track counts/liveness, recovery attempts and recent state transitions. It **does not contain** audio, song titles, source URLs, download tokens, passwords or personal filenames.

The diagnostic is read-only and does not restart music or analyser. It can capture a failure even when `captureStream()` is missing or throws. Physical Steam Deck test of file creation remains required.
