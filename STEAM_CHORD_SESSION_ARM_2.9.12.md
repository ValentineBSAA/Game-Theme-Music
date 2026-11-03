# Game Theme Music 2.9.12 — session-armed STEAM controls

This release starts from the known-good 2.9.6 package.

The raw Steam input listener is **not** installed at module load, `definePlugin()`, settings load, AudioEngine playback, Ambient startup, Store startup, or game-page mount. It can only be created by the user opening the GTM Quick Menu and pressing **Enable controls** (or by re-opening that panel after previously opting in).

Controls:
- STEAM + D-pad Left: Previous
- STEAM + D-pad Right: Next
- STEAM + X / Square: Stop and rewind
- STEAM + B / Circle: Play / resume

The listener accepts both controller callback shapes seen in Decky/Steam builds. On unload, the registration is always released.
