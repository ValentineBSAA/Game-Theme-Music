# Game Theme Music 3.6.5 Validation

- PASS — JavaScript syntax validation
- PASS — Python compilation
- PASS — package/plugin JSON validation
- PASS — frontend/backend/package version contract is 3.6.5
- PASS — Local Import uses a dedicated `steam_game_import_artwork_url` RPC and separate `gameart_import_<appid>` cache
- PASS — official Steam Import fallback prefers `library_600x900.jpg` before landscape hero/header assets
- PASS — Games and Find Music remain on the existing hero artwork resolver
- PASS — notification brain separately tracks audible epochs and shown epochs
- PASS — a playback event beginning while Quick Access is visible remains pending until the ribbon can render
- PASS — update adoption of the same still-audible event does not create a new notification epoch
- PASS — a stopped/paused session returning to the same track creates one new audible event and can notify again
- PASS — track/owner identity changes create one new notification event

Hardware gates:
1. Check 112 Operator Local Import: it should use Steam library/grid artwork rather than the widened hero cache.
2. Enter native Steam Store from a stopped/non-Store surface: one Store Now Playing ribbon should appear.
3. Let Store music survive a Decky update: no duplicate ribbon merely because GTM was replaced.
4. Open/close Quick Access while the same track continues: no duplicate ribbon.
5. Change Store track: exactly one new ribbon.
6. Move Ambient -> Store: exactly one Store ribbon; Store -> Ambient: exactly one Ambient ribbon.
