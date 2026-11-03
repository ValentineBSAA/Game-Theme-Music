#!/usr/bin/env python3
"""Build the single-layer GTM 4.4.3 private-store package from exact 4.4.1 beta resources.

Run: python3 scripts/package_gtm_store_443.py bump
     python3 scripts/package_gtm_store_443.py package original-4.4.1.zip output-4.4.3.zip
"""
import io
import json
import sys
import zipfile
from pathlib import Path
from PIL import Image

VERSION = "4.4.3"
ROOT = "Game-Theme-Music/"
SKIP = (
    "visualizer-packs/arcade/",
    "visualizer-packs/sdk-examples/Neon_Dodger_Community/",
    "visualizer-packs/sdk-examples/flux-shield-run-428/",
    "visualizer-packs/sdk-examples/GTM_4.2.8_NEON_DODGER_COMMUNITY_GAME.zip",
)
OVERLAY = (
    "dist/index.js", "main.py", "plugin.json", "package.json",
    "visualizer-packs/volume1/manifest.json",
    "visualizer-packs/experiments/manifest.json",
    "README.md",
)

def verify_tree():
    plugin = json.loads(Path("plugin.json").read_text())
    package = json.loads(Path("package.json").read_text())
    assert plugin["version"] == package["version"] == VERSION
    assert "ValentineBSAA/Game-Theme-Music" in plugin["publish"]["image"]
    assert Path("assets/game-theme-music-icon.webp").is_file()
    assert 'DECKY_PLUGIN_VERSION", "4.4.3"' in Path("main.py").read_text()
    js = Path("dist/index.js").read_text()
    assert 'const GTM_VERSION = "4.4.3";' in js
    assert "function Gtm419ArcadePage" not in js
    assert "function gtm421DrawArcade" not in js
    assert "class AmbientController" in js and "class StoreController" in js
    assert len(json.loads(Path("visualizer-packs/experiments/manifest.json").read_text())["scenes"]) == 5
    assert len(json.loads(Path("visualizer-packs/volume1/manifest.json").read_text())["scenes"]) == 12

def bump():
    p = Path("dist/index.js")
    s = p.read_text()
    if 'const GTM_VERSION = "4.4.2";' in s:
        s = s.replace('const GTM_VERSION = "4.4.2";','const GTM_VERSION = "4.4.3";',1)
    assert 'const GTM_VERSION = "4.4.3";' in s
    s = s.replace('"pack_id":"gtm_visual_experiments_442","name":"GTM Visual Experiments","author":"Valentine / Game Theme Music","version":"4.4.2"',
                  '"pack_id":"gtm_visual_experiments_442","name":"GTM Visual Experiments","author":"Valentine / Game Theme Music","version":"4.4.3"',1)
    p.write_text(s)
    verify_tree()

def package(input_zip, output_zip):
    verify_tree()
    with zipfile.ZipFile(input_zip) as old:
        assert old.testzip() is None
        roots = {n[:-len("dist/index.js")] for n in old.namelist() if n.endswith("dist/index.js")}
        assert len(roots) == 1, roots
        orig_root = roots.pop()
        with Image.open("assets/game-theme-music-icon.webp") as image:
            image = image.convert("RGB")
            assert image.size == (512,512)
            buf = io.BytesIO()
            image.save(buf, format="PNG", optimize=True)
            icon_bytes = buf.getvalue()
        written = set()
        output_zip = Path(output_zip)
        with zipfile.ZipFile(output_zip, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=6) as dest:
            for entry in old.infolist():
                if entry.is_dir():
                    continue
                assert entry.filename.startswith(orig_root)
                rel = entry.filename[len(orig_root):]
                assert ".." not in Path(rel).parts
                if any(rel.startswith(s) for s in SKIP):
                    continue
                if rel in OVERLAY:
                    data = Path(rel).read_bytes()
                else:
                    data = old.read(entry)
                dest.writestr(ROOT + rel, data)
                written.add(rel)
            for rel in OVERLAY:
                if rel not in written:
                    dest.write(rel, arcname=ROOT + rel)
                    written.add(rel)
            for rel in ("icon.png","logo.png","assets/icon.png","assets/logo.png"):
                dest.writestr(ROOT + rel, icon_bytes)
        with zipfile.ZipFile(output_zip) as built:
            assert built.testzip() is None
            names = built.namelist()
            assert len(names) == len(set(names))
            assert all(n.startswith(ROOT) for n in names)
            assert not any(n.endswith(".zip") and n.count("/") == 0 for n in names)
            assert not any(n.startswith(ROOT+"visualizer-packs/arcade/") for n in names)
            assert all(json.loads(built.read(ROOT+r))["version"] == VERSION for r in ("plugin.json","package.json"))
            assert 'const GTM_VERSION = "4.4.3";' in built.read(ROOT+"dist/index.js").decode()
            assert 'DECKY_PLUGIN_VERSION", "4.4.3"' in built.read(ROOT+"main.py").decode()
            assert built.read(ROOT+"logo.png").startswith(b"\\x89PNG\\r\\n\\x1a\\n")
        print(f"Validated store ZIP: {output_zip} ({output_zip.stat().st_size} bytes, 17 scenes, one folder, icons included)")

if __name__ == "__main__":
    if sys.argv[1:] == ["bump"]:
        bump()
    elif len(sys.argv) == 4 and sys.argv[1] == "package":
        package(sys.argv[2],sys.argv[3])
    else:
        raise SystemExit(__doc__)
