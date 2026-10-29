# SteamOS and Decky compatibility tracker

**Last checked:** October 29, 2026  
**GTM public stable release:** [Game Theme Music 3.7.0](https://github.com/ValentineBSAA/Game-Theme-Music/releases/tag/V3.7.0)

This page tracks **Valve's published SteamOS versions separately from versions actually tested with GTM**. A new Valve release **does not** automatically mean GTM has passed on that version. "Works on my Deck" reports must include exact SteamOS, Decky Loader and GTM versions before being counted as version-specific verification.

## Release and test status

| SteamOS | Valve channel | Valve release date | GTM 3.7.0 compatibility | Evidence |
| --- | --- | --- | --- | --- |
| **3.9.5** | **Stable, latest as of 2026-10-29** | **2026-10-23** | **⏳ Verification pending** | [Valve's SteamOS 3.9 stable announcement](https://steamcommunity.com/games/1675200/announcements/detail/694275728822244964). No version-confirmed GTM 3.7.0 hardware test recorded. |
| **3.8.28** | Stable, superseded | 2026-09-25 | **Not version-confirmed for GTM 3.7.0** | Earlier SteamOS stable branch. Do not infer compatibility from version number alone. |
| **SteamOS version not recorded in test notes** | Not captured | GTM tested 2026-10-28 | **✅ GTM 3.7.0 hardware-tested on developer Steam Deck** | [GTM 3.7.0 testing evidence](VALIDATION_3.7.0.md): games, both Store surfaces, Ambient, reboot persistence and HUD re-enabling. Specific OS version and Decky version were not logged. |

**Latest Valve version and latest GTM-verified version are not necessarily the same.** There is **no documented SteamOS 3.9.5 PASS** until tests on that OS are reported.

### Why SteamOS 3.9.5 deserves focused testing

Valve's October 23 release is a major stable upgrade from 3.8. It updates the Arch Linux base, Desktop Mode (KDE Plasma 6.7.3), and Linux kernel (7.2); Valve also notes audio, power, suspend/resume and Game Mode changes. This **doesn't establish a GTM incompatibility**, but GTM's SteamUI integration, Decky controller focus, audio transport and overlay behavior deserve regression tests.

**Separate dependencies:** SteamOS version, Steam Client channel/build, Decky Loader version, CSS Loader theme, and other audio plugins can each affect GTM. Log them separately rather than attributing every failure to a SteamOS update.

## Version-specific acceptance checklist

When a new SteamOS **stable** release arrives, record its version, Valve announcement link, channel and release date, then repeat this checklist on the actual device:

- [ ] Record Steam Deck model (**OLED or LCD**), exact **SteamOS version/channel**, **Steam Client** version/channel, **Decky Loader** version and **GTM** version.
- [ ] GTM loads in the Quick Access menu and retains previous settings after OS update/reboot.
- [ ] Catherine Classic or another **Steam game** plays its assigned soundtrack.
- [ ] Need for Speed: Most Wanted 2005 or another **non-Steam game** plays its assigned soundtrack.
- [ ] Native **Steam Store** music starts, stops and resumes as expected.
- [ ] **Decky Plugin Store** music works independently of native Store navigation.
- [ ] **Ambient Home** music starts and yields to game/Store playback correctly.
- [ ] **Show mini player HUD OFF** suppresses the popup without muting music, including after a full reboot.
- [ ] **Show mini player HUD ON** restores new notifications.
- [ ] Controller **LB/RB, D-pad and B/Back** navigation is correct.
- [ ] Local imports, existing downloads, artwork and playlist selection work.
- [ ] Shuffle/next/repeat, fades and music transport persist across normal Decky reload/update.
- [ ] Sleep/resume and return from Gaming Mode surfaces do not strand playback.
- [ ] ResonaDeck audio focus pauses and resumes the correct soundtrack (when installed).
- [ ] Note CSS Loader themes or other Decky/audio plugins and retest with them disabled if isolating an issue.

Report each case as **PASS / FAIL / NOT TESTED**; don't treat an unchecked test as a pass.

## Compatibility states

- **Verified (device-specific):** exact GTM/SteamOS/Decky versions and physical Steam Deck results documented.
- **Community reported:** user-provided version-specific observations, with clear evidence limits.
- **Pending:** new SteamOS version released but GTM not tested on it.
- **Issue reported:** a reproducible failure exists; scope and environment must be logged.
- **Incompatible:** convincing evidence of an unresolved blocking issue; not inferred from release announcements.

## Maintain this record as SteamOS changes

1. Watch the official [Steam Deck announcements](https://steamcommunity.com/app/1675200/announcements/) and [Steam Deck news](https://www.steamdeck.com/en/news), noting whether a release is **Stable**, **Beta**, or **Preview**.
2. When Valve publishes a new stable SteamOS version, mark it **Pending** until GTM is tested. Retain older version rows as historical data.
3. Update the [compatibility tracking issue](https://github.com/ValentineBSAA/Game-Theme-Music/issues) with tester results and reproduction evidence.
4. Promote a row to **Verified** only after the precise device's OS/Decky/GTM versions and tested behaviors are recorded.
5. Do not modify stable GTM packages or announce a GTM update solely because Valve updated SteamOS. Make a GTM bugfix only if regression evidence requires one.

For GTM-specific hardware evidence, see [3.7.0 validation](VALIDATION_3.7.0.md) and [hardware testing](../TESTING.md). Please do not share private tokens, credentials or personally identifying details in logs.
