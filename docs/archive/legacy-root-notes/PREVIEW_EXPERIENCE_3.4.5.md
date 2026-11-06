# Game Theme Music 3.4.5 — Centered Live Preview

## Goals

- Find Music results preview before any download.
- Remote provider audio is proxied through GTM's tokenized localhost server so Steam Chromium can play it reliably without saving it.
- The preview dialog is centered in the owning Steam window and no longer shifts with controller focus.
- The dialog borrows restrained SAO-like framing while continuing to use the live 3.0.7 semantic theme palette.
- Download + Add is explicit. The button itself becomes a real byte-progress bar with the active theme accent and a subtle shimmer while data is arriving.
- Existing downloaded tracks still preview through the local audio server.

## Preserved behavior

3.4.5 does not change the 3.0.7 live theme engine, the proven LB/RB handler, manager section navigation, game-aware automatic search, or playlist ownership rules.
