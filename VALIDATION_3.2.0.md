# Game Theme Music 3.2.0 Validation

## Static validation

- JavaScript syntax: PASS (`node --check dist/index.js`)
- Python syntax: PASS (`python -m py_compile main.py`)
- `package.json`: PASS
- `plugin.json`: PASS
- Version consistency: 3.2.0
- Full-screen manager route registered: `/gamethememusic-manager`
- Manager route removed on plugin dismount
- Six manager sections present: Games, Ambient, Store, Library, Find Music, Import
- Ambient and Store editor entry points route into the manager
- Music Library entry point routes into the manager
- Per-game assignment UI routes into the manager
- Batch library selection remains in place until explicitly applied
- Ambient/Store playlist updates resync pinned IDs

## Regression locks

Compared with the 3.1.0 package carrying the known-good 3.0.7 baseline:

- `gtmV307BootstrapTheme`: unchanged (`6de2f58568f33801…`)
- `GtmV301AdaptiveThemeRuntime`: unchanged (`081ea7aaad7f6c38…`)
- `useGtmV301ShoulderNavigation`: unchanged (`7466107949f150ee…`)
- yt-dlp binary: unchanged (`58162f9bfdc27458…`)
- QuickJS binary: unchanged (`772504dcdc78b5eb…`)
- Python backend: unchanged (`0c44ebb8b91dea7e…`)

The manager CSS is semantic-theme-only and does not use the old GTM cyan/blue/violet variables for its surfaces or focus states.

## Hardware validation still required

Static checks cannot reproduce Steam GamepadUI focus, CSS Loader timing, or physical controller behavior. On Deck, verify:

1. opening Soundtrack Manager fills the route rather than opening the old Playlist Studio modal;
2. LB/RB cycles all six manager sections;
3. D-pad navigation follows the visible layout;
4. A marks library cards without moving/removing them;
5. Add Selected applies several tracks in one operation;
6. current destination remains correct while changing Library / Find Music / Import;
7. SAO/CSS Loader colors remain identical to the known-good live-theme behavior;
8. B returns normally without trapping focus.
