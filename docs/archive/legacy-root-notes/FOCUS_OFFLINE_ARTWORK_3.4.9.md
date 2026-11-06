# Game Theme Music 3.4.9 — Focus + Offline Artwork Repair

3.4.9 is a surgical patch on the locked 3.0.7 runtime/theme baseline and the 3.4.8 preview model. It does not redesign playback.

## Fixes
- **Ambient/Store live refresh:** returning with B from Library/Find/Import now reads the latest settings instead of a mount-time snapshot, so newly added tracks/counts appear immediately.
- **LB/RB indicators are no longer controller focus stops:** physical LB/RB still changes pages/sections; the visual shoulder hints remain visible and touch-clickable.
- **Games-tab track focus trap repaired:** each game track is now a horizontal Decky Focusable group, so Right from the main track card enters its action rail and Left can return.
- **Offline artwork:** artwork is cached beside downloaded audio and served from GTM's localhost server. Existing YouTube downloads can backfill art while online; imported local files attempt embedded-cover extraction when Mutagen is available.
- **Context-menu direct entry:** Change Theme Music opens the full-screen Soundtrack Manager with the chosen game already selected.

## Preserved behavior
- Pressing **A** on a game-track card immediately starts/stops preview.
- Preview does not change Active track.
- 3.0.7 live theme engine, AudioEngine, physical LB/RB shoulder handling, Ambient/Store controllers, and update-audio continuity are unchanged.
