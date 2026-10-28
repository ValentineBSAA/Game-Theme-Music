### 3.7.0 — Optional Mini Player HUD (October 28, 2026)

Community report from **Dollet** in Discord identified missing HUD visibility control as a usability issue.
- Add Show mini player HUD in Interface & Feedback; ON by default to preserve the existing 3.6.9 experience.
- OFF suppresses UI only, not the actual audio engine, playlists, navigation, ResonaDeck focus or Ambient/Store music.
- Cancel queued Quick Access, delayed and diagnostic popups after switching OFF; startup respects saved OFF choice.
- Physical Deck tests PASS: Catherine Classic, NFS Most Wanted 2005, native Steam Store, Decky Plugin Store, Ambient on Home, full reboot persistence, and ON reactivation.
- Remaining optional follow-ups: test rapid OFF during visible ribbon and immediately around QAM transitions; other Deck/SteamOS configurations.

### 3.6.8 — Stable Store Ribbon + Direct Import Artwork

3.6.8 changes:
- Remove Local Import from the backend gameart_import cache path entirely; use direct portrait/library Steam candidates in the frontend.
- Delay native Steam Store notification delivery until the Store surface remains stable through the navigation/menu transition.
- Replay a notification once if Steam's overlay interrupts the ribbon before its normal display window completes.
- Keep Store audio continuity and all other manager artwork paths unchanged.

Hardware gates:
- Catherine Classic / 112 Operator Local Import should display artwork rather than a black panel.
- Native Steam Store should show one Now Playing ribbon for the current Store track and keep it visible for the normal display window.
- Plugin Store, Ambient, update continuity, Find Music, and existing artwork should not regress.

### 3.6.7 — Native Store Notification + Import Cache Recovery

- Hardware evidence showed correct Import art briefly flashing before a black cached image replaced it. 3.6.7 uses a fresh Import-art cache key and waits for the dedicated resolver before rendering a fallback.
- Store playback and Store notification identity are now separate concerns. The shared audio transport can stay continuous while notification identity follows Plugin Store vs native Steam Store presentation.
- A lightweight 300 ms Store-only presentation refresh is active only while Store audio is playing, so native Store transitions no longer depend on a transport restart to generate Now Playing.
- AudioEngine, Store playback rules, three-column Find Music, and deep search remain protected.

### 3.6.6 — Native Store Notification + Full-Bleed Import Art

3.6.6 changes:
- Give native Steam Store and plugin Store distinct notification presentation identities while keeping one shared continuous Store audio session.
- End notification epochs as soon as a real stop begins, except during Decky update handoff.
- Prefer Steam portrait library capsule artwork for Local Import and make that art full-bleed in the Import slot.
- Preserve playback continuity, Store queue/history, 3-per-row Find Music and existing section artwork.

3.6.6 hardware gates:
- Enter native Steam Store: Store Music must play and produce exactly one Now Playing notification.
- Plugin Store -> native Steam Store can produce the native Store presentation event once, but QAM open/close and update adoption must not spam duplicates.
- Home -> native Steam Store resume of the same track must produce one fresh notification.
- Assassin's Creed Syndicate / 112 Operator Import art should fill the artwork card instead of floating inside blank space.

### 3.6.5 — Import Capsule + Notification Events

- Dedicated Import artwork brain: separate RPC/cache, portrait/library-grid first, hero only as fallback.
- Dedicated notification event brain: audible state and shown state are separate persistent concepts.
- QAM-hidden playback events queue one ribbon instead of marking themselves already shown.
- Real owner/track/re-entry events notify once; update adoption and simple QAM visibility changes do not.

### 3.6.4 — Unified Notification Brain + Import Artwork

3.6.4 changes:
- Add one persistent notification state next to the persistent AudioEngine.
- Dedupe the same audible track across update remounts and Quick Access open/close.
- Preserve real notification events for owner changes, track changes, and stopped-to-audible resumes.
- Cache notification metadata with the logical track so artwork/title survive rebinding.
- Give Local Import a dedicated art candidate order and blurred-backdrop contain treatment; Games and Find Music keep hero-style art.

