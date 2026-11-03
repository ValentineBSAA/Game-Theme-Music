# Game Theme Music 4.4.3 | Music-First Store Preview

**Channel:** Preview (not stable). **Target:** private DeckFix Store and Decky Loader on Steam Deck OLED.

## Packaging and branding corrections
- Corrected version drift: plugin.json, package.json, compiled frontend GTM_VERSION and backend fallback version now all read **4.4.3**.
- Rebuilt as one directly installable Decky ZIP with exactly one Game-Theme-Music/ folder, without the extra GitHub Actions ZIP wrapper. Note: GitHub Actions still wraps downloaded artifacts; extract that outer wrapper if obtaining the package through Actions.
- Restored the original GTM 512×512 brand icon as root icon.png and logo.png and assets/icon.png and assets/logo.png; original .webp brand artwork remains.
- Updated publish.image to the live ValentineBSAA/Game-Theme-Music asset rather than the old MegalonVII fork path.
- Added deterministic store packaging validation of metadata, icon signature, resource retention, archive integrity, and music-first controls.

## Functionality
- **No playable Arcade games:** no Arcade page, scoreboards, gamepad bridges, or interactive game packs.
- **Retains 17 passive Visual Worlds:** 12 Volume 1 scenes plus five repurposed Arcade art experiments.
- **Preserves:** Steam/non-Steam soundtracks, ambient/store playlists, crossfade, ResonaDeck focus, Now Playing, sleep/wake controls and user settings.
- Bundled yt-dlp and other binary/dependency resources remain from the verified original 4.4.1 beta package.

## DeckFix Store deployment
1. Use the **direct** Game-Theme-Music-4.4.3-MUSIC-FIRST-STORE-FIX.zip. Do not submit the GitHub Actions outer artifact wrapper.
2. In your NAS store's local-network management panel, run **Validate & Publish** to the Preview/Beta channel.
3. Run catalog refresh/reconciliation; remove old 4.4.1 or 4.4.2 records and files only if you want them hidden, keeping a separate 4.4.1 backup.
4. Check the store card icon and that version displays strictly as **4.4.3**, then install and verify playback and visualizer navigation on Steam Deck.

**Verification:** package integrity, JS syntax, Python compile, 17 non-interactive scene manifests and consistent metadata. Real Steam Deck and live private-NAS catalog verification are still pending.

This does not publish a public GitHub release or modify the stable branch.
