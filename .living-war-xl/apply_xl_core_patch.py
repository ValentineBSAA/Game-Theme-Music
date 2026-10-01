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
xl_cell_marker = "#ifdef LIVING_WAR_XL\ntypedef signed long CELL;"
if xl_cell_marker not in s:
    cell_start = s.index("typedef signed short CELL;")
    cell_end = s.index("typedef int WAYPOINT;", cell_start)
    cell_replacement = """#ifdef LIVING_WAR_XL
typedef signed long CELL;
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

# Vanilla has two separate client-placement width-shift declarations: one for
# placement-distance/proximity generation and another inside Place(). Patch both
# cleanly in one pass. Do not patch the first and then search again, because the
# fallback '= 7' line inside the first #else would be mistaken for a third
# vanilla declaration and nest the XL helper definitions inside a dead branch.
p = root / "redalert/dllinterface.cpp"
s = p.read_text(encoding="utf-8")
width_shift_needle = "static const int _map_width_shift_bits = 7;"
width_shift_replacement = """#ifdef LIVING_WAR_XL
static const int _map_width_shift_bits = 8;
#else
static const int _map_width_shift_bits = 7;
#endif"""
width_shift_count = s.count(width_shift_needle)
if width_shift_count:
    if width_shift_count != 2:
        raise SystemExit(f"Expected exactly two vanilla placement width-shift sites; found {width_shift_count}.")
    s = s.replace(width_shift_needle, width_shift_replacement)
    p.write_text(s, encoding="utf-8")
    print("patched: both client placement width-shift sites")
else:
    print("already patched: both client placement width-shift sites")



# Forward-declare the client offset translator before earlier object/sidebar
# export functions use it. The definition itself is placed beside the placement
# stride constants later in dllinterface.cpp.
p = root / "redalert/dllinterface.cpp"
s = p.read_text(encoding="utf-8")
prototype = """#ifdef LIVING_WAR_XL
static short LivingWarXL_Client_Cell_Offset(short internal_offset);
static void LivingWarXL_Reset_Client_Terrain_Stream();
static void LivingWarXL_Get_Client_Window(int& map_cell_x,
                                          int& map_cell_y,
                                          int& map_cell_width,
                                          int& map_cell_height);
static void LivingWarXL_Stream_Static_Window(int map_cell_x,
                                              int map_cell_y,
                                              int map_cell_width,
                                              int map_cell_height);
#endif

"""
if "LivingWarXL_Get_Client_Window(int& map_cell_x" not in s:
    include_anchor = '#include "function.h"'
    if include_anchor not in s:
        raise SystemExit("Could not find dllinterface include anchor for XL client offset prototype.")
    s = s.replace(include_anchor, include_anchor + "\n\n" + prototype, 1)
    p.write_text(s, encoding="utf-8")
    print("patched: XL client-state helper forward declarations")
else:
    print("already patched: XL client-state helper forward declarations")


# The vanilla placement cursor relies on incrementally clearing the previous
# IsCursorHere cells. On the XL map, camera/input transitions can leave stale
# cursor flags behind, producing the long red/white "snake" after dragging a
# building footprint around. Correct the footprint dimensions and scrub stale
# cursor flags before drawing the new XL placement cursor.
p = root / "redalert/display.cpp"
s = p.read_text(encoding="utf-8")
cursor_scrub_marker = "Living War XL stale placement cursor scrub"
if cursor_scrub_marker not in s:
    old = """void DisplayClass::Get_Occupy_Dimensions(int& w, int& h, short const* list) const
{
    int min_x = MAP_CELL_W;
    int max_x = -MAP_CELL_W;
    int min_y = MAP_CELL_H;
    int max_y = -MAP_CELL_H;
    int x, y;

    w = 0;
    h = 0;

    if (!list) {"""
    new = """void DisplayClass::Get_Occupy_Dimensions(int& w, int& h, short const* list) const
{
    int min_x = MAP_CELL_W;
    int max_x = -MAP_CELL_W;
    int min_y = MAP_CELL_H;
    int max_y = -MAP_CELL_H;
    int x, y;

    w = 0;
    h = 0;

#ifdef LIVING_WAR_XL
    if (list) {
#else
    if (!list) {
#endif"""
    if old not in s:
        raise SystemExit("Could not find Get_Occupy_Dimensions list guard.")
    s = s.replace(old, new, 1)

    old2 = """        h = min(1, max_y - min_y + 1);
    }
}"""
    new2 = """#ifdef LIVING_WAR_XL
        h = max(1, max_y - min_y + 1);
#else
        h = min(1, max_y - min_y + 1);
#endif
    }
}"""
    if old2 not in s:
        raise SystemExit("Could not find Get_Occupy_Dimensions height result.")
    s = s.replace(old2, new2, 1)

    old3 = """        if (pos != ZoneCell && ZoneCell != -1) {
            Cursor_Mark(ZoneCell + ZoneOffset, false);
        }

        /*
        ** Render the cursor (could just be animation).
        */"""
    new3 = """        if (pos != ZoneCell && ZoneCell != -1) {
            Cursor_Mark(ZoneCell + ZoneOffset, false);

#ifdef LIVING_WAR_XL
            // Living War XL stale placement cursor scrub.
            // Incremental clear is normally enough, but the Remastered input/
            // camera bridge can leave old IsCursorHere flags after repeated
            // placement movement on the expanded grid.
            for (int yy = MapCellY; yy < MapCellY + MapCellHeight; ++yy) {
                for (int xx = MapCellX; xx < MapCellX + MapCellWidth; ++xx) {
                    CELL scrub_cell = XY_Cell(xx, yy);
                    CellClass* scrub_ptr = &(*this)[scrub_cell];
                    if (scrub_ptr->IsCursorHere) {
                        scrub_ptr->IsCursorHere = false;
                        scrub_ptr->Redraw_Objects();
                    }
                }
            }
#endif
        }

        /*
        ** Render the cursor (could just be animation).
        */"""
    if old3 not in s:
        raise SystemExit("Could not find Set_Cursor_Pos incremental clear block.")
    s = s.replace(old3, new3, 1)

    p.write_text(s, encoding="utf-8")
    print("patched: XL cursor dimensions and stale placement scrub")
else:
    print("already patched: XL cursor dimensions and stale placement scrub")

