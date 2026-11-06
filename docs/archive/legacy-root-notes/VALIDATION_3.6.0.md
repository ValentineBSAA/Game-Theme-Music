# Validation — Game Theme Music 3.6.0

## Static checks
- JavaScript syntax: PASS (`node --check dist/index.js`)
- Python compilation: PASS (`python -m py_compile main.py`)
- JSON manifests: PASS
- Native Store surface classifier synthetic cases: PASS
- Store shuffle / handoff-quarantine synthetic cases: PASS
- 3.6.0 feature-contract checks: PASS
- Protected AudioEngine / notification artwork / deep-search / import-progress comparisons: PASS
- ZIP integrity: performed during final packaging

## What changed in this stabilization release
- Native Steam Store detection now combines Decky-style focused-window authority with bounded window-state, embedded Store-frame, and SharedJS/Steam-tab probes.
- Quick Access / Decky overlays no longer count as leaving the Store surface underneath them.
- Decky replacement claims the surviving audio transport and enters an 8-second handoff quarantine where Store playback cannot stop, skip, reshuffle, or reload.
- The retiring controller's `onEnded` callback is frozen during unload so it cannot advance the old playlist after ownership has been handed off.
- Store runtime queue/history is restored and aligned to the persistent logical `trackKey`.
- Playback priority is explicit in behavior: manual preview / game theme > Store > Ambient. Ambient yields and remembers its position rather than racing the shared transport.
- Find Music follows the sticky selected game regardless of entry path, seeds the game soundtrack query, auto-searches once, keeps Search usable, and shows compact game artwork/context.
- The exact 3.5.10 YouTube-style progress-button treatment for Import to Library / Import + Add remains intact.

## Hardware targets
1. Start Store Music in Decky Store on the previous build, install 3.6.0, and verify the exact same track/position survives uninstall, reinstall, Decky's automatic QAM opening, and closing QAM.
2. Open native Steam Store and verify Store Music starts. In Quick Access > Store Music, the runtime card now reports the Store detector source so a failure is diagnosable instead of silent.
3. Return Home and verify Store Music stops promptly rather than lingering.
4. Enable Ambient on Library, enter Store, and verify Ambient yields to Store. Return to an allowed Ambient surface and verify Ambient resumes without overlapping or stealing playback.
5. Open a game page/theme and verify Ambient yields to game music. Manual previews should also own the shared transport while active.
6. Select a game in Games and reach Find Music using RB. The search field should fill with `<game> soundtrack`, auto-search should begin, Search should remain usable when idle, and the selected game's artwork/context should be visible.
7. Import multiple local files and confirm Import to Library / Import + Add use the same in-button fill/shimmer language as YouTube Download + Add.
