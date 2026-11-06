# Game Theme Music 4.4.7 | Valentine Community Welcome + Quick Menu Repair

**Channel:** Private preview for Steam Deck testing. **Developer:** Valentine.

## Fixed in 4.4.7
- Restores Visualizers and Arcade Spectator to the **active** LB/RB Quick Menu navigation rail. An older unused navigation array had been updated in 4.4.6, leaving both settings pages unreachable. The new rail contains nine pages.
- Adds separate Visualizers and Arcade Spectator icons to the rail.
- Adds a first-run, **once-per-version** community welcome, written in Valentine's first-person developer voice and signed Valentine, displaying the current version. Both **OK** and **Go to GTM** acknowledge and open normal Now Playing.
- Prioritizes controller usability by focusing the welcome's first button when it is shown.
- Stores the acknowledgement in both WebView localStorage and the existing Decky persistent settings backend for resilience across reloads and updates. An already acknowledged version shows the normal Home directly.
- Aligns frontend, backend, plugin.json, package.json, and the bundled Arcade spectator visual-pack version to **4.4.7**.
- Updates the README's first paragraph to match the actual preview and the presence of the spectator-settings tab.

## Preserved
- Music streaming, playlists, crossfade, Store/Ambient music, ResonaDeck sharing and sleep/resume.
- All existing regular Visual Worlds and spectator scene assets, 32 ball powers, paddle/arena effects and adaptive AI learning.
- Color customization, shuffle preference sidecar, saved layout and Couch/TV footer behavior.
- No human-playable Arcade controls or player matchmaking are re-enabled.

## Where to find your settings
Open GTM Quick Menu. Use LB/RB to navigate to **Visualizers** for regular scenes, brightness, palettes, reactivity and layout. Navigate to **Arcade Spectator** for AI-vs-AI scenes, ball powers, AI learning, arena styles and the shared footer options. Settings remain under **Settings** for playback, cache, downloads and recovery.

## Test before calling this stable
1. Install the direct ZIP using Decky on an actual Steam Deck. Verify v4.4.7 and the GTM icon.
2. First open shows Valentine's note. Select OK or Go to GTM with hardware controls. Verify Now Playing opens normally.
3. Close/reopen Quick Menu and restart Decky: welcome should not return for v4.4.7.
4. Use LB/RB to reach Visualizers and Arcade Spectator. Check color changes, selected visualizers, automatic Pong powers, AI learning, and Default/Couch/TV footer.
5. Turn Shuffle All OFF, restart Decky, and test track changes and plugin reinstall without losing OFF.
6. Verify Store/Ambient playback, crossfade and ResonaDeck focus.

**Automated testing:** JavaScript syntax, Python compilation, source/music preservation, actual 120-second Pong AI simulation, shuffle sidecar, one-time welcome with persistent fallback, and direct ZIP integrity.
**Limit:** Physical Deck Gaming Mode UI and real-world audio timing have not been verified in this environment.
