## 3.7.0 (2026-10-28) | User-configurable mini player HUD

- New **Show mini player HUD** setting in Interface & Feedback, ON by default for existing users.
- OFF hides the SAO-style Now Playing HUD and prevents future game, Ambient, Store, track-change and error ribbons without interrupting music.
- Turning OFF dismisses visible HUD content, clears delayed popups/Quick Access queues and prevents old diagnostics from resurfacing later.
- Setting persists through restart; turning ON again restores future HUD events.
- Independent of theme notifications, visualizer, mini-player position and music playback.
- Hardware-tested by the developer on Catherine Classic, NFS MW2005, both Steam Stores and Home Ambient music. OFF persisted through full Deck restart and ON restored the HUD.
- Thanks to **Dollet** for the Discord report that inspired this feature.
- Preserves the playback and ResonaDeck audio-focus behavior from 3.6.9.

## 3.6.9 | ResonaDeck audio-focus interoperability

- Adds a cooperative audio-focus listener to pause GTM when ResonaDeck takes audio focus and safely resume when focus is released.
- Preserves the 3.6.8 gameplay, Store, Ambient, library and artwork baseline.

## 3.6.8

- **Local Import artwork no longer uses the backend Import cache.** The manager directly tries Steam library portrait artwork first, then the same proven remote candidates used by the working Games/Find surfaces.
- **Native Steam Store Now Playing delivery is stabilized.** Steam Store events wait for the surface transition to settle before rendering instead of firing during the side-menu transition.
- **Interrupted notifications are replayed once.** If Steam/Quick Access hides a freshly displayed ribbon before it is really delivered, the same event reappears once after the overlay closes.
- Now Playing display time increases from 4 to 5 seconds.
- AudioEngine, StoreController, Store session continuity, and deep YouTube search are intentionally unchanged.

## 3.6.7

- Invalidate stale Local Import artwork caches with a new versioned cache identity.
- Stop rendering a temporary hero candidate while the dedicated Import artwork resolver is still running.
- Separate Store playback identity from Store presentation identity for notifications.
- Refresh Store presentation only while Store audio is actively playing, allowing native Steam Store notification events without restarting the shared transport.
- Preserve unified Store playback, search, import progress, and controller behavior.

## 3.6.6

- **Native Steam Store notification events** now include the Store presentation surface in notification identity, so entering native Steam Store can show Now Playing even when the same Store audio session was already alive in plugin Store.
- **QAM/update dedupe remains intact** because opening/closing Quick Access does not change the underlying Store presentation identity.
- **Notification epochs end at real stop start** instead of waiting for the last milliseconds of a fade, so Home -> Store resume can show one fresh ribbon.
- **Local Import artwork is full-bleed**: the dedicated Steam library/capsule source now fills the artwork slot instead of being letterboxed inside it.
- **Import artwork resolver prefers Steam library_600x900 first** for official Steam apps, with local capsule/grid artwork and landscape assets as fallbacks.
- AudioEngine, Store session continuity, three-column Find Music, Ambient/Store/Library art and deep search remain protected.

## 3.6.5

- Local Import gets a dedicated Steam library/grid artwork resolver and cache; it no longer inherits the wide hero cache.
- Steam official-game Import fallback prefers `library_600x900.jpg` before landscape assets.
- Now Playing uses audible-event epochs separate from notification-delivery epochs, fixing Store ribbons that were suppressed when playback began behind Quick Access.
- Quick Access/update adoption of the same audible event no longer creates duplicate notifications.
- Returning to the same track after a real stop creates one fresh notification event.

## 3.6.4

- **Persistent notification brain** now lives on the long-lived SteamUI host beside the persistent AudioEngine.
- Same Store track surviving Decky replacement no longer generates a fresh notification just because GTM remounted.
- Opening/closing Quick Access no longer replays the same notification; a real track change while QAM is open can surface once after QAM closes.
- Ambient → Store, Store → game, genuine track changes, and a stopped session becoming audible again still create one Now Playing event.
- Notification metadata is cached with the logical track identity so artwork/title remain coherent through controller rebinding.
- **Local Import artwork** now prefers Steam's remote/library candidate order and uses a contained foreground over a blurred full-frame backdrop, while Games/Find keep their premium hero fit.
- Store session continuity, 3-column Find Music, approved Ambient/Store art, and import progress remain protected.

## 3.6.3

- **Slot-tuned artwork rendering** replaces the 3.6.2 one-size-fits-all game-art fit.
- **Games + Find Music hero artwork** return to a premium cover-style presentation so wide banner slots fill cleanly again.
- **Local Import game artwork** now uses framed contain-style presentation so difficult aspect ratios stay readable without collapsing into a tiny strip.
- **Ambient / Store / Library generated artwork** remains intact and unchanged.
- **Unified Store session, Store continuity, 3-per-row Find Music, and import progress behavior** are intentionally preserved from 3.6.2.

## 3.6.2

- **Unified Store Music session**: Decky/plugin Store and native Steam Store now share current track, resume position, shuffle queue, history, and next-track state.
- **Resume instead of restart**: leaving Store snapshots the exact timestamp; returning resumes the same track instead of starting from zero.
- **State-based update handoff**: the hardware-proven persistent transport remains protected during Decky replacement, but an authoritative Home/Library/game route releases quarantine immediately so cached Store audio cannot linger for several seconds.
- **Store > Ambient ownership** remains explicit, including when Ambient `Other Deck Pages` is enabled.
- **Find Music is 3 per row** with row-based controller flow and three-result visual rhythm.
- **New Ambient + Steam Store artwork** uses the approved standalone assets throughout manager context/import surfaces.
- **Library context art** reuses GTM branding without adding a third generated asset.
- **Safer Steam artwork framing** uses contain-first presentation so games such as Digimon Story Cyber Sleuth and Operator 112 are not over-zoomed/cropped in Games/Find/Import.
- **Import progress polish** keeps the proven YouTube-style button fill/shimmer but slows the visual pacing so fast imports are readable.
- **3.6.0 hardware truth protected**: uninterrupted Decky update playback remains the baseline and the AudioEngine is intentionally unchanged.

## 3.6.1

- Preserve the 3.6.0 hardware-verified seamless Decky update transport unchanged.
- Add a backend Chromium/CEF native Steam Store probe that reads Steam's remote-debugging tab list and verifies Store tabs/webviews are visible before promoting an ambiguous `other` surface.
- Make concrete Home, Library, and game-detail routes immediately outrank stale Store probes, targeting the 3.6.0 four-to-five-second Store stop lag.
- Add a short ambiguous-surface classification window so Ambient → Other Deck Pages cannot grab the native Store before Store detection finishes.
- Keep Store above Ambient in playback ownership.
- Repair selected-game soundtrack D-pad depth: Down from the source-action row enters track 1, and Up from track 1 returns to the last source action, without a global D-pad listener.
- Slow only Local Import's proven YouTube-style progress treatment and hold completion longer so fast imports remain visible.
- Preserve notification artwork, deep YouTube continuation search, sticky-game Find Music, local duplicate protection, and the locked 3.0.7 live-theme/controller foundation.

## 3.6.0

- Rebuilt Steam surface detection around focused/main BrowserWindow authority plus bounded window-state, embedded Store-frame, and SharedJS/Steam-tab probes for the native Steam Store.
- Treat Quick Access/Decky as an overlay so Store playback remains attached to the Store underneath it.
- Added an 8-second update handoff quarantine: replacement GTM adopts the exact surviving transport, track key and Store queue but cannot stop, skip, reshuffle or reload during stabilization.
- Freeze the retiring controller's `onEnded` callback before Decky unloads GTM so an obsolete controller cannot advance the persistent audio element during replacement.
- Enforce playback ownership behavior: manual preview / game theme > Store > Ambient. Ambient saves position and yields instead of racing Store.
- Make Find Music target-driven. A sticky selected game now seeds `<game> soundtrack` and auto-searches whether Find is entered through Games, LB/RB or Back.
- Keep the Find Search control available whenever no search is currently running and add compact selected-game Steam artwork/context.
- Add Store detector-source diagnostics to the Quick Access Store runtime card.
- Preserve 3.5.10 YouTube-style Import progress buttons, deep YouTube continuation search, previews, notification artwork and the 3.0.7 theme/controller foundation.

## 3.5.10

- Fixed real Steam Store detection by reading Steam GamepadUI main/focused-window history and BrowserWindow locations instead of relying only on the plugin window URL. Decky Store remains a valid Store Music surface.
- Reduced Store exit grace from 1.4 seconds to 0.35 seconds and capped the final Store fade at 120 ms so returning Home stops promptly without sacrificing short route-transition protection.
- Routed every Store track end back through StoreController. Multi-track playlists now advance through the configured queue/shuffle path even if the session originally began with one track; single-track playlists deliberately restart through the controller.
- Reused the proven YouTube Download + Add button progress treatment for Local Import. Import to Library and Import + Add now fill/shimmer in-place instead of turning into an ambiguous gray disabled button.
- Removed the redundant standalone Local Import progress strip to reduce crowding.
- Preserved local content-hash IDs and duplicate-safe playlist assignment, so re-importing the exact same file updates/reuses the same library item rather than adding another playlist copy.
- Preserved the 3.5.9 persistent AudioEngine/update-adoption path, working notification artwork, assigned-track preview parity, sticky game destination, deep YouTube search, and 3.0.7 live-theme/controller baseline.

