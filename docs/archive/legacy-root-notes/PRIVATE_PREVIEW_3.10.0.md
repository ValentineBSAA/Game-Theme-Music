# GTM 3.10.0 Private Preview: Theme-Matched Footer + Decky Store Navigation

- FIX: natural Ambient end-of-song hardStop temporarily published `idle`, causing the mounted visualizer footer to disappear for a frame and expose Steam's own CSS footer. The footer now recognizes Ambient's explicit automatic transition token, maintains the same canvas across this controlled idle gap (up to 20 seconds), and still hides on a genuine Stop, manual pause, overlay or game navigation.
- STYLE: sample CSS Loader's actual Home footer background, ignoring GTM's overlay. Use it as the top of an opaque theme-tinted gradient, with a darkened lower stage to block Steam title bleed-through. Recheck periodically when CSS Loader theme changes. No hard-coded navy transition flash.
- FIX: Decky Plugin Store (`/decky/store`) is a Quick Access overlay, not a Steam native Store music surface. Do not start the Store playlist or replace Ambient music when this overlay opens/closes. Preserve native Steam Store audio rules.
- FIX: an Ambient section shuffle toggle must not silently advance the song on the specific Home/Store boundary. The user's actual playlist selection and Next/Previous remain unchanged.
- PRESERVED: 3.8.9 CORS fix, 3.8.10 draw continuity, 3.9.0 prepared-next audio resolution, Desktop/GTM JSON diagnostics, music engine.

### Verify on real Steam Deck
1. Let 5+ Ambient tracks finish naturally, checking no glimpse of the original CSS footer during the `idle` event.
2. Switch between multiple CSS Loader themes including light and wine-red/dark themes. The stage should blend to the actual CSS color at its top while staying opaque beneath.
3. While an Ambient song is playing on Home, visit Decky Plugin Store then return Home. The same track and playback position should remain.
4. Explicit Next, Previous, Stop, Pause, Steam native Store music, Quick Access and Decky updates should retain prior behavior.
5. If unexpected audio navigation occurs, capture Desktop/GTM JSON plus visible Home/Store route details.

No GitHub changes; hardware verification pending.
