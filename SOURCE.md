# Source integrity and release channels

## Current GitHub versions (November 3, 2026)

- **4.4.2 Music-First Preview:** Isolated development branch `refactor/gtm-441-music-first`. The exact 4.4.1 binary was used as the source for a controlled gameplay removal, with 17 passive visualizer scenes retained. **Not merged, not stable, not physically verified.** [Changes and tests](docs/MUSIC_FIRST_4.4.2_PREVIEW.md).
- **4.4.1 Public Beta:** [Published prerelease](https://github.com/ValentineBSAA/Game-Theme-Music/releases/tag/V4.4.1), including its original experimental playable Arcade. It remains available and was not modified.
- **4.1.2:** [Earlier public release](https://github.com/ValentineBSAA/Game-Theme-Music/releases/tag/V4.1.2). The current default `main` branch still reflects its runtime snapshot.
- **3.7.0:** [Earlier stable release](https://github.com/ValentineBSAA/Game-Theme-Music/releases/tag/V3.7.0).

## Exact-version provenance

The 4.4.1 release archive `Game-Theme-Music-4.4.1-PUBLIC-BETA-CHESS-FOCUSED-BOARD.zip` was downloaded and verified to match SHA-256:

`f287d2f85eb5e52ec64b38eb4e6702292139e6db128ea379899db88b956cb537`

The isolated feature branch imports the complete release runtime before applying audited transformations to the compiled frontend, Python backend and Visual Worlds pack manifests. The feature branch therefore is **not simply `main` renamed to 4.4.2**. The packaging workflow overlays the tested runtime changes onto the original release ZIP while preserving unrelated shipped assets and helper modules.

**Do not install the repository's automatically generated “Source code” ZIP.** It is not the Decky installer. Use the named installable ZIP artifact once the candidate is tested. The feature branch is not automatically a public stable release.

## Reproducibility and limitations

The repository does not contain the complete original TypeScript/React source toolchain. The feature branch keeps a deterministic `scripts/refactor_music_first_442.py` so transformations made to the verified compiled JS can be audited. Automated checks cover crossfade, focus integration, sleep handling, adaptive rendering, and backend visual-pack safety; they do not prove physical Steam Deck operation.

Review [4.4.2 migration details](docs/MUSIC_FIRST_4.4.2_PREVIEW.md), [historical 4.4.1 notes](docs/RELEASE_NOTES_4.4.1.md), [hardware testing](TESTING.md), [license](LICENSE), and [third-party notices](THIRD-PARTY-NOTICES.md).
