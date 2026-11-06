# Game Theme Music 4.4.0 · Public Beta Candidate

**Status:** Installable PUBLIC BETA CANDIDATE, not promoted to Stable. Baseline: 4.3.5 Preview.
**Important:** Desktop/browser, synthetic-controller, physics, and scripted rendering regression tests passed. Actual Steam Deck OLED / docked UI, especially controller focus, remain unverified. No GitHub or NAS release has been published by this handoff.

## New: Neon Chess Championship, sixth built-in Arcade game

- Built into the selectable Arcade game list as a trusted offline engine. Not a decorative visualizer or third-party dependency.
- Real legal move generation with king safety, check/checkmate, stalemate, castling on both sides, en passant, and all four legal pawn promotions (queen, rook, bishop, knight).
- Draw detection includes threefold repetition, 50-move threshold, and insufficient material in common cases. Threefold/50-move are automatically recognized for couch-friendly matches rather than requiring a separate draw-claim UI.
- **AI Exhibition** runs automatically without a claimed human controller, **Player vs AI**, and **two-controller local Chess** use the existing Arcade controller ownership bridge. Human Player 1 controls White and Player 2 controls Black. AI takes unclaimed seats.
- **Right stick** moves the square cursor; **RT** selects a piece or destination; **LT** cancels; **LB/RB** cycles promotion choices before moving a pawn to the last rank. This avoids stealing A/Cross and B/Circle from SteamUI.
- Rules: Untimed, Blitz 3 minutes, and Rapid 5 minutes. Visuals: Neon Hologram, Royal Wood, Gothic Cathedral, Frozen Kingdom, and Space Observatory. **New chess match** resets the board and clocks.
- Adaptive AI uses Chess capture outcomes in the shared assessment system. Its local, fully offline search is intentionally lightweight and time-budgeted to avoid blocking the SteamUI renderer. This is NOT a Stockfish-class engine; advanced tactics, engine workers, puzzles, Chess960 and tournament ladders remain future work.
- AI Exhibition plays legal full games, reports results, and automatically starts another exhibition after a brief result display. The board stays square in the available canvas.

## Fixed: original nested GTM visualizer navigation

- Removed the deceptive **More choices ▶** pseudo-option from SteamUI dropdowns: choosing it changed hidden page state while Steam's popover closed, looking like a dead end.
- Longer ordinary dropdowns now expose real, visible controller-focusable **Previous page** and **Next page** buttons outside the popup and display page position.
- Both original Visualizer selectors, in both locations in Settings, now use visible **collection** and **scene** rows with independent bounded pagination. No nested popover dependency. Scene selection follows the selected collection and stays on the appropriate page.
- Original and imported visualizer collections remain available. Shuffle All Visualizers on Track Change behavior and its saved setting are unchanged.

## Preserved from earlier Previews

- Pong and all six modes, Adaptive Mindball steering, yellow steering indication, Morph combinations, large full-screen Ready Up, AI/human handoff, sound playback, scene engine and renderer safety controls.
- Beat Catcher Classic Catcher and Piano Lanes with tapped/held notes.
- Orbital Duel, Orbit Defenders and Neon Strike Gallery remain active. Racing prototype remains retired. The built-in Arcade now contains SIX games: Pong, Beat Catcher, Orbital Duel, Orbit Defenders, Neon Strike Gallery, and Neon Chess Championship.
- No premature Pinball or Blockfall implementation. Both are still approved future milestones.

## Quality controls and results

- Legal move engine opening positions: exactly 20 legal opening moves, 400 depth-2 positions and 8,902 depth-3 positions. Fool's Mate, castle, en passant, promotion, valid AI move, and controller RT selection tests pass.
- Performance benchmark exposed a dangerous >200 ms chess AI calculation in the first draft. The AI now uses a ~6 ms search deadline with bounded nodes. Final synthetic benchmark maximum ~8 ms in this container; hardware timing may differ.
- All 4.3.x inherited regression tests pass, including renderer exception handling, multiple controllers, music/audio/crossfades, Pong handoffs, sleep/wake, and long gameplay simulations.
- Updated backend manifest validates with the bundled security validator. Source and shipped bundle include the same Chess engine. ZIP self-test and version consistency pass.

## Short physical-device beta gate

1. Install 4.4.0 as a Preview, retain a known-good 4.3.5 backup. Open **Settings → Visualizers** and browse a second page of both collections and scenes, including an original scene. Confirm A/Cross selection and B/Circle back navigation.
2. Open **Arcade → Choose Another Game → Neon Chess Championship**. Watch an AI-vs-AI match long enough for several legal moves, then optionally hold Triangle to claim a controller and try right stick / RT / LT. Confirm the chessboard is readable in **Couch / TV** view.
3. Open **Chess → Rules → New Chess Match** and check that a new board appears. Play at least one ordinary Pong rally to spot an accidental cross-game regression.

A Steam Deck hardware smoke test is required before tagging the package as a public GitHub prerelease. Do not describe the build as Stable or as physically verified yet.
