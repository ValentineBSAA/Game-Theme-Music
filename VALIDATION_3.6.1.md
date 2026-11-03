# Validation — Game Theme Music 3.6.1

## Static / synthetic checks
- JavaScript syntax: PASS (`node --check dist/index.js`)
- Python compilation: PASS (`python -m py_compile main.py`)
- JSON manifests: PASS
- Backend CEF Store probe visible-tab protocol test: PASS
- Backend CEF Store hidden-tab rejection test: PASS
- Backend visible embedded Store-frame detection test: PASS
- Frontend Store resolution synthetic cases: PASS
  - concrete Home beats stale CEF/tab Store evidence
  - concrete game-detail beats stale Store evidence
  - ambiguous `other` is promoted by fresh CEF Store evidence
  - legacy Steam-tab probe remains a fallback
  - ambiguous `other` remains `other` when no Store evidence exists
- Ambient/Store priority synthetic cases: PASS (Store wins over Ambient `other`; ambiguous `other` gets a short classification hold; genuine `other` releases afterward)
- Selected-game source-row directional contract: PASS (local focused-control handlers only; no global D-pad listener)
- Local Import visual timing contract: PASS (same progress component, 220 ms minimum per ultra-fast row, 900 ms minimum working phase, 2600 ms completion hold)
- Protected 3.6.0 AudioEngine: byte-for-byte PASS
- Protected notification artwork block: byte-for-byte PASS
- Protected backend deep YouTube search core: byte-for-byte PASS
- ZIP integrity: performed during final packaging

## Hardware truth inherited from 3.6.0
- Decky update audio continuity: **PASS on Steam Deck hardware**. Music survived uninstall/reinstall without stopping, restarting, or stuttering.
- Sticky-game Find Music auto-search: PASS.
- Deep YouTube paging: PASS past 240 results in the user's test.
- Local Import assignment: PASS; requested tracks were added and duplicates were not created.
- Native Steam Store dedicated Store Music: FAIL in 3.6.0. Ambient → Other Deck Pages caused music to play there, identifying Store-as-`other` classification as the key clue.
- Store exit to Home: FAIL in 3.6.0 with roughly 4–5 seconds of lingering audio.
- Selected-game source-row Down navigation: FAIL in 3.6.0.

## 3.6.1 hardware test order
1. Start Store Music in Decky Store on 3.6.0 and install 3.6.1. Verify the same track remains continuous.
2. With Ambient → Other Deck Pages OFF, open native Steam Store. Store Music should start. Check the Store runtime Surface line if it does not.
3. Return Home and time the stop. It should be close to the controller polling/fade cycle, not 4–5 seconds.
4. Turn Ambient → Other Deck Pages ON and repeat native Store entry. Store Music must still own playback.
5. Select a game with an existing soundtrack. Focus Music Library, Find Online, or Import Local and press Down. Focus must enter track 1. Press Up on track 1 and verify it returns to the source row.
6. Import one or more small local tracks and verify the in-button shimmer/fill remains visible long enough to read and admire.
