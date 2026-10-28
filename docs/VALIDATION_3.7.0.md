# GTM 3.7.0 validation record

**Date:** October 28, 2026  
**Scope:** Optional global Mini Player HUD setting, not a playback-engine rewrite.  
**Hardware:** Developer's Steam Deck (other models/configurations not verified).

## Confirmed on physical Steam Deck
- **PASS:** Settings → Interface & Feedback → Show mini player HUD → OFF hides Now Playing.
- **PASS:** Catherine Classic (Steam game) soundtrack continues while HUD is hidden.
- **PASS:** Need for Speed: Most Wanted (2005) (non-Steam shortcut) soundtrack continues while HUD is hidden.
- **PASS:** Native Steam Store and Decky Plugin Store behavior with HUD disabled.
- **PASS:** Ambient music enabled on the Home screen, playback works, and the mini player does not appear.
- **PASS:** HUD disabled preference survives a full Steam Deck reboot.
- **PASS:** Re-enabling HUD restores Now Playing popups.

## Code and archive gates
- Python syntax and JavaScript syntax verified in the 3.7.0 build.
- Default enabled and persisted disabled states verified in implementation.
- Global visibility gating and queued-event cancellation are implemented independently from audio playback.
- Rebuilt installer starts with the checksum-verified 3.6.9 ZIP and retains the bundled helper programs and runtime libraries.
- Build asserts exact SHA-256 digests of the 3.7.0 backend and compiled frontend matching the physically tested build.
- Final release ZIP receives a SHA-256 checksum in the release manifest.

## Not separately hardware-proven
- Turning OFF during an already visible five-second ribbon.
- Suppressing a queued Quick Access interruption during an immediate OFF transition.
- Health Center's diagnostic HUD test while OFF.
- ResonaDeck audio-focus interoperability on this exact 3.7.0 test run.
- Compatibility beyond the developer's Deck.

These cases are covered by implementation checks or preserved architecture, **not claimed as additional Steam Deck test passes**. Please report regressions.

**Community reporter:** Dollet (GTM Discord bug-reports channel).
