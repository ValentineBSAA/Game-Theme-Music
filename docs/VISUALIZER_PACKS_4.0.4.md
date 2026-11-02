# GTM 4.0.4 • Visual Worlds pack author guide

Add compatible scenes **without rebuilding GTM**, by importing a ZIP containing *only* a root `manifest.json` (format 1). Arbitrary scripts, executables and unknown effects are rejected.

```json
{"format":1,"pack_id":"my_visual_pack","name":"My Visual Worlds","author":"Community","version":"1.0.0","scenes":[{"id":"world_my_iris","title":"Custom Iris","category":"signature","layers":[{"effect":"mechanical_iris","scale":1,"speed":1,"density":1,"intensity":1,"hueShift":0}]}]}
```

**Categories:** `retro`, `rhythm`, `signature`, `anime`. Imported scenes are inserted in the matching parent category and in the separate Custom Packs list.

**Supported Canvas2D effects:** `crt_pulse`, `liquid_chrome`, `disc_prism`, `beat_pinball`, `neon_pong`, `seismic_mountains`, `mechanical_iris`, `supernova_bloom` (Chromatic Event Horizon display name), `sakura_tempest`, `tidal_bloom`.

**Removed/unsupported:** `aincrad_duel`, `prism_forge`, `spirit_blade`.

A scene has **1–3 effect layers**, up to **32 scenes per pack**. Parameter ranges: scale 0.3–2.0; speed 0.25–2.0; density 0.3–1.5; intensity 0.2–1.5; hueShift -1.0–1.0. Scene IDs start with `world_` and use safe lowercase letters/digits/underscores.

**Import:** Visualizer Packs → Import ZIP → Refresh. **Preview:** choose inside the scene category or Custom Packs. **Remove:** Manage custom packs → choose a specific pack → review and confirm. **Shuffle All** includes imported scenes. Music/playlist settings are not deleted when uninstalling a pack.

**Future packs:** A genuinely new renderer, such as a detailed racing city, needs an engine implementation first; no manifest alone can invent a new effect. ResonaDeck telemetry support is passive and requires a future ResonaDeck update for Plex visualization.
