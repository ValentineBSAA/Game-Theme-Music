# Game Theme Music 4.1.1 | Ambient Sleep Mode

**Steam Deck / Decky Loader**

GTM 4.1.1 changes how Ambient music behaves after a fresh Steam/Deck reboot or Steam Deck suspend/resume. An enabled Ambient playlist remains automatic, but **does not play immediately at wake**.

## New controls: Ambient music
- **Sleep Mode • delayed Ambient start:** ON by default for new and existing users. OFF keeps previous immediate automatic playback behavior.
- **Wake / restart delay:** configurable **5–60 seconds**, default **12 seconds**.
- After that delay, Ambient starts or resumes **only if the current Steam page allows Ambient, no game or Store music has priority, and ResonaDeck is not playing**.
- First playback after sleep/wake starts with a gentle **1.6-second fade-in**, rather than jumping abruptly to the saved volume.
- Open GTM's own Ambient preview to play explicitly without waiting for the automatic Home delay.

## Sleep and reboot safety
- The guard starts before Ambient's first polling pass following plugin initialization.
- A hidden SteamUI page pauses Ambient and cannot restart it while hidden.
- Wake is detected with visibility/page-resume events and a fallback check for browser timers delayed by suspend.
- Any in-flight Ambient audio-source lookup is invalidated when the grace period begins, to prevent delayed audio from starting unexpectedly.
- The guard is scoped to **Ambient** only: it does not pause Plex, change Store/Game transport, or override ResonaDeck audio-focus priority.

## Preserved
All 22 visualizers, imported visualizer packs, Shuffle All, 60/90Hz-aware frame pacing, no-flash scene changes, automatic 8-second crossfade, unlimited playlists, Store music, ResonaDeck audio-focus and immediate external-visualizer OFF/ON behavior.

## Suggested Steam Deck verification
1. Leave Ambient enabled on Home, set Sleep Mode ON and the delay to 12 seconds.
2. Reboot Steam Deck while on Home; Ambient should stay silent for the delay, then fade into music automatically.
3. Let Ambient play, suspend the Deck, wake it, and check it remains silent until the delay passes.
4. Play Plex in ResonaDeck through that delay; Ambient must not start over it. Once Plex pauses/stops, Ambient may resume if Home is eligible.
5. Set Sleep Mode OFF and verify that the previous immediate automatic behavior returns.
6. Check custom delay values (5 and 30 seconds), Store/game route protection, and normal crossfade.

**This build has passed offline simulation and regression tests. Real Steam Deck suspend/resume behavior must still be verified on hardware.**
