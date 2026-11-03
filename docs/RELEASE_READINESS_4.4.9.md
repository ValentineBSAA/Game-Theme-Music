# GTM 4.4.9 release readiness and provenance

**Developer:** Valentine  
**Version:** 4.4.9  
**Public release channel:** regular numbered release (no Beta suffix)  
**Date:** November 3, 2026

## Source of truth

The installable candidate physically tested by Valentine is `Game-Theme-Music-4.4.9-AI-VS-AI-SCORING-FIX.zip`.

- Original candidate ZIP SHA-256: `a17c6691123f51670e76306590f0b4d247a575085ad2c6af55843070ed786f95`
- Original 4.4.1 baseline ZIP SHA-256: `f287d2f85eb5e52ec64b38eb4e6702292139e6db128ea379899db88b956cb537`
- Tested compiled frontend `dist/index.js` SHA-256: `36eef5688c45c538c2c076173dacfbe449f4505807f3ea14807aa9f73e738fa9`
- GitHub release packaging reconstructs **all 555 exact file contents** using `scripts/reconstruct_gtm_449.py` and the self-contained versioned delta in `release-payload/`.
- The GitHub ZIP may have a **different overall SHA-256** from the user-tested ZIP because ZIP entry timestamps/order are regenerated. Every file's contents are checked, including the four original brand PNGs.

## Actual hardware evidence

Valentine provided a TV photograph of the **4.4.9 full-screen, per-version Home welcome** running on their physical Steam Deck, with the Valentine developer signature and Continue to Home button visible.

Valentine also confirmed seeing **a real AI-vs-AI Pong goal** in 4.4.9 after previously observing five minutes without scoring on 4.4.8. This is useful physical evidence of the scoring fix, but does not establish that no future prolonged rallies or other regressions are possible.

## Automated checks

- 8 independent 300-second Pong spectator tests, including learned high-skill AIs.
- 12 spectator physics modes for 180 simulated seconds at max-learned skill.
- Visualizer shuffle OFF persistence and explicit ON/OFF change.
- JavaScript syntax, Python compilation, archive integrity and file-level SHA verification.
- Preserve 17 Visual Worlds, 32 effects, display/footer settings, visualizer packs, ResonaDeck integration, music playlists and crossfade.

## Release safeguards

- The old public `V4.4.1` release remains intact for rollback.
- The public `V4.4.9` release must contain a directly installable **single ZIP** and a `SHA256SUMS.txt` checksum.
- Do not publish an older `main` source as if it were 4.4.9.
- Stop publication if any reconstructed file mismatches the verified 4.4.9 manifest, JS/Python validation fails, physics or shuffle tests fail, or the tag already exists.
- Private NAS/DeckFix Store is maintained separately, and publishing to GitHub does not update the NAS catalog.

## Remaining physical QA

More continuous real-world use is still valuable: extended AI-vs-AI sessions; 12 physics modes; sleep/wake; CSS color controls; Store and Ambient playlists; ResonaDeck focus; persistent shuffle and Default/Couch-TV settings. Keep an issue tracker open for regression reports.

**This checklist is not a claim that every capability has been hardware-tested.**
