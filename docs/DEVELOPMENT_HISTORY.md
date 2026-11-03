# GTM development history (historical snapshots)

> **Archive notice:** The content below documents earlier experiments and is intentionally preserved as history. Mentions of "latest", private previews, playable Arcade features, old version numbers, or historical availability are **not current guidance**. For the current version, installation and features, use [the main README](../README.md) and [Getting Started](GETTING_STARTED.md). The old 4.4.1 installable prerelease is not currently published on GitHub Releases. **Do not use historical links as installation instructions.**

---

# Game Theme Music 4.4.9 | Balanced AI Spectator Scoring

**Developer:** Valentine. **Version:** 4.4.9.

AI-vs-AI Pong now responds to extended rallies with temporary defensive pressure and sharper *real* return shots, so even learned, high-skill AI opponents have credible scoring opportunities. A goal still requires the ball to pass a real paddle and cross the rear goal line. No artificial score increments or reset of accumulated AI learning.

**All 4.4.8 improvements remain:** the once-per-version Steam Home welcome, Visualizers and Arcade Spectator Quick Menu pages, category browsers, ACTIVE/SAVED selection labels, colored toggles, CSS palette support, persistent Shuffle All OFF and Couch/TV layout, 17 Visual Worlds, 32 effects, visualizer packs, music, crossfade and ResonaDeck integration. No human-playable Arcade systems returned.

See `RELEASE_NOTES_4.4.9.md` and the included validation report. Physical Steam Deck verification is required before calling this stable.

---

# Game Theme Music 4.4.8 | Valentine Visualizer Update

Watch-only AI-versus-AI spectacle, original music-first features, all 32 ball effects, and all 17 Visual Worlds. The Quick Menu contains separate **Visualizers** and **Arcade Spectator** pages. Visualizer power, Shuffle All and persistent Couch/TV layout use consistent colored ON/OFF controls. Regular scenes are organized into browse-only nested collections with accurate active labels.

A one-time personal thank-you from Valentine now appears on **Steam Home** after installing this version, once Quick Access is closed, not as a page inside the plugin. Use A / Cross to continue. All existing music, power effects, scene packs, learning and persistence data remain intact.

See `RELEASE_NOTES_4.4.8.md` for details and the required physical Steam Deck validation.

---

> **GTM 4.4.1 Public Beta:** Chess Focused Board View enlarges the square board and moves status/controls to the right in Couch / TV mode. Other Arcade games and original visualizer navigation are unchanged.

> **Latest testing candidate: 4.4.1 Public Beta.** Six built-in Arcade games including Neon Chess. Original visualizer collection/scene navigation repaired. See `GTM_4.4.0_PUBLIC_BETA_RELEASE_NOTES.md`. Steam Deck hardware verification is still required before public prerelease publication.

> **Private Preview 4.3.5:** Tactical Mindball awareness, Beat Catcher Piano Lanes. Steam Deck hardware verification pending. Stable unchanged. See `GTM_4.3.5_PREVIEW_RELEASE_NOTES.md`.

> **Private Preview 4.3.4:** Mindball modifiers and Adaptive AI personalities. Steam Deck hardware verification pending; public stable remains separate. See `GTM_4.3.4_PREVIEW_RELEASE_NOTES.md`.

> **Private 4.3.3 Preview:** Full-screen couch ready-up, yellow Mindball, better human morph feedback, game-aware Adaptive AI, and first sustained Beat Catcher notes. The active game collection and 4.3.2 controller handoff remain. See `GTM_4.3.3_PREVIEW_RELEASE_NOTES.md` for scope and limits.

> **CURRENT PRIVATE PREVIEW: GTM 4.3.1, Pong Freeze Recovery and Renderer Safeguards.** Fixes stale manual pause when human sessions transition to AI demo, recovers stationary/non-finite balls without awarding phantom points, and limits physics catch-up after render stalls. All five active games and the 4.2.10 menus are retained. This is an unverified physical Steam Deck Preview. [Full notes](GTM_4.3.1_PREVIEW_RELEASE_NOTES.md).

