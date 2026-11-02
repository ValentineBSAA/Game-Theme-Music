# GTM / SteamOS compatibility notes

**4.1.2 (creator-tested beta candidate):** on an actual Steam Deck, Ambient started correctly after the configured wake delay and also after a full restart. The new visualizer frame pacing was reported smooth in use. The creator also confirmed GTM + ResonaDeck integration during the development cycle.

The test record does **not** include precise SteamOS/Decky build IDs, measured per-scene FPS statistics or certified coverage of every CSS theme. Offline tests cover GTM's 60/90 Hz frame pacing logic, but that is not a promise of constant hardware FPS.

**[4.0.4 published beta](https://github.com/ValentineBSAA/Game-Theme-Music/releases/tag/V4.0.4):** 22 scenes, custom packs, crossfade, large playlists, shuffle and gameplay/Store/Ambient improvements had earlier physical Deck acceptance.
**[3.7.0 previous stable](https://github.com/ValentineBSAA/Game-Theme-Music/releases/tag/V3.7.0):** optional mini-player HUD verified in October 2026.

For a bug report, record the Steam Deck model, SteamOS release/channel, Decky version, selected scene, CSS Loader/theme, GTM version, ResonaDeck version and exact action sequence. **GTM 4.1.2** verified Ambient restart behavior; **ResonaDeck 1.4.1** separately verified Plex resume after sleep/wake, **not** autoplay after reboot.

[Beta test results](../TESTING.md) · [Compatibility issue](https://github.com/ValentineBSAA/Game-Theme-Music/issues/1)
