#!/usr/bin/env python3
from pathlib import Path
import hashlib, json, os, shutil, sys, zipfile

if len(sys.argv) < 4:
    raise SystemExit("usage: package_xl_core.py RedAlert.dll upstream_sha output.zip")

dll = Path(sys.argv[1]).resolve()
upstream_sha = sys.argv[2].strip()
out = Path(sys.argv[3]).resolve()

if not dll.is_file():
    raise SystemExit(f"RedAlert.dll missing: {dll}")
if dll.stat().st_size < 250_000:
    raise SystemExit(f"RedAlert.dll is suspiciously small: {dll.stat().st_size} bytes")

stage = out.parent / "xl-package-stage"
if stage.exists():
    shutil.rmtree(stage)
(stage / "Living_War_XL_Core" / "Data").mkdir(parents=True)
shutil.copy2(dll, stage / "Living_War_XL_Core" / "Data" / "RedAlert.dll")

ccmod = {
    "name": "Living War XL Core",
    "description": "Experimental 256x256 internal-map engine support for CNC Living War.",
    "author": "CNC Living War / Vanilla Conquer",
    "load_order": 5,
    "version_high": 0,
    "version_low": 9,
    "game_type": "RA"
}
(stage / "Living_War_XL_Core" / "ccmod.json").write_text(json.dumps(ccmod, indent=2) + "\n", encoding="utf-8")

marker = {
    "component_id": "living-war-xl-core",
    "version": "0.9.0",
    "hardware_verified": False,
    "target_internal_map": "256x256",
    "target_playable_map": "254x254",
    "upstream": "TheAssemblyArmada/Vanilla-Conquer",
    "upstream_branch": "vanilla",
    "upstream_commit": upstream_sha,
    "test_scope": "single-human skirmish + AI",
    "client_map_abi": "128x128 compatibility window",
    "frontend_bootstrap": "126x126 menu-safe map metadata",
    "xl_map_contract": "[LivingWarXL] + [LivingWarXLWaypoints] + hidden XL payload sections",
    "frontend_payload_shell": "vanilla-safe MapPack/OverlayPack/TERRAIN",
    "xl_payload_sections": ["LivingWarXLMapPack", "LivingWarXLOverlayPack", "LivingWarXLTerrain"],
    "runtime_bootstrap": "center local player + reveal sight radius + runtime dimension message",
    "xl_visibility_fix": "remove legacy 0xC000 In_View rejection under LIVING_WAR_XL",
    "xl_building_placement_fix": "all client placement/proximity cell encoders use 8-bit map stride",
    "xl_client_footprint_fix": "translate exported building footprint offsets to 128-wide Remastered UI ABI",
    "xl_debug_reveal": "[LivingWarXLDebug] RevealAll=yes maps the full XL battlefield at start",
    "xl_cursor_cleanup": "correct XL footprint dimensions and clear stale IsCursorHere flags before redraw",
    "xl_client_state_virtualization": "0.8 sliding-window experiment retired; 0.9 preserves the fixed legacy ABI while using absolute-world object/input coordinates",
    "xl_static_terrain_stream": "all 256x256 static terrain is progressively delivered through UPDATE_MAP_CELL callbacks",
    "xl_action_buffer_fix": "ActionWithSelected is capped to the fixed 128x128 ABI window",
    "xl_boundary_telemetry": "debug reveal maps report selected-unit and legacy client state information",
    "xl_renderer_abi_probe": "LivingWarXL-debug.log records state request IDs, buffer sizes, failures and boundary-crossing input coordinates"
}
(stage / "Living_War_XL_Core" / "living-war-xl-core.json").write_text(json.dumps(marker, indent=2) + "\n", encoding="utf-8")

source_notice = f"""Living War XL Core 0.9.0 experimental build

Base source:
https://github.com/TheAssemblyArmada/Vanilla-Conquer
branch: vanilla
commit: {upstream_sha}

This binary is based on GPL-licensed Vanilla Conquer / EA released source.
The Living War XL modifications are the build branch's apply_xl_core_patch.py
changes. This build is for hardware testing and is not hardware-verified.

Target:
- 256x256 internal map grid
- ~254x254 playable map rectangle
- single-human skirmish + AI first
- complete vanilla-safe menu shell with XL dimensions and payload activated inside the DLL\n- XL-safe view test for valid 256-grid cells\n- runtime start reveal/camera bootstrap and dimension proof message\n- confirmed building placement uses the same 256-wide stride as placement preview/proximity
- client placement footprint stays visually connected under the 128-wide UI ABI
- optional full-map reveal for XL proof/debug maps
- stale placement cursor cleanup and corrected XL footprint dimensions
- absolute-world Remastered object/input semantics restored
- complete progressive static-terrain streaming across the 256 grid
- fixed 128x128 ActionWithSelected ABI safety
- renderer ABI file logging for buffer-size and boundary diagnostics\n- fixed Remastered 128x128 client map ABI compatibility window
"""
(stage / "XL_CORE_SOURCE_NOTICE.txt").write_text(source_notice, encoding="utf-8")

manifest = {
    "schema": 1,
    "project": "CNC Red Alert Living War",
    "package_type": "support_component",
    "component_id": "living-war-xl-core",
    "title": "Living War XL Core",
    "version": "0.9.0",
    "channel": "dev",
    "support_role": "Required engine core for Living War XL maps.",
    "notes": "XL Core 0.9 keeps the proven 256x256 simulation and placement fixes, restores Remastered absolute-world pixel semantics, exports layers without DLL-side view clipping, streams the entire static 256x256 terrain through existing map-cell callbacks, and records closed-client state buffer behavior to LivingWarXL-debug.log.",
    "build_status": "HARDWARE-UNVERIFIED",
    "install": [
        {
            "source": "Living_War_XL_Core/ccmod.json",
            "target": "red_alert_mod",
            "mod_folder": "Living_War_XL_Core",
            "dest": "ccmod.json"
        },
        {
            "source": "Living_War_XL_Core/Data/RedAlert.dll",
            "target": "red_alert_mod",
            "mod_folder": "Living_War_XL_Core",
            "dest": "Data/RedAlert.dll"
        },
        {
            "source": "Living_War_XL_Core/living-war-xl-core.json",
            "target": "red_alert_mod",
            "mod_folder": "Living_War_XL_Core",
            "dest": "living-war-xl-core.json"
        }
    ]
}
(stage / "living-war-package.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")

if out.exists():
    out.unlink()
with zipfile.ZipFile(out, "w") as z:
    # DS418 native ZIP reader requires package metadata uncompressed.
    z.write(stage / "living-war-package.json", "living-war-package.json", compress_type=zipfile.ZIP_STORED)
    for path in sorted(stage.rglob("*")):
        if not path.is_file() or path.name == "living-war-package.json":
            continue
        z.write(path, path.relative_to(stage).as_posix(), compress_type=zipfile.ZIP_DEFLATED)

with zipfile.ZipFile(out) as z:
    bad = z.testzip()
    if bad:
        raise SystemExit(f"ZIP integrity failed at {bad}")
    meta = z.getinfo("living-war-package.json")
    if meta.compress_type != zipfile.ZIP_STORED:
        raise SystemExit("living-war-package.json is not ZIP_STORED")

digest = hashlib.sha256(out.read_bytes()).hexdigest()
dll_digest = hashlib.sha256(dll.read_bytes()).hexdigest()
print("PACKAGE", out)
print("PACKAGE_SHA256", digest)
print("DLL_SHA256", dll_digest)
print("DLL_BYTES", dll.stat().st_size)
