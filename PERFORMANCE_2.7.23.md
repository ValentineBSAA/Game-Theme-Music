# Game Theme Music 2.7.23 performance pass

## Goal
Keep the now-working non-Steam shortcut path while removing the remaining startup and first-handoff contention.

## Critical-path changes
- Loopback HTTP audio server starts before storage reconciliation/eviction housekeeping.
- Housekeeping waits four seconds after backend startup.
- Frontend non-Steam prewarm waits 4.2 seconds, then an idle window, instead of starting at 500 ms.
- Only one cold non-Steam track is provider-resolved per idle warm cycle.
- Local checks for warm candidates use one batched backend call.

## Provider acceleration
- Resolved provider URLs are persisted at `resolved-provider-urls.json` with expiry timestamps.
- A still-valid URL survives a Decky/plugin reload and bypasses a new yt-dlp extraction.
- Concurrent callers continue to share one in-flight yt-dlp resolver task.

## Materialization
- Persistent caching is queued and returns immediately.
- It waits six seconds so initial playback/buffering has priority.
- YouTube uses the direct URL already proven by playback instead of a second yt-dlp extraction.
- Response Content-Type determines the stored extension for correct loopback MIME.

## Local-file hot path
- Download-index last-access writes are debounced, so `local_audio_url` no longer waits on an immediate JSON fsync before returning the loopback URL.

## Frontend overhead
- Route diagnostics sampler: 250 ms -> 850 ms.
- Navigation trace localStorage writes are debounced to one write per burst.

## Frozen playback blocks
AudioEngine, AmbientController, StoreController, Legacy191ThemePlayer, and the 1.9.1 Library injector are intentionally unchanged from 2.7.22.
