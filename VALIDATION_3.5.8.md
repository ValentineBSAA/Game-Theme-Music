# Validation — Game Theme Music 3.5.8

## Regression targets

1. Store Music: both the real Steam Store and Decky Store are Store Music surfaces again. Start Store Music in Decky Store, install the next GTM build, and the replacement must adopt the same transport/position instead of restarting.
2. Store/Ambient playlists: every assigned row has A=Preview plus an explicit Preview/Stop Preview control, matching Games.
3. Music Library: focusing a row enables Preview Focused; A still selects/deselects. The action bar uses Decky native `flow-children=right` with no custom Left/Right interception.
4. Library focus: Left/Right must move Preview Focused → Destination → Add Selected → Clear and back. Up/Down leaves the row normally.
5. Online Download + Add: the preview modal shows the same glass-style progress language as Local Import while the existing button progress remains intact.
6. Local Import: preserve the 3.5.7 queue, sticky game destination, smaller artwork column, preview, duplicate-safe content IDs, and import progress strip.
7. Preserve notification artwork, deep YouTube search, local-cache-first assigned playback, and the locked 3.0.7 controller/theme foundation.
