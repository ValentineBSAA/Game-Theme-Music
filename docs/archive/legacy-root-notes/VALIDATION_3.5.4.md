# Game Theme Music 3.5.4 Validation

## Scope

3.5.4 is an Import-page presentation and native-focus release. It keeps 3.5.3 as the playback/artwork baseline. No AudioEngine, notification-artwork, AmbientController, StoreController, provider, downloader, or 3.0.7 live-theme behavior is intentionally replaced.

## Static checks

- JavaScript syntax parses successfully.
- Python backend compiles successfully.
- plugin.json and package.json parse successfully and report 3.5.4.
- ZIP integrity test passes.
- Import has no raw D-pad/left-stick listener.
- Import Target and Start Folder are direct members of one `flow-children=down` Focusable container.
- The two import actions are contained in one `flow-children=right` Focusable row.
- Physical LB/RB section controls remain in the existing Soundtrack Manager section rail.
- The game-target artwork path reuses `GtmV350GameArtwork`.

## Steam Deck hardware checks

1. Open Soundtrack Manager -> Import with a game target selected. Confirm the game hero appears.
2. Press Down repeatedly. Focus should move Target -> Start Folder -> first import action without jumping to Close.
3. On the import-action row, Left/Right should move between Import to Library and Import + Add.
4. Press Up from the action row. Focus should return to Start Folder, then Target.
5. Confirm LB/RB still changes manager sections and the visible LB/RB anchors have not moved.
6. Import a local MP3/FLAC/WAV into the Library. Confirm it appears in Music Library.
7. Import + Add to a game and confirm the resulting local track appears in that game's playlist.
8. While a downloaded/local main track is playing, install 3.5.4 over 3.5.3 and confirm playback does not restart or seek to zero.
9. Confirm Now Playing notification artwork still renders and Games/Import artwork both remain correct afterward.
