# Game Theme Music 2.9.6 — Ambient & Store Playlist Workshop

This release closes the usability gap where Ambient and Steam Store playback existed but users could only choose from audio that had already been downloaded elsewhere.

## New creation flow

Open either playlist from the Game Theme Music Quick Menu, or use a game's context menu and choose **Ambient Music Playlist** or **Store Music Playlist**. The same controller-first workshop opens in both places.

The workshop supports:

- Search online using the configured source (Automatic, YouTube, or KHInsider).
- Download a search result directly into the selected global playlist.
- Import a local audio file from Downloads, Music, or Home.
- Add/remove any already-downloaded or imported track.
- Up to 15 tracks per global playlist.
- B or **Save playlist** commits the playlist.

## Storage ownership repair

Ambient and Store playlist IDs now participate in the backend pinned-ID set. A track referenced only by Ambient or Store is no longer considered disposable during storage reconciliation.

## Performance

AmbientCenter and StoreCenter no longer scan the download library every time the Quick Menu renders. The library is loaded only when the playlist workshop is actually opened.
