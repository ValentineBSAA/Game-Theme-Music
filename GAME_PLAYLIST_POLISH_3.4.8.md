# Game Theme Music 3.4.8 — Game Playlist Polish

## Why this release exists

The online preview/download flow is now fast and visually polished, but auditioning an already-downloaded game track was still slower than it should be and the per-track controls made the game soundtrack list feel like a secondary-menu trap.

## Changes

- Game-track Preview calls `local_audio_url` first.
- The online/provider resolver is only used when there is no local copy.
- Edit Track uses the same local-first preview rule.
- A on the main track row is Preview / Stop Preview.
- Set Active is a separate explicit action.
- Preview does not mutate the active track.
- Track cards label DOWNLOADED, ACTIVE, and PREVIEWING separately.
- The main row tells the user `A Preview • Right More`.
- Preview is the first action in the row action rail.
- Moving focus to another track stops the old temporary audition.

## Preserved from 3.4.7

- instant/bounded online preview warm queue
- preview-before-download behavior
- centered portal-safe preview dialog
- cinematic high-contrast download progress
- unified Soundtrack Manager
- native single-step D-pad navigation
- game title recovery
- update-time AudioEngine continuity
- 3.0.7 live-theme baseline