Hardware gates:
- 3.6.3 → 3.6.4 update with Store Music playing: audio stays continuous and the same track does not notify again after reload or after QAM closes.
- Home → native Steam Store resume shows exactly one Store notification.
- Ambient → Store shows one new notification.
- Store track change shows one new notification.
- 112 Operator and other awkward game art looks intentional in Local Import instead of a thin strip in an empty frame.

### 3.6.3 — Slot-Tuned Artwork Continuity

3.6.3 changes:
- Undo the over-correction from 3.6.2 where one contain-first rule was trying to drive every Steam art slot.
- Restore premium cover-style rendering for wide game/banner slots such as Games and the selected-game Find Music header.
- Keep Local Import preservation-focused by using framed contain presentation instead of forcing a harsh crop.
- Leave unified Store playback continuity, 3-result Find Music layout, and generated Ambient/Store/Library section art unchanged.

3.6.3 hardware gates:
- Games hero art should look full again instead of letterboxed.
- Find Music selected-game art should stay wide and clean.
- Import art should remain readable for troublesome games like 112 Operator without looking like a tiny strip in empty space.
- Store continuity and three-per-row Find Music must remain intact.

# Game Theme Music Update Ledger

This file is the living project ledger for Game Theme Music. Keep it in every future release and update it before handing the project to a new chat.

## Locked foundation

Known-good visual and controller baseline: **3.0.7 LIVE_THEME_ENGINE_REBUILD**.

Do not casually rewrite these systems:

- live CSS Loader / Steam theme sampling
- semantic theme variables and contrast protection
- physical LB/RB page switching
- working Ambient, Store, and game playback ownership
- controller-first Decky behavior that has already been verified on hardware

The project can extend these systems, but future releases must not reintroduce the old cyan/navy fallback, blank startup UI, shoulder-navigation regressions, or duplicate D-pad handling.

## Current release

### 3.6.2 — Unified Store Session + Artwork Polish

Hardware truth entering this release:
- The 3.6.0 Decky replacement continuity path has passed on real Steam Deck hardware with no stop or stutter, and 3.6.1 testing showed the cached transport still survives replacement. Preserve the persistent AudioEngine/Blob transport.
- Native Steam Store now classifies as Store, but Store session position/notification/exit behavior still needed consolidation.
- Ambient `Other Deck Pages` causing native Store audio was the clue that Store must outrank generic Ambient classification.

3.6.2 changes:
- One Store session shared by plugin Store and native Steam Store. Current track, timestamp, shuffle queue, history and next-track state survive surface changes.
- Authoritative Home/Library/game navigation releases update quarantine immediately instead of waiting for the fixed timer.
- Store exit captures position, frees the shared transport, and later resumes the same track.
- Three-column Find Music grid (3, 6, 9, 12...) with row-based focus/scroll rhythm.
- Approved Ambient and Steam Store artwork added to manager surfaces; Library uses existing GTM brand artwork.
- Game artwork changed back to safe contain-first framing to prevent over-zoomed Steam art.
- Import Download+Add-style progress animation slowed for readability.

3.6.2 hardware gates:
- Install 3.6.2 over 3.6.1 while Store Music is playing: no stop, stutter, restart, or queue jump.
- Exit Store for Home immediately after update: Store audio should stop promptly, not remain protected for 4–5 seconds.
- Return to either Store surface: same track resumes from the saved timestamp and keeps the same shuffle cycle.
- Steam Store and plugin Store should share a single Store session, not create separate starts.
- Native Steam Store should show Now Playing when a stopped Store session becomes audible again; seamless Store-to-Store continuation should not spam duplicate cards.
- Ambient Other Deck Pages must never override a dedicated Store session.
- Find Music displays exactly three result cards per grid row.
- Digimon Story Cyber Sleuth / Operator 112 artwork should be fully framed rather than zoom-cropped.

