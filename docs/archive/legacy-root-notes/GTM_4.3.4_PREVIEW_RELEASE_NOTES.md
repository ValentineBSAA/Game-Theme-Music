# Game Theme Music 4.3.4 Preview

**Status:** Private Preview. **Baseline:** 4.3.3 Preview. **Physical Deck validation:** Not performed. **GitHub / NAS:** Unchanged.

## What's new

### Pong: Mindball is now an optional modifier
- In **Arcade → Pong → Abilities**, toggle **Mindball modifier** ON to combine autonomous ball steering with **Morph Battle**, **Power Battle**, or **Competitive**. Classic deliberately remains free of autonomous steering. Existing **Mindball** and **Chaos** modes continue to steer by default.
- Select **Mindball steering strength**: Subtle / Standard / Strong. All choices apply bounded midcourt vertical corrections. The ball does not teleport, change horizontal direction, or steer near the goals.
- Select **Mindball personality**: Adaptive, Curious, Hunter, Trickster, or Survivor. These alter the target trajectory pattern without introducing new scoring rules.
- The yellow active-steering ball cue introduced in 4.3.3 also works when Mindball is added to Morph, Power, or Competitive.
- Modifier and personality changes do not reset current match scores.

### Adaptive AI personalities across built-in Arcade games
- **Arcade → Quick Controls → Adaptive AI personality** now offers **Relaxed**, **Balanced Adaptive**, or **Challenging**, independent of the selected game's difficulty setting.
- The style changes target challenge levels in Pong and other built-in games **only while Adaptive difficulty is selected**. AI-versus-AI demonstrations remain competitive; fixed difficulties and two-human games retain their existing behavior.
- AI does not manipulate ball physics, score, collisions, or target selection to enforce a win.
- This is a small, bounded iteration on 4.3.3's game-aware adaptation, **not** the full Adaptive AI 2.0 redesign. Further game-specific metrics, confidence/explanation UI, skill calibration and more polished interactions remain on the roadmap.

### Preserved from 4.3.3
- Large couch-readable, full-screen Ready Up and live AI match during countdown.
- Seamless handoff introduced in 4.3.2; remaining brief physically observed handoff stutter is a **known, accepted minor issue**.
- Morph status/cooldown messages and blue sustained notes in Beat Catcher.
- Organized Arcade menu, five existing active games, and renderer safety guards.

## Regression test scope
- Complete inherited suite, including low-FPS physics, Pong endurance, render failure containment, controller handoff, music/ResonaDeck focus, sleep/wake, community SDK and version consistency.
- **New** `tests/arcade_434_mindball_adaptive_styles.cjs`: modifier enabled/disabled across all six Pong modes, safe personality steering, strength hierarchy, mid-rally score preservation, Adaptive styles and AI demo invariance, menu setting visibility, editable/source bundle parity.
- Automated suite: **PASS** (`GTM_4.3.4_REGRESSION_RESULTS.log`). These tests are simulated; **they do not certify Decky/SteamUI GPU performance**.

## Minimum physical acceptance
1. From Quick Access, open **Arcade → Pong → Abilities**. In Morph Battle, switch **Mindball modifier** on. See the yellow ball steer mid-rally while Morph abilities remain available.
2. In **Arcade → Quick Controls**, choose the **Adaptive AI personality**. You may notice differences over several matches, not necessarily within one rally. No need to test every game.

**Next milestones:** More fully featured Beat Catcher, Orbital Duel and Orbit Defenders, followed by Blockfall Reactor, Neon Chess Championship and Neon Pinball Reactor. No new games are installed by this Preview.
