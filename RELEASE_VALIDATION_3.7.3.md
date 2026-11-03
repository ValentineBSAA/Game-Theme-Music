# GTM 3.7.3 PREVIEW validation record

| Check | Result |
|---|---|
| Installation ZIP integrity (CRC, files, duplicate paths) | Automated validation |
| JavaScript syntax and Python AST | Automated validation |
| Package/front-end/back-end version all 3.7.3 | Automated validation |
| Existing playback engine and ResonaDeck bridging retained | Source-diff assertions; not hardware regression proof |
| 12 modes, palettes, theme and stage settings | Source-level and isolated browser rendering checks |
| No player info, no focusable content, pointer-events none | Source-level check |
| Correct bottom anchoring (bottom 0), no old 31px gap | Source-level check |
| Dynamic spectral response from actual audio telemetry | Algorithmic unit tests; hardware still pending |
| Physical OLED/SteamOS CSS Loader bright-footer fix | **NOT YET VERIFIED** |
| WebGL depth acceleration in Steam embedded browser | **NOT YET VERIFIED** |
| Steam Deck FPS/suspend/resume/other CSS theme combinations | **NOT YET VERIFIED** |

Stable 3.7.0 release remains unchanged. This is a private testing preview, not a public release.
