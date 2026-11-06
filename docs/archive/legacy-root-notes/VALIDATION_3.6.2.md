# Game Theme Music 3.6.2 Validation

## Validation result before packaging

- PASS — `node --check dist/index.js`
- PASS — `python -m py_compile main.py`
- PASS — `package.json` and `plugin.json` parse as JSON
- PASS — package/backend/frontend version contract is 3.6.2
- PASS — Find Music uses 3-result chunks, 3-column row CSS, and 3-based result indexing
- PASS — approved Ambient and Steam Store artwork derivatives are present and wired into Soundtrack Manager contexts
- PASS — shared Steam game artwork uses contain-first framing; no later `object-fit: cover !important` override remains on `.gtm-v350-game-art img`
- PASS — Local Import keeps the proven in-button Download + Add treatment with longer minimum visibility, slower fill/shimmer, assignment hold, and completion hold
- PASS — native Store ambiguous-surface CEF probe cadence is tightened while retaining in-flight throttling
- PASS — 3.6.1 AudioEngine block is byte-for-byte unchanged (`6fc47a7acc2ab955...`)
- PASS — 3.6.1 notification-info/artwork block is byte-for-byte unchanged (`a2d1610c10389140...`)
- PASS — deep paged YouTube backend core is byte-for-byte unchanged (`70e0fe9223b96aa5...`)

## Synthetic Store-session regression tests

- PASS — authoritative Home exit stops the Store transport
- PASS — Home exit captures the exact Store timestamp
- PASS — leaving Store preserves the current Store track
- PASS — returning to Store reloads the same logical track at the saved timestamp
- PASS — Store-to-Store surface transition does not restart the transport
- PASS — authoritative Home immediately releases update quarantine instead of waiting on the fixed handoff timer
- PASS — deterministic 3-track shuffle cycle visits all three tracks before a repeat
- PASS — no immediate repeat in the tested shuffle cycle

## Protected hardware truth

The seamless browser-owned audio transport is protected from 3.6.0. A real Steam Deck already demonstrated uninterrupted Store audio across a Decky uninstall/reinstall update with no stop or audible stutter. 3.6.2 does not rewrite the AudioEngine that produced that result.

## Hardware gates still required for 3.6.2

1. Install 3.6.2 over 3.6.1 while Store Music is playing. The active track should remain continuous with no stop, stutter, restart, or queue jump.
2. Immediately leave Store for Home after the update. Store Music should stop promptly instead of lingering for the old 4–5 second quarantine window.
3. Return to either plugin Store or native Steam Store. The same Store track should resume near its saved timestamp and keep its shuffle/history state.
4. Move plugin Store → native Steam Store (and back) while music is already playing. The transport should remain one continuous Store session.
5. With Ambient → Other Deck Pages enabled, Store Music must own the native Steam Store and Ambient must not overlap it.
6. Native Steam Store entry should resolve faster than 3.6.1's multi-second start in typical ambiguous-route cases.
7. A stopped Store session becoming audible again should produce the normal Now Playing notification. Seamless Store-to-Store continuation/update adoption should not spam a duplicate notification.
8. Find Music should show exactly three result cards per row and scroll naturally in groups of three.
9. Digimon Story Cyber Sleuth and Operator 112 should use safer, fully framed game art instead of the over-zoomed crop.
10. Ambient and Store Soundtrack Manager pages should display the approved standalone artwork assets.
11. Fast local imports should still complete normally while the in-button progress treatment remains visible long enough to read.

Until those Deck checks are reported, 3.6.2 is software/synthetic validated, not hardware-confirmed.
