# Validation — Game Theme Music 3.5.7

## Regression targets

1. Music Library: select several tracks. On Destination, Right must focus Add Selected, Right again must focus Clear, and Left must walk back. Up/Down must still move between rows.
2. Library fit: Search, View, Refresh, Destination, Add Selected, and Clear must all remain visible at the Deck Gaming Mode viewport.
3. Sticky destination: choose a game in Games, then use RB through Ambient and Store into Import. Import must show that game and its artwork. Explicitly entering Library/Find/Import from Store or Ambient must still target that context.
4. Local Import: queue multiple files, start Import or Import + Add, and verify the progress strip visibly animates and advances through copy/assign/complete states.
5. Store playback: with Store Music enabled, imported local tracks and downloaded online tracks must both start on the Steam Store. Closing Quick Access must not leave the surface stuck as assignment.
6. Decky replacement: start a cached/local Store track in 3.5.6, install 3.5.7, and verify the same transport/position is adopted rather than restarted.
7. Preserve notification artwork, manager artwork, deep YouTube search, preview-first workflow, and the locked 3.0.7 controller/theme foundation.
