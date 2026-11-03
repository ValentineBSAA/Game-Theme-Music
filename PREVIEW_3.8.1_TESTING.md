# GTM 3.8.1 Private Preview — Clean Footer and Music Colors

Private test only. No GitHub publication. Derived from the user's tested GTM 3.8.0 ZIP.

- Footer edge height reduced by four pixels, while Blend Ambient gains a strong lower 70% dark mask. It fades gently at the top but stops the game title showing through the primary effects.
- Added a separately persisted Live Footer Visualizer On/Off switch in both settings layouts. This affects only the visualizer, never Ambient music, game music, playlists or HUD audio. The selected scene is remembered.
- Added a **Music Reactive • Dynamic Spectrum** color palette to both settings layouts. The hue responds to real low/mid/high telemetry and transient events. Existing CSS Auto and manual palettes remain unchanged.
- Reduced beat-detection thresholds, improved attack/decay and normalization while retaining real-signal silence checks; no fake beat generator or new audio source.
- Kept compact Home-only Canvas2D renderer, context-menu hiding, settings migration and original audio transport.

## Hardware acceptance

1. Enable Ambient music and Starlight/Pulse Engine. Switch Live Footer OFF; music should continue and the visualizer should vanish.
2. Turn Live Footer ON; the previous chosen scene should return (Off scene defaults to Ambient Light).
3. Select Music Reactive colors; alternate between bass-heavy music and a quieter acoustic track. Colors should shift smoothly with audio, remain still when paused.
4. Try Blend Ambient and confirm text behind the lower footer is no longer readable; the upper edge should remain soft.
5. Open a Steam context menu and Quick Access; footer should disappear. Test controller navigation, suspend/resume and 3.8.0 rollback.

6. In BOTH settings layouts, choose **Prism Skyline** (Classic Rhythm). Previous should read **Classic Spectrum**, Next should read **Pulse Engine**; neither button may repeat Prism Skyline. Press Previous, confirm the label updates, then Next; test wraparound and switching from Off.
7. Trigger a handful of fast track changes with the visualizer ON, then repeat with it OFF. Compare response time and confirm the same playlist and songs advance correctly. A browser benchmark cannot certify track switching on the device.

Do not promote this private preview without physical Steam Deck checks.