## 3.5.9

- Controlled continuity-test twin of 3.5.8.
- No intentional UI, Store, playlist, search, import, preview, notification, or playback behavior changes.
- Exists specifically so a Store track can play under 3.5.8 in Decky Store while Decky replaces it with 3.5.9, isolating the update-handoff test from unrelated feature changes.

## 3.5.8

- Restored Store Music on both the real Steam Store and Decky Store. Decky Store is once again a valid Store soundtrack surface, which allows Store Music to already be playing before Decky replaces GTM during an update.
- Kept the 3.5.6 persistent HTMLAudioElement/Blob adoption path so replacement builds can adopt the same transport and current position instead of restarting the track.
- Added the proven game-track Preview / Stop Preview behavior to Ambient and Store playlist rows, including A-to-preview on the main row.
- Added Preview Focused to Music Library while preserving A for multi-select.
- Removed custom Left/Right interception from the Library action rail and returned it to Decky-native horizontal `flow-children=right` navigation.
- Added a glass-style online Download + Add progress strip inside the preview modal, while retaining the existing button progress animation.
- Fixed unknown-length download progress so it displays as indeterminate instead of falsely showing 0%.
- Added visible STORE ON/OFF and AMBIENT ON/OFF state chips to their playlist workspaces.
- Preserved sticky selected-game context, Local Import queue/progress, deep YouTube search, local-cache-first playback, notification artwork, and the locked 3.0.7 baseline.

## 3.5.7

- Fixed Music Library horizontal controller navigation: Destination, Add Selected, and Clear now form an explicit left/right action row.
- Fixed clipped Library toolbar/selection actions on the Steam Deck viewport.
- Preserved the user's selected game / Store / Ambient assignment destination across LB/RB traversal into Library, Find Music, and Import.
- Added a glass-style Local Import progress strip with per-track batch position, working animation, assignment stage, completion, and error state.
- Tightened the Import layout by shrinking the artwork column and giving the queue workspace more room.
- Fixed false Quick Access visibility when Decky leaves the panel mounted off-screen, preventing hidden Soundtrack Manager UI from blocking Store/Ambient playback.
- Assigned Store, Ambient, and game soundtracks now resolve local cached/imported audio first before provider/network fallback.
- Preserves 3.5.6 update-time persistent audio transport adoption so installing 3.5.7 is the next live continuity test.

## 3.5.6

- Raised deep YouTube discovery to a 500-usable-result safety ceiling while scanning up to 1,500 raw candidates, and distinguish true provider exhaustion from a safety ceiling or slow continuation.
- Added explicit “all available results loaded” messaging only when the continuing yt-dlp session genuinely exhausts.
- Rebuilt Local Import into an in-manager Music-folder browser with local preview, multi-track queue building, batch Library import, and batch Import + Add.
- Made Music the default local-import folder across current import entry points.
- Strengthened Import controller structure into native vertical lists and intentional horizontal groups. Vertical containers now use Decky column flow, and focused Import controls consume only impossible lateral moves so Left/Right cannot leak into unrelated rows. No second raw D-pad listener was added.
- Added update-time logical-track adoption so replacement Store, Ambient, and game-theme controllers reuse the surviving HTMLAudioElement and exact current position instead of reloading the same song.
- Distinguished Decky Store from Steam Store so plugin-update navigation cannot accidentally create a new Steam Store playback session.
- Added a short Store route-transition grace period to prevent stop/restart loops while backing through Store screens.
- Preserved the proven 3.4.8 notification-artwork path, 3.5.x Soundtrack Manager artwork, and locked 3.0.7 live-theme/controller foundation.

## 3.5.5

- Rebuilt Soundtrack Manager YouTube discovery around one continuing yt-dlp search session instead of repeatedly asking for larger flat windows.
- Fixed the short-page false-end bug where long videos filtered out of a 20-result batch could leave 9 or 19 visible tracks and incorrectly stop pagination.
- Long mixes over 20 minutes are still excluded from ordinary track discovery, but skipped rows no longer count as provider exhaustion.
- Increased the per-query usable discovery depth from 80 to 200 tracks while scanning up to 600 raw YouTube candidates only as the user browses deeper.
- Added explicit backend continuation state so a temporary slow continuation is no longer mislabeled as end of results.
- Search now preloads earlier near the end of the visible list and lazily decodes thumbnails to reduce fast-scroll stalls.
- Preserved every 3.5.4 Import redesign, 3.5.3 notification/update-playback fix, and the locked 3.0.7 theme/audio foundation.

## 3.5.4

- Rebuilt Import Local Music as a first-class Soundtrack Manager workspace instead of the older centered utility card.
- Added the current game artwork to Import when assigning to a game, using the same 3.5.x Steam/local artwork component already proven in the Games workspace.
- Added themed Ambient and Steam Store destination artwork fallbacks when Import is targeting those soundtrack contexts.
- Repaired controller focus structurally: Target and Start Folder now live directly in one native vertical Focusable flow, while the two final import choices are one native horizontal pair.
- Left/Right no longer needs to impersonate vertical movement, and Up/Down can traverse the Import controls before escaping to the manager chrome.
- Added couch-readable destination, folder, action, supported-format, and Library-count context without adding another navigation rail.
- Kept physical LB/RB section controls in their existing positions and did not add any second D-pad/left-stick listener.
- Preserved 3.5.3 notification artwork and browser-owned update playback continuity unchanged for hardware reinstall testing.

## 3.5.3

- Restored the exact 3.4.8 notification artwork path: Now Playing uses the track thumbnail directly instead of the 3.5.1/3.5.2 inline/local conversion layer.
- Added browser-owned Blob mirroring for cached/local main playback so Decky Store plugin replacement can tear down the isolated Python backend without taking the currently playing bytes with it.
- Existing long-lived AudioEngine handoff still preserves the same Audio element/current position and now recognizes the Blob and replacement loopback URL as the same local resource.
- Kept 3.5.2 manager, non-Steam identity, fast-preview, Steam artwork, 3.4.9 focus/live-refresh fixes, and the locked 3.0.7 live-theme/audio foundation.

## 3.5.2

- Make Now Playing artwork self-contained with inline cached data URLs so Steam's overlay cannot lose localhost/remote thumbnails during plugin lifecycle changes.
- Keep a visible artwork fallback under the image so a failed image decode never leaves a blank notification tile.
- Resolve non-Steam shortcut aliases across Steam's uint32 and 64-bit shortcut game IDs and collapse proven duplicate aliases in Soundtrack Manager.
- Prewarm downloaded game-track localhost URLs in one bounded batch when a game opens so assigned-track Preview can start without an extra RPC wait.
- Center game hero artwork consistently while preserving the wider 3.5.1 hero presentation; when Steam has not cached a native game image locally yet, cache first-party Steam CDN art through the backend.
- Preserve 3.5.1 true playback continuity, 3.5.0 search/paging, and the locked 3.0.7 theme/audio foundation.

## 3.5.1

- Preserve the actual playing Audio element, source and exact currentTime across Decky plugin replacement instead of restarting the same song.
- Rebind the replacement backend to the previous loopback stream endpoint so range requests survive the backend handoff.
- Suppress duplicate same-track Now Playing notifications during an update.
- Repair notification artwork by caching active thumbnails locally and enriching an already-visible ribbon when local artwork becomes available.
- Add local Steam librarycache/custom-grid artwork discovery for native and non-Steam games, with broader Steam CDN artwork fallbacks.
- Widen/crop game artwork as a hero, compact the GTM banner, and keep page changes anchored at the top.

## 3.5.0
- Add selected-game Steam artwork to the full-screen Games soundtrack workspace.
- Submit Find Music directly with R2 / Enter while the Steam keyboard is open, then dismiss the keyboard automatically.
- Raise the initial online discovery batch to 20 results.
- Add lazy 20-result paging with preload near the bottom of the result list/grid, up to a bounded 80 loaded results per query.
- Make the result counter grow as additional pages are loaded.
- Fix Game Music coverage action sizing so Refresh and Open next game needing music cannot overlap.
- Preserve the 3.4.9 focus/offline-artwork fixes and keep AudioEngine, AmbientController, StoreController, and the 3.0.7 live-theme foundation unchanged.

## 3.4.9
- Fix stale Ambient/Store playlist refresh after browser Back navigation.
- Keep LB/RB shoulder hints visible but out of the gamepad focus tree.
- Fix Right navigation from game track cards into track actions.
- Cache/serve artwork locally for offline playback and preserve thumbnail metadata.
- Open Change Theme Music directly in the selected game inside Soundtrack Manager.

# Game Theme Music 3.4.8 — Game Playlist Polish

