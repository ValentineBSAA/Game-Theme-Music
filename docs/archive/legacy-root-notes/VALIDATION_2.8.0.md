# Validation — Game Theme Music 2.8.0

## Build identity
- package version: `2.8.0`
- author: `Valentine`
- plugin author: `Valentine`
- JavaScript syntax: PASS
- Python compilation: PASS

## Protected playback comparison against 2.7.27
- AudioEngine: **BYTE-IDENTICAL** (`8185d8c1a0369bcc17503b607363a910813abbbd06d72b1ea6039b863b9092b0`)
- Non-Steam/useThemeMusic: **BYTE-IDENTICAL** (`5e5de47a52f5f961f196476a755bc5afcd9f1ba00db2a4a3cc6cd694d48d5f84`)
- 1.9.1 Library injector: **BYTE-IDENTICAL** (`ca34a07483daee9c289d46166a51e66d1e2aeb26d86d2abbceb240815c48c32d`)
- AmbientController: intentional master-volume multiplier only
  - 2.7.27 `c946df702e36284145c77bb7a48ea6c3dcb5baf7722a24890b0fd182522a2fbc`
  - 2.8.0 `ddb4b5b955eb645d32e86d74f6598fcb447447b9b7294f7bf5c041f9fbc61478`
- StoreController: intentional master-volume multiplier only
  - 2.7.27 `ba3bd44be9234f2aad4519cd8c3830720a9769bd3e310301eb84f5669ee17e66`
  - 2.8.0 `ac8b1f64f115efc7dcd0789b5ae15aa1301eb4f9c7561740b78330d857854ae8`
- Legacy191ThemePlayer: intentional master-volume + per-track startTime changes only
  - 2.7.27 `94759786e1ef21766c8f5de96a4c5d5ef37f190b4dff6f1b7eccf062c312c088`
  - 2.8.0 `7c6ae23db0a19030a399abc2c9c08a42e1ff63a8d78da71b0edfa33566661fb4`

## New 2.8.0 systems
- Manual read-only Steam Library Auto-DJ scan.
- Installed/uninstalled/all filters and missing-music discovery.
- Confirmed, serial, cancellable high-confidence bulk assignment.
- Each successful Auto-DJ assignment downloads exactly one selected track before it is committed.
- Existing playlists are never selected as bulk targets.
- Per-game-playlist-track 0–30 second intro skip.
- Master volume for Game, Ambient, Store, and previews.
- Optional passive SAO HUD analyzer/activity meter.

## Bundled helper integrity
- `yt-dlp`: 40446224 bytes, SHA-256 `58162f9bfdc27458ea47bfcb311cf47028f17d8154a8bf7d689861d46399230a`
- `qjs`: 986576 bytes, SHA-256 `772504dcdc78b5ebb3f2c991e8d121ec727c002ac81d4208546fcd3b81c97cd1`

## Packaging safeguards
- bundled font files: **0** (must be 0)
- ThemeDeck BSD 3-Clause notice: present
- yt-dlp notice: present
- QuickJS notice: present
- No startup Auto-DJ scan or bulk assignment.