> **CURRENT PRIVATE PREVIEW: GTM 4.3.0, Arcade Stability and Renderer Safety.** Physical Steam Deck reports of UI/game resets in **Pong and Neon Drift Circuit** led to guaranteed canvas save/restore, a repeated-failure render circuit breaker, lower Arcade drawing budgets, reduced menu observer churn, and broader endurance/fault-injection tests. **Neon Drift Circuit is retired from the active Arcade** because its oval/lane-only gameplay was unsatisfying and it was reported crashing; its source and manifest are archived for redesign. The active Arcade has **five games** including Pong. No update can be called SteamOS crash-proof without on-device verification. [Full 4.3.0 notes](GTM_4.3.0_PREVIEW_RELEASE_NOTES.md). Keep a known-working older build for rollback.

> **4.2.10 Private Preview:** GTM Quick Access now keeps Default Size, Couch/TV Size, AI difficulty and Pong modes visible under Arcade. Rules, Abilities, Visuals and Players use direct focusable buttons; Game Music, Ambient, Store and Settings have clearly labeled expandable groups. See [4.2.10 release notes](GTM_4.2.10_PREVIEW_RELEASE_NOTES.md). Hardware verification pending.

> **GTM 4.2.9 Preview:** Arcade game-specific options are now visible under **Arcade → Selected Game → Settings**. AI Difficulty is directly accessible; Controller Bridge lives in **Advanced → Controller Bridge**. This is not yet a hardware-verified Stable release. See `GTM_4.2.9_PREVIEW_RELEASE_NOTES.md`.

> **CURRENT PRIVATE PREVIEW: GTM 4.2.8**: Pong Morph Battle, Mindball and Chaos game modes, configurable transformation powers, gentle self-steering ball, cinematic parallax groundwork, and a separately importable community survival game. [Full release notes](GTM_4.2.8_PREVIEW_RELEASE_NOTES.md) and [Community Ability SDK](GTM_4.2.8_COMMUNITY_ABILITIES_SDK.md). Automated tests pass; Steam Deck acceptance still required.

> **CURRENT PREVIEW: GTM 4.2.6 UI & Controller Repair.** Corrects Arcade Library layering, incompatible context menus, visible Adaptive difficulty, controller setup navigation, and AI-to-AI phantom disconnect takeover. [Release notes](GTM_4.2.6_PREVIEW_UI_REPAIR_NOTES.md). **Automated tests pass; physical Steam Deck acceptance still pending.**

> **PREVIOUS PREVIEW:** GTM **4.2.5 Preview**. Neon Drift Circuit replaces Prism Bastion, Adaptive difficulty becomes the new default, the Arcade Library expands, joining resets gameplay, and update-recovery waits are bounded. [Release notes](GTM_4.2.5_PREVIEW_RELEASE_NOTES.md). **Automated tests pass; hardware acceptance pending.**

# GTM 4.2.3 Preview: Flagship Arcade Visuals and Abilities

Six built-in games, enhanced original procedural graphics, independent game-specific powers, more competitive AI tiers and persistent controller-friendly Arcade settings. See [4.2.3 release notes](GTM_4.2.3_PREVIEW_RELEASE_NOTES.md) and [validation](GTM_4.2.3_VALIDATION.md). **Preview only. Physical Deck testing required.** Retain 4.2.2 for rollback.

# GTM 4.2.2 Preview: Built-In Arcade Library Recovery

GTM Arcade now registers all six built-in games without relying on a successful asynchronous backend pack-list call. See [4.2.2 Preview Release Notes](GTM_4.2.2_PREVIEW_RELEASE_NOTES.md). Keep 4.2.1 for rollback and verify the game list on a physical Steam Deck before publishing Stable.

# GTM 4.2.1 Preview (built-in arcade + couch and HUD repair)