- Downloaded/assigned game tracks now check GTM local storage first before any provider resolution, so game-tab Preview should begin almost immediately.
- The Edit Track preview uses the same local-first path.
- Pressing A on a game soundtrack row now previews that track instead of silently changing the active game track.
- Preview and Active are separate states. The action rail contains an explicit Set Active / Active control.
- Track rows now show a couch-readable A Preview / Right More hint plus DOWNLOADED, ACTIVE, and PREVIEWING status.
- Up/down remains track-first in the main soundtrack column; Right enters the row action rail; Left returns toward the track.
- Moving focus to another track stops the previous temporary preview so the audition state does not leak across rows.
- Existing 3.4.7 online preview warming, download animation, and update-time AudioEngine continuity are retained.
- Added GAME_THEME_MUSIC_UPDATE_LEDGER.md as the persistent development ledger and handoff anchor.
- 3.0.7 live-theme and physical LB/RB baseline remain locked.

## 3.4.6 — Fast Preview Warm-Up + Cinematic Download Motion

- Find Music now starts resolving the highlighted result after a short focus pause, so opening Preview usually reuses a warm provider URL instead of beginning cold.
- The first search result is gently prewarmed after results arrive. This resolves metadata/audio URLs only; it does not download or save the track.
- Preview modal reuses the in-flight warm-up promise when A is pressed, avoiding duplicate yt-dlp resolution work.
- Download network transfer remains full speed. The visual progress is intentionally eased and kept visible for roughly 1.3 seconds minimum on very fast tracks so the transfer animation can actually be seen.
- Download fill uses a lighter/darker tint range derived from the current live theme accent, plus a slower scanning sheen. No hardcoded cyan/orange palette was added.
- 3.0.7 live theme/controller baseline remains locked.

## 3.4.5 — Centered Live Preview + Download Progress

- Streams online Find Music results through GTM's tokenized localhost preview proxy before downloading.
- Centers and stabilizes the preview dialog in the owning Steam window.
- Adds restrained SAO-inspired preview framing using the live 3.0.7 theme colors.
- Adds real byte-based Download + Add progress with a theme-accent fill and subtle shimmer.
- Keeps download explicit; previewing never writes the track to storage.
- Preserves the 3.0.7 live theme engine and current manager/controller navigation.

# 3.4.4 — Portal-Safe Preview + Crash Guard

- Fixed fatal Decky render crash when selecting an online Find Music result.
- Root cause: Decky modal portals can render outside GTM's AudioLoader compatibility context; the normal preview hook destructured a null context.
- Added a self-contained modal preview player using GTM's singleton AudioEngine directly.
- Made the shared preview hook null-safe for portal contexts.
- Added a local React error boundary so a future preview render failure can return to results instead of taking down Decky's content tree.
- Preview-first behavior remains: selecting a result never downloads it; Download + Add is explicit.
- Preserved the 3.0.7 live-theme engine and 3.4.x manager/navigation behavior.

# 3.4.2 - Manager Context, Back Stack & Search UX

- Find Online opened from a selected game now automatically searches for that game's soundtrack. The search field is temporarily locked while the automatic search runs, then becomes editable for custom searches while retaining the selected game as the assignment target.
- Find Music now defaults to a couch-readable thumbnail grid with a Grid/List toggle. Grid navigation is row/column grouped for Decky native controller focus.
- Added same-route manager history entries so Steam's native B behavior backs out one manager page at a time before closing the manager. No extra raw B listener was added.
- Selecting a game now creates a real drill-in manager level. B returns to the game list; Find Online, Music Library, and Import return to the selected game's soundtrack page.
- Library multi-select now keeps a permanently reserved action bar so selecting tracks no longer inserts/removes UI and shifts the list.
- Library assignment is explicit: the action bar always shows the current destination and the add button names the destination (for example, “Add 2 to Ambient Music”).
- Tracks already in the current playlist may still be selected; duplicate additions are ignored with a clear status message instead of hiding or moving the track.
- Preserves 3.4.1 single-owner native D-pad/left-stick navigation, 3.4.0 game-name intelligence, physical LB/RB section switching, and the 3.0.7 live theme engine.

# 3.4.1 - Native Single-Step Navigation Fix

- Fixed the root cause of D-pad/left-stick skipping in Soundtrack Manager: 3.4.0 was moving focus twice per physical direction press, once through Steam/Decky native Focusable navigation and once through GTM's custom controller listener.
- Removed GTM's second directional input owner. Decky `Focusable` + `flow-children` is now the only owner of Up/Down/Left/Right navigation.
- Preserved the proven physical LB/RB section-switch handler from 3.0.7.
- Removed custom directional `scrollIntoView` behavior that could shove the manager viewport sideways.
- Kept Games two-pane, source-action rows, playlist rows, Library, Find Music, and Import grouped with native horizontal/vertical Focusable flows.
- Preserved 3.0.7 live theme engine and 3.4.0 game-name resolution.


## 3.3.1 — Content-First Couch Manager
- Reclaimed manager vertical space after 3.3.0 TV testing.
- Removed redundant destination bar and duplicate controller footer.
- Compacted header/section rail while keeping physical LB/RB navigation.
- Expanded usable Library / playlist / search list area.
- Preserved 3.0.7 live-theme and shoulder-navigation baseline.
# 3.3.0 — Couch View Soundtrack Manager

- Rebuilt the full-screen manager around one current section instead of six simultaneous category buttons.
- Physical LB/RB remains the primary section navigation, with large previous/next fallback controls and a single readable current-section header.
- Enlarged headings, list rows, metadata, focus borders, and controller targets for TV/couch viewing.
- Removed the always-visible three-destination button bar; Library, Find Music, and Import now show one current destination with a simple change action.
- Reworked Games into a readable two-pane game/soundtrack workspace and Ambient/Store into full-width ordered playlist editors.
- Rebuilt Library multi-select around stable large cards, persistent selected/in-playlist/name states, and one batch Add action.
- Rebuilt online search as a one-column result list with larger thumbnails and readable titles.
- Simplified local import into a centered task screen with two clear actions.
- Preserved the 3.0.7 live theme engine, adaptive theme runtime, and physical shoulder-navigation implementation byte-for-byte.

# 3.2.0 — Unified Soundtrack Manager

- Replaced Playlist Studio / Soundtrack Assignment Center duplication with one full-screen controller-first manager.
- Added Games, Ambient, Store, Library, Find Music, and Import sections with physical LB/RB navigation.
- Added a persistent assignment destination bar so library/search/import actions always show where music will go.
- Rebuilt multi-track library selection around stable cards and batch Apply instead of disappearing checkbox rows.
- Unified YouTube/KHInsider search, local import, downloaded library, game playlists, Ambient, and Store into one workspace.
- Retained per-track game tuning and ordered playlist controls.
- Redirected old assignment entry points into the unified manager.
- Preserved the verified 3.0.7 live CSS Loader theme engine and shoulder navigation implementation unchanged.

# 3.1.0

- Locks the working 3.0.7 live-theme engine as the visual baseline for both Quick Access and per-game routes.
- Replaces the Ambient/Store picker with Playlist Studio: Playlist / Library / Find Music views, stable staged multi-selection, pending ADD/REMOVE states, bulk apply/undo/reset, stable list rows, and ordered reordering.
- Rebuilds the per-game Playlist tab into a themed controller-first studio with clearer status, active/up-next badges, larger actions, and one Track Settings panel per song.
- Adds per-track start timestamp, optional end timestamp, and optional fade-in/fade-out overrides.
- Adds Smart Playlist Suggestions that score the current soundtrack search and can build up to three strong matches at once.
- Adds known-game playlist coverage on the Game Music page, including a direct jump to the next known game config without music.
- Expands Library Intelligence with Needs Names, Duplicates, and Unused filters.
- Keeps metadata titles when per-game search downloads audio.
- Preserves physical LB/RB navigation, Ambient/Store playback, STEAM-button media controls, Desktop Mode blocking, non-Steam support, and Media Bridge behavior from the 3.0.7 baseline.

# 3.0.7

- Rebuilt adaptive theme startup around a synchronous live host sample instead of caching or hiding the UI.
- Removed all persisted GTM surface-palette replay.
- Automatically clears the 3.0.5 theme cache.
- Added a material-change gate so harmless Steam DOM activity cannot repaint the whole GTM palette.
- Restricted theme mutation rescans to actual host/theme changes.
- Kept Playlist Workshop, bulk selection, metadata repair, Ambient/Store playback and physical LB/RB navigation intact.

# 3.0.5

- Fixed adaptive-theme color flashing by applying cached palette data in the layout phase before first paint.
- Preserved CSS Loader learned focus accents across adaptive rescans so ON switches no longer bounce between GTM blue/cyan and the host theme color.
- Added Playlist Workshop for Ambient and Store playlists with ordered current tracks, separate available-library browsing, filter/search/import, bulk Add Visible/Clear/Reset, theme-colored status chips, and plain-language track status thoughts.
- Added stable track reordering without remounting the whole selection list.
- Added Music Library intelligence summary for local track count, storage use, Ambient/Store assignments, legacy metadata, and duplicate-title groups.
- Updated per-game playlist cards to the adaptive palette and changed six tiny action buttons into a controller-friendlier 3x2 layout.
- Kept the 2.9.12 playback core, 3.0.4 LB/RB navigation, Ambient preview behavior, metadata repair, and Health theming unchanged.

