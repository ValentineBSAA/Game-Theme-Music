# Game Theme Music 4.0.4 | PUBLIC BETA CANDIDATE (PRIVATE DECK TEST FIRST)

This is a **release candidate**. It has NOT been published as a GitHub release. Test on physical Steam Deck before deciding to call it a public beta.

## What's new

- Keeps GTM 4.0.3's working prebuffered, automatic, maximum-eight-second crossfade. Adds **Automatic 8-second crossfade** On/Off switch, default On. Natural transitions within the same Ambient or Store playlist only.
- Preserves verified unlimited Ambient, Store, and per-game music playlists (no 15-track cap).
- Adds **GTM Visual Worlds • Volume 1**: ten original Canvas2D effects, 22 total visualizers in four categories.
- Adds **Anime Worlds** with an Aincrad-inspired two-sword duel, Sakura Tempest, and Spirit Blade. The duel includes collision sparks, active combat silhouettes, moving blade trails, and bass/beat-responsive strikes.
- Adds **Visualizer Packs** UI with Import ZIP, Refresh, Select imported pack, Remove imported pack. Packs are JSON-only declarations. They persist in Decky runtime storage across plugin reinstall/updates.
- Music Reactive • Dynamic Spectrum is the default **color mode for NEW settings**. Existing saved color preferences remain unchanged.
- Adds **ResonaDeck Visualizer Bridge v1 receiver**. Future ResonaDeck can send sanitized spectral telemetry to the GTM footer; the two applications keep their separate audio playback engines and existing audio-focus handoff. No ResonaDeck changes were made in this release.

## Ten original effects

| Category | Scene | Core effect |
|---|---|---|
| Retro Ambient • 2000s | CRT Pulse Field | Scanline sweeps, scan interference, moving frequency tracks |
| Retro Ambient • 2000s | Liquid Chrome | Reflective flowing metallic droplets |
| Retro Ambient • 2000s | Disc Prism | Spinning holographic disc and diffraction spokes |
| Classic Rhythm | Beat Pinball | Music-controlled balls, bumpers and collisions |
| Classic Rhythm | Seismic Mountains | Layered geographic spectral ridges |
| GTM Signature | Prism Forge | Orbiting prismatic geometric facets |
| GTM Signature | Mechanical Iris | Aperture shutters opening with bass |
| Anime Worlds | Aincrad Duel • Sword Combat | Two fighting blades, trails, clashes and sparks |
| Anime Worlds | Sakura Tempest | Floating cherry blossom petals driven by music |
| Anime Worlds | Spirit Blade | Sweeping energy-sword cuts and frequency sparks |

**Safety/CPU:** Canvas2D only, no WebGL, no raw-audio capture added by packs, no remote scripts, no forced audio playback. Drawing remains limited to the Home footer with the original CSS theme color blending and frame timing.

## How to install the private release candidate

1. Keep your current working **GTM 4.0.3** ZIP for rollback.
2. Install **Game-Theme-Music-4.0.4-PRIVATE-PUBLIC-BETA-CANDIDATE.zip** through your private Decky store or existing trusted installation workflow.
3. Under GTM visualizer settings, choose a category and a scene. Select **Anime Worlds** for three anime scenes. Choose Music Reactive colors if your prior setting was customized.
4. Visual Worlds Volume 1 is **already bundled** in 4.0.4. The separate Volume 1 ZIP is for distribution/backup/inspection and does not need to be imported again.
5. For new community packs: open GTM Visualizer Packs → Import ZIP → select an add-on ZIP with a root `manifest.json`. Refresh if necessary. New scenes appear in their declared categories **without rebuilding GTM**.

## Hardware acceptance checklist

- [ ] 4.0.3-quality seamless 8-second crossfade over **at least ten** automatic transitions.
- [ ] Crossfade Off produces ordinary single-player song switching; On restores overlap.
- [ ] More than 20 Ambient tracks still persist across restart, including shuffle/queue order.
- [ ] Distinct Steam Store + Decky Plugin Store session behavior stays correct; game and Ambient playlists remain separate.
- [ ] All **22 scenes** appear in correct group and are selectable with Steam Deck/PS4 controller and LB/RB cycling.
- [ ] Aincrad Duel visibly shows **two swords meeting** and sparks to actual beats.
- [ ] All ten new scenes react to music rather than just an autonomous screensaver; no undue GPU usage or footer overlap.
- [ ] Visualizer canvas follows the new track after crossfade without white flash or lag.
- [ ] CSS Loader theme/visual footer colors remain harmonious, including dark/wine-red and light themes.
- [ ] Import an original custom manifest ZIP, refresh, change scene, restart plugin, and verify it persists.
- [ ] Remove the custom pack without affecting music or bundled scenes.
- [ ] ResonaDeck audio focus still pauses GTM correctly without competing audio or spontaneous track changes.
- [ ] When ResonaDeck is updated separately, its spectral packets drive the footer while ResonaDeck owns audio (future integration test, not a blocker for GTM's standalone public beta).

## Known caveats

- **ResonaDeck bridge is receive-only in this GTM build**: it will not visualize ResonaDeck audio until a later ResonaDeck update publishes the agreed telemetry event in the same WebView context (or forwards the event between contexts).
- Import packs may only combine the ten built-in effect types and numeric options. A truly new effect primitive still requires GTM engine support; ZIP imports cannot run arbitrary scripts.
- Visualizer hardware performance and Decky file chooser integration must be verified on actual SteamOS. Offline tests are not a substitute.
- If audio providers fail to prebuffer, transitions may revert to sequential playback even with crossfade enabled.

## Go/no-go public beta criteria

If the Deck passes the checklist, publish the **same tested 4.0.4 ZIP** as Public Beta and update README/store notes. If anything regresses, remain private and fix through 4.0.5, preserving the 4.0.3 playback core.
