# Game Theme Music 2.7.27 final notification cleanup

This build is intentionally presentation-only.

- Global SAO mini-player now dismisses after 4 seconds instead of 7.
- Ordinary playback stop events are silent and do not generate a `Stopped` mini-player notification.
- If playback stops while a Playing HUD is visible, it is dismissed immediately.
- The active-track identity is reset on stop so replaying the same track can still show a fresh Playing notification.
- Playback engines and the restored 1.9.1 game-page injection path are unchanged from 2.7.26.
