# Source integrity and release packaging

## Current release: Game Theme Music 4.4.9

The **`main` branch tracks GTM 4.4.9** code, visualizer manifests, documentation and release tests. The **[V4.4.9 release](https://github.com/ValentineBSAA/Game-Theme-Music/releases/tag/V4.4.9)** includes the complete directly installable **`Game-Theme-Music-4.4.9.zip`** and `SHA256SUMS.txt`. **The public installer is self-contained. Installing 4.4.9 does not require 4.4.1 or any older release.**

The earlier, physically tested prepublication 4.4.9 ZIP had SHA-256 `a17c6691123f51670e76306590f0b4d247a575085ad2c6af55843070ed786f95`. The **published ZIP is a reconstructed archive with the exact verified file contents**, but may have a different archive SHA-256 due to ZIP timestamps/entry ordering; check `SHA256SUMS.txt` attached to **V4.4.9** for the public download instead of applying the prepublication checksum to a different archive.

The repository does not track large bundled native dependencies normally, but the published release ZIP includes them.

## Historical build provenance, not a download requirement

The original 4.4.9 release preparation combined the then-available checksum-verified experimental 4.4.1 installer (SHA-256 `f287d2f85eb5e52ec64b38eb4e6702292139e6db128ea379899db88b956cb537`) with a checked 4.4.9 source delta. This process is recorded in `scripts/reconstruct_gtm_449.py` and `release-payload/gtm449-source-delta.tar.zst.b64` for provenance.

**V4.4.1 is now a historical Git tag, not an available release asset**. It must **not be restored or republished** as part of documentation or maintenance. The old reconstruction script cannot run from only the public current release and is **historical tooling**, not a supported update path. It is not needed to install 4.4.9. Do not use older release workflows to recreate or overwrite public releases; the current 4.4.9 tag and installer are already published.

For ongoing development, validate the synchronized source on `main` and use the public 4.4.9 ZIP as the current release reference. Any **future new version** should be packaged from its independently verified source and assets, without a missing older prerelease download dependency.

## Testing and version scope

Valentine physically confirmed the full-screen Steam Home welcome and a real AI-versus-AI Pong goal for 4.4.9. Automated tests cover the scoring engine and its 12 physics modes, settings persistence, JS/Python syntax and integrity. They do not certify every SteamOS build or third-party visualizer pack. See [TESTING.md](TESTING.md) and [compatibility notes](docs/STEAMOS_COMPATIBILITY.md).

## Available release history

- **V4.4.9:** current published release; correct installer and SHA256SUMS available.
- **V4.1.2:** earlier published version, available on Releases.
- **V4.4.1:** historical tag only; no current public installation asset; **do not recreate the archived release**.

[Release index](docs/RELEASE_INDEX.md) · [Getting started](docs/GETTING_STARTED.md) · [Main README](README.md)
