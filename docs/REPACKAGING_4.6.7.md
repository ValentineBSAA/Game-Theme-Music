# GTM 4.6.7: Verified runtime and local repackaging

This is a **verification and packaging** procedure for the already published GTM 4.6.7 runtime. It does not recover the original unbundled React/TypeScript sources, and it does not claim that compiling the historical source tree reproduces the shipped frontend.

## Why this exists

The November 12 source synchronization placed checksum-verified copies of the shipped compiled frontend, Python backend, version manifests and selected assets on `main`. The `V4.6.7` tag predates that synchronization, so its automatically generated source archive is not the Decky installer.

A local 4.6.7 installer ZIP can be independently checked against the tracked files. No network access, private keys, external packages, or changes to the published release are required.

## Commands

From the repository root, use Python 3:

```sh
python3 scripts/verify_release_467.py --repo .
```

This validates all 19 SHA-256 hashes in `docs/VERIFIED_RUNTIME_4.6.7.md` plus the internal GTM version.

To compare a locally supplied installer against the tracked runtime:

```sh
python3 scripts/verify_release_467.py --repo . --baseline /path/to/Game-Theme-Music-4.6.7.zip
```

To create a *separate*, deterministic comparison ZIP (never overwrites the baseline or existing output):

```sh
python3 scripts/verify_release_467.py --repo . --baseline /path/to/Game-Theme-Music-4.6.7.zip --output /path/to/gtm-467-comparison.zip
```

The comparison ZIP takes the 19 first-party verified files from the repository and the remaining bundled dependencies and support files from the supplied baseline ZIP. Every file is checked again after packaging. Existing output paths are rejected.

**Do not publish this comparison ZIP as a new stable release without an independent release review and physical Steam Deck testing.** The ZIP container checksum can differ because compression order, timestamps and metadata change; file-by-file checksums are what establish the scoped runtime match.

## Scope and remaining limitation

- ✅ Check repository runtime integrity against its versioned manifest, in CI on `main` and pull requests.
- ✅ Verify a locally supplied installation package contains the exact checksummed runtime files and required `yt-dlp`/`qjs` binaries.
- ✅ Repackage the verified runtime without silently modifying source files or the original installer.
- ❌ No proof of a clean recompilation from complete unbundled React/TSX sources, which were not included in the 4.6.7 installer.
- ❌ No proof that every third-party binary can be independently rebuilt byte-for-byte.

A genuinely source-reproducible future release still requires recovering or independently maintaining complete frontend source modules, a pinned toolchain, a build configuration, and an independent build-versus-install validation. This tool is a documented, tested stepping stone, not a substitute for that work.

**Authoritative published release:** [GTM 4.6.7](https://github.com/ValentineBSAA/Game-Theme-Music/releases/tag/V4.6.7), SHA-256 `e287f1905c4981537e2756a0827b4bc3eb4364bc30db43d8f987690814ba166d`.