# Remastered's UI ABI still interprets building footprint offsets as if rows are
# 128 cells wide. Internally XL building footprints are compiled against
# MAP_CELL_W=256. Translate only the client-facing offsets back to the legacy
# stride so the red/green placement footprint remains a solid connected shape.
p = root / "redalert/dllinterface.cpp"
s = p.read_text(encoding="utf-8")
helper_marker = "static bool LivingWarXLClientTerrainSent[MAP_CELL_TOTAL]"
if helper_marker not in s:
    insert_after = """#ifdef LIVING_WAR_XL
static const int _map_width_shift_bits = 8;
#else
static const int _map_width_shift_bits = 7;
#endif"""
    helper = insert_after + """

#ifdef LIVING_WAR_XL
static short LivingWarXL_Client_Cell_Offset(short internal_offset)
{
    if (internal_offset == REFRESH_EOL) {
        return internal_offset;
    }

    // Footprint offsets can contain a small negative X component. Decode the
    // nearest 256-wide row first, then re-encode the same X/Y delta at 128.
    int y = (internal_offset >= 0)
                ? (internal_offset + (MAP_CELL_W / 2)) / MAP_CELL_W
                : (internal_offset - (MAP_CELL_W / 2)) / MAP_CELL_W;
    int x = internal_offset - (y * MAP_CELL_W);
    return (short)((y * MAP_MAX_CELL_WIDTH) + x);
}
#endif

#ifdef LIVING_WAR_XL
static bool LivingWarXLClientTerrainSent[MAP_CELL_TOTAL] = {false};

static void LivingWarXL_Reset_Client_Terrain_Stream()
{
    memset(LivingWarXLClientTerrainSent, 0, sizeof(LivingWarXLClientTerrainSent));
}

static void LivingWarXL_Get_Client_Window(int& map_cell_x,
                                          int& map_cell_y,
                                          int& map_cell_width,
                                          int& map_cell_height)
{
    const int world_left = max(0, Map.MapCellX - 1);
    const int world_top = max(0, Map.MapCellY - 1);
    const int world_right = min(MAP_CELL_W, Map.MapCellX + Map.MapCellWidth + 1);
    const int world_bottom = min(MAP_CELL_H, Map.MapCellY + Map.MapCellHeight + 1);

    const int client_width = min(MAP_MAX_CELL_WIDTH, world_right - world_left);
    const int client_height = min(MAP_MAX_CELL_HEIGHT, world_bottom - world_top);

    const int view_width = max(1, Lepton_To_Cell(Map.TacLeptonWidth));
    const int view_height = max(1, Lepton_To_Cell(Map.TacLeptonHeight));
    const int camera_x = Coord_XCell(Map.TacticalCoord);
    const int camera_y = Coord_YCell(Map.TacticalCoord);
    const int center_x = camera_x + (view_width / 2);
    const int center_y = camera_y + (view_height / 2);

    const int max_left = max(world_left, world_right - client_width);
    const int max_top = max(world_top, world_bottom - client_height);

    map_cell_x = Bound(center_x - (client_width / 2), world_left, max_left);
    map_cell_y = Bound(center_y - (client_height / 2), world_top, max_top);
    map_cell_width = client_width;
    map_cell_height = client_height;
}

static void LivingWarXL_Stream_Static_Window(int map_cell_x,
                                              int map_cell_y,
                                              int map_cell_width,
                                              int map_cell_height)
{
    // Keep the callback burst bounded. Newly exposed terrain continues to fill
    // on subsequent state polls until the current 128x128 client window is sent.
    int sent_this_call = 0;
    const int max_per_call = 1024;

    for (int y = 0; y < map_cell_height && sent_this_call < max_per_call; ++y) {
        for (int x = 0; x < map_cell_width && sent_this_call < max_per_call; ++x) {
            const int world_x = map_cell_x + x;
            const int world_y = map_cell_y + y;
            CELL cell = XY_Cell(world_x, world_y);
            if (cell < 0 || cell >= MAP_CELL_TOTAL || LivingWarXLClientTerrainSent[cell]) {
                continue;
            }

            CellClass* cellptr = &Map[cell];
            char cell_name[_MAX_PATH];
            char icon_number[32];
            cell_name[0] = 0;
            int icon = 0;
            void* image_data = 0;

            if (cellptr->Get_Template_Info(cell_name, icon, image_data)) {
                itoa(icon, icon_number, 10);
                strncat(cell_name, "_i", 32);
                strncat(cell_name, icon_number, 32);
                strncat(cell_name, ".tga", 32);
                On_Update_Map_Cell(world_x, world_y, cell_name);
            }

            LivingWarXLClientTerrainSent[cell] = true;
            ++sent_this_call;
        }
    }
}
#endif"""
    if insert_after not in s:
        raise SystemExit("Could not find XL placement shift block for client offset helper.")
    s = s.replace(insert_after, helper, 1)

    old = """sidebar_entry.PlacementList[sidebar_entry.PlacementListLength] =
                                                *occupy_list;"""
    new = """#ifdef LIVING_WAR_XL
                                            sidebar_entry.PlacementList[sidebar_entry.PlacementListLength] =
                                                LivingWarXL_Client_Cell_Offset(*occupy_list);
#else
                                            sidebar_entry.PlacementList[sidebar_entry.PlacementListLength] =
                                                *occupy_list;
#endif"""
    if old not in s:
        raise SystemExit("Could not find sidebar placement-list export block.")
    s = s.replace(old, new)

    old2 = """sidebar_entry.PlacementList[sidebar_entry.PlacementListLength] =
                                                    *occupy_list;"""
    new2 = """#ifdef LIVING_WAR_XL
                                                sidebar_entry.PlacementList[sidebar_entry.PlacementListLength] =
                                                    LivingWarXL_Client_Cell_Offset(*occupy_list);
#else
                                                sidebar_entry.PlacementList[sidebar_entry.PlacementListLength] =
                                                    *occupy_list;
#endif"""
    s = s.replace(old2, new2)

    old3 = """new_object.OccupyList[new_object.OccupyListLength] = *occupy_list;"""
    new3 = """#ifdef LIVING_WAR_XL
                    new_object.OccupyList[new_object.OccupyListLength] =
                        LivingWarXL_Client_Cell_Offset(*occupy_list);
#else
                    new_object.OccupyList[new_object.OccupyListLength] = *occupy_list;
#endif"""
    if old3 in s:
        s = s.replace(old3, new3)

    p.write_text(s, encoding="utf-8")
    print("patched: client-facing XL footprint offsets")
else:
    print("already patched: client-facing XL footprint offsets")