### 3.6.1 — Native Store + Focus Reliability

Hardware-driven stabilization on the 3.6.0 continuity baseline.

Confirmed 3.6.0 Steam Deck hardware truth carried forward:
- **PASS:** Decky update from the previous build to 3.6.0 kept Store Music playing through uninstall/reinstall with no stop, restart, or audible stutter. Treat the persistent browser-owned transport/update handoff as protected.
- **PASS:** selected-game Find Music auto-seeded correctly when reached by LB/RB and deep YouTube discovery grew past 240 results.
- **PASS:** Local Import added the requested tracks, preserved selected-game context, showed in-button progress, and did not add duplicates.
- **FAIL / clue:** native Steam Store did not trigger Store Music. Enabling Ambient → Other Deck Pages made music play there, proving the native Store was falling through as the generic `other` surface.
- **FAIL:** Store Music lingered roughly 4–5 seconds after returning Home.
- **FAIL:** on a selected game's soundtrack page, focus could become trapped in the Music Library / Find Online / Import Local row instead of moving Down into the soundtrack.

3.6.1 changes:
- Adds a bounded backend CEF/Chromium Store probe using Steam's localhost remote-debugging tab list. It verifies the Store tab/webview is actually visible before promoting an ambiguous `other` surface to `store`.
- Concrete focused/main Home, Library, and game-detail routes now outrank every stale asynchronous Store probe. This is designed to make Store exit prompt instead of waiting for cached Store evidence to age out.
- Keeps the older exact-title `executeInTab` Store probe as a fallback, but shortens its stale-positive window.
- Adds an 800 ms classification window before Ambient → Other Deck Pages may claim a newly ambiguous surface, giving Store detection time to win cleanly instead of briefly starting Ambient first.
- Preserves Store > Ambient ownership. If Store is positively detected, Ambient yields regardless of whether `Other Deck Pages` is enabled.
- Repairs the selected-game soundtrack focus grid locally: Down from Music Library / Find Online / Import Local enters the first soundtrack row; Up from the first row returns to the last-used source button. No second global D-pad listener is introduced.
- Keeps the proven YouTube-style Import button progress treatment but slows only Local Import's visual transition, guarantees a short minimum visible working interval for very fast files, and leaves the completion state visible longer.
- 3.6.0 AudioEngine, update transport, notification artwork, and deep YouTube search core are protected unchanged.

3.6.1 hardware gates:
- Install 3.6.1 over 3.6.0 while Store Music is playing in Decky Store. This is the first full two-sided test where both outgoing and incoming builds use the 3.6 handoff protocol. The same track must remain continuous.
- Open native Steam Store with Store Music enabled. It should play the Store playlist even when Ambient → Other Deck Pages is off. Store runtime diagnostics should report a Store source such as `cef-store-tab`, `cef-store-frame`, focused/main route evidence, or the existing tab fallback.
- Return Home. Store Music should clear within roughly one controller polling/fade cycle rather than several seconds.
- With Ambient → Other Deck Pages enabled, native Store must still use Store Music, never Ambient Music.
- On a selected-game Games page, Down from any source button must enter track 1, and Up from track 1 must return to the source row while Left/Right remain horizontal.
- Local Import progress should remain visibly animated long enough to read on fast copies without materially slowing real imports.

### 3.6.0 — Playback State Machine + Sticky Find Music

