# Game Theme Music 3.6.1

## Native Store + Focus Reliability

3.6.1 is a hardware-driven stabilization release. It preserves the 3.6.0 update handoff that successfully kept Store Music playing through a real Decky uninstall/reinstall with no audible stop, restart, or stutter.

The native Steam Store now gets a second, bounded classification path through Steam's Chromium remote-debugging tabs. GTM verifies that a Store tab or embedded Store webview is actually visible before promoting an otherwise ambiguous “Other Deck Pages” surface to Store. Concrete Home, Library, and game-detail routes always win immediately, reducing stale Store playback after navigation.

Ambient remains lower priority than Store. A short classification window prevents Ambient's Other Deck Pages option from claiming a native Store page while the Store probe is still resolving.

The selected-game soundtrack workspace also gets a local focus repair: Down from Music Library / Find Online / Import Local enters the first soundtrack row, while Up returns to the last source button. Local Import keeps the same YouTube-style in-button progress language, with slightly slower animation and a longer completion hold for fast files.

Protected systems include the 3.6.0 AudioEngine/update transport, working Now Playing artwork, sticky-game Find Music, deep YouTube pagination, local duplicate protection, and the 3.0.7 theme/controller foundation.
