# GTM 3.8.10 Private Preview: Visualizer track-handoff stability

**Private test build. Do not publish to GitHub.**

## Finding

The 3.8.9 Home footer unmounted immediately if AudioEngine temporarily left its `playing` state. Automatic song changes briefly transition through `paused`, `loading`, and `ready`. This unmounted the React canvas, lost the 12-band rendering envelope, restarted the animation timeline, and reapplied a full-opacity animation. Together these produced the footer flash even after 3.8.9 resolved CORS capture failures.

## Change

- Keep the existing Home footer mounted across an already-playing session's track-loading states, with a bounded 15-second handoff grace.
- Continue to hide immediately for user-disabled scenes, Steam menus, Desktop Mode, actual idle/stop/error, and (outside handoff) manual pauses.
- Remove the opacity-to-zero animation on effect restarts.
- Preserve visual time and fade *real* received audio energy smoothly through loading; no artificial bass values generated.
- Preserve the 3.8.9 CORS fix, JSON export, 12 scenes, automatic color settings, source selections, volume, playback commands, and update continuity.

## Deck acceptance

1. Play a playlist with a visualizer. Let 5+ songs advance naturally. The footer should not disappear/flash during handoff.
2. Verify low, mid and bass movement resumes automatically when sound resumes.
3. Check Pause, Stop, Off, Quick Access and other Steam menus hide the footer as before.
4. Verify playback itself never restarts because of the visualizer.
5. If another flash happens, capture JSON using existing Settings button without manually changing tracks.

Synthetic checks validate UI gating and rendering math, not the physical Steam Deck compositor.
