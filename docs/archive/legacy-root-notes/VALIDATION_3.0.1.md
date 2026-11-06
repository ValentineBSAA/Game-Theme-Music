# Game Theme Music 3.0.1 Validation

## Static checks
- JavaScript syntax checked with Node.
- Python backend syntax checked with compileall.
- package.json and plugin.json parsed successfully.
- ZIP integrity and single plugin-root layout checked.
- Bundled yt-dlp and QuickJS binary hashes compared with the original 2.9.12 package.

## First Deck checks
- Full banner is visible.
- LB and RB cycle Now Playing → Game Music → Ambient → Store Music → Music Library → Settings → Health and wrap in both directions.
- D-pad navigation continues from the page rail into each page.
- Light CSS theme uses dark readable text on light GTM surfaces.
- Dark CSS theme uses light readable text on dark GTM surfaces.
- Library card titles, metadata, sizes, Ambient switches, Store controls, and Master Volume remain readable.
- No playback regression in Game, Ambient, or Store ownership.
