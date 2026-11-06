# Game Theme Music 3.4.6 Validation

## Scope
Fast preview warm-up plus deliberately readable download-progress motion.

## Static checks
- `dist/index.js` passes `node --check`.
- `main.py` passes Python compilation.
- `plugin.json` and `package.json` parse as JSON.
- ZIP integrity passes.

## Protected baseline checks
Compared against 3.0.7:
- `gtmV307BootstrapTheme`: byte-for-byte match.
- `GtmV301AdaptiveThemeRuntime`: byte-for-byte match.
- `useGtmV301ShoulderNavigation`: byte-for-byte match.
- bundled `yt-dlp`: byte-for-byte match.
- bundled QuickJS: byte-for-byte match.

## 3.4.6 behavior assertions
- Search result focus can prewarm provider playback resolution without downloading a file.
- First result receives an automatic low-priority warm-up after search results arrive.
- Opening Preview reuses the same warm/in-flight promise, avoiding duplicate resolution work.
- Download network transfer remains uncapped.
- UI fill progress is eased separately and remains visible for a short minimum presentation window on extremely fast downloads.
- Download fill derives its tint from the current live theme accent and does not introduce a hardcoded GTM palette.
