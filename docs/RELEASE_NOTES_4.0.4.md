# 🎵 Game Theme Music 4.0.4 | Visual Worlds Overhaul • Public Beta

🎵 Game Theme Music 4.0.4

🌈 Visual Worlds Overhaul | Public Beta

A new era of Game Theme Music begins.

Game Theme Music 4.0.4 introduces one of the largest overhauls in the project’s development, transforming GTM into a more immersive, customizable, and expandable music experience for Steam Deck.

This release introduces an improved playback engine with automatic crossfading, 22 music-reactive visualizers, four visualizer collections, unlimited music playlists, downloadable visualizer packs, and a redesigned customization experience.

Every major feature has gone through multiple private release candidates, bug fixes, and real Steam Deck testing before reaching this public beta.

Whether you’re listening to music on your Steam Deck’s Home screen, exploring the Steam Store, or enjoying your favorite game soundtracks, GTM now offers an even richer experience.

⸻

🎶 Automatic Crossfade: Smoother Music Playback

One of the biggest improvements in 4.0.4 is the introduction of automatic, prebuffered crossfading.

Rather than waiting for one song to end before preparing the next, GTM can load the upcoming track in advance and smoothly transition between songs.

Features

* Automatic crossfades of up to 8 seconds.
* Advance preparation and buffering of upcoming tracks.
* Smooth overlapping playback between compatible tracks.
* Improved track caching and playback handoffs.
* Reduced unnecessary audio resolution requests.
* Protection against outdated track requests interfering with playback.
* Optional crossfade On/Off setting.
* Preserved audio-focus compatibility with other music plugins.

The result is a noticeably more continuous listening experience, with fewer interruptions between songs.

Crossfading depends on the next audio stream being available and buffered. Some remote sources may still require additional loading time.

⸻

🌈 Introducing Visual Worlds

22 visualizers. Four collections. One music-reactive experience.

GTM’s Live Footer has received a major expansion.

Visual Worlds introduces ten new lightweight Canvas-based effects alongside the twelve existing visualizers.

The visualizers are organized into four collections:

📺 Retro Ambient • 2000s

Inspired by the colorful, animated music visualization experiences of the early 2000s.

Featuring:

* CRT Pulse Field
* Liquid Chrome
* Disc Prism XL
* Ambient Light
* Alchemy Rings
* Silk Ribbons
* Plasma Bloom
* Neon Oscilloscope
* Starlight Nucleus
* Retro Kaleidoscope

Experience holographic discs, metallic liquid effects, colorful retro animations, and flowing reactive patterns.

🎱 Classic Rhythm

A collection focused on rhythm, movement, and reactive animation.

Featuring:

* Classic Spectrum
* Prism Skyline
* Beat Pinball
* Neon Pong
* Seismic Mountains

Highlights include animated pinball chambers with reactive targets, moving Pong paddles with independent ball movement, and layered mountainous landscapes responding to music frequencies.

💎 GTM Signature

Original visualizers designed around GTM’s identity.

Featuring:

* Pulse Engine
* Arc Reactor
* Resonance Crown
* Mechanical Iris Array
* Chromatic Event Horizon

Explore glowing mechanical structures, reactive energy effects, colorful accretion rings, and cosmic-inspired animations.

🌸 Anime Worlds

A new visualizer collection featuring colorful, atmospheric animations inspired by anime aesthetics.

Featuring:

* Sakura Tempest
* Tidal Bloom

Watch animated cherry blossoms drift across the footer, or enjoy flowing ocean waves reacting to music.

All effects use original procedural visuals without requiring copyrighted anime artwork.

⸻

🎨 Music-Reactive Colors

Visualizers can respond to the music itself rather than simply following a repeating animation.

GTM analyzes available audio frequency information, allowing effects to respond to:

* Bass frequencies and musical impacts.
* Midrange energy.
* Higher-frequency details.
* Changes in musical intensity.
* Dynamic color variations.

Music Reactive • Dynamic Spectrum is now the default color selection for new installations.

Existing users retain their saved preferences.

Additional color palettes and adjustable visualizer settings remain available, including brightness, sensitivity, and bass impact.

⸻

🔀 Shuffle All Visualizers

Can’t decide which visualizer to use?

Let GTM choose!

The new Shuffle All Visualizers option automatically selects a different visualizer when your music changes tracks.

Features include:

* Automatic visualizer changes between songs.
* Support for all four visualizer categories.
* Support for imported visualizer packs.
* Protection against immediately repeating the current scene.
* Optional On/Off control.
* Existing manual visualizer selection remains available.

Your music playlist and visualizer collection can now evolve together.

⸻

📦 Introducing the Visualizer Pack Manager

One of the most important additions in 4.0.4 is the ability to expand GTM’s visualizer collection without rebuilding the entire plugin.

The new Visualizer Pack Manager supports importing compatible visualizer ZIP packages containing validated scene definitions.

Features

