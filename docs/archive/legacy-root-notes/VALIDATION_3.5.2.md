# Game Theme Music 3.5.2 Validation

Baseline: **3.5.1** (new known-good baseline).

## Scope

3.5.2 is intentionally narrow: notification artwork reliability, non-Steam identity cleanup, faster local preview start, and hero-art polish. The 3.5.1 playback-update handoff and the locked 3.0.7 audio/theme foundation were not redesigned.

## Automated checks

- Python backend compile: PASS
- Bundled JavaScript syntax (`node --check`): PASS
- `plugin.json` parse: PASS
- `package.json` parse: PASS
- Inline artwork data-URL smoke test: PASS
- Batched local preview URL smoke test: PASS
- ZIP integrity: PASS

## Baseline-preservation hashes

- AudioEngine: UNCHANGED (`b551d166f6f13f1b0162b975e1ccd0be2ed4ed6647a8f09351439ad54ba2ff10`)
- AmbientController: UNCHANGED (`dd711f9d2283faac0132538fc24e74d254c41fa4db3cd85665903bda4e42d48c`)
- StoreController: UNCHANGED (`f722cc1286929ee396707043969df1e84bf4ff56ce6e870271d9169ecbc6011a`)

## 3.5.2 targeted checks

- Now Playing asks the backend for cached inline artwork first.
- If no inline art exists, GTM caches the current thumbnail, retries inline art, then falls back to the loopback artwork URL.
- The notification image has an always-present fallback underneath it, so image failure cannot leave a blank tile.
- Non-Steam shortcut rows expose uint32 / signed-int32 / 64-bit Steam shortcut aliases.
- Soundtrack Manager collapses only rows proven to share the same shortcut canonical ID; saved configs are not deleted.
- Assigned game tracks prewarm local preview URLs through one bounded RPC.
- Native Steam game artwork can fall back to backend-cached first-party Steam CDN assets when local librarycache art is missing.
- Game hero crop is centered.

## Hardware checks requested

1. Start a track and verify the Now Playing tile shows its artwork instead of a blank square.
2. Test a second provider/local track to confirm artwork survives track changes.
3. Open ES-DE/non-Steam entries and check that duplicate aliases/names are cleaner.
4. Open a Steam title that previously lacked hero art (for example Jurassic World Evolution 3) and check the backend fallback.
5. Preview an already-downloaded assigned track and compare startup delay with 3.5.1.
6. Install 3.5.2 over 3.5.1 while music is playing to perform the first real hardware verification of 3.5.1's continuity handoff.