# Define the client-state window helpers at a deterministic source location.
# Earlier builds bundled these definitions with the footprint helper, which
# could be skipped after the forward declaration was added.
p = root / "redalert/dllinterface.cpp"
s = p.read_text(encoding="utf-8")
client_state_definition_marker = """static void LivingWarXL_Get_Client_Window(int& map_cell_x,
                                          int& map_cell_y,
                                          int& map_cell_width,
                                          int& map_cell_height)
{"""
if client_state_definition_marker not in s:
    anchor = "void DLLExportClass::Calculate_Placement_Distances"
    if anchor not in s:
        raise SystemExit("Could not find placement-distance anchor for XL client-state helper definitions.")

    defs = r"""#ifdef LIVING_WAR_XL
static bool LivingWarXLClientTerrainSent[MAP_CELL_TOTAL] = {false};

static void LivingWarXL_Reset_Client_Terrain_Stream()
{
    memset(LivingWarXLClientTerrainSent, 0, sizeof(LivingWarXLClientTerrainSent));
}

static void LivingWarXL_Get_Client_Window(int& map_cell_x,
                                          int& map_cell_y,
                                          int& map_cell_width,
                                          int& map_cell_height)
{
    const int world_left = max(0, Map.MapCellX - 1);
    const int world_top = max(0, Map.MapCellY - 1);
    const int world_right = min(MAP_CELL_W, Map.MapCellX + Map.MapCellWidth + 1);
    const int world_bottom = min(MAP_CELL_H, Map.MapCellY + Map.MapCellHeight + 1);

    const int client_width = min(MAP_MAX_CELL_WIDTH, world_right - world_left);
    const int client_height = min(MAP_MAX_CELL_HEIGHT, world_bottom - world_top);

    const int view_width = max(1, Lepton_To_Cell(Map.TacLeptonWidth));
    const int view_height = max(1, Lepton_To_Cell(Map.TacLeptonHeight));
    const int camera_x = Coord_XCell(Map.TacticalCoord);
    const int camera_y = Coord_YCell(Map.TacticalCoord);
    const int center_x = camera_x + (view_width / 2);
    const int center_y = camera_y + (view_height / 2);

    const int max_left = max(world_left, world_right - client_width);
    const int max_top = max(world_top, world_bottom - client_height);

    map_cell_x = Bound(center_x - (client_width / 2), world_left, max_left);
    map_cell_y = Bound(center_y - (client_height / 2), world_top, max_top);
    map_cell_width = client_width;
    map_cell_height = client_height;
}

static void LivingWarXL_Stream_Static_Window(int map_cell_x,
                                              int map_cell_y,
                                              int map_cell_width,
                                              int map_cell_height)
{
    int sent_this_call = 0;
    const int max_per_call = 1024;

    for (int y = 0; y < map_cell_height && sent_this_call < max_per_call; ++y) {
        for (int x = 0; x < map_cell_width && sent_this_call < max_per_call; ++x) {
            const int world_x = map_cell_x + x;
            const int world_y = map_cell_y + y;
            CELL cell = XY_Cell(world_x, world_y);
            if (cell < 0 || cell >= MAP_CELL_TOTAL || LivingWarXLClientTerrainSent[cell]) {
                continue;
            }

            CellClass* cellptr = &Map[cell];
            char cell_name[_MAX_PATH];
            char icon_number[32];
            cell_name[0] = 0;
            int icon = 0;
            void* image_data = 0;

            if (cellptr->Get_Template_Info(cell_name, icon, image_data)) {
                itoa(icon, icon_number, 10);
                strncat(cell_name, "_i", 32);
                strncat(cell_name, icon_number, 32);
                strncat(cell_name, ".tga", 32);
                On_Update_Map_Cell(world_x, world_y, cell_name);
            }

            LivingWarXLClientTerrainSent[cell] = true;
            ++sent_this_call;
        }
    }
}
#endif

"""
    s = s.replace(anchor, defs + anchor, 1)
    p.write_text(s, encoding="utf-8")
    print("patched: deterministic XL client-state helper definitions")
else:
    print("already patched: deterministic XL client-state helper definitions")


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


# The Remastered ABI has one genuinely fixed 128x128 static-cell array, but
# earlier XL builds clamped every per-cell state export to the first 128x128
# cells. That made far terrain look "unrevealed" and caused client state to
# vanish at the old boundary. Keep the internal placement-distance map full
# size, while all client-sized state snapshots follow a 128x128 window centered
# on the live tactical camera.
p = root / "redalert/dllinterface.cpp"
s = p.read_text(encoding="utf-8")
viewport_marker = "viewport-aware Remastered client state window"
if viewport_marker not in s:
    clamp = """#ifdef LIVING_WAR_XL
    map_cell_width = min(map_cell_width, MAP_MAX_CELL_WIDTH);
    map_cell_height = min(map_cell_height, MAP_MAX_CELL_HEIGHT);
#endif"""

    calc_start = s.index("void DLLExportClass::Calculate_Placement_Distances")
    calc_end = s.index("void Recalculate_Placement_Distances", calc_start)
    calc_segment = s[calc_start:calc_end]
    if clamp not in calc_segment:
        raise SystemExit("Expected XL clamp inside Calculate_Placement_Distances.")
    calc_segment = calc_segment.replace(clamp, "", 1)
    s = s[:calc_start] + calc_segment + s[calc_end:]

    window = """#ifdef LIVING_WAR_XL
    // viewport-aware Remastered client state window
    LivingWarXL_Get_Client_Window(map_cell_x, map_cell_y, map_cell_width, map_cell_height);
#endif"""
    remaining = s.count(clamp)
    if remaining != 5:
        raise SystemExit(f"Expected five client state clamps after placement-distance repair; found {remaining}.")
    s = s.replace(clamp, window)

    p.write_text(s, encoding="utf-8")
    print("patched: viewport-aware Remastered client state window")
else:
    print("already patched: viewport-aware Remastered client state window")

p = root / "redalert/dllinterface.cpp"
s = p.read_text(encoding="utf-8")
# Do not clamp OriginalMapCellWidth/Height. Those fields are plain ints and
# are the only chance the Remastered client has to learn the true XL world
# extents after launch. The actual exported StaticCells payload remains clamped
# to the fixed 128x128 ABI window below, so this does not overflow the struct.
print("preserved: real XL OriginalMap dimensions for runtime scrolling")

# Remastered's front-end validates custom maps before it starts the game DLL.
# XL maps therefore advertise a normal 126x126 [Map] rectangle to the menu and
# carry their real dimensions in [LivingWarXL]. Once the custom instance starts,
# the XL DLL swaps in the real rectangle before the map is initialized.
p = root / "redalert/display.cpp"
s = p.read_text(encoding="utf-8")
xl_dim_marker = 'static char const* const XLNAME = "LivingWarXL";'
if xl_dim_marker not in s:
    anchor = '    int h = ini.Get_Int(name, "Height", MAP_CELL_H - 2);'
    if anchor not in s:
        raise SystemExit("Could not find DisplayClass::Read_INI map dimension block.")
    replacement = anchor + """

#ifdef LIVING_WAR_XL
    // Living War XL frontend-safe dual-dimension map bridge.
    // The Remastered menu sees the normal [Map] rectangle. The simulation DLL
    // consumes the XL rectangle only after the custom instance has started.
    static char const* const XLNAME = "LivingWarXL";
    if (ini.Get_Bool(XLNAME, "Enabled", false)) {
        x = ini.Get_Int(XLNAME, "X", x);
        y = ini.Get_Int(XLNAME, "Y", y);
        w = ini.Get_Int(XLNAME, "Width", w);
        h = ini.Get_Int(XLNAME, "Height", h);

        x = Bound(x, 0, MAP_CELL_W - 1);
        y = Bound(y, 0, MAP_CELL_H - 1);
        w = Bound(w, 1, MAP_CELL_W - x);
        h = Bound(h, 1, MAP_CELL_H - y);
    }
#endif"""
    s = s.replace(anchor, replacement, 1)
    p.write_text(s, encoding="utf-8")
    print("patched: frontend-safe dual-dimension map bridge")
else:
    print("already patched: frontend-safe dual-dimension map bridge")