# 3.0.4

- Fixed the remaining owner-window theme sampling path so CSS Loader colors are read from the document that actually renders Game Theme Music.
- Added live focus-accent learning: GTM now learns the rendered controller highlight color and reuses it for ON switches, focus rings, and sliders instead of falling back to Steam blue.
- Rebuilt Health diagnostic rows on adaptive semantic colors; removed the legacy hard-coded navy gradient.
- Made metadata-repair results persist in the Music Library and extended the notification so the result can actually be read.
- Raised the Music Library visible cap from 40 to 100 tracks and clarified whether the full library is being shown.
- Added an explicit top focus stack so moving upward reaches the GTM banner/page rail before Steam's header/back control.
- Removed forced smooth scrolling from Health rows to reduce focus/scroll fights near the top of long pages.

# 3.0.3

- Fixed LB/RB for real Steam Deck hardware: the controller callback no longer checks the wrong global document.
- Fixed adaptive theme sampling/apply across Decky's cross-document render boundary.
- Restored the large banner as a focusable Now Playing/Home control.
- Added stronger light/dark contrast ownership and WebKit text-fill overrides for CSS Loader conflicts.
- Added bounded automatic title normalization plus an Ambient name-repair action.

# Game Theme Music 3.0.2

## 3.0.2

- Fixed physical LB/RB page switching using current Steam controller button values.
- Removed the Ambient playlist remount that reset scroll/focus after every toggle.
- Added live Ambient preview while the Ambient page is open.
- Added bounded legacy metadata repair for old ID-only YouTube tracks and removed repeated “Imported 1.8 theme” labels.
- Rebuilt Ambient/Store rows as GTM-owned surfaces and tightened light-theme contrast.
- Preserved the 2.9.12 playback core and bundled helper binaries.


## Deck-first correction
- Restored the full-width 2.9.12 Game Theme Music banner as the primary brand treatment.
- Removed the seven tiny page buttons from the active UI.
- Added true LB/RB page switching through Steam controller input messages, with visible LB and RB page controls as a fallback.
- Added native-focus recovery to the persistent page rail after a shoulder-button page change so focus is not stranded in unmounted page content.
- Replaced navigation and major surface glyphs with recognizable inline SVG icons.
- Removed the duplicate page title from each content page and hid the compact theme diagnostic from Now Playing.

## Contrast and CSS Loader compatibility
- Reworked adaptive theme sampling to consider multiple surrounding Steam surfaces rather than accepting the first opaque parent.
- Added bright-host evidence so light CSS Loader themes are correctly classified even when an inner Decky container remains dark.
- Accent colors are contrast-corrected before being used for text or focus indicators. Cyan-on-white and light-gray-on-white are no longer valid output states.
- GTM now explicitly owns section, row, control, switch, library-card, Ambient, Store, and Now Playing surfaces. Host themes can still influence mode/accent but cannot leave mismatched white rows inside dark GTM cards.
- Primary text targets 7:1 on GTM surfaces, secondary text 4.8:1, and muted text 3.5:1.

## Compatibility
- AudioEngine, Game/Ambient/Store ownership, downloads, non-Steam handling, Desktop Mode hard block, SAO HUD, Media Bridge, and session-armed STEAM-button media controls are unchanged from the 3.0.0/2.9.12 playback core.

# Game Theme Music 3.0.0

## Adaptive UI architecture
- Rebuilt the Quick Access interface as a controller-first seven-page application: Now, Game, Ambient, Store, Library, Settings, and Health.
- Added Adaptive Theme Intelligence. GTM samples the actual rendered Steam/Decky/CSS Loader appearance instead of trying to identify themes by name.
- Generates semantic background, surface, text, accent, focus, border, success, warning, and danger colors at runtime.
- Enforces readable contrast for primary/secondary text and interactive states, including light Steam themes.
- Watches host style/class changes and automatically resamples after CSS Loader theme changes without restarting playback.
- Added theme diagnostics, contrast ratio, palette swatches, source reporting, and manual rescan.
- Scoped GTM fallback CSS variables to the plugin and exposes only uniquely named runtime variables on the document root for portal compatibility.

## Interface overhaul
- New compact identity header and two-row controller navigation.
- New unified Now Playing dashboard with current owner/source, artwork, transport, Up Next, and master output control.
- Split the old long settings tunnel into task-based pages.
- Remapped Ambient, Store, library cards, custom switches, Decky controls, and diagnostics to semantic adaptive colors.
- Added persistent last-page navigation.

## Safety / compatibility
- Preserved the 2.9.12 playback engine, strict game playlist ownership, Ambient/Store controllers, non-Steam handling, Media Bridge, Desktop Mode hard block, SAO HUD, and session-armed STEAM-button controls.
- Backend changes are version metadata only. No playback pipeline rewrite was performed for 3.0.0.

# 2.9.12

- Rebuilt directly from the proven 2.9.6 installable runtime.
- Adds STEAM-button Previous / Next / Stop / Play controls as an explicitly session-armed feature.
- Steam controller input is never registered during installation or plugin startup.
- Saved opt-in is re-armed only when the user opens the GTM Quick Menu after a reload.
- Accepts both documented Decky three-argument controller callbacks and Steam array-message callbacks.
- Keeps strict per-game playlist ownership, Ambient/Store playlist workshop, native-Steam re-entry fixes, and Auto-DJ removal.

## 2.9.6 — Ambient & Store playlist creation

- Added a controller-first global playlist workshop for Ambient Music and Steam Store Music.
- Added online search and direct local-file import to both global playlist editors.
- Added game-tile context-menu shortcuts for Ambient and Store playlist management.
- Preserved existing playlist entries even if a local file is temporarily missing.
- Added Ambient/Store IDs to backend pin synchronization so storage cleanup cannot treat them as unused.
- Removed unnecessary download-library scans from the Quick Menu Ambient/Store cards; the editor loads the library only when opened.

## 2.9.5 — Fast native-Steam re-entry

- Fixed a startup reconciliation race that could clear persisted playlist pins before the frontend re-sent them, making assigned native-Steam audio eligible for storage eviction.
- Backend now seeds its in-memory pinned ID set from `downloads.json` before startup maintenance.
- Frontend now synchronizes authoritative playlist pins immediately at plugin startup.
- Added an idle native-Steam repair pass that restores missing active assigned tracks by their exact media ID, never by search or automatic substitution.
- Preserved the 2.9.4 hard game-detail Ambient boundary and strict per-game playlist ownership.
- Non-Steam shortcut warm/cache behavior is unchanged.

## 2.9.4 — Strict per-game playback ownership

- Fixed cross-game music leakage where Ambient could continue on `/library/app/<game>` pages.
- Game detail pages are now a hard Ambient boundary. Ambient remains available for browsing surfaces only.
- Removed automatic game-theme playback/discovery mode from the UI and migrated saved `automatic` modes to Manual at runtime.
- Explicit game playlists are authoritative: if a configured track cannot resolve, GTM does not substitute a different search result.
- Native Steam games can re-resolve an assigned missing local track by the exact saved media ID and cache it again.
- Suggest-and-ask remains available only for games with no assigned playlist and never auto-plays the suggestion.

## 2.9.3 — No Auto-DJ stability build

- Version bump for the private Decky Store so this byte-distinct no-Auto-DJ package cannot collide with an existing 2.9.2 release.
- No playback-engine or feature changes from the no-Auto-DJ stability rebuild.
- Library Auto-DJ remains physically removed from the runtime.

## 2.9.2 — Stability rollback: Library Auto-DJ removed

- Removed the Library & Automation / Library Auto-DJ UI from the Decky panel.
- Removed the Auto-DJ confirmation, progress, stop, results, and Return-to-Steam modal workflow.
- Removed the Auto-DJ bulk search/download/assignment path and its `autoAssigned` metadata writes.
- Removed the read-only Steam-library scanner RPC and its Auto-DJ-only backend helpers.
- Removed Auto-DJ-only styles and standalone feature documentation.
- Preserved the existing singleton AudioEngine, game playlists, per-game automatic mode, Ambient, Store, previews, provider search, non-Steam/MW support, SAO HUD, Media Bridge v1, downloads, and diagnostics.
- This is a feature removal, not a playback-engine rollback.

## 2.9.1 — Final UI polish

- Reorganized the oversized Settings page into Playback & Volume, Music Discovery & Providers, Interface & Feedback, Downloads & Maintenance, and Advanced & Recovery.
- Renamed Health Center to Health Center & Integrations and made the page hierarchy easier to scan.
- Renamed Library Auto-DJ section to Library & Automation and Overrides to Overrides & Backups.
- Fixed Auto-DJ modal horizontal overflow by sizing to the actual Decky modal and using a contained GTM progress bar.
- Fixed final Auto-DJ Assigned / Skipped / Failed counters so completed results remain authoritative.
- No playback, Media Bridge, non-Steam, Ambient, Store, or Auto-DJ assignment logic changes.

## 2.9.0 — Final / Media Bridge v1

