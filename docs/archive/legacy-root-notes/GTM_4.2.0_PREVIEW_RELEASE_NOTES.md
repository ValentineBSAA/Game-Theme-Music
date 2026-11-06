# Game Theme Music 4.2.0 Preview

## What's in this ONE installable GTM ZIP

Version 4.2.0 incorporates the starter arcade collection into the regular GTM plugin. You do **not** need to install the old Community Arcade Lab ZIP or an additional game pack.

The GTM Arcade category includes six distinct playable experiences:

- **Neon Paddle Championship** (the original Pong-inspired mode) with **three selectable courts**: Classic Neon, Thunder, and Starlight. Three courts are arena variants of **one** game, not three extra games.
- **Beat Catcher**, a short rhythm-and-position scoring game with autonomous scoring when music is silent.
- **Orbital Duel**, a two-side AI or human-versus-human pulse-and-alignment competition, with individual side scores.
- **Orbit Defenders**, an original shooting/aiming target patrol with a point counter.
- **Target Roll**, a right-stick aiming and trigger-driven precision score game.
- **Prism Rally**, a right-stick-controlled reflex and bounce game with points and misses.

The five additional titles are lightweight **2D procedural arcade prototypes**, not complete commercial-grade games. They demonstrate that GTM can include diverse minigames and use the same safe pack runtime. All title graphics are generated procedurally; no outside game graphics, logos, or sound files were added.

## Arcade menu and visual selection

GTM Arcade has its own page, accessible from the Quick Menu, separate from ordinary music settings. It provides a **Game** selector, a **Pong arena** selector (when a Pong arena is selected), and a **Show game in footer / Arena active** action. Changing an arena is intended to preserve the Pong championship, controllers, and current score. An Arcade selection is remembered independently of the Live Footer scene so the two menus don't silently overwrite one another. If ordinary visualizers take over the footer, selecting **Show game in footer** restores the chosen game.

Controls are grouped by task into seven short sections: Play & Pause, Controllers, Powers, Championship, Scenery, Packs, and Diagnostics. There are selectable Previous/Next section buttons and a focusable help control at the end of the page to avoid unreachable noninteractive text. Contextual dropdown pagination retains the observed 11-items-including-Cancel ceiling.

## Controllers and gameplay

- Existing three-device and two-human-controller session logic remains: use **any two distinct assigned controllers**; unused or newly connected gamepads shouldn't cause AI takeover.
- Steam Deck's built-in/Steam Input controller may appear as an Xbox virtual pad. Slots are shown in shortened identifiers; physical controller color cannot be identified automatically.
- Controller settings expose buttons to step through detected slots without closing the Controllers section.
- Original default is AI vs AI, with supported solo, Player vs AI, and Player vs Player modes. A connected controller can reclaim its previous side with an intentional two-movement right-stick gesture after an automatic takeover.
- A controller assigned to a playing human that disconnects triggers a **10-second visible countdown** before AI takeover. Reconnect within the countdown cancels it. Hold Y/Triangle ~800ms to pause the game; music continues.
- In the built-in Neon Paddle, human paddle movement has Comfortable, Competitive (default), and Turbo presets. Ball speed offers Relaxed, Competitive (default), and Extreme; music-driven effects remain separate from physics timing.
- Rear-goal scoring, localized goal light and brief impact freeze, individual RB Power/LB Shield indicators, and AI championship behavior are preserved from 4.1.9.

## Animated arenas

Classic Neon shows a glowing perspective grid, Thunder has distinct clouds, rain and periodic localized lightning, and Starlight has a starfield, orbital planet and drifting comets. The Pong HUD is compressed to give the playing field more visible area. Music enhances lighting, not background position, avoiding jerking scenery. Both Arcade selection and the persistent Pong scenery override have a clear priority to prevent every court looking the same.

## Pack runtime guard

The programmable visualizer engine still validates JSON and enforces per-frame operation/drawing limits. A single costly first frame no longer permanently disables an otherwise valid game. Repeated costly frames continue to be shut down. Built-in arcade packs are protected from user uninstall; importable community packs remain optional for later.

## Copyright and branding

The new demonstration games use new names and programmatically generated visuals only, with no third-party game source, copyrighted character art, music clips, or logos bundled. That is a risk-reduction measure, **not a legal clearance guarantee**: before public distribution, verify game names for trademark conflicts and review any future assets, licenses, and attribution. The plugin still builds on previously licensed code and assets already present in GTM; inspect their existing notices as part of public distribution.

## Testing and acceptance

Source syntax, pack validation, two built-in manifest startup paths, archived pack safety, Store and Ambient playback code paths, Pong timing, championship, goal scoring, controller assignment/disconnect, 10-second takeover, and source-level UI navigation tests pass. All five built-in game programs completed a 600-frame simulated run. Chromium rendered their scenes and the contrasting scenery styles; measured scenery draw costs there are not Steam Deck benchmarks.

**NOT YET TESTED ON PHYSICAL STEAM DECK.** Acceptance still requires checking both Store playlists, Ambient/manual pause, two PS4 controllers, actual Quick Menu focus and paging, human paddle feel, each arena's animated appearance, all six games, and real frame rates. Keep 4.1.9 available for rollback. This is a PREVIEW and has not been published to GitHub or the NAS store.

## First-device acceptance order

1. Install 4.2.0 Preview and open Quick Menu > GTM Arcade; verify the six games appear without importing any ZIP.
2. Select Neon Paddle Championship, change Classic -> Thunder -> Starlight, and visually confirm each environment changes.
3. Enter Arcade Controllers, assign two PS4 controllers, play a two-human match and verify Competitive/Turbo paddle movement feels responsive.
4. Navigate every one of the seven Arcade sections, including the last button and any dropdown Cancel entry.
5. Cycle through each of the five built-in mini-games with and without music playing; confirm animation, scoring, and controller interactions.
6. Verify Steam Store, Decky Plugin Store, Ambient playback, manual pause, and audio focus behavior.
7. If any blocker occurs, roll back to preserved 4.1.9 and report the symptom plus Live Performance values.