- Native Steam Store detection is now multi-signal: focused/main BrowserWindow + history, bounded window-state evidence, embedded Store frames, and a cached SharedJS/Steam-tab probe.
- Quick Access/Decky is treated as an overlay, so opening QAM on top of Store does not mean the underlying Store was exited.
- Update handoff now quarantines the surviving transport for 8 seconds after replacement. The new controller adopts exact track/position/queue state but cannot stop, advance, reshuffle, or reload it during stabilization.
- `onEnded` is frozen before the old plugin unloads, preventing a retired Store controller from advancing the persistent audio element during Decky replacement.
- Store queue/history is restored across update and aligned to the surviving logical track key.
- Playback priority is enforced as manual preview / game theme > Store > Ambient. Ambient remembers its position and yields instead of competing.
- Find Music is target-driven: sticky game selection survives LB/RB, seeds `<game> soundtrack`, auto-searches once regardless of entry path, keeps Search usable while idle, and shows compact Steam artwork/context.
- Store diagnostics now expose the detector source in the Quick Access runtime card.
- 3.5.10 in-button Import progress, 3.5.8 preview parity, 3.5.5 deep YouTube continuation search, 3.5.3 notification artwork/update transport, and the locked 3.0.7 theme/focus foundation are preserved.

Hardware gates:
- Decky Store update replacement must preserve one continuous Store track without the two post-install skips seen in 3.5.10.
- Native Steam Store must classify as Store and play the Store playlist; Home must clear it promptly.
- Ambient must never overlap or steal ownership from Store, game music, or previews.
- RB into Find Music after selecting a game must auto-populate/search the game and keep the Search control available.

### 3.5.7 — Focus Grid + Context + Import Progress

- Library Destination/Add/Clear is now a real horizontal controller row; Import-only focus locks no longer leak into Library/Find Music.
- Library toolbar/action widths are bounded to the Deck viewport so Refresh and Clear remain visible.
- A selected game remains the sticky assignment destination while LB/RB moves through Ambient/Store to Library/Find/Import; explicit Store/Ambient source actions still intentionally change the destination.
- Local Import gets an animated glass progress bar with batch count, copy/assign phases, completion, and failure states.
- Import artwork is narrower, freeing more width for Available Files and Import Queue.
- Quick Access visibility now requires actual viewport intersection, preventing an off-screen mounted GTM panel from suppressing Steam Store/Ambient playback.
- Store/Ambient/game assigned tracks resolve the local audio cache first, including imported `local_*` tracks, before provider fallback.
- Keep 3.5.6 same-transport Decky replacement adoption unchanged for the 3.5.7 install test.

### 3.5.6 — Local Queue + Seamless Update Handoff

Goal: make Local Import behave like a real Soundtrack Manager workspace and make Decky replacement adopt, rather than restart, an already-playing soundtrack.

Implemented:
- 3.5.5 remains the baseline; notification artwork and existing manager artwork are preserved
- YouTube deep discovery now supports up to 500 usable rows / 1,500 raw candidates and reports true exhaustion separately from safety limits
- Local Import defaults to Music and lists supported files directly inside Soundtrack Manager
- focused local files can be previewed before import
- A toggles files into a persistent import queue; queued tracks can be batch-imported to Library or imported and added to the current target
- Import focus is nested into native vertical and horizontal Decky Focusables so D-pad directions reflect the visual layout without a second raw input listener
- cached/local playback remains pre-mirrored to browser-owned Blob URLs when small enough for the continuity RAM budget
- replacement Store/Ambient controllers adopt the surviving transport by logical track identity instead of reloading it
- game-theme playback can transfer update-only ownership from the previous route-session owner without touching currentTime
- Decky Store is now a separate maintenance surface from Steam Store, preventing Store playlist relaunches caused by `/decky/store`
- Store playback gets a small route-transition grace window so Back navigation does not repeatedly tear down and recreate the same track

Hardware gates:
- install 3.5.6 over 3.5.5 while a normal downloaded/local track is playing; the same audio element should continue at the same position with no restart
- while backing through Steam Store pages, one Store track should remain one playback session and stop once the Store is genuinely exited
- Import should open on Music, show files inline, preview the focused file, build a queue, and import multiple tracks without opening Decky's single-select picker
- Up/Down should move through vertical Import rows/lists; Left/Right should only move across intentional horizontal choices/columns
- a broad Find Music query should continue beyond 200 results when available; true exhaustion should explicitly say all available results were loaded

### 3.5.5 — Deep YouTube Search Continuations

