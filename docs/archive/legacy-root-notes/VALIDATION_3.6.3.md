# Game Theme Music 3.6.3 Validation

## Validation result before packaging

- PASS — `node --check dist/index.js`
- PASS — `python -m py_compile main.py`
- PASS — `package.json` and `plugin.json` parse as JSON
- PASS — package/backend/frontend version contract is 3.6.3
- PASS — Find Music remains 3-result chunks, 3-column row CSS, and 3-based result indexing
- PASS — approved Ambient and Steam Store artwork derivatives remain present and wired into Soundtrack Manager contexts
- PASS — Steam game artwork is now slot-tuned instead of one-size-fits-all: default hero contexts use cover, while explicit import contexts use contain framing
- PASS — Local Import keeps the proven in-button Download + Add treatment with longer minimum visibility, slower fill/shimmer, assignment hold, and completion hold
- PASS — native Store ambiguous-surface CEF probe cadence remains intact
- PASS — 3.6.2 Store-session continuity core remains protected; this build targets presentation, not Store transport rewrites

## Hardware gates still required for 3.6.3

1. Install 3.6.3 over 3.6.2 while Store Music is playing. The active track should remain continuous with no stop, stutter, restart, or queue jump.
2. On the Games page, verify wide game artwork fills the hero slot cleanly again without obvious white side bars.
3. In Find Music with a selected game, verify the selected-game banner uses the premium wide fit and still looks centered.
4. In Local Import targeting a game, verify awkward artwork stays readable inside the framed panel and does not collapse into a tiny strip floating in empty space.
5. Recheck known trouble cases such as 112 Operator and American Truck Simulator so the same artwork no longer looks correct on one screen and broken on another.
6. Ambient, Store, and Library banners should remain unchanged and continue using the approved generated artwork.
7. Find Music should still show exactly three result cards per row and scroll naturally in groups of three.

Until those Deck checks are reported, 3.6.3 is software/synthetic validated, not hardware-confirmed.
