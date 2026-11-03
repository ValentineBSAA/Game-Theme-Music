# Game Theme Music 2.8.1 — Install-safe repack

This build is functionally identical to 2.8.0. It exists to isolate a Decky installation stall at the 90% archive/hash stage.

Packaging changes:
- fresh 2.8.1 version and SHA-256
- executable mode bits for `bin/yt-dlp` and `bin/qjs`
- `yt-dlp` stored without ZIP compression to reduce extraction CPU work
- no remote binaries declared in `package.json`

The 2.8 feature implementation is unchanged.
