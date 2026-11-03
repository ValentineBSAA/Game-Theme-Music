# Validation — 3.4.5

- JavaScript syntax: PASS (`node --check dist/index.js`)
- Python compile: PASS (`python -m py_compile main.py`)
- package.json / plugin.json parse: PASS
- Preview route present: `/preview/{token}/{preview_id}`
- Preview creation RPC present: `create_preview_url`
- Download job RPCs present: `start_download_job`, `get_download_job`
- Remote preview is proxied without persistent writes
- Download progress is derived from bytes written / Content-Length when available
- Preview dialog uses owning Steam window and fixed centered shell
- Theme colors remain semantic 3.0.7 variables