p = root / "redalert/dllinterface.cpp"
s = p.read_text(encoding="utf-8")
stream_marker = "XL streamed static terrain window"
if stream_marker not in s:
    fn = s.index("bool DLLExportClass::Get_Dynamic_Map_State")
    loop = s.index("    int cell_index = 0;", fn)
    inject = """#ifdef LIVING_WAR_XL
    // XL streamed static terrain window.
    // StaticCells[] is fixed at 128x128, so feed newly visited XL cells through
    // the existing Remastered UPDATE_MAP_CELL callback instead of pretending
    // the fixed ABI array is 256x256.
    LivingWarXL_Stream_Static_Window(map_cell_x, map_cell_y, map_cell_width, map_cell_height);
#endif

"""
    s = s[:loop] + inject + s[loop:]
    p.write_text(s, encoding="utf-8")
    print("patched: XL streamed static terrain window")
else:
    print("already patched: XL streamed static terrain window")

# Optional XL debug reveal. This is deliberately map-controlled so production
# maps keep normal shroud while proof/debug maps can expose the whole internal
# battlefield from frame one.
p = root / "redalert/display.cpp"
s = p.read_text(encoding="utf-8")
debug_marker = "Living War XL debug reveal option"
if debug_marker not in s:
    old = """        h = Bound(h, 1, MAP_CELL_H - y);
    }
#endif"""
    new = """        h = Bound(h, 1, MAP_CELL_H - y);

        // Living War XL debug reveal option.
        Debug_Unshroud = ini.Get_Bool("LivingWarXLDebug", "RevealAll", false);
    }
#endif"""
    if old not in s:
        raise SystemExit("Could not find XL dimension bridge tail for debug reveal option.")
    s = s.replace(old, new, 1)
    p.write_text(s, encoding="utf-8")
    print("patched: Living War XL debug reveal option")
else:
    print("already patched: Living War XL debug reveal option")

# The menu-facing [Waypoints] list also remains in the legacy 128x128 address
# range. XL simulation waypoints live in [LivingWarXLWaypoints] and are swapped
# in by the DLL after map allocation is based on the real XL dimensions.
p = root / "redalert/display.cpp"
s = p.read_text(encoding="utf-8")
xl_waypoint_marker = 'static char const* const XLWAYPOINTS = "LivingWarXLWaypoints";'
if xl_waypoint_marker not in s:
    marker_text = "Set the starting position (do this after Init(), which clears the cells'"
    marker_pos = s.find(marker_text)
    if marker_pos < 0:
        raise SystemExit("Could not find DisplayClass::Read_INI starting-position block.")
    comment_start = s.rfind("    /*", 0, marker_pos)
    if comment_start < 0:
        raise SystemExit("Could not find waypoint insertion point.")
    waypoint_override = """#ifdef LIVING_WAR_XL
    if (ini.Get_Bool("LivingWarXL", "Enabled", false)) {
        static char const* const XLWAYPOINTS = "LivingWarXLWaypoints";
        for (int i = 0; i < WAYPT_COUNT; i++) {
            char xlbuf[20];
            sprintf(xlbuf, "%d", i);
            int xl_waypoint = ini.Get_Int(XLWAYPOINTS, xlbuf, -1);
            if (xl_waypoint != -1) {
                Scen.Waypoint[i] = (CELL)xl_waypoint;
                (*this)[Scen.Waypoint[i]].IsWaypoint = 1;
            }
        }
    }
#endif

"""
    s = s[:comment_start] + waypoint_override + s[comment_start:]
    p.write_text(s, encoding="utf-8")
    print("patched: XL waypoint bridge")
else:
    print("already patched: XL waypoint bridge")



# Vanilla DisplayClass::In_View rejects any cell with bits 14/15 set because
# 128x128 cells fit in 14 bits. On a 256x256 CELL layout those bits are valid Y
# coordinate bits, so the old test can turn large parts of the XL world into a
# permanent invisible void.
p = root / "redalert/display.cpp"
s = p.read_text(encoding="utf-8")
xl_view_marker = "XL-safe DisplayClass::In_View cell guard"
if xl_view_marker not in s:
    old = """bool DisplayClass::In_View(register CELL cell) const
{
    if (cell & 0xC000)
        return (false);"""
    new = """bool DisplayClass::In_View(register CELL cell) const
{
#ifdef LIVING_WAR_XL
    // XL-safe DisplayClass::In_View cell guard.
    // Bits 14/15 are valid Y-coordinate bits on the 8+8 CELL layout.
    if (cell < 0 || Cell_X(cell) >= MAP_CELL_W || Cell_Y(cell) >= MAP_CELL_H)
        return (false);
#else
    if (cell & 0xC000)
        return (false);
#endif"""
    if old not in s:
        raise SystemExit("Could not find DisplayClass::In_View legacy 14-bit guard.")
    s = s.replace(old, new, 1)
    p.write_text(s, encoding="utf-8")
    print("patched: XL-safe DisplayClass::In_View cell guard")
else:
    print("already patched: XL-safe DisplayClass::In_View cell guard")


p = root / "redalert/dllinterface.cpp"
s = p.read_text(encoding="utf-8")
action_marker = "XL fixed ActionWithSelected window"
if action_marker not in s:
    old = """        const int left = Map.MapCellX;
        const int right = Map.MapCellX + Map.MapCellWidth - 1;
        const int top = Map.MapCellY;
        const int bottom = Map.MapCellY + Map.MapCellHeight - 1;"""
    new = """#ifdef LIVING_WAR_XL
        // XL fixed ActionWithSelected window.
        // CNCPlayerInfoStruct has a hard 128x128 ActionWithSelected array.
        // Never write 254x254 entries into that legacy ABI buffer.
        int left = Map.MapCellX;
        int top = Map.MapCellY;
        int action_width = Map.MapCellWidth;
        int action_height = Map.MapCellHeight;
        LivingWarXL_Get_Client_Window(left, top, action_width, action_height);
        const int right = left + action_width - 1;
        const int bottom = top + action_height - 1;
#else
        const int left = Map.MapCellX;
        const int right = Map.MapCellX + Map.MapCellWidth - 1;
        const int top = Map.MapCellY;
        const int bottom = Map.MapCellY + Map.MapCellHeight - 1;
#endif"""
    if old not in s:
        raise SystemExit("Could not find player action-map bounds.")
    s = s.replace(old, new, 1)

    old2 = """        player_info->ActionWithSelectedCount = Map.MapCellWidth * Map.MapCellHeight;"""
    new2 = """#ifdef LIVING_WAR_XL
        player_info->ActionWithSelectedCount = action_width * action_height;

        if (Debug_Unshroud && CurrentObject.Count() > 0) {
            static int xl_last_reported_zone = -1;
            CELL selected_cell = Coord_Cell(CurrentObject[0]->Center_Coord());
            int selected_x = Cell_X(selected_cell);
            int selected_y = Cell_Y(selected_cell);
            int zone = (selected_x >= MAP_MAX_CELL_WIDTH ? 1 : 0)
                       | (selected_y >= MAP_MAX_CELL_HEIGHT ? 2 : 0);

            if (zone != xl_last_reported_zone) {
                char xl_diag[224];
                sprintf(xl_diag,
                        "XL DEBUG | unit %d,%d | camera %d,%d | client window %d,%d %dx%d",
                        selected_x,
                        selected_y,
                        Coord_XCell(Map.TacticalCoord),
                        Coord_YCell(Map.TacticalCoord),
                        left,
                        top,
                        action_width,
                        action_height);
                DLLExportClass::On_Message(PlayerPtr, xl_diag, 12.0f, MESSAGE_TYPE_DIRECT, -1);
                xl_last_reported_zone = zone;
            }
        }
#else
        player_info->ActionWithSelectedCount = Map.MapCellWidth * Map.MapCellHeight;
#endif"""
    if old2 not in s:
        raise SystemExit("Could not find ActionWithSelectedCount assignment.")
    s = s.replace(old2, new2, 1)

    p.write_text(s, encoding="utf-8")
    print("patched: XL fixed ActionWithSelected window + telemetry")
