# Game Theme Music 3.4.4 — Portal-Safe Preview + Crash Guard

## Root cause fixed
Decky's modal portal can render outside Game Theme Music's AudioLoader compatibility React context.
The preview modal used the normal `useAudioPlayer` hook, which destructured `setOnThemePage` from that context.
When the context was `null`, opening a search result could throw during render and take down Decky's content tree.

## 3.4.4 changes
- Search-result preview now uses a self-contained singleton AudioEngine preview hook that does not depend on plugin-only React contexts.
- The shared `useAudioPlayer` hook is also null-safe when used from portal/modal contexts.
- Search preview is wrapped in a local React error boundary. A future modal render failure should show a recoverable GTM error panel with Back instead of replacing Steam UI with Decky's fatal plugin screen.
- Preview remains preview-first: selecting a result does not download it.
- Download only occurs after explicit `Download + Add` confirmation.
- Preview audio is stopped automatically when the preview closes/unmounts.
- 3.0.7 live-theme behavior and existing 3.4.2/3.4.3 manager navigation are preserved.
