# Game Theme Music 3.1.0 Playlist Studio

3.0.7 is the immutable theme/navigation baseline for this release.

## Playlist Studio
- Ambient and Store editors are split into Playlist, Library, and Find Music views.
- Pressing A in the library stages ADD/REMOVE intent instead of immediately changing row membership.
- Status thoughts are semantic and theme-colored: IN PLAYLIST, WILL ADD, WILL REMOVE, AVAILABLE, ONLINE, NEEDS NAME.
- Apply queued changes in one batch, undo the queue, reset the working playlist, or save directly.
- Stable IDs and stable library rows prevent selection from jumping around.

## Per-game playlists
- The per-game route now mounts the same 3.0.7 live theme engine.
- Playlist cards expose Active, Up Next, metadata health, timing, preview, ordering, and removal in a controller-first layout.
- Track Settings supports start timestamp, optional end timestamp, and optional per-track fade overrides.

## Intelligence
- Smart Playlist Suggestions can score the current search and add up to three strong matches.
- Game Music shows coverage for known per-game configs.
- Music Library can filter names needing repair, duplicate-title groups, and unused audio.
