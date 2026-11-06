# Game Theme Music 4.1.3 | Experimental visualizer behaviors

Built on the tested 4.1.2 beta. **Not published to GitHub.** This ZIP is for manual preview testing.

## Neon Pong: actual competition

- Paddle collisions can miss; score updates on missed returns.
- Predictive Red and Blue AI with reaction delays, bank-shot estimation, adjustable difficulty, occasional targeting errors.
- First to 5/7/11 points wins; short celebration and automatic rematch.
- 3 gameplay modes: Classic, Competitive, Power Battle.
- Twelve bounded powers: Fire, Ice, Lightning, Plasma, Comet, Gravity, Mirror, Pulse, Shadow, Rainbow, Magnet, and Vortex.
- White ball core, high contrast score plate, visually distinct Red and Blue paddles, on-ball power labels; readability survives Rainbow and Music Reactive global palettes.
- Optional Vivid effects, capped trail/burst work, fixed-step 90 Hz simulation with limited catch-up steps.

## Shared behavior framework

- Registered built-in behaviors support create, fixed-step update, draw, signature-based state restart, and optional dispose.
- Behaviors define their own dropdown options. Future effects can add logic without changing common scene controls or audio engines.
- Imported visualizer packs are still **declarative**. No arbitrary JS, eval, executable hooks or network access from pack ZIPs.
- Current first registered behavior: Neon Pong. Other existing scenes retain their original rendering unchanged.

## Important

Physical Steam Deck validation is still required. Simulations test rules and regressions, not actual FPS/audio/Decky behavior. 4.1.2 remains the released beta. If preview testing fails, roll back using its ZIP.