* Import additional visualizer packs.
* Refresh installed packs without reinstalling GTM.
* Browse imported visualizers.
* Automatically organize imported scenes into their appropriate categories.
* Dedicated scrollable Custom Packs management section.
* Preview imported visualizers.
* Choose which installed pack to remove.
* Confirmation before pack removal.
* Imported visualizers participate in Shuffle All.
* Imported pack definitions persist independently of the main plugin installation.

The pack system uses validated configurations rather than executing arbitrary scripts from imported archives.

This creates a foundation for future visualizer collections and community customization.

Additional rendering effects may require future GTM engine updates.

⸻

🎼 Unlimited Music Playlists

The previous 15-track playlist restriction has been removed.

GTM now supports larger playlists across:

* Ambient Music.
* Steam Store Music.
* Decky Plugin Store Music.
* Individual game soundtracks.
* Compatible playlist imports.

Create larger collections without worrying about the previous 15-song restriction.

Existing playlist management and playback preferences are preserved.

⸻

🛍️ Unified Store Music Experience

GTM now provides improved continuity between the native Steam Store and Decky Plugin Store.

Both Store surfaces share one music playback session, reducing unwanted playlist restarts when navigating between them.

Ambient Music and individual Game Themes remain independent.

This helps ensure your selected music stays associated with the appropriate listening context.

⸻

🎮 Steam Deck Integration

Visual Worlds was designed specifically for the Steam Deck’s Gaming Mode experience.

Highlights include:

* Lightweight Canvas 2D rendering.
* Home-screen footer visualization.
* Controller-friendly scene selection.
* Four organized visualizer collections.
* Adjustable visualizer height and brightness.
* CSS theme-aware footer blending.
* Optional mini-player HUD.
* Music-reactive color customization.
* Visualizer Off setting.
* Preserved Steam Deck navigation and audio-focus behavior.

The visualizers are designed to complement the interface without covering game artwork or interrupting normal navigation.

⸻

🔗 ResonaDeck Compatibility Foundation

GTM 4.0.4 also introduces the foundation for future visualizer interoperability with ResonaDeck.

A passive telemetry interface allows compatible external music plugins to provide music-reactive data without granting control over their playback.

The interface is designed to support future Plex-driven visualization through ResonaDeck.

Full ResonaDeck music visualization requires a corresponding ResonaDeck update and is not yet enabled in this release.

⸻

🔧 Additional Improvements

This release also includes numerous fixes and refinements developed throughout the private beta process.

Highlights include:

* Improved cached-audio streaming.
* Better next-track preparation.
* Protection against outdated playback requests.
* Reduced track-transition interruptions.
* Improved visualizer animation stability.
* Smoother Pong movement and collision behavior.
* Improved Pinball target reactions.
* More distinct multicolor Pinball effects.
* Refined Sakura Tempest movement.
* Expanded footer coverage for selected scenes.
* Improved imported-scene selection.
* Safer visualizer pack removal.
* Better playlist persistence.
* Preserved CSS footer theme matching.
* Improved visualizer continuity during playback.

Several experimental visualizer concepts were also removed or redesigned following testing to prioritize quality over quantity.

⸻

🧪 Public Beta

Game Theme Music 4.0.4 has undergone multiple private release candidates and Steam Deck testing.

Core functionality, including crossfading, playlist expansion, visualizer selection, pack importing, and custom visualizer management, has been tested and verified during development.

However, this remains a Public Beta.

Performance may vary depending on SteamOS configuration, installed plugins, CSS themes, and the selected visualizer.

Community testing and bug reports are welcome.

💬 Feedback and Feature Requests

Have an idea for a new visualizer, an improvement, or an additional feature?

Feel free to share your suggestions through the project’s GitHub Issues or feature-request discussions.

Feedback helps guide future development, although proposed features are evaluated individually and may not necessarily be included.

⸻

❤️ Thank You

Game Theme Music has grown significantly from its earlier releases.

What began as an effort to improve the Steam Deck’s music experience has evolved into a much more customizable platform for music playback, reactive visualizations, and personalized soundtracks.

Version 4.0.4 represents a major step forward for the project.

Thank you to everyone who has downloaded GTM, tested its features, shared feedback, or supported its continued development.

Enjoy the music, explore Visual Worlds, and make your Steam Deck your own.

Made with ❤️ for the Steam Deck community.

Game Theme Music 4.0.4 | Visual Worlds Overhaul • Public Beta

## Official release assets
- [Installable 4.0.4 RC4 ZIP](https://github.com/ValentineBSAA/Game-Theme-Music/releases/download/V4.0.4/Game-Theme-Music-4.0.4-PUBLIC-BETA-RC4-PACK-SHUFFLE-PINBALL.zip)
- [11-screenshot archive](https://github.com/ValentineBSAA/Game-Theme-Music/releases/download/V4.0.4/GTM.Visualizers.Screenshots.zip)

**Status:** Public prerelease. Some screenshot captures show earlier preview text; [3.7.0](https://github.com/ValentineBSAA/Game-Theme-Music/releases/tag/V3.7.0) remains the previous stable release.
