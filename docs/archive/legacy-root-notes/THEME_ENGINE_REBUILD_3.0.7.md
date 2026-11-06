# Game Theme Music 3.0.7 Theme Engine Rebuild

This release removes the 3.0.5 persisted palette and the 3.0.6 hidden-root gate.

Theme boot order:
1. React mounts the visible GTM root.
2. The ref callback samples the current ownerDocument / CSS Loader theme during commit.
3. Semantic GTM variables are applied before paint.
4. The runtime performs quiet settling scans and only commits material surface changes.
5. Native Steam focus can still teach GTM the current interactive accent in-memory.

The UI is never deliberately hidden. If theme sampling fails, the readable built-in CSS remains visible while later rescans retry.
