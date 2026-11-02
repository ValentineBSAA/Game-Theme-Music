# Game Theme Music 4.1.2 | Beta release notes

**Status:** Beta candidate verified by the maintainer on a physical Steam Deck. **Release assets and GitHub release will be published separately by the maintainer.** The previous published beta is [4.0.4](https://github.com/ValentineBSAA/Game-Theme-Music/releases/tag/V4.0.4), with 3.7.0 available as the previous stable release.

## Highlights since 4.0.4

- **ResonaDeck integration:** GTM can display music-reactive Home footer visualizers from ResonaDeck's opt-in Plex audio telemetry. GTM yields audio focus to ResonaDeck; an explicit visualizer OFF command clears the external session promptly while music keeps playing. ResonaDeck 1.4.1 is the paired beta candidate.
- **Smoother, more reliable visuals:** improved transition continuity and no-flash protection, frame pacing aligned with 60/90 Hz display refresh where possible, adaptive render quality for heavier scenes, smoothing between audio telemetry samples, and performance data in Capture JSON. Actual FPS depends on visualizer complexity and device load.
- **Ambient Sleep Mode:** Ambient page contains a delayed-start toggle and adjustable wake/restart delay (5–60 seconds, default 12 seconds). Ambient pauses for sleep, waits after wake or initialization, and resumes with a gentle fade while respecting ResonaDeck audio ownership.
- **More robust suspend detection:** SteamOS backend sleep/wake event monitoring, suspend-aware clock fallback, frontend guards against resumed audio events, and recovery when browser visibility events are missed.
- **Preserved music features:** 22 built-in visualizers, custom packs, Shuffle All, unlimited playlists, unified Store Music, per-game themes, optional mini-player and prebuffered eight-second crossfade.

## Verified on a real Steam Deck

The maintainer reports that **GTM 4.1.2 resumes Ambient correctly after sleep/wake and after restarting the Steam Deck**, using the configured delay instead of immediate full-volume playback. The smoother 4.0.9+ visualizer frame pacing and integration with ResonaDeck were also accepted on hardware.

## Testing and limitations

Automated regression checks previously passed for sleep/restart state simulations, delayed track resolution, ResonaDeck audio-focus handoff, visualizer shuffle, scene continuity, playlists, pack management, and crossfade. They are simulations, not benchmarks or a guarantee for every SteamOS version. No measured universal frame-rate guarantee is claimed.

**Install:** When the maintainer publishes the beta release, install its named `Game-Theme-Music-4.1.2.zip` asset via Decky Loader. GitHub's automatically generated source archive is not an installable plugin. Keep a copy of your settings before updating.

[Hardware validation](VALIDATION_4.1.2.md) · [Getting started](GETTING_STARTED.md) · [Source notes](../SOURCE.md) · [Feedback](https://github.com/ValentineBSAA/Game-Theme-Music/issues)
