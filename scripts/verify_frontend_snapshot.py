#!/usr/bin/env python3
"""Verify or regenerate the GTM 4.6.7 frontend from checked-in COMPILED JavaScript.

This is not a rebuild from the missing original React/TypeScript modules or
third-party binaries. The published GTM 4.6.7 ZIP remains unchanged.
"""
from __future__ import annotations
import argparse
import hashlib
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "src/runtime-snapshots/gtm-4.6.7.compiled.js"
TARGET = ROOT / "dist/index.js"
MANIFEST = ROOT / "docs/VERIFIED_RUNTIME_4.6.7.md"


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def expected_sha() -> str:
    text = MANIFEST.read_text(encoding="utf-8")
    hashes = re.findall(r"^\| " + re.escape(chr(96) + "dist/index.js" + chr(96)) +
                        r" \| " + chr(96) + r"([0-9a-f]{64})" + chr(96) + r" \|$",
                        text, re.MULTILINE)
    if len(hashes) != 1:
        raise ValueError("Expected exactly one frontend checksum in verified manifest")
    return hashes[0]


def check_version(data: bytes) -> str:
    package = json.loads((ROOT / "package.json").read_text(encoding="utf-8"))
    plugin = json.loads((ROOT / "plugin.json").read_text(encoding="utf-8"))
    version = package["version"]
    if version != plugin["version"]:
        raise ValueError("Plugin and package versions differ")
    if ('const GTM_VERSION = "' + version + '";').encode() not in data:
        raise ValueError("Bundle version constant does not match manifests")
    return version


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument("--check", action="store_true", help="Require exact verified 4.6.7 source/dist parity")
    mode.add_argument("--build", action="store_true", help="Recreate dist from the compiled snapshot")
    parser.add_argument("--allow-development", action="store_true",
                        help="Allow a changed compiled source ONLY in an unreleased branch")
    args = parser.parse_args()
    if args.allow_development and not args.build:
        parser.error("--allow-development requires --build")

    source = SOURCE.read_bytes()
    version = check_version(source)
    digest = sha256(source)
    released = digest == expected_sha()
    if args.build:
        if not released and not args.allow_development:
            raise ValueError("Source differs from released 4.6.7; refusing to overwrite dist. "
                             "Use --allow-development on an unreleased development branch.")
        TARGET.parent.mkdir(parents=True, exist_ok=True)
        TARGET.write_bytes(source)

    runtime = TARGET.read_bytes()
    if source != runtime:
        raise ValueError("Compiled source and dist/index.js differ")
    if args.check and not released:
        raise ValueError("Compiled source does not match the published 4.6.7 file hash")

    print("PASS: frontend snapshot equals dist/index.js (" + str(len(source)) + " bytes), version " + version)
    if released:
        print("PASS: SHA-256 equals the published 4.6.7 verified runtime manifest")
    else:
        print("UNVERIFIED DEVELOPMENT OUTPUT: not the published 4.6.7 runtime")
    print("Scope: compiled JS only; missing original React/TypeScript sources and third-party binaries remain unverified")


if __name__ == "__main__":
    try:
        main()
    except (OSError, ValueError, json.JSONDecodeError) as err:
        print("FAIL: " + str(err), file=sys.stderr)
        sys.exit(1)
