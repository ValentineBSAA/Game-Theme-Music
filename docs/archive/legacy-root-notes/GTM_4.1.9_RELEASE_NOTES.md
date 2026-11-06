# GTM 4.1.9 Preview · Arcade Reliability & Community SDK

Private **Preview**, not Stable. Based on the tested 4.1.8 Universal Engine. No GitHub release or NAS upload performed. Keep 4.1.8 and 4.1.7 ZIPs available for rollback.

## What's new
- **GTM Arcade** category separates the three built-in Pong arenas and compatible imported game scenes from GTM Signature. The original music-reactive visualizer categories remain intact.
- **Dedicated Arcade Quick Menu page**, separate from Settings, with Play/Pause, Controllers, Powers, Championship, Scenery, Packs and Diagnostics sections. The old huge Pong Studio block is no longer duplicated under music Settings.
- **Controller assignments** show detected Gamepad API device names and slot numbers. Steam Deck plus two external controllers can all be detected, and any distinct assigned slots may be chosen. Different hardware unexpectedly appearing at an assigned slot is blocked rather than silently taking a paddle. Steam Input may expose virtual slots or identical device names, so actual hardware identification still requires live testing.
- **AI vs AI still defaults.** Player vs AI and Player vs Player can reclaim control after the 10-second controller-loss countdown by deliberately moving the original assigned controller's right stick twice (return to center between motions). Unused third controllers do not trigger takeover. Reclaim does not reset championship progress. A/Cross remains Steam confirmation; Y/Triangle hold pauses gameplay but not audio.
- **Pong** separates Player 1/Player 2 scoreboard identity from color names when people are controlling. Distinct RB power and LB shield recharge timers and feedback are visible during Power Battle. Ball travel continues beyond a missed paddle to a rear goal line; only then does a localized glow and ~0.62s score-impact freeze award the point. This does not flash the whole screen.
- **Dropdown safety:** paged choice lists with seven choices and at most two navigation items, leaving Cancel visible below the 11-item Steam Gaming Mode limit. Existing backup context choices are capped at ten plus native Cancel; backup paging is future work.
- **Community-only SDK:** public pack contract, examples, validation helper and sample pack. No GTM internal audio/Store/backend source code in this SDK. The distributed installable plugin remains inspectable by users, as is typical for client-side Decky software.

## Hardware acceptance before Stable
1. Verify Steam Store and Plugin Store playlists, Ambient pause latch, ResonaDeck focus, Home transitions and shuffle.
2. Detect Steam Deck built-in controls and both external PS4 controllers; assign Controller 2 and Controller 3 to Player 1 and Player 2. Verify both move independently and no unassigned controller causes takeover.
3. Disconnect only Player 2, confirm visible 10-to-1 countdown and AI takeover. Reconnect; perform two deliberate right-stick flicks with neutral in between to reclaim P2 without opening the Quick Menu. Test P1 recovery separately. Check no false recovery from stick drift.
4. In Power Battle, verify RB and LB controls, ready/recharge labels, and distinct cooldowns for the two teams. Test Y/Triangle hold pause, music remains playing, and A/Cross still confirms the Quick Menu.
5. Let the ball miss the paddle, travel behind it and hit the goal line before the score changes. Confirm localized score glow and no full-background white flash or ball slowdown.
6. Navigate every Arcade section using the Deck and a PS4 controller; confirm scroll, focus, B/Circle close, and that every Cancel item remains visible in color/scene dropdowns.
7. Import `GTM_4.1.9_COMMUNITY_ARCADE_LAB.zip`: one Signature visual world and two Arcade game examples. Check scene selection, music responsiveness, shuffle, removal, invalid pack rejection and version migration.
8. Check frame rate with Pong and animated scenery for at least a championship; review Live Performance diagnostics. The automated 5-to-90 FPS simulations do not equal Deck GPU measurements.

## Known limits
Physical Steam Deck, Bluetooth reordering, actual in-game 60 FPS and full UI focus are **not verified** here. Device identity is best-effort from the browser Gamepad API; two identical controllers may share indistinguishable labels and Steam may remap slots. Packs support the current bounded 2D format-3 programmable VM, not arbitrary JavaScript or new 3D shaders. Existing native SteamUI context menu APIs may render differently from tests.
