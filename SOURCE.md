# Game Theme Music 3.6.9: source availability

This repository publishes a **version-matched code snapshot** recovered from the *official* Game Theme Music 3.6.9 tester ZIP. The release archive was checked against the published SHA-256 before extraction.

## Browse the code

- [Python backend](main.py): the actual editable `main.py` used in the 3.6.9 release.
- [JavaScript frontend](dist/index.js): the exact, readable **compiled frontend bundle** shipped in the release. This is compiled output, not the original React/TypeScript source.
- [Package metadata](package.json) and [Decky manifest](plugin.json): project metadata maintained for this repository.
- [Artwork and UI assets](assets/): shipped assets made available for inspection.
- [Third-party licensing notes](THIRD-PARTY-NOTICES.md).
- [Working release download](https://github.com/ValentineBSAA/Game-Theme-Music/releases/tag/V3.6.9).

## Important limitations

The supplied 3.6.9 ZIP contains the Python backend and compiled JavaScript frontend, **but does not include the original TypeScript/TSX components, source maps, or complete frontend build configuration**. We cannot honestly claim that this snapshot is a full reproducible frontend source checkout, or that it can be rebuilt with `pnpm build` as-is.

The readable files above are published as an inspection, archival and maintenance reference, not a modified plugin. **For installation, use the original signed-by-checksum 3.6.9 release ZIP**, which contains runtime dependencies excluded here.

Runtime software such as `yt-dlp`, QuickJS and the vendored Mutagen package remains available inside the release ZIP under its respective third-party licenses. Those binaries and vendored libraries are intentionally not duplicated into the browsable project source tree.

## Release integrity

- Release file: `Game-Theme-Music-3.6.9.zip`
- SHA-256 (ZIP): `84364fe71ef5a65b9fae513ba0e8449cf670017f9d51b2da2807df9186d6a1df`
- Backend `main.py` SHA-256: `826f1bb54a4b26868f1c6ceba5721629eab2bde322d99c45fd949d3a62b27a86`
- Compiled frontend `dist/index.js` SHA-256: `f3fcb26f1c1b68f7d3a5f69dd03bf41b4f1e2ab7126db8ee8c57b4e85fecffbf`

The source snapshot is extracted byte-for-byte from the original ZIP; the release itself is not rebuilt or altered.

## Development lineage

Game Theme Music continues the GPL-licensed GameThemeMusic project lineage (OMGDuke → MegalonVII → Valentine) with AI-assisted development under Valentine's direction. See [LICENSE](LICENSE) and [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md).

## Missing unbundled frontend source

If the original `src/` directory and build configuration from this exact 3.6.9 working baseline are recovered, they can be added later without changing this version-matched compiled snapshot. Do not substitute an independently reconstructed frontend and label it as the original 3.6.9 source.
