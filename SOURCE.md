# GTM source, licensing and provenance

**Beta preparation status (2026-11-02):** The maintainer has verified the packaged **GTM 4.1.2** build on Steam Deck. The [4.1.2 release notes](docs/RELEASE_NOTES_4.1.2.md), [test summary](docs/VALIDATION_4.1.2.md), and [exact ZIP checksum](docs/RELEASE_MANIFEST_4.1.2.md) describe that package. **Important:** The tracked `dist/index.js` and `main.py` currently reflect the previously published 4.0.4 code snapshot; the 4.1.2 source binaries have not been synchronized in this GitHub update. Do not treat the GitHub-generated source archive as a 4.1.2 installable build. The maintainer will supply the named 4.1.2 beta ZIP separately.

**Public Beta:** [4.0.4](https://github.com/ValentineBSAA/Game-Theme-Music/releases/tag/V4.0.4); **Previous stable:** [3.7.0](https://github.com/ValentineBSAA/Game-Theme-Music/releases/tag/V3.7.0).

The source snapshot is synchronized from the **published, maintainer-tested 4.0.4 RC4 ZIP**: [Python backend](main.py), [compiled frontend](dist/index.js), [built-in pack manifest](visualizer-packs/volume1/manifest.json), and regression tests. Original TypeScript/React frontend source and a fully reproducible build are **not available**. GitHub-generated “Source code” ZIP files are not installable GTM packages.

**Known packaging metadata caveat:** the tested 4.0.4 RC4 installer still contains some older **RC3 wording** in internal JSON descriptions; the actual version and runtime are 4.0.4 RC4. Documentation metadata on the repository is corrected without quietly replacing the tested installer.

[Checksum manifest](docs/RELEASE_MANIFEST_4.0.4.md) · [Release notes](docs/RELEASE_NOTES_4.0.4.md) · [Third-party notices](THIRD-PARTY-NOTICES.md) · [License](LICENSE).

Maintained by Valentine, continuing GPL-3.0-only OMGDuke → MegalonVII → Valentine project lineage with AI-assisted development.
