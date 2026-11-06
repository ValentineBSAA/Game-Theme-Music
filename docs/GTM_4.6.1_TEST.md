# GTM 4.6.1 · Test build

**For physical Steam Deck verification, not a Stable release.** Developer: Valentine. Based on the working GTM 4.6.0 private test, which used the published 4.5.8 release as its base. Confirm whether unpublished 4.5.9 changes need integrating before public release.

## What changed

The **Settings → Library Context Menu** section now controls exactly **three GTM-owned shortcuts**. Each switch defaults to ON and can be toggled independently:

- **Change Music:** soundtrack shortcut on an individual game card.
- **Change Ambient Music Playlist:** Steam Home/Ambient playlist editor shortcut.
- **Change Store Music Playlist:** Store playlist editor shortcut.

**OFF only hides that shortcut.** It does not turn playback off, delete a playlist, or disable the editor inside GTM. Experimental switches for **TitleDeck, Change Artwork, and Developer** and all code attempting to filter those other plugins' menu entries have been removed.

### Quick Menu page navigation

Pages are ordered A–Z for LB/RB navigation:

**Ambient Music → Arcade Spectator → Game Card Music → Health → Music Library → Now Playing → Settings → Store Music → Visualizers.**

Page IDs were not changed, so saved-page preferences continue to work. Click the full GTM banner to return directly to **Now Playing**. The active page rail shows its position, and page descriptions more clearly explain each area's purpose.

### Welcome and visual feedback

The **Steam Home welcome screen** appears once for 4.6.1 and summarizes this build's actual changes. Previously it still described 4.5.8. The original low-flicker **65 ms ON/OFF** visual feedback was retained. The version badge on the banner actually used by the Quick Menu now uses a contrast-safe, CSS Loader-adaptive panel and readable lettering.

## Steam Deck test checklist

1. Launch the plugin and verify 4.6.1 appears in its banner and the new welcome screen appears on Home once.
2. Open **Settings → Library Context Menu**; verify it contains only three GTM options and all three are ON by default.
3. Turn **Ambient OFF**, **Music ON**, **Store ON**; open a Steam game's menu and verify exactly the expected two GTM rows appear. Change the combination and repeat.
4. Check that **Edit with TitleDeck**, Steam artwork shortcuts, and Developer options are not hidden, moved, or otherwise changed by GTM.
5. Restart Decky and check the GTM shortcut preferences persist; playlist data, ResonaDeck integration, Home/Store audio and game soundtracks continue working.
6. Navigate all nine A–Z pages with LB/RB, including wraparound; return to **Now Playing** using the banner.
7. Confirm dark and light CSS Loader themes both display readable version text and controls. Verify no switch flashing and no long Quick Menu startup delay.
8. Check the Home welcome screen's **Continue** focus, gamepad button mapping and once-per-version dismissal.

Automated tests check the shipped runtime function's independent on/off behavior, preservation of third-party rows, A–Z navigation metadata, welcome highlights and version consistency. Physical Steam Deck verification is still required before publishing.