else:
    print("already patched: XL fixed ActionWithSelected window")

# Full XL payload sections are hidden from the Remastered frontend parser.
# The menu receives a completely vanilla-safe shell in [MapPack], [OverlayPack]
# and [TERRAIN]. Once the XL DLL starts the custom instance it reads the real
# 256-grid payload from Living War-only sections instead.
p = root / "redalert/display.cpp"
s = p.read_text(encoding="utf-8")
xl_mappack_marker = 'static char const* const XLMAPPACK = "LivingWarXLMapPack";'
if xl_mappack_marker not in s:
    old = '''    static char const* const MAPPACK = "MapPack";
    len = ini.Get_UUBlock(MAPPACK, _staging_buffer, sizeof(_staging_buffer));
    BufferStraw bstraw(_staging_buffer, len);
    Map.Read_Binary(bstraw);'''
    new = '''    static char const* const MAPPACK = "MapPack";
#ifdef LIVING_WAR_XL
    static char const* const XLMAPPACK = "LivingWarXLMapPack";
    char const* map_pack_name = ini.Get_Bool("LivingWarXL", "Enabled", false) ? XLMAPPACK : MAPPACK;
#else
    char const* map_pack_name = MAPPACK;
#endif
    len = ini.Get_UUBlock(map_pack_name, _staging_buffer, sizeof(_staging_buffer));
    BufferStraw bstraw(_staging_buffer, len);
    Map.Read_Binary(bstraw);'''
    if old not in s:
        raise SystemExit("Could not find DisplayClass MapPack read block.")
    s = s.replace(old, new, 1)
    p.write_text(s, encoding="utf-8")
    print("patched: hidden XL MapPack payload bridge")
else:
    print("already patched: hidden XL MapPack payload bridge")

p = root / "redalert/overlay.cpp"
s = p.read_text(encoding="utf-8")
xl_overlay_marker = 'static char const* const XLOVERLAYPACK = "LivingWarXLOverlayPack";'
if xl_overlay_marker not in s:
    old = '        int len = ini.Get_UUBlock("OverlayPack", _staging_buffer, sizeof(_staging_buffer));'
    new = '''#ifdef LIVING_WAR_XL
        static char const* const XLOVERLAYPACK = "LivingWarXLOverlayPack";
        char const* overlay_pack_name =
            ini.Get_Bool("LivingWarXL", "Enabled", false) ? XLOVERLAYPACK : "OverlayPack";
        int len = ini.Get_UUBlock(overlay_pack_name, _staging_buffer, sizeof(_staging_buffer));
#else
        int len = ini.Get_UUBlock("OverlayPack", _staging_buffer, sizeof(_staging_buffer));
#endif'''
    if old not in s:
        raise SystemExit("Could not find OverlayPack read block.")
    s = s.replace(old, new, 1)
    p.write_text(s, encoding="utf-8")
    print("patched: hidden XL OverlayPack payload bridge")
else:
    print("already patched: hidden XL OverlayPack payload bridge")

p = root / "redalert/terrain.cpp"
s = p.read_text(encoding="utf-8")
xl_terrain_marker = 'static char const* const XLTERRAIN = "LivingWarXLTerrain";'
if xl_terrain_marker not in s:
    old = '''    int len = ini.Entry_Count(INI_Name());

    for (int index = 0; index < len; index++) {
        char const* entry = ini.Get_Entry(INI_Name(), index);
        TerrainType terrain = ini.Get_TerrainType(INI_Name(), entry, TERRAIN_NONE);
        CELL cell = atoi(entry);'''
    new = '''#ifdef LIVING_WAR_XL
    static char const* const XLTERRAIN = "LivingWarXLTerrain";
    char const* terrain_ini_name =
        ini.Get_Bool("LivingWarXL", "Enabled", false) ? XLTERRAIN : INI_Name();
#else
    char const* terrain_ini_name = INI_Name();
#endif
    int len = ini.Entry_Count(terrain_ini_name);

    for (int index = 0; index < len; index++) {
        char const* entry = ini.Get_Entry(terrain_ini_name, index);
        TerrainType terrain = ini.Get_TerrainType(terrain_ini_name, entry, TERRAIN_NONE);
        CELL cell = atoi(entry);'''
    if old not in s:
        raise SystemExit("Could not find TerrainClass Read_INI block.")
    s = s.replace(old, new, 1)
    p.write_text(s, encoding="utf-8")
    print("patched: hidden XL terrain payload bridge")
else:
    print("already patched: hidden XL terrain payload bridge")




# After Start_Scenario creates the multiplayer houses and starting units, force
# the local XL player context to a real start cell, reveal the first sight
# radius, center the tactical camera there, and emit a visible runtime proof.
# This runs inside Calculate_Start_Positions so both Remastered start paths get
# the same behavior.
p = root / "redalert/dllinterface.cpp"
s = p.read_text(encoding="utf-8")
xl_runtime_marker = "Living War XL runtime visibility bootstrap"
if xl_runtime_marker not in s:
    old = """    Map.TacticalCoord = old_tac;
    ScenarioInit--;

    PlayerPtr = player_ptr;
}"""
    new = """    Map.TacticalCoord = old_tac;
    ScenarioInit--;

    PlayerPtr = player_ptr;

#ifdef LIVING_WAR_XL
    // Living War XL runtime visibility bootstrap.
    // The frontend only knows the vanilla-safe shell; once the real scenario
    // exists we prove and initialize the actual XL simulation here.
    if (Map.MapCellWidth > MAP_MAX_CELL_WIDTH || Map.MapCellHeight > MAP_MAX_CELL_HEIGHT) {
        HouseClass* xl_local_player = NULL;
        if (Session.Players.Count() > 0) {
            xl_local_player = HouseClass::As_Pointer(Session.Players[0]->Player.ID);
        }

        if (xl_local_player != NULL) {
            PlayerPtr = xl_local_player;
            CurrentLocalPlayerIndex = 0;
            CurrentObject.Set_Active_Context(PlayerPtr->Class->House);
            Refresh_Player_Control_Flags();

            CELL xl_start = MultiplayerStartPositions[0];
            if (!Map.In_Radar(xl_start)) {
                int wp = PlayerPtr->StartLocationOverride;
                if (wp < 0 || wp >= WAYPT_COUNT || Scen.Waypoint[wp] == -1) {
                    wp = 0;
                }
                xl_start = Scen.Waypoint[wp];
                MultiplayerStartPositions[0] = xl_start;
            }

            if (Map.In_Radar(xl_start)) {
                Map.Sight_From(xl_start, 10, PlayerPtr, false);
                COORDINATE xl_pos = Cell_Coord(xl_start);
                Map.Set_Tactical_Position(xl_pos);
                Map.Center_Map(xl_pos);
                Map.Flag_To_Redraw(true);

                char xl_message[192];
                sprintf(xl_message,
                        "LIVING WAR XL ACTIVE | runtime %dx%d | grid %dx%d | start %d,%d",
                        Map.MapCellWidth,
                        Map.MapCellHeight,
                        MAP_CELL_W,
                        MAP_CELL_H,
                        Cell_X(xl_start),
                        Cell_Y(xl_start));
                DLLExportClass::On_Message(PlayerPtr, xl_message, 15.0f, MESSAGE_TYPE_DIRECT, 0x4C57584C);
            }
        }
    }
#endif
}"""
    if old not in s:
        raise SystemExit("Could not find Calculate_Start_Positions tail.")
    s = s.replace(old, new, 1)
    p.write_text(s, encoding="utf-8")
    print("patched: Living War XL runtime visibility bootstrap")
