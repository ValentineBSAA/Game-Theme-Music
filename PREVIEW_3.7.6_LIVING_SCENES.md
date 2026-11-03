# Game Theme Music 3.7.6 PREVIEW | Living Scenes

**Experimental Decky Loader preview. GTM 3.7.0 Stable remains unchanged.** This package is separate from the previous 3.7.5 preview.

## What changed

- **Seven new object-based scenes**: Starry Night, Solar System, Ringed Planet, Meteor Shower, Spiral Galaxy, Moonlit Ocean, and Luminous Jellyfish.
- Existing **Holographic Dragon** and the twelve earlier visualizer styles remain.
- **Fixed Holographic Dragon selection**. Earlier builds exposed Dragon in the menu but rejected it in settings normalization; selecting it silently reset to Off. Every offered scene is now in the settings allow-list.
- **A new category + scene selector** replaces one oversized dropdown. Categories contain at most six options to avoid Steam Deck controller navigation problems. Previous / Next buttons provide a second way to navigate *every* scene without a dropdown.
- New scenes have recognizable objects and distinct audio responses: bass powers the sun and planetary glows, high frequencies twinkle stars, onset events brighten meteors, mids move jellyfish tentacles, lunar waves follow changing frequencies. Ambient drift is intentionally gentle.
- Cosmetic changes remain contained to the **Home-only fixed Live Footer**, with clipping, no song metadata, no input capture, and hidden state during Steam menus and Quick Access.
- Existing read-only audio telemetry, 2048 FFT, adaptive beat detection, controller focus, ResonaDeck focus handling, playlists and music transport remain unchanged.
- New scenes run on the 2D canvas lighting layer rather than creating unnecessary WebGL resources. Legacy 3D effects still use their existing WebGL/fallback renderer.

## How to test

1. Install **Game-Theme-Music-3.7.6-PREVIEW-LIVING-SCENES.zip** with Decky manual installer.
2. GTM → Settings → Interface & Feedback → **Live Footer 3.7.6 Preview · Scene category**.
3. Select **Cosmic Worlds**. Then choose **Live Footer scene** → **Starry Night**, **Solar System**, **Ringed Planet**, **Meteor Shower**, **Spiral Galaxy**, or **Moonlit Ocean**.
4. Select **Living Creatures** → **Holographic Dragon** or **Luminous Jellyfish**. Confirm the selected scene remains selected after leaving Settings and after reboot. Test Previous / Next actions as well.
5. Use a bass-heavy song, a quiet song, and a silent section. See if beats control object highlights and stars stop reacting during silence.
6. With Live Footer active, open a Steam game context menu. The footer should hide. Close the menu: it should return. Confirm it stays **below game cards**, without touching the Steam controller hints.

## Quality and safety

- This build is not yet verified on a real Steam Deck. Test CSS Loader themes, the Decky dropdown and menu transitions before considering public distribution.
- Only GTM-owned audio telemetry is observed; **no microphone or game-audio capture**. If Steam's Web Audio stream is unavailable, scenes settle into a static composition rather than pretending to track music.
- Visuals are optional, default Off for new installations, and do not take focus or pointer events.
- The audio playback engine and third-party helper binaries are retained. No upstream visualizer source code was copied; the scenes are original Canvas implementations inspired by public projects.
- Roll back to the physically tested **3.7.3 Preview** or **3.7.0 Stable** as needed.
