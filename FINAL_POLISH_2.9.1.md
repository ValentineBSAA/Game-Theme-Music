# Game Theme Music 2.9.1 — Final UI polish

This release is a presentation and containment pass over the 2.9.0 final architecture.

## Settings organization

The former single Settings card is split into five clear groups:

1. Playback & Volume
2. Music Discovery & Providers
3. Interface & Feedback
4. Downloads & Maintenance
5. Advanced & Recovery

Existing Ambient, Store, Download Storage, and diagnostics systems remain separate first-class sections. Health Center is renamed Health Center & Integrations so Media Bridge v1 is easier to find.

## Auto-DJ modal

The run/results modal now uses the Decky modal's real content width instead of viewport width. The progress indicator is GTM-owned and fully contained. Long content wraps, buttons remain inside the modal, and final counters are explicitly committed from the job totals.

## Scope

No playback ownership, provider resolution, MW/non-Steam handling, Ambient/Store behavior, Media Bridge protocol, or Auto-DJ assignment algorithm was changed.