- Freezes the proven 2.8.7 playback architecture as GTM's final feature baseline.
- Adds an optional, observer-only **Game Theme Music Media Bridge v1** for companion Decky plugins such as a future live-wallpaper engine.
- Exposes current playback state, source type, game/app identity, track title, provider, artwork, Up Next, playlist position, elapsed/duration, volume, Steam surface context, UI mode, and Desktop playback-block state.
- Adds demand-driven real audio telemetry: 12 frequency bands plus low/mid/high, RMS, and peak, capped at 20 Hz. The analyzer remains completely dormant until another plugin explicitly subscribes.
- Telemetry observes `captureStream()` only. It never inserts a Web Audio node into GTM's playback graph, and if capture is unavailable it reports that condition instead of changing playback.
- The bridge intentionally exposes **no playback-control API**. Companion plugins cannot Play, Pause, Next, seek, change volume, or take ownership of GTM audio.
- Adds bridge-ready/state/unavailable browser events and a stable `window.GameThemeMusicBridge` protocol object so a companion plugin can load before or after GTM without a hard dependency.
- Adds Media Bridge status to Health Center.
- No changes to MW/non-Steam resolution, Auto-DJ selection/download behavior, game/Ambient/Store ownership, Desktop Mode blocking, playlist behavior, or the SAO mini-player trigger rules.

## 2.8.7 — Desktop Mode hard playback block

- Promoted Desktop Mode from a one-shot stop into a persistent AudioEngine gate.
- Game Theme, Ambient, Store, previews, and Auto-DJ preview playback cannot restart while Steam reports Desktop Mode.
- Returning to Gaming Mode releases the gate and restores normal GTM behavior.
- Preserved the 2.8.6 Auto-DJ modal fit, wrapping, and reliable Return-to-Steam behavior.

## 2.8.6 — Auto-DJ modal fit + reliable Return to Steam

- Expanded the Auto-DJ workflow modal and removed one-line clamps so long game/track/result text wraps instead of being cut off.
- Shortened the progress-bar operation label while keeping the full current game/track visible below it.
- Made completed results scroll safely without pushing the action button off screen.
- Fixed Done/B Return to Steam by closing the main Gamepad UI MenuStore directly, with public Decky navigation fallbacks after modal dismissal.
- Playback, MW/non-Steam resolution, Auto-DJ selection/download logic, Ambient, Store, and SAO mini-player behavior are unchanged.

## 2.8.5 — Auto-DJ Return-to-Steam polish

- Auto-DJ result windows remain visible until explicitly dismissed, including skipped or failed matches.
- The finished-state button is now **Done • Return to Steam**.
- Pressing Done or B after completion closes the results modal and uses Decky's native `Navigation.CloseSideMenus()` behavior to close the Quick Access Menu and reveal the Steam screen underneath.
- While Auto-DJ is running, B still requests a safe stop rather than abandoning the workflow.
- Playback architecture and Auto-DJ assignment/search/download logic are unchanged from 2.8.4.

## 2.8.4 — 2026-08-27

- Rebuilds Library Auto-DJ as a persistent workflow modal instead of dismissing the confirmation and finishing through a toast.
- The modal now shows overall progress, the current game, selected track title, search/download/assignment stage, and live Assigned/Skipped/Failed counts.
- Completed game results remain visible in the modal, including skipped and failed reasons.
- Stop Auto-DJ remains inside the workflow; completion uses a Back to Game Theme Music button and no final Auto-DJ toast.
- Library scan feedback is kept inside the Auto-DJ section instead of sending a scan-complete toast.
- Playback, MW/non-Steam resolution, playlists, Ambient, Store, master volume, start offsets, and SAO mini-player behavior are unchanged.

## 2.8.3 — 2026-08-27

- Install-safe packaging restored after 2.8.2 accidentally recompressed the bundled yt-dlp executable.
- Library Auto-DJ remains promoted to the top of the GTM interface.
- No playback, Auto-DJ, MW/non-Steam, Ambient, Store, playlist, or SAO HUD behavior changes from 2.8.2.

## 2.8.2 — 2026-08-27

- Moved Library Auto-DJ directly below the GTM identity header so it is immediately visible in the main Decky panel.
- No Auto-DJ logic, playback, non-Steam handling, playlist behavior, Ambient, Store, or SAO HUD behavior changed.

## 2.8.1 — 2026-08-27

- Install-safe repack of 2.8.0. No playback or feature behavior changes.
- New release identity prevents stale private-store SHA metadata from being reused.
- Bundled Linux helper binaries are packaged with executable mode bits.
- yt-dlp is stored uncompressed in the ZIP to minimize Decky's 90% extraction step.

## 2.8.0 — 2026-08-27

- Adds Library Auto-DJ: manual read-only Steam library scanning, installed/uninstalled/all filters, missing-music discovery, confirmation, progress/cancel, and high-confidence bulk assignment that downloads exactly one selected winner per successful game without replacing existing playlists.
- Adds per-track 0–30 second intro skip in the controller-first Playlist tab.
- Adds a true master-volume cap across Game, Ambient, Store, and preview playback while preserving individual volume settings.
- Adds an optional passive SAO HUD activity/beat meter. It uses captureStream when Steam exposes audio analysis and never reroutes or owns playback.
- Keeps the proven 1.9.1 mount lifecycle and permanent non-Steam/MW resolution path intact.
- Library scanning is manual so startup performance remains unchanged.

# Changelog

## 2.7.27 - Final notification timing cleanup

- Ordinary playback stops no longer raise the global SAO mini-player HUD.
- If playback stops while the HUD is visible, the HUD dismisses immediately instead of changing to a Stopped state.
- Mini-player display time reduced from 7 seconds to 4 seconds.
- Replaying the same track after a stop still counts as a fresh playback event.
- No playback, non-Steam, playlist, Ambient, Store Music, or provider-resolution behavior changed.

## 2.7.26 - SAO-inspired mini player rebuild

- Rebuilt the global mini player as an actual SAO-inspired white/yellow HUD in code.
- Uses the globally available `SAO UI` font family when the SAO Gaming Mode theme is active, with system fallbacks otherwise.
- Added angular white clock-style panel geometry, yellow notification blade, album artwork, real playback progress/time, context metadata, and an angled playback-state module.
- Preserved the 7-second event-driven trigger behavior and left/right docking option.
- Playback, MW/non-Steam handling, playlist focus, provider timing, Ambient, Store Music, and notification trigger logic are unchanged.

# 2.7.25

- Fixed Playlist controller navigation so D-pad Up/Down moves between track rows instead of crawling through every action in one track.
- Track action buttons now form an explicit left/right focus row.
- The entire owning track card gets a strong focus-within highlight while one of its actions is selected.
- Removed the duplicate Shuffle Playlist switch from the Playlist tab; shuffle remains in Game Settings.
- Playback/non-Steam timing stack remains unchanged from 2.7.24.

# 2.7.24

- Fixed game-theme now-playing/notification metadata so each playlist song shows its own configured track title instead of repeating the game name.
- Game name is now secondary context for game-theme playback.
- Game-theme presentation identity now includes the active track ID, so Next/shuffle track changes are recognized as real media changes.
- Kept 2.7.23 non-Steam playback, provider caching, Ambient handoff, and startup performance logic unchanged.

# 2.7.23

- Preserved the working 1.9.1-style game-page core and 2.7.21 non-Steam media fallback.
- Made the loopback stream server startup-critical and deferred download-index/storage housekeeping until after the first Home/Decky paint.
- Persisted still-valid resolved provider URLs across plugin reloads, with expiry-aware pruning.
- Deferred non-Steam prewarming until after a startup grace period plus an idle window.
- Limited each idle prewarm cycle to one cold shortcut track and batched local-file checks.
- Debounced frontend flight-recorder localStorage writes and reduced route sampling frequency.
- Queued persistent remote materialization after playback has had time to buffer.
- Reused the already-resolved provider stream for materialization instead of launching a second yt-dlp process.
- Preserved actual audio MIME/extension when caching direct provider streams.
- Debounced download-index last-access persistence so local playback does not wait on an fsync.
- Mini-player visuals intentionally unchanged.

# 2.7.22

- Frozen the working 2.7.21 non-Steam playback fix.
- Added expiry-aware in-memory provider URL caching and single-flight yt-dlp resolution.
- Switched direct YouTube URL extraction from full JSON output to the lean `-g` path.
- Added background startup prewarming for the selected track of configured non-Steam shortcuts.
- Automatically materializes a successfully resolved remote shortcut theme into Download Storage so later visits and later Decky sessions use the fast local loopback path.
- Ambient now releases immediately when a configured non-Steam theme reaches the media-resolution stage instead of continuing Home music during provider resolution.
- Added timing evidence events for shortcut handoff, warmup, provider cache materialization, and failures.
- Mini-player appearance intentionally unchanged pending hardware confirmation of the timing fix.

# 2.7.21

