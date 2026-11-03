# Game Theme Music 3.0.0 Validation

## Static validation performed
- JavaScript bundle syntax checked with Node.
- Python backend syntax checked with Python compileall.
- package.json and plugin.json parsed as JSON.
- ZIP structure verified to contain a single `Game Theme Music/` plugin root.
- Existing 2.9.12 binaries/assets preserved.

## Hardware checks recommended on Steam Deck
1. Open GTM under the stock Steam theme and verify all seven page buttons are controller-focusable.
2. Enable a very light CSS Loader theme and confirm cards/text/switches remain readable.
3. Swap to a dark theme while GTM stays open; the palette should rescan automatically.
4. Settings → Adaptive appearance → Rescan Steam theme should update diagnostics without stopping audio.
5. Verify Game, Ambient, and Store playback still owns audio exactly as 2.9.12 did.
6. Verify STEAM-button media controls remain opt-in/session-armed.
7. Verify Desktop Mode still hard-stops GTM playback.
8. Verify Library, Health, backup/restore, yt-dlp update/rollback, and direct App ID route.

The adaptive sampler deliberately has a fallback palette so host DOM/CSS changes degrade appearance gracefully instead of breaking playback.
