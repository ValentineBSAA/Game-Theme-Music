# Game Theme Music 4.4.1 · Public Beta

**Channel:** Public Beta build (not Stable). **Base:** 4.4.0 Public Beta Candidate. **Published:** No, this is an installable private handoff for physical review. **Hardware validation:** Pending on the Steam Deck / television. **Changes:** Chess presentation only, plus version metadata and tests.

## Fixed: tiny Chess board in Couch / TV mode

- The screenshot revealed the underlying cause: Chess was constrained to GTM's standard 208px Couch View footer and then consumed only 72% of that height for the board.
- When Neon Chess Championship is active and GTM is set to **Couch / TV**, the chess footer gets its own taller but **non-fullscreen** stage, sized to about 46% of viewport height with an upper cap of 410 CSS pixels and a safe 48vh maximum.
- The chessboard now uses 82.2% of the stage height, stays perfectly square, and occupies the left side. The turn indicator, game mode, move counter, white/black players or timers, and controller hints live on a separate right-side card. Board squares, pieces, selection highlights and cursors all scale together.
- Example synthetic measurement at a 1280-wide viewport: about **302px square** for the board in 4.4.1 versus about **150px square** in 4.4.0 at 208px stage height. TV scaling may vary.
- GTM's Steam Home visualizer remains a **click-through footer**. No intrusive fullscreen window, gameplay interruption, controller remapping, or music-player changes.
- The other Arcade games and visualizers retain their existing stage sizes. Standard non-Couch settings are still honored.

## Unchanged from 4.4.0

- Complete playable Chess rules (legal movement, check/checkmate, castling, en passant, promotion, common draws), local two-player, human-vs-AI and AI exhibitions.
- Chess controls remain **Right Stick = Move; RT = Select; LT = Cancel; LB/RB = Promotion**. A/Cross and B/Circle remain reserved for SteamUI navigation.
- Existing visualizer collection/scene navigation and the repaired Previous/Next page buttons.
- All GTM Arcade games, settings, audio, Pong, Mindball, Ready Up, renderer guards, and Beat Catcher mechanics.

## Verification performed

- Full 4.4.1 inherited automated regression suite: **PASS**. Includes Chess rules/perft 20/400/8902, bounded AI, six-game startup, live audio/crossfade/focus, controllers, Pong, Quick Menu and visualizer navigation.
- New layout test measures a real square board at 1280x368, 1280x331, 800x360, 640x320 and 1280x208. Verifies 64 board cells, piece render, board/status separation, source/bundle parity, Chess-only expanded footer, and unchanged game state. **PASS**.
- Archive integrity and metadata checks performed after packaging.

## Minimal Steam Deck acceptance test

1. Install the new 4.4.1 ZIP and select **Arcade → Neon Chess Championship** with **Couch / TV** sizing active.
2. Confirm the board is visibly much larger, stays square, and the status/controls are on the right while Steam Home remains visible above the chess panel.
3. Watch AI make a few legal moves. If desired, join and check Right Stick + RT. No need to repeat tests across every other Arcade title.

**Do not tag this build Stable until hardware verification.** The earlier minor Pong controller-handoff hitch remains a known issue; this release does not change Pong or claim to fix it. This ZIP has not been uploaded to GitHub or the private NAS Decky store.
