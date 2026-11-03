# Game Theme Music 2.8.3 install-safe packaging

This build restores the packaging policy proven by 2.8.1 on real Steam Deck hardware.

- `bin/yt-dlp` and `bin/qjs` are stored without ZIP compression.
- No Decky `remote_binary` download is declared.
- Generated `__pycache__` files are excluded from the release.
- Library Auto-DJ placement from 2.8.2 is retained.
- Runtime feature behavior is unchanged from 2.8.2 apart from version metadata.
