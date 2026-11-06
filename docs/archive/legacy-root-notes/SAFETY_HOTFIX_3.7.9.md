# GTM 3.7.9 Preview — Home-only safety correction

This is a **safety hotfix** for 3.7.8, not a claim that the visual quality of planets and other worlds meets the user's requested cinematic standard.

## Confirmed defect in 3.7.8

- The full-screen Cinematic Showcase opens as a topmost modal and can trap Steam Deck users when B/Escape is not routed as a browser key. Physical Steam Deck screenshot and testing confirm a usability regression.
- The showcase is contrary to the desired Home-screen visualization.
- Planets look like simple circles; visual fidelity still needs design improvement.

## Changes

- **Remove the full-screen Cinematic Showcase entirely** (its component registration, dialog component, launch action in both settings layouts, and event listener).
- Retain the optional, non-interactive Home Live Footer with the existing WebGL2/WebGL1/Canvas rendering paths.
- Preserve music transport, independent HUD visibility, settings persistence and CSS styling controls.
- Distinct package version 3.7.9. No 3.7.0 Stable change.

## Known limits

- This hotfix does **not** add photographic textures or accurate planetary surface details. The small Home footer still places a hard limit on visible scene detail.
- A real Steam Deck menu/overlay regression test is still necessary. Browser syntax and package integrity are not hardware certification.
- Existing large world visualizations are intentionally **not accessible**. No action can unexpectedly cover the whole Steam screen.

## Physical acceptance steps

1. Install 3.7.9 and confirm the version shown is 3.7.9.
2. Navigate to GTM Settings: verify no `Open Cinematic Showcase` action exists.
3. Enable Live Footer and return to Steam Gaming Mode Home. Effects must stay within the bottom strip.
4. Open game context menus and Quick Access, then close them. They must remain accessible and the footer must not capture input.
5. Disable Live Footer and confirm it disappears; verify Ambient/Steam/non-Steam audio continues.
6. If 3.7.9 misbehaves, reinstall 3.7.7 or the 3.7.0 Stable backup.
