# Game Theme Music 3.6.0

## Playback State Machine + Sticky Find Music

3.6.0 is a stabilization release built around one playback owner at a time. Native Steam Store detection now combines Decky-style focused-window authority with BrowserWindow/history signals, bounded window-state checks, embedded Store frames, and a cached SharedJS/Steam-tab probe. Decky Store remains a Store Music surface, while Quick Access is treated as an overlay instead of a Store exit.

Decky replacement handoff now adopts the exact surviving audio transport, logical track and Store queue under a short no-skip quarantine. The retiring controller's track-end callback is frozen during unload so it cannot advance the playlist after it has been replaced. Store has explicit priority over Ambient, while game themes and manual previews continue to own the shared transport when active.

Find Music now follows the sticky selected game across LB/RB, automatically seeds and runs the game soundtrack search, keeps Search available while idle, and adds a compact Steam-artwork/context card. Existing preview behavior, local import queue, YouTube-style Import progress buttons, deep YouTube continuation search, notification artwork, and the locked 3.0.7 theme/controller foundation remain protected.