See [4.2.1 Preview Release Notes](GTM_4.2.1_PREVIEW_RELEASE_NOTES.md). All six arcade games are included in this install. The two small Pong power bars for each player are now inside the top scoreboard, and the Game/Couch and Default layout options are separate from general visualizer settings. Physical Steam Deck acceptance remains outstanding.

# GTM 4.2.0 Preview: Built-in GTM Arcade Collection

GTM Arcade now includes Neon Paddle Championship (Classic/Thunder/Starlight courts) plus Beat Catcher, Orbital Duel, Orbit Defenders, Target Roll, and Prism Rally **inside this one plugin**. Separate arcade pack installs are not required. See `GTM_4.2.0_PREVIEW_RELEASE_NOTES.md` and `GTM_4.2.0_VALIDATION.md` for the full scope, device-testing checklist and limitations. Version is a Preview; retain 4.1.9 for rollback.

# Game Theme Music 4.1.9 Preview | GTM Arcade & Community SDK

**Private preview, NOT Stable.** This build introduces a dedicated Arcade page and game visualizer category, controller assignment diagnostics, player-by-player right-stick reclamation after a 10-second AI takeover, separate LB/RB power cooldown indicators, rear goal zones, localized goal light and freeze, compact paged options, and a standalone community-only SDK. It retains Universal Visualizer Format 3 and existing playlists. **Physical Steam Deck verification is still required.** See `GTM_4.1.9_RELEASE_NOTES.md` and `GTM_4.1.9_VALIDATION.md`.

---

# Game Theme Music 4.1.8 Preview | Universal Visualizer Pack Engine

**Private preview, not Stable.** This build extends 4.1.7 with format-3 programmable but bounded JSON visualizers, optional arcade gameplay inputs, Quick Menu controls, and 10-second automatic AI takeover. Packs can mix custom visual worlds, interactive art and lightweight arcade games. **All third-party packs remain non-executable JSON.**

Read [`GTM_4.1.8_UNIVERSAL_VISUALIZER_SDK.md`](GTM_4.1.8_UNIVERSAL_VISUALIZER_SDK.md) for the exact extension points, authoring schema, controller rules and hardware gate. Sample at `visualizer-packs/sdk-examples/manifest-v3.json`. For verified regression tests run `bash GTM_4.1.8_RUN_REGRESSION.sh`. Keep 4.1.7 as rollback until physical Deck acceptance.

---

# Game Theme Music 4.1.5 Preview

**Private testing build, not a published Stable release.** This preview continues 4.1.4 Pong Championship and Effects Pack v2, improves distinguishable scenery, readability and music responsiveness, and prevents the reset white-flash in the procedural Pong arenas.

## What changes in 4.1.5

Three distinct default GTM Signature Pong worlds (neon arcade, lightning storm, drifting starlight), plus a Pong Studio scenery selector with ten scene styles, two custom backdrop colors and music-reactive intensity (Off/Subtle/Balanced/Dynamic). Bass drives scenery pulse, mids drive motion, treble drives fine detail, beats drive localized accents. A full-width, higher-contrast couch HUD reports scores, timer, series and last winner. Ambient animation continues even while paused; audio responses stop when music pauses. The backdrop is painted opaque before Pong so a canvas reset does not briefly expose white. Previous sound, 20 Pong powers, color-team pairings, imported packs and audio-focus rules remain.

## Development, testing, rollback

Read **`GTM_4.1.5_EFFECTS_PACK_SDK.md`** for the precise developer map, pack-schema JSON, safe constraints, source file boundaries and Steam Deck acceptance checklist. Run `sh GTM_4.1.5_RUN_REGRESSION.sh` from the plugin root. These checks test code behavior only; verify on actual hardware before using 4.1.5 as a stable build. Keep 4.1.4 separately to roll back if needed. This includes a precompiled JS UI with trusted extension modules, not a complete TypeScript source checkout.

The **sample importable pack** is at `visualizer-packs/sdk-examples/GTM_4.1.5_Starter_Effects_Pack.zip`. A pack ZIP must contain only the root `manifest.json` file. No GitHub publication is performed.
