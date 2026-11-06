#!/usr/bin/env python3
"""Focused source-side checks for the private GTM 4.6.0 context menu test."""
from pathlib import Path
import ast
import json
import re

root = Path(__file__).resolve().parents[1]
js = (root / "dist/index.js").read_text(encoding="utf-8")
meta = json.loads((root / "plugin.json").read_text(encoding="utf-8"))
pkg = json.loads((root / "package.json").read_text(encoding="utf-8"))
py = (root / "main.py").read_text(encoding="utf-8")
assert meta["version"] == pkg["version"] == "4.6.0"
assert 'const GTM_VERSION = "4.6.0";' in js
assert 'DECKY_PLUGIN_VERSION", "4.6.0"' in py
ast.parse(py)
flags = [
    "contextMenuShowGameMusic",
    "contextMenuShowAmbientPlaylist",
    "contextMenuShowStorePlaylist",
    "contextMenuShowTitleDeck",
    "contextMenuShowArtwork",
    "contextMenuShowDeveloper",
]
for flag in flags:
    assert f"{flag}: true" in js, f"Missing enabled default: {flag}"
    assert f"value?.{flag} !== false" in js, f"Missing persisted settings normalization: {flag}"
    assert f"['{flag}'" in js, f"Missing settings switch: {flag}"
assert "function gtm460HideOtherShortcuts" in js
assert "gtm460HideOtherShortcuts(menuItems)" in js
assert "contextMenuShowGameMusic !== false" in js
assert "contextMenuShowAmbientPlaylist !== false" in js
assert "contextMenuShowStorePlaylist !== false" in js
assert "isOpeningAppContextMenu(component.props.children)" in js
assert "gtm-v3-chip is-version" in js
assert "gtm-v3-header .gtm-v3-chip.is-version" in js
assert "color:var(--gtm-text)!important" in js
assert "background:var(--gtm-focus-soft,var(--gtm-panel-2))!important" in js
assert "font-size:11px" in js
assert "transition: background-color 65ms linear" in js
print("PASS: GTM 4.6.0 version metadata, menu visibility defaults, switches and theme-aware badge")