Goal: make Find Music behave like an actual continuing YouTube discovery surface instead of treating a partially filtered 20-result page as the end of the provider.

Implemented:
- 3.5.4 remains the baseline, including its premium Import artwork and native focus structure
- one streaming yt-dlp YouTube search session now stays alive while a query is browsed
- long-form videos over 20 minutes are filtered locally, so skipped mixes no longer truncate pagination
- backend returns explicit `has_more` continuation state rather than forcing the frontend to infer exhaustion from page length
- usable search depth increased from 80 to 200 results, with a 600-candidate raw safety ceiling
- result preloading starts earlier for fast couch scrolling
- YouTube result thumbnails use lazy loading/async decode to reduce scroll pressure
- rolling-update fallback keeps compatibility with the 3.5.4 list-only search RPC during plugin replacement
- 3.5.3 notification artwork and update-time browser audio continuity remain untouched

Hardware gates:
- a query whose first 20 raw YouTube hits include long mixes should still fill toward 20 usable tracks when more valid results exist
- browsing past 20 and 40 results should continue without falsely showing end-of-results
- broad artist/game queries can grow beyond the old 80-result ceiling, up to 200 usable rows
- quick grid/list scrolling should begin fetching the next page before focus reaches the final row
- 3.5.4 Import focus/artwork and 3.5.3 reinstall playback continuity must remain correct

### 3.5.4 - Premium Local Import + Native Focus

Goal: bring the last visibly older Soundtrack Manager page up to the same controller, artwork, and couch-presentation standard without disturbing 3.5.3 playback continuity.

- Import Local Music is now a real two-panel manager workspace rather than a centered bolt-on utility card
- game-target imports reuse the proven Steam/local game artwork component
- Ambient and Store imports receive themed destination art instead of an empty artwork region
- import controls are direct children of one native vertical Focusable flow
- only the final two import actions form a horizontal Focusable pair
- no custom D-pad/left-stick listener was added; Decky native focus remains the sole directional owner
- LB/RB section anchors remain exactly where they were
- destination and start-folder controls now expose readable labels and A-button guidance
- format support and current Library count are visible but deliberately low-priority
- 3.5.3 notification-art truth and browser-owned update audio continuity are preserved unchanged

Hardware checks:

- Import page shows the selected game's artwork and correct target name
- Down moves Target -> Start Folder -> Import action row without jumping to Close
- Left/Right moves only between the two side-by-side import actions when that row is active
- Up returns from the import actions to Start Folder, then Target
- physical LB/RB still changes manager sections from anywhere in Import
- A on Start Folder cycles Downloads / Music / Home
- Import to Library still opens Decky's file picker and stores the selected track
- Import + Add still imports once and assigns the resulting local track to the selected target
- reinstall/update from 3.5.3 to 3.5.4 while a downloaded/local main track is playing does not restart or seek to zero

### 3.5.3 — Notification Truth + Store Update Continuity

Goal: keep 3.5.2 as the baseline, restore only the notification artwork behavior proven on 3.4.8, and remove the remaining backend gap from update-time playback.

- notification artwork is direct-track-thumbnail again, matching 3.4.8 exactly at the rendering/source layer
- 3.5.1/3.5.2 notification-only inline/local-art conversion is bypassed
- cached/local main playback is mirrored into a bounded browser-owned Blob cache on the long-lived SteamUI window
- the persistent AudioEngine can now survive both frontend dismount and isolated Python-backend teardown without losing local media bytes
- Blob/local loopback URLs normalize to the same stable resource key, preventing same-track reload/restart after the new backend arrives
- 60-second orphan watchdog still stops playback if GTM is truly gone
- 3.5.2 remains the functional baseline; 3.4.8 is donor-only for notification artwork
- 3.4.9 focus/live-refresh fixes and 3.0.7 theme/audio foundation remain locked

### 3.5.2 — Notification Artwork + Manager Polish

Goal: finish the 3.5.x visual reliability pass without disturbing the new 3.5.1 baseline.

