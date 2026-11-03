# Game Theme Music 3.5.1 Validation

## Release target
3.5.1 is a focused continuity/artwork/layout release built directly on the tested 3.5.0 package.

## Verified statically
- JavaScript parses successfully.
- Python backend compiles and was exercised with isolated backend smoke tests.
- `plugin.json` and `package.json` identify 3.5.1.
- 3.5.0 R2/Enter search and the 20/80 seamless paging limits remain present.
- AmbientController and StoreController are byte-for-byte unchanged from 3.5.0.
- AudioEngine contains an update-handoff guard that reattaches options/callbacks without pausing, replacing `src`, calling `load()`, or resetting `currentTime` for the same current media resource.
- The replacement frontend asks the replacement backend to adopt the localhost audio endpoint already owned by the playing Audio element before playback controllers start.
- The backend persists the loopback port/token and can rebind to a previous endpoint while remaining loopback-only.
- A backend smoke test proved an old endpoint can be released and adopted by a replacement plugin instance.
- A backend smoke test proved native Steam library art and non-Steam custom-grid art can be discovered and served from GTM's local artwork endpoint.
- Now Playing identity continuity persists across the short frontend replacement window to avoid a duplicate same-track notification.
- Active Now Playing artwork attempts local lookup, then cache backfill, and the visible ribbon can update when local art arrives.
- Selected-game artwork checks local Steam library/custom-grid art plus broader Steam hero/header/capsule fallbacks.
- Game artwork uses a wider cover-style hero treatment.
- Main GTM banner is compacted and page selection scrolls to the banner/root instead of the content body.
- Generated Python cache files are excluded from the release ZIP.

## Real Deck checks still required
Only a real Steam Deck/Decky replacement can prove timing across the complete installer lifecycle. Test these in order:
1. Start a downloaded track and note its timestamp.
2. Install 3.5.1 while it is playing. Verify the timestamp continues forward rather than restarting.
3. Confirm the same song does not create another Now Playing ribbon after the replacement completes.
4. Start several downloaded tracks and verify mini-player artwork fills in instead of remaining blank.
5. Open a native game that lacked artwork in 3.5.0 and verify the wider hero artwork.
6. Open non-Steam/ES-DE entries that already have Steam custom artwork and verify GTM finds it.
7. Switch Game Music/Ambient/Store pages and verify the compact banner remains at the top without manual scroll correction.
