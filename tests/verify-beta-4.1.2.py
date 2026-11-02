#!/usr/bin/env python3
"""Validate the exact maintainer-built 4.1.2 beta ZIP; no external dependencies."""
import hashlib
import json
import sys
import zipfile
from pathlib import Path

VERSION = "4.1.2"
FILENAME = "Game-Theme-Music-4.1.2.zip"
ROOT = "Game-Theme-Music/"
SHA256 = "4582cbae401e0cc54293ab605c5152f4434e2eafc938a928f66eea125a19f01d"
EXPECTED_FILES = 287

def main() -> None:
    archive = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(FILENAME)
    if not archive.is_file():
        raise SystemExit(f"Missing beta archive: {archive}")
    actual = hashlib.sha256(archive.read_bytes()).hexdigest()
    assert actual == SHA256, f"Unexpected ZIP checksum: {actual}"
    with zipfile.ZipFile(archive) as z:
        assert z.testzip() is None, "Damaged ZIP entry"
        names = z.namelist()
        assert len(names) == EXPECTED_FILES, f"Expected {EXPECTED_FILES} entries, got {len(names)}"
        assert all(n.startswith(ROOT) and not n.startswith("/") and ".." not in Path(n).parts for n in names)
        for n in ("plugin.json", "package.json", "dist/index.js", "main.py"):
            assert ROOT + n in names, f"Missing {n}"
        for n in ("plugin.json", "package.json"):
            manifest = json.loads(z.read(ROOT + n))
            assert manifest["version"] == VERSION, f"Wrong version in {n}"
        js = z.read(ROOT + "dist/index.js").decode("utf-8")
        assert VERSION in js, "Frontend version marker missing"
    print(f"PASS: {FILENAME} 4.1.2, checksum, CRC, paths, metadata and frontend marker")

if __name__ == "__main__":
    main()
