# Validation 3.0.2

Static/package validation completed before release:

- `node --check dist/index.js`
- `python -m py_compile main.py`
- `package.json` and `plugin.json` parsed as JSON
- Physical page shoulders mapped to current Steam controller input values LB=30 / RB=31
- Ambient picker no longer remounts its list when a selection changes
- Ambient-page preview path is present
- New online Ambient/Store downloads preserve the search-result title
- Legacy metadata repair frontend/backend RPC path is present
- qjs and yt-dlp hashes are unchanged from 3.0.1
- ZIP archive integrity checked after packaging

Hardware behavior still requires Steam Deck testing because CSS Loader, Steam focus routing, and live controller input are runtime-only.
