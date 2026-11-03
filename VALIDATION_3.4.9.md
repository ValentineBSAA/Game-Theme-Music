# Validation 3.4.9

Static/package validation performed in the chat build environment.

## Passed

- JavaScript syntax: `node --check dist/index.js`.
- Python syntax: `python -m py_compile main.py`.
- `plugin.json` and `package.json` parse successfully.
- Bundled Mutagen 1.47.0 imports successfully.
- Version identity: package/frontend/backend metadata updated to 3.4.9.
- Pressing A on a game-track card still calls the 3.4.8 preview action.
- Game track rows are native horizontal Decky `Focusable` groups.
- Quick Access and full-screen LB/RB visual indicators are no longer `DialogButton` focus stops.
- Ambient/Store Back restoration reads the live settings ref instead of a mount-time settings snapshot.
- Change Theme Music calls the full-screen manager launcher with the selected App ID.
- Downloaded artwork has a localhost artwork route and local lookup path.
- Download jobs receive source thumbnail metadata for artwork caching.
- Imported local audio attempts embedded-cover extraction through bundled Mutagen.
- Artwork is removed when its downloaded audio is deleted or storage eviction removes it.
- Store metadata now describes the product itself rather than only the current patch.

## Locked-baseline comparison

The following 3.4.8 implementation blocks were compared byte-for-byte and remain unchanged in 3.4.9:

- `AudioEngine`
- `AmbientController`
- `StoreController`

The 3.0.7 live-theme foundation and physical shoulder input owner were not redesigned by this patch.

## Steam Deck hardware checks still required

1. Reproduce the Ambient 12-to-14 track add: after returning with B, the count/list should show 14 immediately without changing pages.
2. Confirm the visible LB/RB indicators never receive controller focus in either the Quick Access plugin or Soundtrack Manager.
3. Games -> selected game -> track card -> Right should enter Preview / Set Active / Edit Track / Move / Remove; Left should return naturally.
4. Cache/download artwork while online, disable Internet, then confirm the artwork remains visible while local preview/playback continues.
5. Test an imported file with embedded cover art offline.
6. Long-press a game -> Change Theme Music should open the full-screen Soundtrack Manager directly on that game's soundtrack workspace.
7. Confirm A on a game soundtrack row starts/stops Preview and never changes the Active track.
8. Perform a real Decky update from 3.4.8+ and verify update-time audio continuity.
