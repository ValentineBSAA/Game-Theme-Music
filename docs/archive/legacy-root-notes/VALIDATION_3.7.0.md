# Game Theme Music 3.7.0 — Mini Player HUD switch

Status: **STATIC AND LOGIC TESTS PASSED · PHYSICAL STEAM DECK TEST PENDING**

Source baseline: user-supplied `Game-Theme-Music-3.6.9.zip`. No changes to playback engine, audio-focus interoperability, Store/Ambient controllers, media bridge, music discovery, or Steam page injection.

## User preference
- `miniPlayerEnabled` defaults to `true`, so upgrades continue existing behavior.
- Save through the existing Decky global `settings` store, normalized alongside the other settings.
- Visible in both the current Settings Center and the legacy Settings page under Interface & Feedback.
- OFF dismisses a visible ribbon instantly, cancels the delayed show timer, clears Quick Access interruption replays and pending notifications, and cancels queued health-preview tests.
- OFF consumes HUD notification epochs rather than affecting the audio transport. Returning ON waits for a fresh audio event.
- A saved OFF state is respected during the next plugin startup; first hydration prevents a default-ON startup flash.
- Theme notifications, mini HUD position, and visualizer remain separate user preferences.

## Desktop validation
- JS syntax: `node --check dist/index.js` — PASS.
- Python backend syntax: `python3 -m py_compile main.py` — PASS.
- Node logic checks: ON default, OFF/ON normalization, settings independence, both Settings surfaces, instant suppression, cancelled pending events, test-preview OFF/ON behavior, version stamps — PASS.
- Unmodified sections of AudioEngine and Store/Ambient playback controllers compared against 3.6.9 — PASS.

## On-device acceptance (not yet performed)
1. Update 3.6.9 to 3.7.0: old playlists and music play correctly, HUD still appears by default.
2. Settings → Interface & feedback → Show mini player HUD → OFF. Open several Steam and non-Steam game pages, change tracks, and enter/exit Steam Store: music plays, no HUD.
3. Open Quick Access during a new track and disable HUD before closing QAM: no delayed ribbon after close.
4. Turn OFF while the five-second ribbon is on screen: it disappears without stopping music.
5. Restart Decky, verify the OFF preference stays OFF; turn ON and cause a new track event to verify the HUD returns.
6. Try Health → Global mini player test with OFF: notice explains why it cannot arm. Turn ON and retry, then close Quick Access to see the test HUD.
7. Verify ResonaDeck audio-focus pause/resume, Ambient/Store, notifications, artwork, and volume are unaffected.
