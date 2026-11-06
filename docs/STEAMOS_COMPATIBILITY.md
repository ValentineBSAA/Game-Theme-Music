# GTM 4.6.7: SteamOS, Decky and CSS Loader compatibility

**Current public release:** [GTM 4.6.7](https://github.com/ValentineBSAA/Game-Theme-Music/releases/tag/V4.6.7) · Active music-first maintenance.

## Verified on the maintainer's physical Steam Deck (November 6, 2026)

- Three independent GTM Library context-menu shortcuts behave correctly when hidden or shown.
- A–Z page selection and LB/RB controller paging work.
- Store Music starts in both **Steam's native Store** and the **Decky Plugin Store**, and stops on leaving the corresponding Store.
- Native Store exit detection was tightened in 4.6.7. The final Store checks were performed **without restarting the Deck**.
- GTM yields Store audio to ResonaDeck music already playing.
- With visualizers enabled, idle Home stays free of unwanted visuals; supported playback can activate the visualizer.
- ResonaDeck frequency-reactive visualizer movement was recovered by toggling its GTM Visualizers sharing OFF/ON. **Not a universal guarantee that first-time audio capture always connects automatically.**

## Compatibility and known limitations

- Native Steam Store navigation and Decky overlays can expose stale routing data after Steam/Decky updates; compatibility may require later adjustments.
- CSS Loader theme support is maintained, but not all light/dark or community themes were physically retested.
- Performance improvements reduce avoidable work but don't guarantee a measured opening-time improvement on every Deck.
- Current **Arcade Spectator is watch-only AI-versus-AI**, not controllable multiplayer.
- Imported packs, TV/Couch layouts, sleep/wake, every Decky/SteamOS build and lengthy streaming sessions have not been universally verified.

If a hot update leaves stale UI state, close/reopen Quick Access; restart Steam if necessary. A full Deck reboot is **not required** as standard install guidance.

For support include the GTM version, SteamOS/Decky versions, CSS theme, whether the issue is **Decky Plugin Store** or **native Steam Store**, and steps to reproduce. Avoid posting private credentials.

[Release](https://github.com/ValentineBSAA/Game-Theme-Music/releases/tag/V4.6.7) · [Testing](../TESTING.md) · [Notes](RELEASE_NOTES_4.6.7.md) · [Report an issue](https://github.com/ValentineBSAA/Game-Theme-Music/issues/new/choose)
