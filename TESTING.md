# Hardware testing

Game Theme Music needs testing on Steam Deck configurations other than the developer’s own hardware.

## 3.7.0 Mini Player HUD acceptance checks

- Set **Settings → Interface & Feedback → Show mini player HUD** OFF; music must continue with no HUD on Steam and non-Steam game pages.
- Check native Steam Store, Decky Plugin Store and Home Ambient playback with the HUD hidden.
- Restart the Steam Deck; the OFF preference should persist.
- Switch HUD ON; the next actual playback event should show the mini player again.
- Check that theme notifications and the HUD visualizer have independent settings.
- Try disabling while a ribbon is already visible and while Quick Access is open. There should be no delayed reappearance.
- Confirm ResonaDeck audio-focus behavior still works.

These checks extend the developer's initial successful physical Steam Deck tests. Report OS/Decky version and reproduction details when possible.

## High-value checks

1. Install / reload / uninstall.
2. Native Steam game soundtrack start and stop.
3. Non-Steam shortcut soundtrack behavior.
4. Ambient playback on supported Steam surfaces.
5. Steam Store playback and stop timing.
6. Shuffle, repeat, Previous, Next, and volume.
7. Artwork in the Quick Access player and full manager.
8. Local import and downloaded-track playback.
9. Controller focus with LB/RB and D-pad navigation.
10. Coexistence with ThemeDeck or other audio-related Decky plugins.
11. ResonaDeck audio-focus pause and safe resume.

## Useful report format

- Steam Deck model:
- SteamOS version:
- Decky Loader version:
- Game Theme Music version:
- Other related Decky plugins:
- Steam or non-Steam game:
- Steps to reproduce:
- Expected:
- Actual:
- Screenshot/log:

Please do not include account tokens, cookies, or other private data in logs or screenshots.
