# Game Theme Music 3.5.0 — Artwork + Search Flow

## Scope

3.5.0 is a manager/discovery upgrade on top of 3.4.9. It deliberately does not rewrite the audio engine, Ambient/Store controllers, or 3.0.7 live-theme system.

## Game artwork

When a game is open in Soundtrack Manager → Games, the right-hand workspace now reserves a landscape artwork hero above the game title. GTM first inspects Steam's live AppOverview/assets for usable URLs. Native Steam App IDs then fall back to Valve's public `header.jpg` asset. Non-Steam games degrade to a themed placeholder rather than failing the workspace.

## R2 / Enter search

The Find Music text field handles the Enter key emitted by Steam's on-screen keyboard. On Deck, R2 is the keyboard's Enter action, so R2 now submits the current query. GTM then hides the virtual keyboard best-effort and begins the search without forcing the user to navigate to the Search button.

## Seamless results

- first page: 20 results
- next pages: 20 results each
- preload trigger: within the final six cards or within ~420 px of the scroll end
- per-query UI cap: 80 loaded results
- YouTube backend requests progressively larger flat `ytsearchN` windows and slices the unseen page; the largest window is cached for 90 seconds
- search still resolves only metadata; playable URLs are warmed/resolved separately so result loading does not start dozens of audio streams

The bounded cap is intentional. It gives the user a much deeper search without turning the Deck into an unbounded yt-dlp job.

## Coverage layout

The Game Music coverage action row now uses flexible zero-min-width columns and wrapping text, removing the Refresh / Open-next overlap seen on hardware.
