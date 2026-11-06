# Non-Steam shortcut research for GTM 2.7.19

## Why GTM now treats shortcuts separately

Steam's native application identity is simple: an AppID is sufficient for the library page, app store lookup and GTM cache key. A non-Steam shortcut has several representations and a different UI lifecycle.

- `shortcuts.vdf` stores a 32-bit shortcut AppID. The same bit pattern may be read as signed int32 or unsigned uint32 by different tools.
- Steam also has a 64-bit shortcut GameID representation: `(uint32_appid << 32) | 0x02000000`.
- Current Steam's `SteamClient.Apps.AddShortcut()` assigns an AppID and current Decky shortcut-management projects wait for `appStore.GetAppOverviewByAppID()` before applying shortcut properties.
- A valid manually seeded `shortcuts.vdf` shortcut can instead have a deliberately fixed AppID. The MW Easy Setup package uses that approach while Steam is stopped so its identity remains stable.
- Steam Gamepad UI may retain old App Details React pages after navigating away. Route mount/unmount is therefore not a safe visible-page signal for shortcut playback.
- Current Decky plugins that need the page the user is actually looking at resolve the visible App Details DOM container, reject hidden cached copies, and read `overview.appid` from that page's React fiber.

## Most Wanted identity

The MW Easy Setup shortcut uses the stable seed `decktools:nfsmw2005:v2` plus `Need for Speed: Most Wanted Black Edition (2005)`.

- unsigned shortcut AppID: `3923877808`
- hexadecimal: `0xE9E19FB0`
- signed int32 form: `-371089488`
- 64-bit shortcut GameID: `16852926858893721600`

GTM 2.7.19 normalizes all three forms to `3923877808` before playlist, cache or audio ownership lookup.

## 2.7.19 design

Native Steam games keep the existing GTM route ThemePlayer. Non-Steam shortcuts are owned by a separate global coordinator:

1. Find the App Details page that is physically visible.
2. Prefer Decky's current `basicAppDetailsSectionStylerClasses.AppDetailsContainer` / `AppDetailsRoot` anchors.
3. Walk the visible node's React fiber for the live Steam `overview` object.
4. Canonicalize its signed/unsigned/64-bit identity.
5. Load the existing GTM config by canonical AppID. Existing assigned tracks do not require a successful display-name lookup.
6. Suspend Ambient and play through the same AudioEngine used by native themes.
7. Tear the shortcut player down when the visible page disappears.
8. Use a MutationObserver plus a heartbeat so Home -> same shortcut -> Home -> same shortcut does not depend on a route remount.

## Reference implementations researched

- SteamDeckHomebrew/decky-frontend-lib: SteamClient Apps interface, appStore globals and App Details static-class exports.
- danielcamilo1/decky-add-non-steam-games: current `AddShortcut` registration and appStore read-back behavior.
- danielcopper/romm-tender: current Steam shortcut AppID lifecycle and 64-bit identity documentation.
- Featherwolf/EnhancedGV: visible App Details container + React-fiber AppID resolution for cached Steam pages.
- beallio/Decky-Metadata: non-Steam `BIsShortcut` / app-type checks and current multi-signal game-detail detection.
- ricewind012/steam-ui-unobfuscated: AppStore behavior, including `BIsShortcut`, `GetGameID`, `GetAppOverviewByAppID`, and `GetAppOverviewByGameID`.
