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


patch_once(
    "redalert/CMakeLists.txt",
    r"target_compile_definitions\(RedAlert\s+PUBLIC\s+\$<\$<CONFIG:Debug>:_DEBUG>\s+\$\{REMASTER_DEFS\}\)",
    "target_compile_definitions(RedAlert PUBLIC $<$<CONFIG:Debug>:_DEBUG> ${REMASTER_DEFS} LIVING_WAR_XL)",
    "LIVING_WAR_XL compile definition",
)


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

print("\nLiving War XL Core patch applied.")
print("Internal map: 256x256; intended playable test rectangle: 1,1,254,254.")
print("Remastered menu receives a vanilla-safe shell; XL runtime now fixes 256-cell visibility, recenters the local player, reveals the start, and reports the live dimensions.")
