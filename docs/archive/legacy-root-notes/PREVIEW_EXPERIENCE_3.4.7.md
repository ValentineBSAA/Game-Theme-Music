# Game Theme Music 3.4.7 — Instant Preview + Update Continuity

## Preview latency
- YouTube search remains metadata-only for fast result rendering.
- Immediately after results are returned, the backend warms up to eight playable URLs with at most two yt-dlp extractors running concurrently.
- `single_yt_url` remains cached and single-flight, so opening a preview joins the already-running resolver instead of starting duplicate extraction.
- Focus/mouse warm-up now has zero artificial delay.
- No track is downloaded by preview warm-up.

## Download presentation
- Real transfer speed is unchanged.
- The focused Download button is forced to a neutral accent-tinted base during transfer so the meter cannot disappear into the same orange focus background.
- The meter uses a brighter/darker accent-family glass gradient plus a moving sheen and a contrast edge.
- UI progress is deliberately eased and held long enough to be visible even when the network transfer finishes almost instantly.

## Update audio continuity
- The AudioEngine is retained on the long-lived SteamUI window and reused by the replacement GTM frontend after an ordinary Decky plugin reload/update.
- Dismount arms a 60-second continuity handoff before route/controller cleanup; normal stop calls are ignored only during that handoff.
- The replacement GTM build claims the existing engine and clears the watchdog.
- If GTM does not return (for example uninstall, disable, or failed reload), the watchdog hard-stops the orphaned transport rather than leaving ghost audio.
- This does not promise continuity across a Steam client/Game Mode restart because that destroys the owning SteamUI page itself.

## Locked baseline
The 3.0.7 adaptive/live theme system and the proven physical LB/RB implementation are intentionally not redesigned in this release.
