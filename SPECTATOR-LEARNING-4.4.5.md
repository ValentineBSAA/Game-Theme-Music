# GTM 4.4.5 Spectator Learning Preview

**Channel:** private test preview, not stable. This replaces the earlier 4.4.5 Spectator Preview without changing semantic version.

- Two independent Pong AI profiles learn from observed successful returns, missed intercepts, point results and directional prediction errors. Learned timing and prediction accuracy improve within bounded skill caps, so both AIs can still miss.
- Shots begin targeting zones where the opponent historically missed, without teleportation or pre-knowledge of future motion. Exploratory personality changes keep a little unpredictability.
- Local-only, versioned, compact learning state is stored in Steam WebView localStorage when available. If storage is blocked, the AI still learns while the plugin is running. No cloud training, external calls or hidden network traffic.
- Each fresh match selects a different arena, ball shell, paddle pairing, personality pairing, tempo and automatic power-up rhythm. Paddle skins also change mid-match. Original 32 power catalog remains, including original physics-affecting powers.
- Five additional spectator game engines use observed hits, misses, captures, kills, base health or round outcomes to adjust their demonstration AI skill, rather than a fixed 0.68 AI-versus-AI setting. Original music, crossfade, ResonaDeck link, Decky front-end and complete effects are retained.
- All Arcade gameplay inputs remain disabled and the Arcade Quick Menu tab remains removed. Historic gameplay code is present for its AI, simulation and visual effects only.
- All performance guards and one-folder ZIP structure inherited from 4.4.5 are preserved. Not tested on a real Steam Deck. Do not publish stable before actual hardware tests.

## Observation / debugging
In a supporting JavaScript console, `window.GTM444SpectatorLearning.snapshot()` provides the per-side hit, miss, score, skill and learned shot-zone statistics. It contains no personally identifying information.

## Limitations
This is online heuristic adaptation, not a trained neural network. Improvements are capped for fairness. Changing plugin WebView storage or clearing app data can reset long-term learning; session learning remains unaffected.