- Permanent non-Steam media-resolution repair built on the 2.7.20 / 1.9.1-style Library mount core.
- Diagnostics proved MW was detected, mounted, and its three-track config loaded, but `legacy191-theme-start` never fired because the configured media ID was not present in Download Storage.
- Native Steam game pages remain local-first and otherwise unchanged.
- Non-Steam shortcuts now use local audio first, then fall back to the configured media provider when the local file is absent.
- Added shortcut trace events for local hit/miss, provider ready/miss, and provider error.

# Changelog

## 2.7.20 — 2026-08-26

### 1.9.1 game-page core restoration

- Replaced the 2.7.x game-page visibility/session state machine with the older mount/unmount-driven Library player model that was proven with the MW custom non-Steam shortcut.
- Restored direct `useParams()` AppID ownership from `/library/app/:appid`; no shortcut-specific route translation is required for playback.
- Restored fresh ThemePlayer injection on each Steam Library render and intentionally removed the newer `alreadyInjected` guard that could leave cached non-Steam detail trees without a fresh player on same-game re-entry.
- Removed the non-Steam DOM/React-fiber fallback coordinator from playback authority.
- Kept the modern singleton audio engine, local loopback streaming, playlists, cursor/shuffle/loop behavior, Ambient, Store Music, mini player, notifications, diagnostics, bundled yt-dlp, and QuickJS.
- The legacy core remains controller-invisible: it renders no focusable UI on the game page.

# 2.7.19

- Dedicated non-Steam shortcut playback coordinator based on the actually visible Steam App Details page.
- Uses current Decky `AppDetailsContainer` / `AppDetailsRoot` DOM anchors and React-fiber `overview` identity instead of relying on shortcut route remounts.
- Normalizes signed int32 shortcut AppIDs, unsigned 32-bit AppIDs and 64-bit Steam shortcut GameIDs to one cache/playback identity.
- Native Steam games remain on the proven route ThemePlayer path; shortcut route players no longer compete with the coordinator.
- Existing configured themes load without requiring Steam to resolve an app display name.
- Persistent diagnostics now report visible shortcut identity, anchor and config load.

# 2.7.18

- Uses the 2.7.17 exported flight recorder evidence to target the MW custom-shortcut failure without changing normal Steam-game playback.
- Adds a non-Steam-only visible App Details fallback: when Steam visibly shows a custom shortcut but Decky's normal route patch never mounts a ThemePlayer, GTM reads the visible page AppID from Steam's React fiber and starts the same ThemePlayer controller through a Decky global component.
- Gives the ordinary route path a 450 ms head start and suppresses the fallback whenever a route ThemePlayer is mounted, preventing duplicate ownership on games that already work.
- Clears fallback playback immediately when the visible non-Steam App Details page disappears.
- Adds `dom-visible-app`, `dom-fallback-start`, and `dom-fallback-clear` events to the persistent diagnostic trace.
- Preserves the 2.7.17 Ambient, Store Music, notification, mini-player, diagnostics export, and backend behavior.

# 2.7.17

- Keeps the 2.7.14 playback/notification behavior unchanged while upgrading diagnostics only.
- Makes the frontend navigation/theme recorder persistent across GTM panel closes with a bounded localStorage ring buffer.
- Records route changes, ThemePlayer lifecycle/visibility/session events, and audio owner/state transitions with timestamps and session IDs.
- Passes the recorder snapshot into backend diagnostic export and writes `frontend-diagnostics.json` plus `frontend-navigation-trace.json` into every diagnostics ZIP.
- Health Center now shows recorder event count/session so hardware testing can confirm evidence is being collected before export.

# 2.7.16

- Recovery build based directly on 2.7.14 after the 2.7.15 route-authority regression.
- Restores the 2.7.14 game-theme route behavior so normal Steam games work again.
- Adds an observation-only navigation/theme ring buffer in Health Center.
- Records route changes, ThemePlayer mount/unmount, visibility changes, session creation/cleanup, track-start attempts, and current audio owner.
- The recorder does not control playback, Ambient, Store Music, notifications, or route decisions.

# 2.7.14

- Fixed custom/non-Steam game-detail re-entry without changing Ambient or notification plumbing.
- Game Theme Music now patches all three Steam detail-route shapes used by current Gamepad UI: `/library/app/:appid`, `/library/details/:appid`, and `/library/:collection/app/:appid`.
- Game-theme visibility checks now read the focused Steam BrowserWindow, main Gamepad UI BrowserWindow, plugin window, and top window instead of relying on the plugin execution window alone.
- Preserved 2.7.13 non-Steam 64-bit/32-bit identity normalization.
- Preserved the working 2.7.12 Ambient, notification, mini-player, Store Music, and playback foundations.

# 2.7.12

## 2.7.13

- Fixed non-Steam shortcut dual-ID handling. 64-bit Steam shortcut game IDs are normalized with BigInt to their canonical 32-bit AppID, avoiding precision loss and split playlist/playback identity on repeated game-page visits.
- Preserved the 2.7.12 playback, Ambient resume, notification, mini-player, and Store Music behavior.

- Recovery build based on 2.7.10 after the 2.7.11 regression.
- Restored working music playback and direct notifications.
- Added diagnostic-only Steam route probes to Health Center.
- No diagnostic route source controls playback in this build.

## 2.7.12

- Fixed rapid **Home ↔ same game-detail page** switching getting GTM stuck on Ambient until a different game was opened.
- ThemePlayer now watches actual Steam GamepadUI route visibility instead of relying only on React mount/unmount; cached same-game app-detail trees therefore restart correctly when revisited.
- Added a monotonic per-visit game-theme session/owner generation so stale teardown from an older visit can never stop a newer visit to the same app.
- Added current-session and current-route guards after asynchronous config/provider resolution so late completions from pages the user already left cannot steal AudioEngine ownership.
- Preserved 2.7.9 Ambient exact-track/timestamp resume behavior, the playback-event-only global mini-player policy, its existing premium footer design, and the corrected 24 px outer Decky icon.

## 2.7.9

- Fixed Ambient → game-theme → Ambient continuity on Steam game-detail pages. Before ThemePlayer takes the shared AudioEngine, GTM now captures the active Ambient track's exact current time and preserves the current Ambient playlist position.
- Leaving a game-detail page now allows Ambient to resume from the captured position instead of restarting the Home/Library track from the beginning when Ambient interruption mode is Resume.
- Existing Ambient interruption preferences remain respected: Resume keeps timestamp, Restart returns to 0, and Next advances the Ambient queue.
- Enlarged the **outer Decky Quick Access plugin icon** registration from the undersized 1em image to a fixed 24 px slot so GTM has normal visual weight before the plugin panel is opened.
- Preserved the proven global mini-player host, 2.7.8 playback-event-only banner policy, Store controller, and premium left/right footer presentation.

## 2.7.8

- Changed the global mini player to playback-event-only triggering.
- Opening/closing Quick Access and moving between Steam Home, Library, Store, or game pages no longer retriggers the banner.
- Same-track Ambient resume after GTM/Quick Access interruption no longer retriggers the banner.
- The ribbon now appears for actual new-track/start events, real playback stops, and playback errors.
- Added short start/stop stability windows to prevent Next/Previous/shuffle transitions from flashing duplicate banners.
- Preserved the proven Decky global-component host and the 2.7.7 premium left/right footer presentation.

## 2.7.7

- Added a persistent **Mini player position** setting with Right side and Left side choices; Right is the new default for existing installs that have no saved preference.
- Kept Decky `routerHook.addGlobalComponent` as the proven global mini-player host and preserved all playback ownership/continuity logic.
- Reworked the footer mini player into a more premium two-layer glass ribbon with a subtle gradient edge, source-aware accent, stronger NOW PLAYING hierarchy, refined music tile, and compact playback/location status.
- Position changes publish live through GTM settings, so the global mini player moves sides without a plugin reload.
- Preserved the 7-second auto-dismiss, Quick Access suppression, controller-safe pointer-free overlay, and the full in-plugin Ambient Now Playing card.

## 2.7.6

- Kept the proven Decky `routerHook.addGlobalComponent` mini-player architecture unchanged.
- Moved the transient mini player from the upper-right to a low left-side dock in Steam's footer/action-prompt band.
- Reworked the mini player into a slimmer premium ribbon with a compact music tile, source/surface hierarchy, restrained glass treatment, and small playback-state indicator.
- Preserved the 7-second auto-dismiss behavior, Quick Access hiding, source ownership logic, and pointer-free controller-safe overlay behavior.
- Ambient Music's full in-plugin Now Playing card remains the primary player inside GTM and is unchanged.

## 2.7.5

- Replaced the failed 2.7.4 raw `document.body` mini-player injection with Decky Loader’s supported `routerHook.addGlobalComponent` host.
- Uses Decky API v2 Quick Access visibility state to suppress the strip while Quick Access / GTM is open.
- Removed mini-player route sniffing and DOM-panel detection; playback ownership plus Ambient’s published surface state are now the source of truth.
- Mini player reappears on track, playback-state, or Ambient-surface changes and auto-dismisses after about 7 seconds.
- Added Health Center diagnostics for global registration, React mounting, and successful triggers.
- Added an **Arm test** action: arm it in Health Center, close Quick Access, and a 7-second test strip should render even without active music.
- Ambient, Store, and game-theme playback engines are intentionally unchanged.

