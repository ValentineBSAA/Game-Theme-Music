> **HISTORICAL / SUPERSEDED:** The 3.7.8 full-screen Showcase trapped Steam Deck controller input in physical tests. It was removed in GTM 3.7.9. Do not use these Showcase instructions on 3.7.9.

# GTM 3.7.8 Preview · Cinematic Visual Worlds

**Experimental Steam Deck build, not a stable release.** This release upgrades the five featured worlds from mostly flat Canvas drawings to GPU-powered procedural 3D-looking scenes. Neither this document nor the build is a claim of successful physical Deck validation.

## Where to find it

**GTM → Settings → Interface & Feedback → Live Footer.** Choose **Featured Worlds**, then choose one of the five cinematic scenes. The existing **Off**, color, brightness, sensitivity, bass impact, footer height, and Blend/Dominate settings remain available. **Open Cinematic Showcase** opens an optional large view, with scene buttons and a prominent **Close** button; use **B/Escape** to dismiss. The compact footer remains below the game cards and continues to hide for Steam menus.

## Featured cinematic worlds

- **Celestial Orrery** (Solar Orrery mode): shaded spherical planets, multi-depth orbits, illuminated star, bass-driven flares.
- **Living Particle Orb:** lit, iridescent sphere with high-frequency interference accents and reactive rim lighting.
- **Sonic Nebula:** layered procedural clouds, parallax stars, rotating noise field and reactive core glow.
- **Starry Night:** several star scales, drifting layers, meteors and a reactive horizon.
- **Liquid Light Sculpture:** lighting, a refractive-looking object, Fresnel rim and ribbons.

Five existing signature/rhythm scenes remain: Bass Floor, Pulse Engine, Prism City Skyline, Holographic Dragon and Arc Reactor. They retain their established graphics path. There are ten public presets, not twenty aliases.

## Renderer and fallback strategy

1. Try the independent shader renderer via **WebGL2**.
2. When unavailable, try **WebGL1** with a matching GLSL ES 1.00 shader and vertex buffer.
3. If GPU contexts are unavailable, use the earlier **Canvas 2D featured-scene fallback**. **This fallback will look less sophisticated.**

The renderer never connects to or takes ownership of the music transport. It subscribes to GTM's existing demand-driven Media Bridge audio telemetry; when no usable audio telemetry exists, effects remain non-beat-reactive rather than synthesizing fake beats. Visuals never intercept controller or mouse input in the Home footer. Showcase is intentionally interactive and must be opened explicitly.

Performance: the GPU renderer limits its internal resolution and reduces it on sustained slow frames. It stops when the footer is hidden, context menus appear, or the plugin unloads; WebGL lost/restored contexts trigger resource rebuild. The in-plugin Showcase displays which graphics path (WebGL2/WebGL1/Canvas fallback) is available and an approximate browser frame rate.

**Important:** Any claim of GPU quality, SteamOS compatibility or 60 FPS requires real Steam Deck testing. The completed checks are documented in `VALIDATION_3.7.8.md`.

**Rollback:** Reinstall Game Theme Music 3.7.0 Stable or the last known-good 3.7.7 Preview if visualizer performance or navigation regresses. Neither user music nor playlists should need manual deletion.
