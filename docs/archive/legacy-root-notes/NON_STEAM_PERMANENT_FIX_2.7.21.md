# Game Theme Music 2.7.21 — Permanent non-Steam shortcut playback repair

## What the Steam Deck evidence proved

The 2.7.20 flight recorder shows the MW shortcut is already detected correctly:

- shortcut AppID: `3923877808`
- route AppID: `3923877808`
- 1.9.1-style ThemePlayer mounts
- the saved game config loads
- the config contains three tracks
- selected track: `86khmc6y1yE`

No `legacy191-theme-start` event follows.

The same diagnostics ZIP shows `86khmc6y1yE` is absent from Download Storage. Therefore the failure is after shortcut detection but before playback.

## Root cause

2.7.x made initial game-page theme resolution local-only. Older 1.9.x behavior could resolve a configured provider track directly. A migrated/non-Steam configuration can therefore be perfectly valid while its local file is missing, leaving newer builds with no audio URL.

## 2.7.21 behavior

For native Steam apps, the 2.7.20 local-first path is unchanged.

For non-Steam shortcuts:

1. Use Download Storage when the configured track exists locally.
2. If it is missing and it is a provider-backed track, resolve a fresh playable provider URL.
3. Start playback from that URL immediately.
4. Schedule a background download of that exact configured track.
5. Once repaired, future visits use the local loopback copy.

This is a general non-Steam compatibility bridge. There is no MW-specific AppID exception.

## Flight recorder events

- `nonsteam-track-local-miss`
- `nonsteam-track-stream-recovery`
- `nonsteam-track-recovery-failed`
- `nonsteam-track-repair-start`
- `nonsteam-track-repair-complete`
- `nonsteam-track-repair-failed`