## 2.7.4

- Fixed the 2.7.3 mini player not appearing on Steam surfaces. The 2.7.3 React component was mounted only inside the Decky plugin panel, where it could never serve Home/Library as intended.
- Replaced it with a global, non-interactive Gaming Mode overlay mounted directly to Steam's document body.
- Mini player now appears on Home, Library/collections, game pages, and Steam Store when GTM owns active playback.
- Hides while the Game Theme Music Decky panel is open so it does not duplicate the full Ambient/Store controls.
- Auto-dismiss reduced to 6 seconds; track, playback-state, and surface changes retrigger it.
- Overlay does not enter Steam's controller focus tree or push page content around.
- Preserved AmbientController, StoreController, AudioEngine, playlist state, and playback continuity logic.
- Public developer/author remains Valentine.

## 2.7.3

- Removed the redundant standalone full-size Now Playing section from the Decky panel.
- Preserved the existing Ambient Music now-playing hero/strip as the authoritative Ambient playback UI.
- Added a compact, surface-aware mini player for Steam Home, Library/game pages, and Store while GTM is visible.
- Mini player auto-dismisses after 7 seconds, reappears/restarts on playback or surface changes, and pauses dismissal while controller focus is held on it.
- Kept the 2.7.1 continuity-safe Ambient playback engine and the 2.7.2 Store playback engine unchanged.
- Public developer/author remains Valentine; required upstream and third-party attribution remains preserved.

## 2.7.2

- Set the public Game Theme Music developer/author identity to **Valentine** while preserving upstream and third-party attribution separately.
- Preserved the hardware-proven 2.7.1 Ambient navigation continuity/resume architecture without changing its playback logic.
- Polished Store Music status with playback, queue, surface, and Store-over-Ambient priority visibility.
- Disabled Store shuffle when fewer than two Store tracks are selected, with a clear explanation.
- Polished Now Playing to distinguish Steam Store, Ambient, game-theme, and preview ownership and show playlist position/queue context where available.
- Refreshed stale README/backend/branding documentation to describe the current 2.7.x product accurately.
- Removed runtime package debris and historical validation reports; retained required GPL/third-party license material and bundled yt-dlp/QuickJS.

## 2.7.1

- Added a dedicated Steam Store playlist with up to 15 tracks, shuffle, Previous/Next, volume, and Storage assignment.
- Added Ambient interruption modes for Change Theme Music: Resume (default), Next track, or Restart.
- Fixed returning from Change Theme Music restarting the Ambient song from the beginning when Resume is selected.
- Added a premium Now Playing status card showing source, track, playback state, and Up Next.
- Dedicated Store music takes priority over general Ambient on Steam Store pages.

## 2.6.7
- Polished Ambient playback UI without rewriting the proven shuffle/Next engine.
- Restored a compact Steam-style visual treatment for the multi-select Ambient picker while preserving A multi-select, B commit/close, and one Done action.
- Added an optional **Shuffle on section change** control. When enabled with Shuffle, moving between two enabled Steam sections advances to the next queued Ambient track. Continuous playback remains the default when disabled.
- Expanded Ambient status with playlist count, queue remaining, playback state, and section-shuffle state.
- Improved Now Playing and Up Next title readability for long track names.

## 2.6.6

- Ambient playlist engine now keeps a persistent current track, history, and no-repeat up-next queue.
- Added Previous and Next controls plus visible Now Playing, Up Next, surface, and queue diagnostics.
- Shuffle remains on by default and rebuilds the upcoming queue without interrupting the current song.
- Restyled the working multi-select ModalRoot into a compact GTM/Steam-style picker while preserving A multi-select, B save/close, and one Done button.
- Ambient queue state survives GTM panel navigation and plugin UI reopen via local runtime persistence.

# 2.6.5

- Replaced the broken Ambient multi-select ConfirmModal with Decky's native ModalRoot lifecycle.
- Ambient picker now has exactly one Done action.
- A toggles up to 15 tracks without closing the picker.
- B commits the current multi-selection and closes the modal through Decky's injected `closeModal` callback.
- Done performs the same commit-and-close operation.
- Added route-change cleanup so navigating away cannot leave the Ambient picker as a zombie overlay.
- Preserved 2.6.4 Home/Library classification, live Ambient reevaluation, shuffle queue, surface toggles, and Storage grid work.

# 2.6.3

- Ambient Music is now a 15-track playlist with shuffle.
- Added independent Home, Library, Store, and Other page toggles. Home defaults off.
- Rebuilt two-column Download Storage navigation as actual Decky focus rows: Left/Right across cards, Up/Down between rows.
- Storage track actions can add songs directly to the Ambient playlist.

# 2.6.2

- Rebuilt Ambient Music controls around native Decky controller targets.
- Added a dedicated Choose Track action that opens a native controller-friendly downloaded-track picker.
- Ambient playback now uses a normal selectable action instead of a custom disabled-looking switch.
- Ambient volume now uses Decky’s native slider directly.
- Rebuilt Download Storage navigation so each music card is one reliable controller focus target; A opens native Track Actions with Set as Ambient and Delete.
- Library layout is now a real selectable Decky action that toggles 2-column Grid / List.
- Forced Grid to remain two columns at the actual Decky sidebar width instead of collapsing back to one column.
- Preserved native Decky destructive confirmation for downloaded-audio deletion and all 2.6.0 audio ownership rules.

# 2.6.1

- Rebuilt Download Storage as a premium controller library instead of a compressed utility row.
- Added default two-column Grid view with spatial Left/Right and Up/Down controller navigation, plus optional List view.
- Each track is now a readable card with title, game/source metadata, size, Set Ambient, and Delete actions.
- Moved Ambient Music out of the middle of Settings into its own dedicated feature section with selected-track hero, status, volume, enable toggle, and clear action.
- Preserved 2.6.0 ambient ownership rules, native Decky delete confirmation, focus recovery diagnostics, playback, providers, playlists, and storage backend.

## 2.6.0

- Added Deck Ambient Music: choose any downloaded track as the Deck-wide ambient loop, with independent volume and automatic priority below game themes, previews, and running games.
- Added reusable GTM controller-focus diagnostics to Health, including the last GTM focus target, native navigation API availability, and the last native recovery result.
- Added native focus recovery for Storage Delete confirmation using Steam's gamepad navigation tree when available, replacing raw DOM focus/timer hacks.
- Added a Settings toggle for native focus recovery so it can be disabled immediately if a Steam build rejects the mechanism.
- Preserved the native Decky destructive confirmation and the stable 2.5.1 storage/playback behavior as the base.

## 2.5.1

- Replaced Download Storage's Decky confirmation modal with an inline per-track confirmation.
- Cancel and Confirm Delete now stay entirely inside the GTM focus tree, preventing Steam/Decky from throwing focus into the host Overrides panel when the dialog closes.
- Confirmed deletion restores focus to the same logical storage-row position.

## 2.4.9
- Removed inherited Extras/social-promo UI from Settings and About so controller focus can no longer fall into that section.
- Preserved required third-party/license files.

# 2.4.7 - Storage position preservation

## 2.4.8

- Fixed Download Storage confirmation Cancel/B-close jumping to Extras or the bottom of the page.
- Cancel now restores the exact storage row and saved scroll position that opened the confirmation.
- Confirmed deletion keeps the existing nearest-surviving-row restoration behavior.


- Download Storage now remembers the focused song and current scroll offsets before a delete confirmation.
- After deletion and list refresh, focus returns to the nearest surviving song at the same list position instead of jumping to the bottom.
- Keeps the 2.4.6 universal delete confirmation and all 2.4.5 controller-focus fixes unchanged.

# 2.4.6 - Storage delete confirmation

- Every Download Storage Delete action now requires an explicit destructive confirmation.
- Confirmation names the selected track and explains whether it is referenced by a playlist.
- Cancel is the safe escape path; no storage file is deleted until Delete is confirmed.
- No playback, provider, playlist, focus, banner, or storage-list behavior changed.

# 2.4.5 - Embedded banner + Storage Delete focus fix

- Replaced the banner actually embedded in `dist/index.js`; the obsolete baked-in Version 2.1.0 badge is now truly gone.
- Kept the cleaned GTM banner artwork otherwise unchanged.
- Storage download rows are no longer controller-focusable wrappers that steal focus from Delete.
- Storage Delete is a direct `DialogButton` focus target.
- Pinned downloads no longer render Delete disabled; selecting Delete shows a destructive confirmation explaining that the playlist entry remains and the audio may need to be downloaded again.
- No playback/provider/playlist/resolver behavior changed.

# 2.4.4 - Controller hierarchy + playlist delete hotfix

- Made the wide Game Theme Music artwork banner the first controller-focusable control.
- Removed the redundant inner Game Theme Music text button.
- Kept the live Version row visible but informational/non-focusable so controller navigation goes from the GTM banner directly into Settings.
- Removed the obsolete baked-in "Version 2.1.0" badge from the GTM banner artwork; the UI now has one authoritative live plugin version.
- Rebuilt per-track Remove/Delete as a standalone Decky DialogButton in the same action grid as Use Track, Preview, Move Up, and Move Down.
- Kept the existing remove-only / remove-and-delete-file confirmation behavior unchanged.
- Preserved playback, provider, playlist, resolver, storage, launch-stop, and backend behavior.

