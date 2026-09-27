# Game Theme Music 3.6.9 — ResonaDeck Audio Focus Bridge

Based directly on the GTM 3.6.8 baseline.

- Media Bridge v1 remains read-only.
- Adds a separate `resonadeck:audio-focus:v1` window-message contract.
- When ResonaDeck acquires audio focus, GTM remembers the exact current owner/track and pauses it.
- While focus is active, GTM transport play requests remain inaudible.
- When ResonaDeck releases focus, GTM resumes only when the same owner/track remains paused.
- No playlists, themes, artwork, volumes, providers, Store behavior, Ambient behavior, or library data are intentionally changed.
