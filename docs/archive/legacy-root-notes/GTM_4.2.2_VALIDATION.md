# GTM 4.2.2 Validation

- All targeted gameplay, UI, controller, physics, audio, format-1/2/3 import and old regression tests passed in the development environment. Full log: `GTM_4.2.2_REGRESSION_LOG.txt`.
- The new startup test checks all six Arcade entries are visible synchronously without a backend response, then remains true after partial, empty, rejected, and throwing backend RPC responses.
- The backend is tested with `gtm_pack_v3` absent from `sys.path`; it still reads the trusted validator and loads both native packs.
- Both built-in manifests ship in `visualizer-packs`, and trusted sanitized builtin metadata is embedded in `dist/index.js` for first-paint reliability.
- Packed file SHA-256 and ZIP CRC integrity checked.
- Not verified on physical Steam Deck: Steam Input/controller focus, actual menu layout, frame rate, file system and Decky reload behavior. Keep 4.2.1 for rollback.
