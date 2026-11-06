# Physical Steam Deck acceptance for GTM 4.3.0 Preview

This release reduces scene rendering load and contains repeated JavaScript errors. It **cannot** prove or repair an unknown SteamOS GPU reset or Decky Loader process crash without the on-device error report.

**Safety:** Do not repeatedly reproduce a full-system crash. Keep a known-working ZIP available. If a reboot occurs, stop testing the Preview and restore the last working version. Keep the date/time and the game/mode selected.

### What to observe
1. Confirm Arcade → AI Difficulty is set to **Adaptive**, not a manually saved Balanced setting. Check easy/difficult opponents only after an intentional Triangle join, not during the AI demo.
2. On Steam Home, test Pong Classic first in Default Size, then Couch/TV. Leave animation on for a minute while checking Quick Access responsiveness.
3. Test Morph and Mindball only after Classic appears stable; enable cinematic visuals separately, one setting at a time.
4. If the scene reports **ARCADE RENDER PAUSED FOR SAFETY**, note the selected game/mode and whether music keeps playing. The diagnostic object `window.__GTM_ARCADE_RENDER_HEALTH__` has a limited error reason (developer inspection only).
5. Do not test the retired Neon Drift Circuit through old saved selections. It is no longer an active built-in game.

### If SteamUI or the entire system restarts again
The most useful evidence is a previous-boot journal excerpt and Steam/CEF renderer logs collected after restart. In Desktop Mode, a developer can collect a bounded log (review for personal paths before sharing):

`journalctl -b -1 --no-pager -n 250 > ~/Desktop/gtm-previous-boot.txt`

This requires journal access and may be unavailable if logs do not persist or the reboot was not a full OS restart. If SteamUI alone restarted, inspect Steam's current UI/CEF logs instead. Avoid posting the whole unredacted journal publicly.

**Release gate:** Automated regression tests passed. Actual Steam Deck hardware acceptance is pending. Do not call 4.3.0 Stable or publicly publish it based on simulated tests alone.
