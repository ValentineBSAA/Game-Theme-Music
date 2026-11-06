# Game Theme Music 2.7.20 - 1.9.1 Game-Page Core

This build restores the older Game Theme Music Library-page lifecycle as the playback authority.

## Authority

- Steam `/library/app/:appid` render mounts ThemePlayer.
- ThemePlayer reads the route AppID directly with `useParams()`.
- React mount means the game page is active for GTM.
- React unmount means the game page is gone for GTM.
- No route polling, multi-window visibility union, shortcut DOM coordinator, or same-app route epoch controls playback.

## Critical restored behavior

The old patch appended a fresh ThemePlayer every time the Steam Library page render function produced its App Details container. It did not reject injection because a child with a previous GTM key was still present in a cached React tree. This is deliberately restored for same non-Steam shortcut re-entry.

## Modern systems retained

The 1.9.1 lifecycle drives the current 2.7.x singleton AudioEngine, local loopback media URLs, per-game playlists, persistent cursor, shuffle and loop modes. Ambient and Store Music remain separate modern controllers and yield to the singleton game-theme owner.