- Now Playing uses cached inline artwork data first, avoiding fragile overlay fetches from localhost/remote URLs
- broken image loads reveal the built-in music fallback instead of a blank tile
- Steam non-Steam shortcut aliases resolve across uint32 and 64-bit game IDs and proven duplicate aliases collapse in the Games list
- assigned/downloaded game-track preview URLs are prewarmed in one bounded RPC when a game opens for faster A Preview response
- game hero crop is centered consistently, with backend-cached first-party Steam CDN fallbacks when the local Steam cache is missing art
- 3.5.1 exact-position update continuity is preserved as the new baseline
- 3.0.7 live-theme/audio foundation remains locked

### 3.5.1 — Continuity + Artwork Reliability

Goal: make updates invisible to playback and make visual metadata dependable.

- true same-Audio-element update handoff with exact currentTime preservation
- replacement backend adopts the previous loopback port/token so the old src stays valid
- same-track notification dedupe survives frontend replacement
- Now Playing artwork cache backfill and live ribbon enrichment
- native + non-Steam local Steam artwork discovery with broader CDN fallbacks
- wider hero artwork, smaller GTM banner, top-anchored page changes
- 3.5.0 R2 search/infinite paging and 3.0.7 theme/audio baseline preserved

### 3.5.0 — Steam Artwork + Seamless Search

Goal: make the full-screen manager feel more like a real game soundtrack browser while preserving the known-good 3.4.9 controller/audio behavior.

Implemented:

- selected Games workspace now reserves a dedicated Steam-artwork hero above the game title and soundtrack controls
- artwork first tries Steam runtime asset fields and falls back to Valve's native Steam header CDN for normal Steam App IDs
- non-Steam shortcuts fail safely to a themed Game Artwork placeholder if Steam does not expose usable art
- Find Music treats Enter from the Steam keyboard as Search; on Deck this gives R2 the expected submit behavior
- keyboard is dismissed automatically when Enter/R2 submits the query
- initial online search batch is 20 results instead of 12
- YouTube discovery is paged lazily in 20-result windows and capped at 80 loaded results per query to keep Deck CPU/network use bounded
- approaching the bottom of search results automatically requests the next page; focusing one of the last six results also primes the next page
- result count grows as pages arrive and shows when more are available
- Game Music coverage actions use flexible zero-min-width columns so Refresh and Open next game needing music no longer overlap
- 3.4.9 Ambient/Store live refresh, focus repair, offline artwork, and direct Change Theme Music launch remain intact
- AudioEngine, AmbientController, and StoreController remain byte-for-byte unchanged from 3.4.9
- 3.0.7 live-theme engine remains the locked visual baseline

Hardware checks still needed:

- context menu → Change Theme Music → selected game shows the correct Steam artwork without pushing the soundtrack controls off-screen
- Find Music → open Steam keyboard → type query → R2 submits, keyboard closes, and search begins immediately
- searches with more than 20 results load 20 first, then add the next page before the user reaches the bottom
- short searches such as a six-result query stop cleanly and do not show an endless loader
- Grid and List both preserve controller focus while another result page is appended
- Game Music coverage Refresh and Open next game needing music no longer overlap at the real Quick Access width
- A Preview / Right actions / LB-RB navigation / Ambient / Store / local-first playback remain unchanged

## Major release history

### 3.0.0 to 3.0.6 — Theme and navigation rebuild period

The 3.0 branch rebuilt the UI around a controller-first multi-page application. The early builds exposed several Decky-specific mistakes: wrong shoulder input assumptions, cross-document theme reads, stale palette replay, hidden-root startup behavior, and selection/list remounting. Those regressions are historical lessons, not patterns to reuse.

### 3.0.7 — LIVE_THEME_ENGINE_REBUILD

This became the permanent baseline. The interface samples the live Steam/CSS Loader environment instead of replaying a cached GTM palette. The UI stays visible if theme detection fails. Physical LB/RB navigation and the theme engine were verified on the Steam Deck.

