# Game Theme Music 3.5.1 Store Listing

## Tagline
Your Steam Deck, with a soundtrack.

## Short description
Game Theme Music is a controller-first Steam Deck soundtrack manager with per-game playlists, seamless update playback, Steam/non-Steam artwork, Ambient and Store music, online discovery, local imports, offline playback/artwork, library tools, and live theme integration.

## Full description
Turn Steam Deck Gaming Mode into a soundtrack system. Give Steam and non-Steam games ordered playlists, create separate Ambient music for normal Steam browsing, and give the Steam Store its own playlist. The full-screen Soundtrack Manager combines game artwork, local music, online discovery, imports, previews, track editing, and controller-first playlist management.

3.5.1 makes updates far less intrusive. When Decky replaces Game Theme Music while a song is playing, GTM hands the existing browser Audio element forward and lets the replacement backend reclaim the same loopback stream endpoint. The goal is for the song to keep playing at the exact current position without a same-song restart or duplicate Now Playing notification. Track artwork is also repaired more aggressively by caching active thumbnails locally and updating the visible Now Playing ribbon as soon as local artwork becomes available.

Game artwork now looks in Steam's local library/custom-grid cache as well as Steam's live app metadata and CDN fallbacks, improving coverage for native games, non-Steam shortcuts, and custom library artwork. The artwork panel uses a wider hero treatment, while the main GTM banner is more compact so the interface stays anchored at the top.

Find Music remains built for the Deck: type with Steam's keyboard, press R2 / Enter to search immediately, and results arrive in a 20-item batch with seamless paging as you browse.

### Highlights
- Up to 15 tracks per game
- Exact-position playback handoff across GTM plugin updates
- No duplicate same-track Now Playing notification after a successful handoff
- Local-first/cached Now Playing artwork repair
- Steam and non-Steam game artwork from local Steam caches plus online fallbacks
- Wider hero-style selected-game artwork
- R2 / Enter submits Find Music from the Steam keyboard
- 20-result initial discovery with seamless lazy paging
- Separate Ambient and Steam Store playlists
- A = instant Preview on game soundtrack rows
- Explicit Active track selection
- Preview before download
- Local audio import
- Offline downloaded playback and artwork
- Controller-first full-screen Soundtrack Manager
- Direct Change Theme Music context-menu launch into the selected game
- Live CSS Loader / Steam theme adaptation
- Music Library, diagnostics, storage controls, timing and fade editing

## What's new in 3.5.1
- Keeps the live Audio element, source and currentTime through Decky replacement when possible.
- Rebinds the replacement backend to the previous loopback stream URL.
- Prevents duplicate same-track Now Playing notifications across the handoff.
- Repairs blank notification art and enriches an already-visible ribbon when cached artwork arrives.
- Adds local Steam librarycache/custom-grid game-art discovery for native and non-Steam titles.
- Adds broader Steam hero/header CDN fallbacks.
- Makes selected-game artwork wider and more hero-like.
- Shrinks the GTM banner and keeps page changes anchored at the top.
- Preserves 3.5.0 R2 search, seamless result paging, controller focus fixes, and the locked 3.0.7 live-theme foundation.
