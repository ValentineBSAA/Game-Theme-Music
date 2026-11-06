# Game Theme Music 3.5.0 Validation

## Locked foundation
- 3.0.7 live theme engine remains present.
- Existing AudioEngine / Ambient / Store playback code was not intentionally rewritten.
- 3.4.9 focus, offline-artwork, and direct context-menu behavior remain in the package.

## 3.5.0 checks
- Selected game workspace renders Steam artwork before the game title/actions.
- Steam AppOverview/cache artwork is preferred; Valve CDN header is fallback for native Steam games.
- Find Music initial page size is 20.
- Search paging requests later windows using offset/limit and preloads when focus/scroll approaches the end.
- Search is bounded to 80 loaded rows per query to protect Deck performance.
- R2 uses current Decky GAMEPAD_BUTTON_RTRIGGER value 29 and only submits while the Find Music text field is active.
- Enter/NumpadEnter shares the same submit path.
- Steam virtual keyboard is dismissed before search.
- Game Music Refresh / Open-next controls use non-overlapping responsive columns and stack when narrow.

## Static package checks
- JavaScript syntax: PASS
- Python compile: PASS
- JSON parse: PASS
- ZIP integrity: PASS
- Version metadata: 3.5.0

## Hardware gates
Must still be verified on the Steam Deck:
1. R2 while the Steam keyboard is open dismisses it and launches exactly one search.
2. RPG Maker MV (or another selected title) displays usable Steam artwork.
3. A broad query loads 20 results, then preloads 20 more before the bottom without focus jumps.
4. Result count increases as pages arrive.
5. Game Music coverage buttons no longer overlap.

## Foundation byte-identity check
Compared directly with the packaged 3.4.9 baseline:
- AudioEngine class: byte-for-byte identical · SHA-256 prefix `df1e6de5932ed463`
- AmbientController class: byte-for-byte identical · SHA-256 prefix `dd711f9d2283faac`
- StoreController class: byte-for-byte identical · SHA-256 prefix `f722cc1286929ee3`
