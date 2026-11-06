# GTM 4.4.5 | Spectator Quick Menu and Shuffle Persistence Preview

**Release type:** Private preview, not stable. **Base:** GTM 4.4.4 Spectator Quick Menu Shuffle Persistence Fix.

## New build version and unchanged functionality
- Incremented to **4.4.5** to distinguish this install from 4.4.4 in Decky Loader and the private NAS Deck Store.
- Aligned version metadata in `plugin.json`, `package.json`, Python backend fallback, compiled JavaScript frontend, the embedded spectator manifest and the bundled spectator visualizer manifest.
- Preserved the complete 4.4.4 spectator engine, AI learning, changing paddle and ball effects, animated arenas, original effect bank, 17 visualizer scenes, regular Visualizers and Arcade spectator Quick Menu tabs, Couch/TV / Default footer modes, color controls and shuffle preference protection.
- Original GTM icons and bundled dependencies preserved.

## Version policy
Every future changed build must increase the plugin version. Update all six version identity points and validate them before publishing. Historical internal names such as `GTM444_*` are **feature identifiers**, not the display version, and remain unchanged to maintain compatibility.

## Publication and testing
Install the **single directly installable** ZIP. This is not an automatic NAS upload or a GitHub release. Test shuffle Off across song changes, plugin restart and actual update; test all visualizer palettes, the Arcade spectator tab and saved footer layout on a physical Steam Deck before publishing stable.
