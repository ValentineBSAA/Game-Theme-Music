# Game Theme Music 2.0 performance changes

The 2.0 release deliberately avoids feature bloat.

Performance rules:
1. Game page playback is local-first.
2. Steam game launch never waits on theme cleanup.
3. Search asks providers for a small useful result set.
4. Search result metadata is cached for 90 seconds.
5. Download-state checks are batched.
6. Playlist state distinguishes last-played from next-to-play.
7. Existing 1.9.1 cache/settings structures migrate in-place through compatibility fields.

Compatibility:
- `playbackCursorId` is still read and written as a compatibility alias.
- 1.8 `videoId` themes still migrate into the playlist.
- Existing downloaded media and downloads.json remain valid.
- yt-dlp and QuickJS remain bundled.
