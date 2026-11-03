# Validation 2.7.24

## Syntax / package
- `node --check dist/index.js`: PASS
- `python -m py_compile main.py`: PASS
- `package.json` version: 2.7.24
- `plugin.json` author: Valentine
- Direct Decky notification calls: 28 (unchanged from 2.7.23)

## Frozen playback / resolver blocks
- AudioEngine: byte-identical to 2.7.23 = true · SHA-256 `8185d8c1a0369bcc17503b607363a910813abbbd06d72b1ea6039b863b9092b0`
- AmbientController: byte-identical to 2.7.23 = true · SHA-256 `c946df702e36284145c77bb7a48ea6c3dcb5baf7722a24890b0fd182522a2fbc`
- StoreController: byte-identical to 2.7.23 = true · SHA-256 `ba3bd44be9234f2aad4519cd8c3830720a9769bd3e310301eb84f5669ee17e66`
- useThemeMusic: byte-identical to 2.7.23 = true · SHA-256 `7653c7435b83209907b51dfdc8773e06559a85db599c2490e39c54c0bea04a39`
- Legacy191LibraryInjector: byte-identical to 2.7.23 = true · SHA-256 `ca34a07483daee9c289d46166a51e66d1e2aeb26d86d2abbceb240815c48c32d`

## 2.7.24 notification identity assertions
- Game-theme presentation metadata stores the active `track.id` and configured `track.title`.
- Game-theme title prefers the active track title instead of the parent game name.
- The parent game name remains secondary surface context.
- Game-theme `trackKey` includes the active track ID, so playlist transitions are distinct playback events.
- Metadata is updated before initial game-theme load and before playlist advance load.
- Metadata is cleared on the owning ThemePlayer unmount.
- No provider, cache, Ambient, Store, AudioEngine, startup-prewarm, or non-Steam resolution logic changed.
