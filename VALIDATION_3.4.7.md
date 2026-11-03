# Validation — 3.4.7

Static release checks:

- JavaScript syntax passes Node `--check`.
- Python backend compiles with `py_compile`.
- `package.json` and `plugin.json` parse successfully and identify 3.4.7.
- Search result handling schedules bounded backend preview warming without downloading tracks.
- Preview warm concurrency is capped at two yt-dlp resolver workers.
- Focus warm-up adds no artificial delay.
- Download presentation uses a high-contrast accent-family fill and neutral transfer base.
- Minimum visual showcase is 2350 ms plus final settling time; actual network I/O is not throttled.
- Update continuity uses a global SteamUI AudioEngine handoff with a 60-second orphan watchdog.
- The existing theme/controller baseline functions remain protected by source comparison checks.
- ZIP integrity test passes.

Hardware validation still required for exact preview latency under the user's network/provider conditions and for one real Decky self-update/reload handoff.
