# Game Theme Music 2.8.7 — Desktop Mode hard playback block

Desktop Mode (Decky EUIMode 7) is now a persistent AudioEngine playback gate rather than a one-shot hard stop. All GTM AudioEngine load/play/rewind requests are rejected while Desktop Mode is active. Returning to Gaming Mode clears the gate.

This applies to game themes, Ambient, Store, previews, and Auto-DJ previews because they share the singleton AudioEngine.
