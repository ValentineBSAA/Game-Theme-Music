# Game Theme Music: Hardware testing and automated regressions

## 4.4.1 Public Beta: what was actually checked

The following is **maintainer-reported testing on a physical Steam Deck**, not independent laboratory certification. "Verified" means a reported working experience in the specific tested setup, not every mode, timing scenario, controller type or SteamOS build.

| Component | Hardware acceptance | Notes |
| --- | --- | --- |
| Original GTM visualizer collections | **Reported working** | Navigation and scene selection accepted; older physical screenshot gallery remains valid as historical evidence. |
| Neon Paddle Championship | **Verified** | Single-player/AI and local multiplayer work. Minor AI ↔ controller transition stutter is still known. |
| Orbital Duel | **Verified** | Local multiplayer works in the maintainer's test. |
| Orbit Defenders | **Verified** | Local multiplayer works. Space-invaders-inspired survival/defense game. |
| Neon Strike Gallery | **Reported working** | Multiplayer *believed* to work, but not explicitly verified in this report. |
| Beat Catcher | **Not fully hardware-verified** | Classic and Piano Lanes included; automated tests passed, no comprehensive Deck acceptance for each mode. |
| Neon Chess Championship | **Very early alpha** | Larger focused board displays and functions visually on physical hardware. **Gameplay is bare-bones and not accepted as complete/verified**. It may change or be removed. |
| Home/Ambient and soundtracks | **Previously verified (4.1.2)** | Prior hardware confirmation of sleep/wake, music and ResonaDeck interaction. Does not certify every new 4.4.1 combination. |

### Known issues and unverified claims

- **Pong:** a short stutter remains possible when humans join or return control to AI; this is not a Steam Deck operating-system crash.
- **Chess:** early-alpha status is deliberate. The board resize solved a visual problem, **not** all chess UX, difficulty, or gameplay quality.
- **Arcade experiment:** developer estimates that the majority of features work, but no formal test coverage percentage is claimed.
- **Frames per second:** no guarantee of 60/90 FPS for every scene or game. No exhaustive tests on every SteamOS/Decky build.
- **Arcade future:** inclusion in a beta is not a commitment to retain every minigame or to build future titles.

## 4.4.1 offline testing

The provided 4.4.1 candidate passed its integrated regression suite: Chess legal-move and controller checks, board layout geometry, Arcade startup, Pong/controller handoffs, audio/crossfade/focus, visualizer navigation and sleep/wake. These are simulated/offline checks, **not evidence of physical Steam Deck testing of every Arcade title**.

To test a downloaded candidate, extract the maintainer-uploaded ZIP and run the version-matched tests included in that package, rather than the older 4.1.2 scripts on main.

## Main-branch regression suite (4.1.2 snapshot)

The main branch remains at 4.1.2 for runtime code; its existing tests are not direct 4.4.1 validation. Typical checks from the repository root:

```bash
node --check dist/index.js
python3 -m py_compile main.py
for t in tests/*-412.cjs tests/GTM_4.1.2_*.cjs; do node "$t"; done
python3 tests/GTM_4.1.2_BACKEND_POWER_TESTS.py
```

**Past verified 4.1.2 hardware behavior:** Ambient delayed recovery after sleep/wake and restart; maintainer-reported smooth visualizer pacing and ResonaDeck audio-focus cooperation. Do not interpret this as verification of ResonaDeck autoplay after reboot.

[4.4.1 release notes](docs/RELEASE_NOTES_4.4.1.md) · [Source integrity](SOURCE.md) · [Submit beta feedback](https://github.com/ValentineBSAA/Game-Theme-Music/issues/4)
