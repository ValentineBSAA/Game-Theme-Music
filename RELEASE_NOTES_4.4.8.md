# Game Theme Music 4.4.8 | Valentine Home Welcome & Visualizer Menu Update

**Developer:** Valentine. **Update version:** 4.4.8.

## Fixed in 4.4.8

- Replaced the cramped Quick Menu welcome with a **Steam Home-screen full-viewport** note. It appears only when the Home surface is active, saved settings have loaded, and Quick Access and other menus are closed. Opening the GTM Quick Menu no longer blocks navigation with the thank-you.
- New community welcome is signed by Valentine in first-person and thanks the people using, testing, and helping improve GTM. One clearly focused **Continue to Home** controller button removes the confusing up/down two-button navigation. It saves per-version acknowledgment to localStorage and Decky's persistent settings.
- Moved the **visualizer power**, **Shuffle All on track change**, and **Default/Couch-TV** options to matching premium ON/OFF switches. The Couch/TV switch stays synchronized with the existing shared footer-layout setting.
- Updated quick-toggle colors to consume GTM's **live CSS Loader/Steam theme accent**, including clear focus and selected OFF/ON states. Does not force a muted blue when the theme is changed.
- Redesigned the regular visualizer selector as nested *collections*. Opening Retro Ambient, Classic Rhythm or GTM Signature does **not** activate a scene. Selecting a scene does.
- Truthful **ACTIVE / SAVED** labels for regular and Arcade spectator scene lists. Previously a stored Arcade selection could display a checkmark even while another visualizer was playing.
- Keeps **Colors & Reactions**, **Footer Advanced**, and **Packs & Advanced** as individually expandable, remembered sections. Volume/brightness and pack management remain accessible.
- Updated version identities to 4.4.8 in the frontend, Python backend fallback, plugin.json, package.json and Arcade spectator pack manifest. No beta/preview label in active GTM header/footer.

## Preserved

- All 17 original and Arcade-derived Visual Worlds, original 4.4.1 visuals, 32 rotating ball powers, AI-vs-AI adaptive learning, auto-changing paddle/ball/arena designs, music playback, Store/Ambient playlists, crossfade, ResonaDeck integration, and pack-management/import tools.
- No human-playable arcade systems, controller multiplayer, matchmaking or take-control menus restored.
- Previous persistent settings, learning data, and shuffle OFF sidecar are neither reset nor deleted. A new per-4.4.8 welcome acknowledgment is stored separately.

## Test on physical Steam Deck

1. Install 4.4.8. If the Quick Access menu is open, close it and return to Steam Home. Verify the letter appears **over Home**, not inside GTM's Quick Menu. Continue with A/Cross. Confirm it does not return after restarting or updating 4.4.8.
2. Reopen GTM. Use LB/RB to reach Visualizers and Arcade Spectator. Verify the three prominent colored ON/OFF switches, including Shuffle OFF surviving restart and track change.
3. Open Retro Ambient, Classic Rhythm, GTM Signature. Merely browsing must not change the active Home scene. Choose one to activate; only the actual active scene gets the active indicator.
4. Switch between a regular scene and Neon Paddle; inspect Arcade's ACTIVE/SAVED state and Default/Couch-TV footer height.
5. Change CSS Loader theme and confirm ON/OFF/focus outlines stay visible and theme-coherent. Use Color & Reactions for Gold/Aurora/Custom.
6. Validate ambient/store music, ResonaDeck focus, crossfade, AI-vs-AI powers, and imported visualizer packs.

**Automated checks:** frontend JS syntax, Python compilation, 120-second Pong AI simulation, 32 effects, explicit shuffle sidecar persistence, Home route welcome and acknowledgment, browser inert category navigation, 4.4.8 JSON metadata, original visual resources and ZIP integrity.

**Limit:** An actual Gaming Mode hardware/UI/CSS Loader test is still necessary. The Home overlay's placement relies on Decky's global-component host and cannot be fully verified by offline unit tests. Do not mark stable on GitHub until physical validation.
