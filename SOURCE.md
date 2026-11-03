# Source integrity and releases

## Current GTM: 4.4.9

The **`main`** branch now tracks the synchronized **Game Theme Music 4.4.9** code and documentation. The installed version is 4.4.9 across `plugin.json`, `package.json`, the compiled frontend, and the backend. The release tag is **`V4.4.9`**; install its `Game-Theme-Music-4.4.9.zip` asset via Decky, rather than using a GitHub auto-generated source ZIP. The user-tested pre-publication install archive has SHA-256 **`a17c6691123f51670e76306590f0b4d247a575085ad2c6af55843070ed786f95`**. The published ZIP is reconstructed from validated file contents and may have a different binary ZIP checksum because packaging timestamps/order can differ. Individual changed file hashes are verified against the tested original.

The binary installer is reconstructed from the immutable original **4.4.1** release ZIP (SHA-256 `f287d2f85eb5e52ec64b38eb4e6702292139e6db128ea379899db88b956cb537`) plus an integrity-checked 4.4.9 source delta. See `scripts/reconstruct_gtm_449.py` and `release-payload/gtm449-source-delta.tar.zst.b64` for reproducible provenance. No code is taken from the abandoned 4.4.3 music-first reduction. The original 4.4.1 beta release remains available as a rollback reference.

The **published binary ZIP** includes Decky runtime dependencies and 555 plugin files. This repository's source tree intentionally omits the large bundled binary dependencies from normal source tracking. These dependencies are restored from the checksum-verified original release when packaging.

## Testing status

Maintainer hardware observations on 2026-11-03: the full-screen Steam Home welcome displays as intended and AI-versus-AI Pong visibly scores. Automated tests cover 4.4.9 spectator scoring, all 12 physics modes, shuffle persistence, JavaScript/Python compilation and installation archive contents. This is **not** a claim that every SteamOS version, TV/Couch layout, playlist provider, or visualizer pack has been tested on physical hardware.

## Historical releases

- **V4.4.1:** preserved public beta; full Arcade-era rollback.
- **V4.1.2:** previous maintained music runtime.
- **V3.7.0:** legacy stable release.

