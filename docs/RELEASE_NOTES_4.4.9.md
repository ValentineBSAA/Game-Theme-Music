# Game Theme Music 4.4.9 | Pong AI-vs-AI Scoring Fix

**Developer:** Valentine  
**Version:** 4.4.9  
**Status:** regular numbered release (no Beta suffix). Initial hardware checks passed; wider compatibility QA is ongoing.

## Fixed

A five-minute spectator match could remain 0–0 after two AI paddle agents had learned high defensive precision. The previous system improved skills on every return without balancing offensive difficulty; it was possible to make over 300 returns without a goal.

- A new **spectator-only rally director** increases pressure gradually after 13 seconds of continuous ball play without a goal. This produces momentary defensive fatigue, slower reactions and less exact predictions during exceptionally long rallies; it **does not change the saved learning profile**.
- As a rally extends, AI shots gain carefully bounded corner angles so superior learned defense has a realistic challenge. Genuine ball travel and paddle collision still determine every goal.
- The pressure resets after a **real goal**, and pauses correctly during serves/goal celebrations/match transitions. Existing AI learning, powers, color changes and match variations are untouched.
- Bounded velocities, non-finite ball recovery, rear goal-line scoring, and 90 Hz physics remain as before. No timer-based or fabricated score is awarded.

## Preserved from 4.4.8

- Valentine’s per-version full-screen Home-screen welcome, route checks, saved acknowledgment and Steam Deck A/Cross control.
- Visualizers and Arcade Spectator pages, nested browse-only categories, accurate ACTIVE/SAVED scene indicators.
- Colored theme-adaptive ON/OFF switches, color/reaction settings, CSS palette support, Default/Couch-TV controls, persistent Shuffle All OFF.
- 17 built-in Visual Worlds, visualizer-pack installer, 32 power effects, adaptive learning, saved settings.
- Steam/non-Steam game soundtracks, ambient/store playlists, crossfade and ResonaDeck integration.
- Zero new human-playable or multiplayer Arcade systems.

## Automated validation

- Reproduced original bug: **two learned-max AI scenarios completed five simulated minutes at 0–0**, with 342 and 316 returns.
- Patched engine: corresponding 300-second runs recorded **12 and 10 genuine goals**, with no ball-recovery events.
- Eight randomized five-minute runs: all scored, longest tested scoreless gap **45 seconds**.
- All 12 match-physics modes tested for 180 simulated seconds each with max-skilled opponents: every mode scored, greatest scoreless gap **36.1 seconds**.
- Frontend `node --check`, backend `python -m py_compile`, JSON, original archive preservation, embedded fallback-manifest version and ZIP integrity checked.
- Home welcome, nested category controls and shuffle persistence regression checks remain required in the final packaged candidate.

## Initial Steam Deck verification and follow-up QA

1. Install GTM 4.4.9 over 4.4.8, leave your existing saved settings intact and confirm the version is **4.4.9**.
2. Start Neon Paddle AI-vs-AI on Home, including with a previously trained high-skill AI profile. Watch for real return-to-goal action and legitimate scoring. The change **reduces the risk of five-minute 0–0 matches** but is not an enforced score timer.
3. Switch between Classic, Thunder, and Starlight courts, and through Gravity/Zen/Chaos when available.
4. Confirm the full Home welcome, Visualizers categories, colors, footer, Shuffle All OFF, ambient music, and ResonaDeck still behave as in 4.4.8.

**Physical hardware verified so far:** Valentine confirmed that the 4.4.9 full-screen Home welcome appears correctly and that Pong AI-vs-AI scored a genuine goal. The remaining scenarios above are follow-up regression checks, not completed hardware certifications.