else:
    print("already patched: Living War XL runtime visibility bootstrap")



p = root / "redalert/dllinterface.cpp"
s = p.read_text(encoding="utf-8")
debug_runtime_marker = "XL debug full-map reveal bootstrap"
if debug_runtime_marker not in s:
    old = """            if (Map.In_Radar(xl_start)) {
                Map.Sight_From(xl_start, 10, PlayerPtr, false);"""
    new = """            if (Map.In_Radar(xl_start)) {
                LivingWarXL_Reset_Client_Terrain_Stream();

                // XL debug full-map reveal bootstrap.
                if (Debug_Unshroud) {
                    for (int yy = Map.MapCellY; yy < Map.MapCellY + Map.MapCellHeight; ++yy) {
                        for (int xx = Map.MapCellX; xx < Map.MapCellX + Map.MapCellWidth; ++xx) {
                            Map.Map_Cell(XY_Cell(xx, yy), PlayerPtr, true, true);
                        }
                    }
                } else {
                    Map.Sight_From(xl_start, 10, PlayerPtr, false);
                }"""
    if old not in s:
        raise SystemExit("Could not find XL runtime sight bootstrap.")
    s = s.replace(old, new, 1)

    old2 = """            shroud_entry.IsVisible = cellptr->Is_Visible(PlayerPtr);
            shroud_entry.IsMapped = cellptr->Is_Mapped(PlayerPtr);
            shroud_entry.IsJamming = cellptr->Is_Jamming(PlayerPtr);"""
    new2 = """#ifdef LIVING_WAR_XL
            if (Debug_Unshroud) {
                shroud_entry.IsVisible = true;
                shroud_entry.IsMapped = true;
                shroud_entry.IsJamming = false;
            } else
#endif
            {
                shroud_entry.IsVisible = cellptr->Is_Visible(PlayerPtr);
                shroud_entry.IsMapped = cellptr->Is_Mapped(PlayerPtr);
                shroud_entry.IsJamming = cellptr->Is_Jamming(PlayerPtr);
            }"""
    if old2 not in s:
        raise SystemExit("Could not find shroud-state export block.")
    s = s.replace(old2, new2, 1)

    p.write_text(s, encoding="utf-8")
    print("patched: XL debug full-map reveal bootstrap")
else:
    print("already patched: XL debug full-map reveal bootstrap")


patch_once(
    "redalert/CMakeLists.txt",
    r"target_compile_definitions\(RedAlert\s+PUBLIC\s+\$<\$<CONFIG:Debug>:_DEBUG>\s+\$\{REMASTER_DEFS\}\)",
    "target_compile_definitions(RedAlert PUBLIC $<$<CONFIG:Debug>:_DEBUG> ${REMASTER_DEFS} LIVING_WAR_XL)",
    "LIVING_WAR_XL compile definition",
)



p = root / "redalert/display.cpp"
s = p.read_text(encoding="utf-8")
camera_marker = "XL Remastered tactical camera tracks the real world coordinate"
if camera_marker not in s:
    old = """#ifdef REMASTER_BUILD
    int xx = 0; // (int)Coord_X(coord) - (int)Cell_To_Lepton(MapCellX);
    int yy = 0; // (int)Coord_Y(coord) - (int)Cell_To_Lepton(MapCellY);"""
    new = """#ifdef REMASTER_BUILD
#ifdef LIVING_WAR_XL
    // XL Remastered tactical camera tracks the real world coordinate.
    // Vanilla Remastered pins the DLL-side camera at 0,0 because every stock
    // map fits inside the legacy client window. XL needs the DLL-side view to
    // follow the same world region so object pixels and state windows do not
    // disappear when crossing X/Y 127.
    int xx = (int)Coord_X(coord) - (int)Cell_To_Lepton(MapCellX);
    int yy = (int)Coord_Y(coord) - (int)Cell_To_Lepton(MapCellY);
#else
    int xx = 0; // (int)Coord_X(coord) - (int)Cell_To_Lepton(MapCellX);
    int yy = 0; // (int)Coord_Y(coord) - (int)Cell_To_Lepton(MapCellY);
#endif"""
    if old not in s:
        raise SystemExit("Could not find Remastered Set_Tactical_Position pin.")
    s = s.replace(old, new, 1)
    p.write_text(s, encoding="utf-8")
    print("patched: XL Remastered tactical camera tracking")
else:
    print("already patched: XL Remastered tactical camera tracking")

# Several footprint/refresh lists are deliberately arrays of signed 16-bit
# relative offsets. They were typed as CELL pointers only because vanilla CELL
# was also a short. Keep the offsets short when XL CELL becomes 32-bit.
for rel, old, new, label in [
    ("redalert/building.cpp", "    CELL const* offset;\n", "    short const* offset;\n", "building occupy offset pointer"),
    ("redalert/building.cpp", "    CELL const* ptr;\n    CELL origin = Coord_Cell(Coord);", "    short const* ptr;\n    CELL origin = Coord_Cell(Coord);", "building exit offset pointer"),
    ("redalert/display.cpp", "    CELL const* ptr;\n    CellClass* cellptr;", "    short const* ptr;\n    CellClass* cellptr;", "display refresh offset pointer"),
]:
    p = root / rel
    s = p.read_text(encoding="utf-8")
    if new not in s:
        if old not in s:
            raise SystemExit(f"Could not patch {label} in {rel}")
        s = s.replace(old, new, 1)
        p.write_text(s, encoding="utf-8")
        print("patched:", label)