# 2.4.3 — Playlist remove focus hotfix

- Keeps the working 2.4.2 top header controller anchor unchanged.
- Removes the non-focusable Focusable wrapper that caused Steam to suppress the playlist action descendants.
- Promotes Remove to its own native Decky ButtonItem below each track so it is a first-class vertical controller target.
- Leaves playback, providers, playlist data, storage and resolver logic unchanged.

# 2.4.2 — Controller focus hotfix

- Fixes the top Game Theme Music title anchor so it is exposed as a true Decky focus node with explicit A/activate handling.
- Fixes Playlist action navigation by removing the focus-stealing action-row container.
- Makes Preview and Remove explicitly controller-focusable when available.
- No playback, provider, playlist data, resolver, storage, lifecycle, or download behavior changes.

# 2.4.0 — Controller-first interface pass

## Controller navigation
- The actual top “Game Theme Music” title is now a real controller-focusable button/anchor.
- Pressing A on the title jumps to the version/top-content anchor instead of leaving a dead focus target.
- The existing focusable version row and subtle read-only Health/Storage scrolling behavior are preserved.

## Visual system
- Added explicit reusable GTM section, control, slider, dropdown, and switch shells instead of relying on Steam/Decky wildcard styling alone.
- Settings modules now use richer navy/indigo surfaces with restrained cyan, blue, and violet accents.
- Sliders keep their original ranges and handlers but use the GTM accent family and a cleaner value treatment.
- Dropdowns keep Decky’s native interaction while gaining an explicit indigo shell and stronger selected-value hierarchy.
- Health success remains green (`#59bf40`).

## Boolean controls
- Replaced stock boolean ToggleField presentation with explicit ON/OFF controller buttons.
- Provider fallback, playlist shuffle, theme notifications, safe mode, and per-game shuffle use the same state-safe switch component.
- A changes each boolean exactly once through the existing settings callbacks; saved values remain the source of truth.

## Scope guard
- No AudioEngine, provider, local-first playback, playlist cursor/state, search cache/batching, launch cleanup, or storage-backend behavior was rewritten for this release.

# 2.3.0 — Full Theme Pass

Presentation-only upgrade. Playback/search/storage behavior is intentionally unchanged.

- Themes the full plugin with the approved teal/cyan/blue/violet identity.
- Adds dark navy panel surfaces and stronger couch-readable contrast.
- Makes section headers bolder with restrained gradient accent lines.
- Themes buttons, dropdowns, inputs, sliders, toggles, tabs, and focused controls.
- Keeps focus bright and obvious for interactive controls while preserving subtle read-only focus.
- Gives Download Storage and Health rows card-like visual treatment.
- Keeps Health's green success status exactly unchanged.
- Preserves the approved banner, icon, and selectable version row.
- Avoids heavy glow or animated decoration so the plugin stays premium rather than noisy.


# 2.2.0 — Identity pass

- Adds the approved Game Theme Music icon/glyph.
- Replaces the generic music-note Quick Access icon with the new identity.
- Adds the approved teal/cyan/violet Game Theme Music banner at the top of the plugin panel.
- Adds a controller-selectable Version 2.2.0 row immediately below the banner.
- Version focus uses a subtle cyan/violet highlight, deliberately separate from Runtime Watcher's palette.
- The existing 2.1 controller scrolling, human storage names, green Health status, fast source search, local-first playback, playlist behavior, and launch cleanup are unchanged.


# 2.1.0 — Focus, storage names, and launch polish

This release keeps the 2.0 performance architecture and finishes the remaining game-theme fundamentals.

## Controller reading
- Health/status text rows are real controller focus targets now.
- Read-only focus is intentionally subtle so status text does not look like a button.
- Focused text scrolls into view.
- Existing green Health status colors are unchanged.

## Download storage
- New YouTube and KHInsider downloads save their real song title.
- Existing ID-only downloads are repaired from the plugin's playlist/override cache.
- Storage rows show song title, game usage, provider, and size.
- Opaque internal IDs stay hidden unless a file genuinely cannot be identified.
- Opening Download Storage trusts the download index and does not rescan the folder.
- Refresh list performs the explicit filesystem reconcile.

## Game lifecycle
- Game-page teardown uses a clean fade capped at 100 ms.
- The existing game-running notification still performs an immediate hard safety stop.
- Active provider search is still cancelled when a game starts.

## Game Settings
- Opening Game Settings is now local-only.
- It never starts yt-dlp or a provider simply to prepare Preview.
- Preview is disabled with “No local theme” if the selected file is missing.

## Fresh-install behavior
- A genuinely fresh install defaults to “Pick automatically,” matching the useful spirit of 1.8.
- Existing upgraded installations preserve their saved behavior choice.

No unrelated player dashboard, lyrics, visualizer, cloud, social, or streaming-service features were added.


# 2.0.0 — Performance-first overhaul

## Core fixes
- Game-page theme playback is local-first and never starts yt-dlp/provider resolution just because a Steam game page opened.
- Game launch uses synchronous hard-stop audio teardown and cancels active YouTube search work without blocking Steam.
- YouTube search now returns a small metadata-only batch in one RPC instead of up to 50 per-result RPC calls.
- YouTube search results are cached briefly so backing out and reopening does not immediately repeat the same provider work.
- KHInsider search fetches only the first useful albums sequentially and stops after a practical result cap.
- Downloaded-state checks are batched instead of one backend RPC per result card.
- The download index is used before filesystem globbing.
- Startup no longer reconciles the download directory twice.
- Playlist playback now keeps separate last-played and next-track state, while retaining playbackCursorId only for backward compatibility.
- Re-entering a game page advances to the next playlist track when multiple tracks exist; shuffle still avoids immediate repeats.
- AudioLoader compatibility no longer schedules roughly one hundred timers when a game exits.

## Scope
No new entertainment/dashboard features were added. 2.0 stays focused on one job: fast, reliable game-page theme music.


# Changelog

## 1.9.1 — 2026-08-22

### Preview and local import repair

- Fixed silent search-result previews caused by every result card preloading
  into the singleton audio engine and replacing the previously mounted card.
- Search cards now resolve and load audio only after **Play** is pressed.
- YouTube previews request a fresh provider URL instead of reusing a possibly
  expired search-result CDN URL.
- Stopped previews can be played again without remounting the page.
- Preview media failures now return the button to **Play** and show an error
  notification instead of remaining stuck on **Stop**.
- Fixed the local file picker opening as an empty screen by showing folders and
  using Decky's file-list page limit correctly.
- Added Deck home, Music, and Downloads import shortcuts before opening the
  picker.

### Search and playlist usability

- Automatic mode now searches YouTube and KHInsider concurrently and keeps
  labeled results from both providers.
- YouTube remains the first choice for hands-off automatic theme selection;
  KHInsider is used when YouTube cannot supply a playable result.
- Reworked playlist cards with thumbnails, a clear active badge, larger
  controller-friendly actions, working previews, and a safer remove dialog.
- Added playlist shuffle directly to the Playlist tab, prevented immediate
  repeats, and made enabling shuffle continue through the playlist.
- Enforced a 15-track per-game limit with a clear Playlist Full notification.
- Added a persistent per-game playlist cursor so reopening a long playlist
  resumes where it left off instead of starting again at track one.

## 1.9.0-deckfix.1 — 2026-08-22

### Reliability

- Replaced Base64 local-audio responses with tokenized loopback streaming and
  byte-range support.
- Added a singleton audio engine and deterministic cleanup on launch, route
  exit, Desktop mode, and plugin unload.
- Added safe mode and isolated Steam UI patch failures from core plugin load.
- Added timeout and size limits around provider requests.
- Added live health tests and redacted diagnostic exports.

### Providers and updates

- Retained the native Linux yt-dlp and bundled QuickJS SteamOS repair.
- Added ordered provider fallback and provider badges.
- Added SHA-256 verified yt-dlp candidate validation, atomic replacement, and
  last-known-good rollback.

### Playback and library

- Added migrated per-game playlists, reordering, preview, active selection,
  shuffle, loop modes, and deletion controls.
- Added manual, automatic, suggest-and-ask, and silent behavior modes.
- Added conservative automatic-result scoring and rejection memory.
- Added local-file import, fade in/out, and configurable start delay.

### Storage

- Added a persistent download index, per-file deletion, last-access tracking,
  pinned-playlist protection, and configurable LRU cleanup.

### Distribution

- Added a portable private Decky store for Synology Web Station with dynamic
  catalog URLs, checksums, a browser portal, and direct-install links.

## 1.8.2-deckfix.1

- Fixed the Steam Library context-menu Symbol conversion crash.
- Migrated current Decky imports.
- Replaced the generic yt-dlp Python zipapp with the native Linux executable.
- Sanitized Decky's stale LD_LIBRARY_PATH.
- Bundled QuickJS and passed it explicitly to yt-dlp.
- Added digest verification and safe atomic yt-dlp replacement.
