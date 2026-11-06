# Game Theme Music 3.3.0 Validation

## Static checks

- JavaScript syntax: PASS (`node --check dist/index.js`)
- Python compile: PASS (`python -m py_compile main.py`)
- `package.json`: PASS
- `plugin.json`: PASS
- Couch-view manager assertions: PASS
- One-section-at-a-time Games / Ambient / Store / Library / Find Music / Import navigation: PASS
- Stable Library multi-select state markers: PASS
- Current-destination context bar: PASS
- Large couch-readable card and focus CSS markers: PASS

## 3.0.7 baseline lock

- `function gtmV307BootstrapTheme`: **UNCHANGED** — `6de2f58568f33801`
- `function GtmV301AdaptiveThemeRuntime`: **UNCHANGED** — `081ea7aaad7f6c38`
- `function useGtmV301ShoulderNavigation`: **UNCHANGED** — `7466107949f150ee`
- `main.py`: **UNCHANGED** — `0c44ebb8b91dea7e`
- `bin/yt-dlp`: **UNCHANGED** — `58162f9bfdc27458`
- `bin/qjs`: **UNCHANGED** — `772504dcdc78b5eb`

## Hardware checks still required

Static validation cannot reproduce SteamOS/Decky focus behavior, CSS Loader composition, TV viewing distance, or the physical controller. Test on the Deck:

1. Open Soundtrack Manager and confirm only one current category is shown.
2. Use physical LB/RB through all six sections.
3. Verify focus remains visible and lands on useful content after a section change.
4. Test Games two-pane readability from the couch.
5. Select several Library tracks deep in the list and confirm no jumping/remounting.
6. Add selected tracks to Game, Ambient, and Store destinations.
7. Search online and import local audio.
8. Confirm the active CSS Loader theme remains visually identical to the known-good 3.0.7 behavior.
