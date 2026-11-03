# Game Theme Music 2.7.22 validation

## Purpose
Consolidate the working 2.7.21 non-Steam shortcut fix and remove the repeated 10–15 second media-resolution delay without changing the proven native-Steam, Ambient, Store Music, notification, or mini-player visual systems.

## Timing architecture
- Non-Steam local miss releases Ambient immediately.
- Backend resolved YouTube URLs are cached with expiry awareness.
- Concurrent URL requests share a single yt-dlp task.
- Direct URL extraction uses `yt-dlp -g` instead of full JSON serialization.
- Configured non-Steam active tracks are prewarmed after plugin startup.
- Successful remote-only shortcut themes are materialized into shared Download Storage in the background.
- Later visits therefore prefer local loopback playback.

## Static validation
- `node --check dist/index.js`: PASS
- `python -m py_compile main.py`: PASS
- package.json parse: PASS
- plugin.json parse: PASS
- Direct Decky toast call count remains 28.
- AudioEngine byte-identical to 2.7.21.
- AmbientController byte-identical to 2.7.21.
- StoreController byte-identical to 2.7.21.
- Mini-player appearance intentionally unchanged.

## Hardware test
1. Install 2.7.22 and wait on Home roughly 10–15 seconds once so startup prewarming has time to finish.
2. Open MW. Ambient should stop immediately and MW should start much faster than the old repeated-delay path.
3. Return Home and reopen MW several times. Repeat visits should be near-immediate.
4. Restart Decky, wait briefly on Home, and reopen MW. Once background materialization has completed, it should use local loopback storage.
5. Open a normal Steam game to verify the proven native path is unchanged.
