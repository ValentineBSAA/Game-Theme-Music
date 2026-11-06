# Validation — Game Theme Music 3.4.4

## Failure reproduced from Deck evidence
Selecting a Find Music result in 3.4.3 opened a Decky portal modal and immediately crashed Decky's render tree.

## Root cause
`GtmV343SearchPreviewModal` used the normal `useAudioPlayer` hook. That hook directly destructured `setOnThemePage` from `AudioLoaderCompatStateContext`. Decky's `showModal` portal can render outside the plugin provider, where this context is `null`. The destructure therefore throws during React rendering, which Decky reports as a plugin render failure.

## Fixes validated
- `useAudioPlayer` is null-safe when AudioLoader compatibility context is absent.
- Find Music modal preview uses a context-independent singleton AudioEngine preview hook.
- Preview modal is wrapped in a local React error boundary with a recoverable Back action.
- Selecting a result still performs zero downloads until explicit Download + Add.
- Preview player cleanup stops its AudioEngine owner on unmount.
- Protected 3.0.7 functions remain byte-for-byte identical:
  - gtmV307BootstrapTheme
  - GtmV301AdaptiveThemeRuntime
  - useGtmV301ShoulderNavigation
- main.py, yt-dlp, and QuickJS remain unchanged from 3.4.3.

## Static checks
- `node --check dist/index.js`: PASS
- `python -m py_compile main.py`: PASS
- package.json JSON parse: PASS
- plugin.json JSON parse: PASS
- ZIP integrity: PASS
