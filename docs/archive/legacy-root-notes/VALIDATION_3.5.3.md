# Game Theme Music 3.5.3 Validation

Baseline: **3.5.2**. Donor-only truth: **3.4.8 notification artwork path**.

## Scope

3.5.3 is a surgical regression/continuity release. 3.5.2 remains the functional baseline. No 3.4.8 manager, navigation, search, playlist, or theme code is restored.

## Notification artwork

- Now Playing takes `gameTrack.thumbnail` / `activeTrack.thumbnail` directly, matching 3.4.8.
- The 3.5.1/3.5.2 notification-only `local_artwork_data_url` / `cache_artwork` conversion path is removed from `useMiniPlayerInfo`.
- The artwork node is restored to the 3.4.8 direct `<img src=artwork>` behavior.
- Backend artwork caching remains available for Manager/offline hero artwork and is not rolled back.

## Decky Store update continuity

- The existing SteamUI-owned `AudioEngine` remains persistent across frontend module replacement.
- Cached/local main playback is mirrored to a browser-owned Blob URL before playback.
- Blob state lives on the same long-lived SteamUI window as the AudioEngine.
- Resource matching maps the Blob back to the stable local audio filename, so the replacement build does not reload/restart the same song.
- Blob cache is bounded to 3 entries / 96 MiB best-effort. A HEAD size gate leaves oversized local files on the normal loopback path, and mirroring failure always falls back safely.
- Remote provider playback keeps the existing continuity behavior.
- The 60-second orphan watchdog remains: a real uninstall/failed replacement does not leave ghost music forever.

## Preserved fixes from 3.5.2 / 3.4.9

- Ambient/Store fresh return state
- decorative LB/RB indicators outside the focus tree
- Games action-rail focus repair
- direct selected-game context launch
- non-Steam alias cleanup
- assigned-track local preview warmup
- Steam hero fallback/polish
- R2/Enter search and paged discovery
- 3.0.7 live-theme/controller/audio foundation

## Hardware checks

1. Start a downloaded track and confirm Now Playing artwork matches the working 3.4.8 behavior.
2. Change to another track/provider and confirm artwork changes with it.
3. While a downloaded/local main song is playing, install 3.5.3 over 3.5.2 from Decky and verify no stop, restart, or seek-to-zero occurs.
4. Confirm the same track position continues after the replacement frontend/backend returns.
5. Verify Ambient additions still show the fresh count after Back and the Games action rail still navigates one step per press.
