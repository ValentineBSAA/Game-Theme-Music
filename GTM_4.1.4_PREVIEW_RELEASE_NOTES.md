# Game Theme Music | 4.1.4 Preview (private validation build)

Source baseline: user-supplied GTM 4.1.3 Preview.

## Included in this ZIP

- **Pong Studio:** 3 GTM Signature Pong scenes, 20 gameplay powers (12 originals, 8 new), configurable best-of-3/5/7/endless championship, configurable reset countdown, a match timer, live series standings, recent match history (last seven results) in the settings view and last champion in session memory.
- **Team Identity:** 10 curated pairings including Purple/Pink and Magenta/Cyan; random matchup per match and two custom hex colors; independent left/right paddle cosmetic styles with intensity preset. White ball core remains consistent.
- **Effects Pack SDK v2:** backwards-compatible safe imports; audio-modulated layer parameters, 17 composable Canvas2D overlay effects with beat/bass/treble/always triggers; frame/CPU safety bounds; protected duplicate scene IDs; built-in and custom pack scenes participate in Shuffle All exactly once.
- **Ambient 1/7 Pause fix:** user-triggered Pause now creates a temporary manual-pause latch respected by Ambient's polling auto-resume; explicit user Resume clears it. Existing sleep guards, ResonaDeck audio focus, surface priorities and auto-play remain separate.
- **Developer map & starter pack:** includes `GTM_4.1.4_EFFECTS_PACK_SDK.md`, `visualizer-packs/sdk-examples/manifest-v2.json`, new regression suites and an independently importable starter ZIP (also included as a separate download).

## Not claimed

- This is **not** a physical Steam Deck acceptance pass, published GitHub release or a stable release.
- Tournament match history is preserved when switching scenes within the current plugin session. It is not persisted to disk across plugin reloads.
- ZIP packs do not run arbitrary community code or inject new game logic. Unknown algorithms need a trusted core update.
- Existing frontend TypeScript source is not in the incoming archive; the installed UI is `dist/index.js`, and the developer-editable behavior snapshot is `src/visualizer-behaviors/runtime-414.js`.

## Focused smoke tests

```shell
python3 -m py_compile main.py
node --check dist/index.js
python3 GTM_4.0.4_PACK_VALIDATION_TESTS.py
python3 GTM_4.1.4_PACK_TESTS.py
node GTM_4.1.4_REGRESSION.cjs
```

Keep the original 4.1.3 Preview ZIP for immediate rollback until the hardware checklist in the SDK is completed.
