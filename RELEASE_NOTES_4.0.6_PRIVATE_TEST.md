# GTM 4.0.6 Private Test | ResonaDeck Track Change Bridge

**Requires ResonaDeck 1.3.5 to receive the new anonymous song-change counter.**

GTM continues to own the Home footer, visualizer engine, imported scenes and Shuffle All setting. ResonaDeck supplies live 12-band audio and two metadata-free numbers: a bridge-session ID and an incrementing logical track counter.

On the first packet for any bridge session, GTM establishes a baseline (no surprise shuffle mid-song). On a later positive song-change counter, GTM runs its **existing** Shuffle All Visualizers selector if enabled, using all available scenes without immediately repeating the current one. Repeated direct/postMessage/Broadcast audio packets, pause/resume and reconnected bridge sessions are deduplicated.

## No-flash visualizer transitions (4.0.6)

- Keeps both footer canvases **mounted with stable keys** when a ResonaDeck song change triggers a scene shuffle.
- Freezes the outgoing frame into a separate click-through canvas for a **520 ms** eased fade, while the new selected scene renders underneath. The CSS Loader-derived footer background is never exposed between scenes.
- Holds the visual stage during short silent network/track-change gaps (up to **6.5 seconds** since the last valid remote packet); explicit ResonaDeck Stop removes the footer immediately.
- Routes the same-window direct bridge through the same track-sequence processing as postMessage/BroadcastChannel to ensure shuffle is reliable in all supported SteamUI arrangements.
- Does not alter ResonaDeck's Plex playback/crossfade engine or GTM's own audio playback.

All previous 4.0.5 PCM reception, 4.0.4 visualizer rendering, eight-second crossfade, playlists and safe pack import remain unchanged. New build version is **4.0.6**, private testing only.