### 3.1.0 — Playlist Studio + Intelligence

Added the first larger playlist-management and library-intelligence concepts. Useful ideas survived, but the original Playlist Studio layout was too text-heavy and cramped for TV use.

### 3.2.0 — Unified Soundtrack Manager

Merged previously separate assignment and playlist workflows into one manager covering Games, Ambient, Store, Library, Find Music, and Import.

### 3.3.x — Couch-view redesign

Changed the manager to one category at a time with LB/RB switching. Removed much of the all-at-once chrome and prioritized couch-distance readability.

### 3.4.0 — Controller Navigation + Manager UX Rebuild

Added name recovery for Steam and non-Steam titles and attempted a custom spatial controller layer. The custom directional listener caused double movement because Decky was already moving focus.

### 3.4.1 — Native Single-Step Navigation

Removed the second D-pad/left-stick controller owner. Decky native focus became authoritative again. One directional press equals one focus move.

### 3.4.2 — Context, Back, and Search UX

Game Find Online became context-aware and auto-searches for the selected game. Find Music gained grid/list presentation. Library assignments gained a persistent destination and selection bar. Manager Back behavior became hierarchical.

### 3.4.3 — Preview-first Search + Safe Track Editor

Online search stopped auto-downloading on selection. Search results were meant to preview before explicit download. The first modal implementation exposed a Decky portal-context crash.

### 3.4.4 — Portal-safe Preview Crash Guard

Removed the React-context dependency from the preview portal and added a local error boundary so a preview-window failure should not take down all of Decky.

### 3.4.5 — Centered Live Preview + Download Progress

Moved remote preview playback through a localhost stream path. Centered and restyled the preview dialog. Added real backend download progress and a themed progress fill.

### 3.4.6 — Fast Preview + Cinematic Progress

Started warming preview URLs earlier and separated actual transfer speed from UI animation timing so fast downloads still have a visible progress experience.

### 3.4.7 — Instant Preview Warm Queue + Update Continuity

Added bounded parallel search-result warm-up, higher-contrast download progress, and AudioEngine continuity across ordinary Decky plugin replacement/reload. A watchdog stops orphan audio if GTM does not return. This continuity cannot survive a Steam/Game Mode restart because the SteamUI owner is destroyed.


### 3.4.8 — Game Playlist Polish

Separated temporary Preview from persistent Active selection, made downloaded game-track preview local-first, added clear DOWNLOADED / ACTIVE / PREVIEWING states, and made A on a game track preview immediately. The action rail retained explicit Set Active, Edit Track, Move, and Remove actions.


### 3.4.9 — Live Refresh + Focus Repair + Offline Artwork

Fixed stale Ambient/Store return-state refresh, removed decorative LB/RB indicators from the focus tree, repaired the Games action-rail focus trap, cached artwork locally for offline use, preserved embedded local artwork, and restored direct context-menu launch into the selected game. 3.0.7 audio/theme behavior stayed locked.

### 3.5.0 — Steam Artwork + Seamless Search

Adds Steam artwork to the selected-game Soundtrack Manager workspace, maps R2 to search submission while the Find Music field is active, dismisses the Steam keyboard on R2/Enter, raises the initial discovery batch to 20, lazily preloads later 20-result pages up to a bounded 80 results, grows the visible result counter as more rows arrive, and fixes Game Music coverage-action overlap. 3.4.9 focus/offline-artwork fixes and the 3.0.7 audio/theme baseline remain protected.

## Product direction

Game Theme Music is no longer just a one-song game-page plugin. The product direction is a **Steam Deck soundtrack system**:

- per-game ordered playlists
- Ambient music for Steam surfaces
- Store music
- local and online music library
- preview before download
- explicit assignment destinations
- controller-first couch UI
- live CSS Loader theme compatibility
- metadata and game-name recovery
- per-track timing and fade editing
- playback continuity where SteamUI remains alive

## Comparison targets

### ThemeDeck

