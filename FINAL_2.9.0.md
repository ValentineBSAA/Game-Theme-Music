# Game Theme Music 2.9.0 — Final Feature Baseline

2.9.0 is the final planned feature release for this GTM branch. It freezes the hardware-proven 2.8.7 playback behavior and adds only the observer-only Media Bridge v1 needed by future companion visual plugins.

The bridge does not replace, wrap, or control AudioEngine playback. No live wallpaper code is bundled in GTM. Future wallpaper development should remain an independent Decky plugin and consume GTM only through the documented bridge when GTM is present.

Future GTM updates should be limited to compatibility, security, provider maintenance, Steam/Decky breakage, or confirmed bugs unless a new feature release is intentionally reopened.