# MAX(0, CELL-long-expression) becomes type-ambiguous under MSVC. The loop
# variables are ints and coordinate components are 0..255, so cast explicitly.
p = root / "redalert/vortex.cpp"
s = p.read_text(encoding="utf-8")
changed = False
for old_expr, new_expr in [
    ("MAX(0, yc - 1)", "MAX(0, (int)yc - 1)"),
    ("MAX(0, xc - 1)", "MAX(0, (int)xc - 1)"),
]:
    if new_expr not in s:
        if old_expr not in s:
            raise SystemExit("Could not patch Chronal Vortex MAX type ambiguity: " + old_expr)
        s = s.replace(old_expr, new_expr, 1)
        changed = True
if changed:
    p.write_text(s, encoding="utf-8")
    print("patched: Chronal Vortex coordinate MAX casts")


# XL Core 0.9 renderer-ABI probe and absolute-world bridge.
#
# Hardware testing of 0.8 showed that the 256x256 simulation is alive, but the
# Remastered/GlyphX presentation side still behaves like a 128x128 client:
# static ground tiles arrive only partially and objects can disappear near the
# old boundary. The Remastered DLL interface itself confirms why: StaticCells
# and ActionWithSelected are hard 128x128 arrays. The other state calls are
# variable-sized, and Remastered input coordinates are already world-space
# pixels. Therefore do NOT move the DLL-side tactical camera as 0.8 did.
#
# This pass restores vanilla Remastered absolute-world pixel semantics, forces
# layer export to ignore the internal view clip, streams the entire 256x256
# static terrain through UPDATE_MAP_CELL callbacks over successive state polls,
# and writes a compact protocol log so the next hardware run tells us exactly
# what buffer sizes/state requests the closed client is making.
p = root / "redalert/display.cpp"
src = p.read_text(encoding="utf-8")
camera_patched = """#ifdef REMASTER_BUILD
#ifdef LIVING_WAR_XL
    // XL Remastered tactical camera tracks the real world coordinate.
    // Vanilla Remastered pins the DLL-side camera at 0,0 because every stock
    // map fits inside the legacy client window. XL needs the DLL-side view to
    // follow the same world region so object pixels and state windows do not
    // disappear when crossing X/Y 127.
    int xx = (int)Coord_X(coord) - (int)Cell_To_Lepton(MapCellX);
    int yy = (int)Coord_Y(coord) - (int)Cell_To_Lepton(MapCellY);
#else
    int xx = 0; // (int)Coord_X(coord) - (int)Cell_To_Lepton(MapCellX);
    int yy = 0; // (int)Coord_Y(coord) - (int)Cell_To_Lepton(MapCellY);
#endif"""
camera_stock = """#ifdef REMASTER_BUILD
    // Living War XL 0.9: preserve Remastered absolute-world pixel semantics.
    // The closed GlyphX client already supplies world-space coordinates.
    int xx = 0; // (int)Coord_X(coord) - (int)Cell_To_Lepton(MapCellX);
    int yy = 0; // (int)Coord_Y(coord) - (int)Cell_To_Lepton(MapCellY);"""
if camera_patched in src:
    src = src.replace(camera_patched, camera_stock, 1)
elif "Living War XL 0.9: preserve Remastered absolute-world pixel semantics." not in src:
    raise SystemExit("Could not restore Remastered absolute-world camera semantics.")
p.write_text(src, encoding="utf-8")
print("patched: XL 0.9 absolute-world Remastered camera semantics")

p = root / "redalert/dllinterface.cpp"
src = p.read_text(encoding="utf-8")

# The 0.8 sliding window had no way to communicate its changing origin through
# shroud/occupier/placement state structures. Restore the fixed first-128 ABI
# clamp for those state snapshots. Keep Calculate_Placement_Distances full-size.
window = """#ifdef LIVING_WAR_XL
    // viewport-aware Remastered client state window
    LivingWarXL_Get_Client_Window(map_cell_x, map_cell_y, map_cell_width, map_cell_height);
#endif"""
clamp = """#ifdef LIVING_WAR_XL
    // XL 0.9: fixed legacy client ABI payload. Far-world presentation is
    // supplied through absolute object pixels and UPDATE_MAP_CELL streaming.
    map_cell_width = min(map_cell_width, MAP_MAX_CELL_WIDTH);
    map_cell_height = min(map_cell_height, MAP_MAX_CELL_HEIGHT);
#endif"""
window_count = src.count(window)
if window_count:
    src = src.replace(window, clamp)
    print("patched: restored fixed client state clamp in", window_count, "state paths")
elif "XL 0.9: fixed legacy client ABI payload." not in src:
    raise SystemExit("Could not find 0.8 viewport state windows.")

# Stream the whole internal map, not only the current legacy-sized window.
old_stream_call = "LivingWarXL_Stream_Static_Window(map_cell_x, map_cell_y, map_cell_width, map_cell_height);"
new_stream_call = "LivingWarXL_Stream_Static_Window(0, 0, MAP_CELL_W, MAP_CELL_H);"
if old_stream_call in src:
    src = src.replace(old_stream_call, new_stream_call, 1)
elif new_stream_call not in src:
    raise SystemExit("Could not find XL static terrain stream call.")

# Track streamed terrain progress.
if "LivingWarXLClientTerrainSentCount" not in src:
    src = src.replace(
        "static bool LivingWarXLClientTerrainSent[MAP_CELL_TOTAL] = {false};",
        """static bool LivingWarXLClientTerrainSent[MAP_CELL_TOTAL] = {false};
static int LivingWarXLClientTerrainSentCount = 0;""",
        1)
    src = src.replace(
        "memset(LivingWarXLClientTerrainSent, 0, sizeof(LivingWarXLClientTerrainSent));",
        """memset(LivingWarXLClientTerrainSent, 0, sizeof(LivingWarXLClientTerrainSent));
    LivingWarXLClientTerrainSentCount = 0;""",
        1)
    src = src.replace(
        """            LivingWarXLClientTerrainSent[cell] = true;
            ++sent_this_call;""",
        """            LivingWarXLClientTerrainSent[cell] = true;
            ++LivingWarXLClientTerrainSentCount;
            ++sent_this_call;

            if ((LivingWarXLClientTerrainSentCount % 8192) == 0) {
                char xl_stream_msg[128];
                sprintf(xl_stream_msg,
                        "XL DEBUG | terrain stream %d/%d",
                        LivingWarXLClientTerrainSentCount,
                        MAP_CELL_TOTAL);
                On_Message(xl_stream_msg, 6.0f, -1);
            }""",
        1)

# Export every active layer object using absolute world pixels. The Remastered
# client does its own camera transform, so clipping these in the DLL is wrong.
layer_sig = """bool DLLExportClass::Get_Layer_State(uint64 player_id, unsigned char* buffer_in, unsigned int buffer_size)
{
    player_id;"""
layer_new = """bool DLLExportClass::Get_Layer_State(uint64 player_id, unsigned char* buffer_in, unsigned int buffer_size)
{
    player_id;

#ifdef LIVING_WAR_XL
    // XL 0.9 absolute-world layer export.
    DLLExportClass::Adjust_Internal_View(true);
#endif"""
if layer_sig in src:
    src = src.replace(layer_sig, layer_new, 1)
elif "XL 0.9 absolute-world layer export." not in src:
    raise SystemExit("Could not find Get_Layer_State prologue.")

