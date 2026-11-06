# Game Theme Music 4.1.2 | Ambient Sleep/Wake Reliability

## Fixed

4.1.1 relied on SteamUI's browser visibility and 350-ms timer loop to
recognize sleep. SteamOS may freeze and resume browser audio before those
callbacks fire, making an already-playing Ambient track audible immediately
on wake, before the Gaming Mode Home screen is visible.

4.1.2 now uses multiple independent signals:

- A new backend monitor listens for Linux `org.freedesktop.login1.Manager.PrepareForSleep` via `dbus-monitor --system` where available and emits a Decky event with a monotonically increasing event sequence. No system files or rootfs changes, and no pip dependencies.
- Backend `get_power_state` allows polling to recover event notifications missed while SteamUI was frozen. A Linux `CLOCK_BOOTTIME` minus `CLOCK_MONOTONIC` drift detector provides an independent missed-wake fallback when logind events are absent.
- Optional SteamClient suspend/resume callbacks are registered only when available; these are known to be unreliable on some SteamOS versions, so they are not the sole authority.
- On confirmed suspend, the audio transport pauses immediately. An active suspension blocks Ambient regardless of the elapsed time.
- On wake, the 5–60-second configured delay restarts (12 seconds default). Existing/resumed media uses the existing gentle 1.6-second fade-in.
- The transport's `playing` callback also enforces the Ambient guard; delayed media events cannot bypass it.
- ResonaDeck audio focus, external-visualizer bridge, all 22 scenes/custom packs, frame governor, crossfade and music playback engine are otherwise unchanged.

## Placement

The two options stay on **Full Manager → Ambient**: `Sleep Mode • delayed Ambient start` and `Wake / restart delay`. They are not being moved to unrelated Settings.

## Caveats

A physical Steam Deck sleep/wake test is essential. There can be device- or
SteamOS-dependent timing between the power event and resumption of Chromium's
media process. If the machine lacks system `dbus-monitor` or the process has
no system bus access, the frontend still uses the SteamClient callbacks and
suspend-aware monotonic-clock polling. The fallback may react just after the
Deck wakes, not necessarily before the first resumed audio sample.

Nothing was published to GitHub. ResonaDeck 1.3.9 does not need an update.
