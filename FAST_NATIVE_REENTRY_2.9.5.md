# Game Theme Music 2.9.5 — Fast native-Steam re-entry

## Root cause

2.9.4 correctly stopped unrelated fallback music, but it exposed an older download-index race. Backend startup maintenance reconciled the download index after four seconds. Before the frontend had necessarily re-sent its playlist pin set, reconciliation rebuilt `pinned` from an empty in-memory set. Assigned files could therefore become eviction candidates. When a native Steam game later opened with its exact assigned file missing, 2.9.4 correctly re-resolved that same media ID instead of choosing a substitute, but cold provider extraction could take many seconds.

## Fix

- Seed backend `_pinned_ids` from persisted `downloads.json` before startup maintenance.
- Re-send all playlist pins immediately from frontend startup.
- Keep native Steam local-first playback unchanged.
- Add a delayed idle repair pass for missing active native-Steam tracks.
- Repair uses only the exact saved track ID/provider and materializes it into Download Storage.
- Never search for or substitute another track during repair.
- Leave the proven non-Steam shortcut warm path unchanged.

## Safety invariant

A game page may play only a track explicitly present in that game's saved playlist. If exact-track repair fails, the result is silence, not automatic discovery.