# Always allow far-world Remastered input conversion. With the DLL tactical
# origin pinned at 0, Pixel_To_Coord converts the client's world pixel directly
# into the 256-grid simulation coordinate.
input_sig = """    if (!DLLExportClass::Set_Player_Context(player_id)) {
        return;
    }

    switch (input_event) {"""
input_new = """    if (!DLLExportClass::Set_Player_Context(player_id)) {
        return;
    }

#ifdef LIVING_WAR_XL
    DLLExportClass::Adjust_Internal_View(true);
#endif

    switch (input_event) {"""
# Limit this replacement to CNC_Handle_Input by locating its function first.
input_fn = src.index('extern "C" __declspec(dllexport) void __cdecl CNC_Handle_Input')
input_switch = src.index(input_sig, input_fn)
src = src[:input_switch] + src[input_switch:].replace(input_sig, input_new, 1)

p.write_text(src, encoding="utf-8")
print("patched: XL 0.9 absolute object/input bridge and whole-map terrain stream")

# Add compact file logging for the closed Remastered/GlyphX client protocol.
p = root / "redalert/dllinterface.cpp"
src = p.read_text(encoding="utf-8")
if "LivingWarXL-debug.log" not in src:
    if "#include <chrono>" not in src:
        raise SystemExit("Could not find include anchor for XL protocol logger.")
    src = src.replace(
        "#include <chrono>",
        """#include <chrono>
#include <stdio.h>
#include <stdarg.h>""",
        1)

    macro_anchor = "#define KILL_PLAYER_ON_DISCONNECT 1"
    logger = r'''
#ifdef LIVING_WAR_XL
static void LivingWarXL_Log(const char* format, ...)
{
    static FILE* xl_log = NULL;
    if (xl_log == NULL) {
        xl_log = fopen("LivingWarXL-debug.log", "a");
        if (xl_log == NULL) {
            return;
        }
        fprintf(xl_log, "\n=== Living War XL Core 0.9 renderer ABI probe ===\n");
    }

    va_list args;
    va_start(args, format);
    vfprintf(xl_log, format, args);
    va_end(args);
    fprintf(xl_log, "\n");
    fflush(xl_log);
}
#endif
'''
    if macro_anchor not in src:
        raise SystemExit("Could not find macro anchor for XL logger.")
    src = src.replace(macro_anchor, macro_anchor + logger, 1)

    # Record state request buffer sizes. This is the critical information for
    # deciding whether variable-length shroud/occupier/dynamic states can safely
    # be enlarged or whether a true client-side hook is required.
    get_state_sig = """extern "C" __declspec(dllexport) bool __cdecl CNC_Get_Game_State(GameStateRequestEnum state_type,
                                                                 uint64 player_id,
                                                                 unsigned char* buffer_in,
                                                                 unsigned int buffer_size)
{
    bool got_state = false;"""
    get_state_new = get_state_sig + r'''

#ifdef LIVING_WAR_XL
    static unsigned int xl_state_calls[16] = {0U};
    static unsigned int xl_last_state_buffer[16] = {0U};
    int xl_state_index = (int)state_type;
    if (xl_state_index >= 0 && xl_state_index < 16) {
        ++xl_state_calls[xl_state_index];
        if (xl_state_calls[xl_state_index] == 1U
            || xl_last_state_buffer[xl_state_index] != buffer_size
            || (xl_state_calls[xl_state_index] % 300U) == 0U) {
            LivingWarXL_Log("STATE req=%d call=%u buffer=%u map=%d,%d %dx%d tac=%d,%d ignore=%d",
                            xl_state_index,
                            xl_state_calls[xl_state_index],
                            buffer_size,
                            Map.MapCellX,
                            Map.MapCellY,
                            Map.MapCellWidth,
                            Map.MapCellHeight,
                            Coord_XCell(Map.TacticalCoord),
                            Coord_YCell(Map.TacticalCoord),
                            DisplayClass::IgnoreViewConstraints ? 1 : 0);
            xl_last_state_buffer[xl_state_index] = buffer_size;
        }
    }
#endif'''
    if get_state_sig not in src:
        raise SystemExit("Could not find CNC_Get_Game_State prologue for logger.")
    src = src.replace(get_state_sig, get_state_new, 1)

    # Log unsuccessful state requests without spamming successful polls.
    gs_start = src.index('extern "C" __declspec(dllexport) bool __cdecl CNC_Get_Game_State')
    gs_end = src.index('extern "C" __declspec(dllexport) void __cdecl CNC_Handle_Game_Request', gs_start)
    gs_seg = src[gs_start:gs_end]
    ret = "    return got_state;\n}"
    ret_new = r'''#ifdef LIVING_WAR_XL
    if (!got_state) {
        LivingWarXL_Log("STATE FAIL req=%d buffer=%u map=%d,%d %dx%d",
                        (int)state_type,
                        buffer_size,
                        Map.MapCellX,
                        Map.MapCellY,
                        Map.MapCellWidth,
                        Map.MapCellHeight);
    }
#endif
    return got_state;
}'''
    if ret not in gs_seg:
        raise SystemExit("Could not find CNC_Get_Game_State return for logger.")
    gs_seg = gs_seg.replace(ret, ret_new, 1)
    src = src[:gs_start] + gs_seg + src[gs_end:]

    # Log client input whenever it crosses one of the old 128 boundaries.
    input_fn = src.index('extern "C" __declspec(dllexport) void __cdecl CNC_Handle_Input')
    switch_pos = src.index("    switch (input_event) {", input_fn)
    input_probe = r'''#ifdef LIVING_WAR_XL
    if (x1 >= 0 && y1 >= 0) {
        COORDINATE xl_input_coord = Map.Pixel_To_Coord(x1, y1);
        if (xl_input_coord) {
            CELL xl_input_cell = Coord_Cell(xl_input_coord);
            int xl_input_zone = (Cell_X(xl_input_cell) >= MAP_MAX_CELL_WIDTH ? 1 : 0)
                              | (Cell_Y(xl_input_cell) >= MAP_MAX_CELL_HEIGHT ? 2 : 0);
            static int xl_last_input_zone = -1;
            if (xl_input_zone != xl_last_input_zone) {
                LivingWarXL_Log("INPUT event=%d pixel=%d,%d cell=%d,%d zone=%d",
                                (int)input_event,
                                x1,
                                y1,
                                Cell_X(xl_input_cell),
                                Cell_Y(xl_input_cell),
                                xl_input_zone);
                xl_last_input_zone = xl_input_zone;
            }
        }
    }
#endif

'''
    src = src[:switch_pos] + input_probe + src[switch_pos:]

    p.write_text(src, encoding="utf-8")
    print("patched: XL 0.9 renderer ABI protocol log")
else:
    print("already patched: XL 0.9 renderer ABI protocol log")


print("\nLiving War XL Core patch applied.")
print("Internal map: 256x256; intended playable test rectangle: 1,1,254,254.")
print("Remastered menu stays vanilla-safe; XL 0.9 restores absolute-world client semantics, streams the full static map, and records the closed-client ABI in LivingWarXL-debug.log.")
