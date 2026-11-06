# Validation 2.7.23

## Syntax / package
- `node --check dist/index.js`: PASS
- `python -m py_compile main.py`: PASS
- `package.json` version: 2.7.23
- `plugin.json` author: Valentine
- Direct Decky notification calls: 28 (unchanged from 2.7.22)

## Frozen playback blocks
- AudioEngine: byte-identical to 2.7.22 = true · SHA-256 `8185d8c1a0369bcc17503b607363a910813abbbd06d72b1ea6039b863b9092b0`
- AmbientController: byte-identical to 2.7.22 = true · SHA-256 `c946df702e36284145c77bb7a48ea6c3dcb5baf7722a24890b0fd182522a2fbc`
- StoreController: byte-identical to 2.7.22 = true · SHA-256 `ba3bd44be9234f2aad4519cd8c3830720a9769bd3e310301eb84f5669ee17e66`
- Legacy191ThemePlayer: byte-identical to 2.7.22 = true · SHA-256 `46dda868310ca942d8c1363beb9faadcd2e3e6fb1e5824917ec0038b12bf3b8a`
- Legacy191LibraryInjector: byte-identical to 2.7.22 = true · SHA-256 `ca34a07483daee9c289d46166a51e66d1e2aeb26d86d2abbceb240815c48c32d`

## Performance assertions
- Startup non-Steam prewarm no longer runs at 500 ms.
- Warmup has a 4.2 s grace period plus `requestIdleCallback` when available.
- Route diagnostics sampling reduced from 250 ms to 850 ms.
- Navigation trace persistence is debounced.
- Provider URL cache persists across plugin reloads with expiry filtering.
- Persistent shortcut materialization is queued 6 s after resolution and reuses the resolved direct provider stream.
- Download-index last-access writes are debounced instead of blocking `local_audio_url`.
- Loopback server starts before delayed storage housekeeping.