Use ThemeDeck as the benchmark for the narrow assignment experience: fast preview-before-assign, simple game assignment, missing-music workflows, and presentation polish. GTM should keep its deeper playlist/context system while matching that simplicity where possible.

### DeckTune

Use DeckTune as inspiration for whole-soundtrack discovery, ordered album imports, and soundtrack verification. GTM should eventually be able to discover an official soundtrack or playlist and offer the user the full ordered album, selected tracks, or a suggested subset.

## Next milestones

### 3.4.10 / hardware polish

Only after 3.4.9 Steam Deck testing:

- repair any remaining native-focus edge cases found on hardware
- verify every Back depth in Games, Edit Track, Find Music, Library, Import, Ambient, and Store
- refine action-rail density only if couch testing still feels crowded
- verify local artwork backfill for older downloads while online, then retest offline
- verify update-time music continuity during a real plugin upgrade

### 3.7+ — Library Intelligence and Missing Music

Planned:

- coverage dashboard: known games, games with music, games needing music
- controller-friendly missing-music queue
- safe assisted search for missing games
- suggested small playlists rather than blindly assigning a single result
- duplicate and metadata cleanup improvements
- better unresolved-title repair

### 3.7+ — Soundtrack / Album Intelligence

Planned:

- recognize likely official soundtrack playlists/albums
- preserve track order
- optional MusicBrainz-style verification where practical
- import all / selected / favorites / first N tracks
- show track count and source before import

### Later presentation work

Planned only after manager stability:

- optional Now Playing mini HUD
- Off / Compact / Full presentation modes
- subtle waveform or visualizer
- never obscure normal Steam navigation

## Permanent UX rules

1. One physical direction press equals one focus move.
2. Up/down in a music list should primarily mean previous/next track.
3. Right enters actions; Left returns to content when the layout supports an action rail.
4. Preview must never silently change the active playlist configuration.
5. Online selection previews first. Download requires explicit confirmation.
6. Downloaded/local media should never go through an online resolver unless the local file is genuinely missing.
7. The current assignment destination must always be visible before an Add action.
8. Focus and selection are different visual states.
9. Do not hide the entire UI while waiting for theme detection.
10. Do not persist/replay a stale theme palette.
11. Do not add a second raw D-pad/left-stick navigation listener on top of Decky native focus.
12. The 3.0.7 theme engine is the baseline until hardware evidence proves a replacement is better.
## 3.5.8 — Store Restore + Preview Parity
- Restored Decky Store as a real Store Music surface; this is required to start Store Music before Decky replaces GTM during an update.
- Kept the 3.5.6 persistent AudioEngine adoption path so the next build can test true no-restart replacement.
- Added Preview/Stop Preview to Ambient and Store playlist rows using the same local-first preview engine as Games.
- Added Preview Focused to Music Library while preserving A=multi-select.
- Removed fragile manual Left/Right interception from the Library action row and returned it to Decky-native horizontal focus flow.
- Added glass-style online download progress matching Local Import.
- Preserved 3.5.7 sticky game destination, local import queue/progress, and 3.5.5 deep-search architecture.

## 3.5.9 — Continuity Probe
- Exact-behavior test twin of 3.5.8 except version metadata.
- Purpose: isolate Decky unload/reinstall audio handoff with Store Music already playing in Decky Store.

## 3.5.10 — Store Route + Shuffle Reliability
- Native Steam Store detection now reads Steam GamepadUI/focused-window history and BrowserWindow locations, while Decky Store remains a Store Music surface.
- Store exit latency reduced to a short 350 ms route grace plus at most 120 ms fade.
- Store track-end always returns through StoreController so current playlist size and shuffle state decide the next action.
- Local Import actions reuse the YouTube Download + Add button progress fill/shimmer and drop the redundant standalone progress strip.
- Local content hashes and duplicate-safe assignment remain authoritative.
- AudioEngine/update handoff, artwork, previews, deep search, and the 3.0.7 foundation remain protected.

