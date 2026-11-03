# Game Theme Music 3.0.1 UI Correction

## Why 3.0.0 failed on the Deck
The first 3.0 UI mixed GTM-owned dark surfaces with native Decky rows that a CSS Loader theme could repaint white. Its sampler also trusted the first opaque parent too much, so a bright Steam theme could still be classified from a dark inner container. That produced exactly the bad combinations visible in hardware screenshots: cyan on white, pale gray on white, dark shells around bright rows, and controller focus ending at Master Volume.

## 3.0.1 rules
1. The full Game Theme Music banner is back.
2. LB and RB are the primary page navigation. The on-screen LB/RB rail is a fallback and orientation cue, not a second copy of the same destination.
3. GTM owns the surfaces inside GTM. CSS Loader supplies host context, not uncontrolled row colors.
4. Accent colors are never assumed to be readable text colors. They are corrected against the actual GTM surface first.
5. Page controls use SVG icons, not Unicode symbols.
6. The active page is one coherent visual surface language. No alternating bright/dark striping.
7. The playback engine is outside the scope of this correction and remains preserved.
