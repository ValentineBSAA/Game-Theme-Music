#!/usr/bin/env python3
from pathlib import Path
import re, sys

root = Path(sys.argv[1]).resolve()
ra = root / "redalert"
if not (ra / "defines.h").is_file():
    raise SystemExit("Expected a Vanilla-Conquer checkout root.")

def patch_once(rel, pattern, replacement, label, flags=0):
    p = root / rel
    s = p.read_text(encoding="utf-8")
    if replacement in s:
        print("already patched:", label)
        return
    ns, n = re.subn(pattern, lambda m: replacement, s, count=1, flags=flags)
    if n != 1:
        raise SystemExit(f"Could not patch {label} in {rel}; upstream layout changed.")
    p.write_text(ns, encoding="utf-8")
    print("patched:", label)

patch_once(
    "redalert/defines.h",
    r"// Size of the map in cells\.\s*#define\s+MAP_CELL_W\s+128\s*#define\s+MAP_CELL_H\s+128\s*#define\s+MAP_CELL_TOTAL\s+\(MAP_CELL_W\s*\*\s*MAP_CELL_H\)",
    """// Size of the map in cells.
#ifdef LIVING_WAR_XL
#define MAP_CELL_W 256
#define MAP_CELL_H 256
#else
#define MAP_CELL_W 128
#define MAP_CELL_H 128
#endif
#define MAP_CELL_TOTAL (MAP_CELL_W * MAP_CELL_H)""",
    "256x256 map constants",
    re.S,
)

# CELL needs a direct splice because the upstream block contains nested
# preprocessor conditionals and comments that are brittle to regex matching.
p = root / "redalert/defines.h"
s = p.read_text(encoding="utf-8")
xl_cell_marker = "#ifdef LIVING_WAR_XL\ntypedef signed int CELL;"
if xl_cell_marker not in s:
    cell_start = s.index("typedef signed short CELL;")
    cell_end = s.index("typedef int WAYPOINT;", cell_start)
    cell_replacement = """#ifdef LIVING_WAR_XL
typedef signed int CELL;
typedef union
{
    CELL Cell;
    struct
    {
#ifdef __BIG_ENDIAN__
        unsigned int sluff : 16;
        unsigned int Y : 8;
        unsigned int X : 8;
#else
        unsigned int X : 8;
        unsigned int Y : 8;
        unsigned int sluff : 16;
#endif
    } Sub;
} CELL_COMPOSITE;
#else
typedef signed short CELL;
typedef union
{
    CELL Cell;
    struct
    {
#ifdef __BIG_ENDIAN__
        /*
        ** Unused upper bits will cause problems on a big-endian machine unless they
        ** are deliberately accounted for.
        */
        unsigned short sluff : 2;
        unsigned short Y : 7;
        unsigned short X : 7;
#else
        unsigned short X : 7;
        unsigned short Y : 7;
#endif
    } Sub;
} CELL_COMPOSITE;
#endif

"""
    s = s[:cell_start] + cell_replacement + s[cell_end:]
    p.write_text(s, encoding="utf-8")
    print("patched: 32-bit CELL with 8-bit X/Y")
else:
    print("already patched: 32-bit CELL with 8-bit X/Y")

patch_once(
    "redalert/externs.h",
    r"extern\s+char\s+_staging_buffer\s*\[\s*32000\s*\]\s*;",
    """#ifdef LIVING_WAR_XL
#define LIVING_WAR_STAGING_BUFFER_SIZE (1024 * 1024)
#else
#define LIVING_WAR_STAGING_BUFFER_SIZE 32000
#endif
extern char _staging_buffer[LIVING_WAR_STAGING_BUFFER_SIZE];""",
    "1 MiB staging declaration",
)
patch_once(
    "redalert/globals.cpp",
    r"char\s+_staging_buffer\s*\[\s*32000\s*\]\s*;",
    "char _staging_buffer[LIVING_WAR_STAGING_BUFFER_SIZE];",
    "1 MiB staging definition",
)

patch_once(
    "redalert/dllinterface.cpp",
    r"static\s+const\s+int\s+_map_width_shift_bits\s*=\s*7\s*;",
    """#ifdef LIVING_WAR_XL
static const int _map_width_shift_bits = 8;
#else
static const int _map_width_shift_bits = 7;
#endif""",
    "client placement width shift",
)

p = root / "redalert/dllinterface.cpp"
s = p.read_text(encoding="utf-8")
needle = """#ifdef LIVING_WAR_XL
    map_cell_width = min(map_cell_width, MAP_MAX_CELL_WIDTH);
    map_cell_height = min(map_cell_height, MAP_MAX_CELL_HEIGHT);
#endif"""
if needle not in s:
    pat = re.compile(
        r"(if \(map_cell_height < MAP_MAX_CELL_(?:HEIGHT|WIDTH)\) \{\s*map_cell_height\+\+;\s*\})"
    )
    s, n = pat.subn(lambda m: m.group(1) + "\n\n" + needle, s)
    if n < 4:
        raise SystemExit(f"Expected several client map export blocks; found {n}.")
    p.write_text(s, encoding="utf-8")
    print("patched: client 128x128 ABI clamps in", n, "state paths")
else:
    print("already patched: client state ABI clamps")

p = root / "redalert/dllinterface.cpp"
s = p.read_text(encoding="utf-8")
marker = """#ifdef LIVING_WAR_XL
        map_data->OriginalMapCellWidth = min(map_data->OriginalMapCellWidth, MAP_MAX_CELL_WIDTH);
        map_data->OriginalMapCellHeight = min(map_data->OriginalMapCellHeight, MAP_MAX_CELL_HEIGHT);
#endif"""
if marker not in s:
    anchor = """        map_data->OriginalMapCellWidth = map_cell_width;
        map_data->OriginalMapCellHeight = map_cell_height;"""
    if anchor not in s:
        raise SystemExit("Could not find static-map OriginalMap dimensions.")
    s = s.replace(anchor, anchor + "\n\n" + marker, 1)
    p.write_text(s, encoding="utf-8")
    print("patched: static-map advertised ABI dimensions")

patch_once(
    "redalert/CMakeLists.txt",
    r"target_compile_definitions\(RedAlert\s+PUBLIC\s+\$<\$<CONFIG:Debug>:_DEBUG>\s+\$\{REMASTER_DEFS\}\)",
    "target_compile_definitions(RedAlert PUBLIC $<$<CONFIG:Debug>:_DEBUG> ${REMASTER_DEFS} LIVING_WAR_XL)",
    "LIVING_WAR_XL compile definition",
)

print("\nLiving War XL Core patch applied.")
print("Internal map: 256x256; intended playable test rectangle: 1,1,254,254.")
print("Remastered fixed client map ABI remains 128x128 for the first hardware test.")
