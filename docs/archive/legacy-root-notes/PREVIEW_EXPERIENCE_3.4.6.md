# Game Theme Music 3.4.6 — Fast Preview Warm-Up + Cinematic Download Motion

## Goal
Keep preview and downloads feeling immediate, but make their presentation polished enough to read from couch distance.

## Preview warm-up
- Search remains metadata-only. No file is downloaded automatically.
- When a result receives focus, GTM waits briefly, then resolves the provider playback URL and creates its localhost preview token in the background.
- The first result is also prewarmed shortly after search results appear.
- Pressing A reuses the same in-flight/completed promise. If the warm-up has already finished, the preview dialog can begin with almost no extra provider-resolution wait.
- A failed warm-up is discarded so opening the result can retry normally.

## Download presentation
- Actual provider download stays uncapped and full-speed.
- UI progress is eased separately so tiny/fast tracks do not flash from 0 to 100 before the user can see it.
- Very fast transfers keep the completion animation visible for a short minimum presentation window, then close normally.
- The fill is a tint-gradient derived from `--gtm-interactive-accent`, so SAO gold remains SAO gold, just with a lighter transfer-energy treatment.
- A moving sheen continues while the operation is active.

## Regression locks
No intentional changes to the 3.0.7 theme engine, physical LB/RB handler, manager native single-step navigation, or playback ownership system.
