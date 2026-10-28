# Game Theme Music 3.7.0: source availability and integrity

The current **3.7.0 stable release** includes the same editable Python backend and readable **compiled JavaScript frontend** as the public version-matched code snapshot in this repository. It is built as a checksum-verified transformation of the previously published 3.6.9 release archive. The exact 3.7.0 compiled frontend and backend SHA-256 values are checked during packaging.

## Browse the code
- [Python backend](main.py)
- [Compiled JavaScript frontend](dist/index.js)
- [Decky plugin manifest](plugin.json) and [package metadata](package.json)
- [Versioned validation report](docs/VALIDATION_3.7.0.md)
- [Release integrity manifest](docs/RELEASE_MANIFEST_3.7.0.md)
- [3.7.0 release notes](docs/RELEASE_NOTES_3.7.0.md)
- [Third-party notices](THIRD-PARTY-NOTICES.md)

## Source and build limitations
The original React/TypeScript/TSX components, source maps and complete frontend build setup are **not** provided by the upstream distributable. This repository offers inspectable compiled frontend code, not a claim of fully reproducible TypeScript source. The distribution ZIP includes helper binaries, vendored Python dependencies, art assets, and notices that are intentionally not copied into the lightweight source browser.

The release workflow starts with the verified 3.6.9 ZIP, verifies its SHA-256, applies the strict 3.7.0 HUD change set, then verifies the resulting backend and compiled frontend against the developer-tested version hashes before packaging. The archive's own final SHA-256 is documented in the release manifest.

## Previous version archival integrity
- [3.6.9 release](https://github.com/ValentineBSAA/Game-Theme-Music/releases/tag/V3.6.9)
- Original 3.6.9 ZIP SHA-256: `84364fe71ef5a65b9fae513ba0e8449cf670017f9d51b2da2807df9186d6a1df`
- Original 3.6.9 Python SHA-256: `826f1bb54a4b26868f1c6ceba5721629eab2bde322d99c45fd949d3a62b27a86`
- Original 3.6.9 compiled JS SHA-256: `f3fcb26f1c1b68f7d3a5f69dd03bf41b4f1e2ab7126db8ee8c57b4e85fecffbf`

## Project and licensing
Continues the GPL-licensed OMGDuke → MegalonVII → Valentine lineage under GPL-3.0-only, with AI-assisted development directed and hardware-tested by Valentine. See LICENSE and THIRD-PARTY-NOTICES.md. Always download install packages from this repository's official Releases.
