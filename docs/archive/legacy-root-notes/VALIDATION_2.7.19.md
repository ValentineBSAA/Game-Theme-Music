# Game Theme Music 2.7.19 validation

## Scope

2.7.19 replaces the experimental non-Steam fallback with a dedicated visible-page shortcut coordinator. Native Steam game playback remains on the 2.7.18 route path. Ambient, Store Music, notification delivery and mini-player presentation are intentionally not redesigned.

## Non-Steam identity

- Accepts unsigned 32-bit shortcut AppIDs.
- Accepts signed int32 representations and normalizes with uint32 semantics.
- Accepts Steam's 64-bit shortcut GameID using BigInt before Number conversion.
- Resolves app overviews by canonical AppID first, then GameID aliases.

## Visible-page coordinator

- Prefers `basicAppDetailsSectionStylerClasses.AppDetailsContainer` and `AppDetailsRoot`.
- Uses legacy app-details classes only as compatibility fallbacks.
- Verifies real visibility with geometry and computed style.
- Reads the currently displayed page's `overview` from its React fiber.
- Uses a MutationObserver plus a 300 ms heartbeat.
- Shortcut route ThemePlayers do not compete for audio; the visible-page coordinator is the sole shortcut authority.
- Existing assigned tracks load even if Steam's app-name lookup is unavailable. App name is required only for automatic search/suggestion.

## Diagnostics

The persistent frontend flight recorder records shortcut-visible-page, shortcut-visible-clear and shortcut-theme-config events, including raw/canonical identity data and the DOM anchor used.

## Static validation

Run JavaScript syntax validation, Python compilation, JSON parsing, ZIP CRC validation, duplicate-path checks and protected-block comparisons before distribution.
