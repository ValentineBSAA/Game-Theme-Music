#!/usr/bin/env python3
"""Exact-release GTM 4.4.1 -> isolated, music-first 4.4.2 preview refactor.
This script never modifies a published release or main branch. It is intended
for the checksum-verified 4.4.1 runtime imported by the prepare workflow.
"""
import json
import re
from pathlib import Path

JS=Path("dist/index.js")
PY=Path("main.py")
VERSION="4.4.2"
source=JS.read_text(encoding="utf-8")
if 'const GTM_VERSION = "4.4.2";' in source:
    print("Already refactored. No changes.")
    raise SystemExit(0)
assert 'const GTM_VERSION = "4.4.1";' in source, "Wrong baseline"

def swap(old,new,label):
    global source
    count=source.count(old)
    assert count==1,(label,"expected one match",count)
    source=source.replace(old,new,1)
    print("UPDATED",label)

def cut(first,last,replacement,label):
    global source
    assert source.count(first)==1 and source.count(last)==1,(label,"missing/duplicate anchor")
    a=source.index(first);b=source.index(last)
    assert b>a,(label,"reversed range")
    print("REMOVED",label,b-a,"characters")
    source=source[:a]+replacement+source[b:]

# Gameplay-only Quick Menu. Game Music (per-title soundtracks) is untouched.
cut("// 4.1.9: one discoverable Arcade page.","function GtmV3SettingsCenter() {",
    "// Arcade controller and gameplay configuration removed. Visual Worlds remains in Settings.\n",
    "Arcade Quick Menu, score and controller settings")
swap("    { id: 'arcade', label: 'Arcade', short: 'Arcade', icon: 'game' },\n","",
     "Arcade navigation tab")
swap("     else if (activePage === 'arcade') content = window.SP_REACT.createElement(Gtm419ArcadePage, null);\n","",
     "Arcade tab renderer")
swap("Music + Six-Game Arcade · Preview","Music & Visual Worlds · Preview",
     "music-first masthead")
swap(" · Public Beta Candidate · Six Active Arcade Games"," · Music-First Preview · Visual Worlds",
     "footer")

# Keep generic safe reactive behavior hooks for future animations. Remove the
# entire score/AI/ability/game mechanics implementation and input bridge.
cut("const GTM413_EFFECTS = Object.freeze({","function gtm413RegisterBehavior(effect, hooks){",
    "// Music-only visual hooks; interactive game abilities removed.\n",
    "unused arcade ability catalog")
cut("// Trusted arcade-game contract shared by Pong","function gtm413RunBehavior(effect,frame,layerIndex,env){",
    "", "game registration and championship state transitions")
cut("function gtm413RunBehavior(effect,frame,layerIndex,env){",
    "function gtm413PongRandom(s){",
    """function gtm413RunBehavior(effect,frame,layerIndex,env){
    const handler=GTM413_BEHAVIORS.get(effect);
    if(!handler)return false;
    const states=frame.behaviors||(frame.behaviors=Object.create(null));
    const key=effect+':'+layerIndex;
    const signature=typeof handler.signature==='function'?handler.signature(env):'';
    let record=states[key];
    if(!record||record.signature!==signature){
        if(record&&typeof handler.dispose==='function')handler.dispose(record.state);
        record={state:handler.create(env),signature,accumulator:0};
        states[key]=record;
    }
    // Bounded animation updates; never claim physical controller input.
    const delta=Number(frame.dt);
    record.accumulator=Math.min(.06,record.accumulator+
        (Number.isFinite(delta)?Math.max(0,Math.min(.045,delta)):0));
    let n=0;
    while(record.accumulator>=1/60&&n++<4){
        handler.step(record.state,1/60,env);
        record.accumulator-=1/60;
    }
    handler.draw(record.state,env);
    return true;
}
""", "replace gameplay-specific behavior scheduler with passive animation runtime")
cut("function gtm413PongRandom(s){",
    "// GTM 4.1.8 Universal Input + Arcade Session Bridge.",
    "// The existing 'neon_pong' Canvas2D effect below remains passive.\n",
    "Pong physics, AI, scores, tournament and gameplay-only option UI")
cut("// GTM 4.1.8 Universal Input + Arcade Session Bridge.",
    "const GTM418_PACK_OPTION_PREFIX=",
    "// Passive format-3 draw programs remain bounded and have no controller bridge.\n",
    "universal arcade input, multiplayer and reconnect engine")
cut("// GTM 4.2.1 Preview: trusted built-in Arcade simulation,",
    "function gtm404RegisterPacks(packs){",
    "// Built-in game engines removed; their visual themes are declarative visualizer scenes.\n",
    "Beat Catcher, Duel, Defenders, Strike, racing and Chess engines")

# The declarative format-3 program runtime stays available for non-interactive
# visualizer effects. No program can read controller state or start an Arcade game.
swap("""    if(typeof GTM421_ARCADE_IDS!=='undefined'&&GTM421_ARCADE_IDS.has(scene.id))
        return gtm421DrawArcade(ctx,canvas,scene,mode,frame,data,w,h);
""","", "remove embedded game dispatch")
a="""    const supported=Array.isArray(scene.interaction?.modes)?scene.interaction.modes:['ai_ai'];
    const controls=scene.interaction?gtm418ReadPlayers(snapshot$1,supported,'program:'+mode):null;
    env.mode=controls?.numericMode||0;env.paused=controls?.paused?1:0;
    env.player1_side=controls?.side==='right'?1:0;
    env.disconnect_countdown=controls?.countdown||0;
    for(const [number,side] of [[1,controls?.side==='right'?'right':'left'],[2,controls?.side==='right'?'left':'right']]){
        const sample=controls?.[side]||GTM418_ZERO();
        for(const prop of ['x','y','lb','rb','lt','rt','xbtn','ybtn'])env['p'+number+prop]=sample[prop]||0;
        env['p'+number+'a']=gtm418ConsumeMenuAction(number,'program:'+mode);
        env['human'+number]=sample.human||0;env['connected'+number]=sample.connected||0;
    }
"""
swap(a,"    env.mode=0;env.paused=0; // All imported programs are non-interactive visuals.\n",
     "disable controller inputs in visual program runtime")
swap("        const steps=controls?.paused?0:Math.max(1,Math.min(5,Math.ceil(realDt/.05)));",
     "        const steps=Math.max(1,Math.min(5,Math.ceil(realDt/.05)));",
     "remove gameplay pause simulation")
swap("            if(controls)gtm418DrawSessionStatus(ctx,w,h,controls);\n","",
     "remove game status overlay")

# Old installed community packs may have interactive nodes. Ignore these scenes
# rather than resurrecting gameplay through the importer.
swap("            if(!pack||!Array.isArray(pack.scenes))continue;\n",
     "            if(!pack||!Array.isArray(pack.scenes))continue;\n",
     "check pack registration anchor") if False else None
swap("        for(const scene of pack.scenes.slice(0,96)){\n",
     "        for(const scene of pack.scenes.slice(0,96)){\n            if(scene?.interaction?.kind==='game')continue;\n",
     "reject legacy interactive community scenes")
old="""valid.set(scene.id,{...scene,program,interaction:pack.format===3?scene.interaction:null,options:pack.format===3?scene.options||[]:[],background,overlays,category:(['world_neon_pong','world_pong_thunder','world_pong_starlight'].includes(scene.id)||scene.category==='arcade'||(scene.interaction&&!scene.category))?'arcade':(['retro','rhythm','signature','anime','arcade'].includes(scene.category)?scene.category:'signature'),layers});"""
new="""valid.set(scene.id,{...scene,program,interaction:null,options:pack.format===3?scene.options||[]:[],background,overlays,category:scene.category==='arcade'?'experiments':(['retro','rhythm','signature','anime','experiments'].includes(scene.category)?scene.category:'signature'),layers});"""
swap(old,new,"music-only scene categorization and program input isolation")
swap("  {id:'arcade',label:'GTM Arcade',modes:[]}",
     "  {id:'experiments',label:'Visual Experiments',modes:[]}",
     "replace Arcade group with Visual Experiments")
swap("['arcade','GTM Arcade']", "['experiments','Visual Experiments']",
     "remove Arcade category")
# Restrict heavier visuals to 550k pixels, without shrinking all music visualizers.
swap("""    const arcade=scene.layers.some(layer=>layer.effect==='neon_pong')||!!scene.interaction;
    const maxWidth=arcade?1000:1200,maxPixels=arcade?550000:1400000;""",
     """    const heavy=scene.category==='experiments'||scene.layers.some(layer=>layer.effect==='neon_pong');
    const maxWidth=heavy?1000:1200,maxPixels=heavy?550000:1400000;""",
     "energy-conscious raster limit")
swap("    if(scene.program)gtm418DrawProgram(ctx,canvas,scene,mode,frame,data,w,h);",
     "    if(scene.program&&!scene.interaction)gtm418DrawProgram(ctx,canvas,scene,mode,frame,data,w,h);",
     "non-interactive program rendering only")
swap("function gtm430RenderSafetyCost(state,renderMs,isArcade){\n    if(!isArcade||state.latched)return state.latched;",
     "function gtm430RenderSafetyCost(state,renderMs,isComplexVisual){\n    if(!isComplexVisual||state.latched)return state.latched;",
     "visualizer-agnostic safety watchdog")
swap("Sustained slow Arcade rendering","Sustained slow visualizer rendering",
     "clear game-specific render error text")
swap("""    const pongActive=currentScene?.layers?.some(layer=>layer.effect==='neon_pong');
    const arcadeActive=Boolean(pongActive||currentScene?.category==='arcade'||currentScene?.interaction?.kind==='game');
    const couchEnabled=arcadeActive&&(snapshot$1.homeReactiveVisualizerArcadeView||'couch')==='couch';
    const pongCouch=couchEnabled;
    // 4.4.1: Chess needs a readable 8x8 board, not a 208px horizontal strip.
    // Remain inside the GTM Home footer, below the upper Steam interface.
    // Other games retain the exact 4.4.0 stage dimensions.
    const focusedChess=couchEnabled&&currentScene?.id==='world_arcade_neon_chess';
    const h=focusedChess?Math.min(410,Math.max(292,Math.round((window.innerHeight||800)*.46))):
        pongCouch?Math.max(gtmV373Height(visual.height),208):gtmV373Height(visual.height);
    const stage=pongActive?{...gtmV373StageStyle(visual,hostBackground),background:'#080e22'}:gtmV373StageStyle(visual,hostBackground);""",
     """    const visualExperiment=currentScene?.category==='experiments';
    const h=gtmV373Height(visual.height);
    const stage=gtmV373StageStyle(visual,hostBackground);""",
     "restore user-selected visualizer size")
swap("maxHeight:focusedChess?'48vh':pongCouch?'28vh':'12vh'",
     "maxHeight:visualExperiment?'18vh':'12vh'",
     "remove Chess game stage scaling")
# Preserve cached mode IDs for updates; the old Pong scene is now a passive
# neon-court animation, with the original lightweight renderer as fallback.

# Convert format-3 built-in game pack into passive, music-responsive visual art.
styles={
 "world_arcade_beat_catcher":("Beat Trails • Rhythm Lights","beat_pinball","rings"),
 "world_arcade_orbital_duel":("Orbital Prism • Starfield","disc_prism","orbits"),
 "world_arcade_orbit_defenders":("Event Horizon • Defense Nebula","supernova_bloom","comets"),
 "world_arcade_neon_strike_gallery":("Neon Target Grid • Pulse Field","crt_pulse","hexagons"),
 "world_arcade_neon_chess":("Neon Checkboard • Luminous Grid","mechanical_iris","grid"),
}
def passive_pack(pack):
    assert len(pack.get("scenes",[]))==5
    pack["format"]=2
    pack["pack_id"]="gtm_visual_experiments_442"
    pack["name"]="GTM Visual Experiments"
    pack["version"]=VERSION
    pack["description"]="Five music-reactive visual worlds preserved from the 4.4.1 Arcade art experiments. No playable games or controller input."
    for scene in pack["scenes"]:
        title,effect,overlay=styles[scene["id"]]
        scene["title"]=title
        scene["category"]="experiments"
        scene["layers"]=[dict(effect=effect,scale=1,speed=1,density=1,intensity=.95,hueShift=0)]
        scene.pop("program",None);scene.pop("interaction",None);scene.pop("options",None)
        scene["overlays"]=[dict(effect=overlay,trigger="beat",color="auto",density=.65,speed=1,intensity=.5)]
        bg=scene.get("background") or {}
        bg.setdefault("density",1);bg.setdefault("motion",.5);bg.setdefault("reactivity",.9)
        scene["background"]=bg
    return pack

external=Path("visualizer-packs/arcade/manifest.json")
arcade=json.loads(external.read_text())
passive=passive_pack(arcade)
out=Path("visualizer-packs/experiments/manifest.json")
out.parent.mkdir(parents=True,exist_ok=True)
out.write_text(json.dumps(passive,indent=2,ensure_ascii=False)+"\n")
external.unlink()
for f in Path("visualizer-packs/arcade").glob("*"): f.unlink()
Path("visualizer-packs/arcade").rmdir()
# Remove bundled game SDK examples but preserve visual-only starter effects.
for f in [Path("visualizer-packs/sdk-examples/GTM_4.2.8_NEON_DODGER_COMMUNITY_GAME.zip")]:
    if f.exists():f.unlink()
for d in [Path("visualizer-packs/sdk-examples/Neon_Dodger_Community"),
          Path("visualizer-packs/sdk-examples/flux-shield-run-428")]:
    if d.exists():
        for f in d.rglob("*"):
            if f.is_file(): f.unlink()
        for folder in sorted((f for f in d.rglob("*") if f.is_dir()),reverse=True):folder.rmdir()
        d.rmdir()

embedded_re=re.compile(r"^const GTM422_EMBEDDED_BUILTINS=(.*);$",re.M)
match=embedded_re.search(source)
assert match,"Missing embedded pack fallback"
packs=json.loads(match.group(1))
assert len(packs)==2,"Unexpected embedded packs"
for pack in packs:
    if pack.get("pack_id")=="gtm_arcade_builtin_420":passive_pack(pack)
    else:
        for scene in pack.get("scenes",[]):
            if scene.get("id") in ("world_neon_pong","world_pong_thunder","world_pong_starlight"):
                scene["title"]=scene["title"].replace("Neon Paddle","Neon Court")
source=source[:match.start(1)]+json.dumps(packs,separators=(",",":"),ensure_ascii=False)+source[match.end(1):]
volume=Path("visualizer-packs/volume1/manifest.json")
v=json.loads(volume.read_text())
for scene in v["scenes"]:
    if scene.get("id") in ("world_neon_pong","world_pong_thunder","world_pong_starlight"):
        scene["title"]=scene["title"].replace("Neon Paddle","Neon Court")
volume.write_text(json.dumps(v,indent=2,ensure_ascii=False)+"\n")

swap('const GTM_VERSION = "4.4.1";', 'const GTM_VERSION = "4.4.2";',
     "candidate version")
# Existing settings are intentionally not deleted from user storage. Unused
# Arcade preferences are inert, preserving safe upgrade/rollback behavior.
assert "function Gtm419ArcadePage" not in source
for name in ["gtm418ReadPlayers","gtm421DrawArcade","gtm413PongScore","GTM440_CHESS","GTM421_GAMES","GTM420_ARCADE_GAMES"]:
    assert name not in source,name
JS.write_text(source,encoding="utf-8")

py=PY.read_text()
assert "visualizer-packs' / 'arcade' / 'manifest.json'" in py
py=py.replace('frozenset({"retro", "rhythm", "signature", "anime", "arcade"})',
              'frozenset({"retro", "rhythm", "signature", "anime", "arcade", "experiments"})',1)
py=py.replace(" / 'arcade' / 'manifest.json'"," / 'experiments' / 'manifest.json'",1)
py=py.replace('for path in [builtin, arcade_builtin, *sorted(custom.glob("*.json"))]:',
              'for path in [builtin, arcade_builtin, *sorted(custom.glob("*.json"))]:',1)
# Reject fresh game import attempts, but continue to allow visual-only format-3
# packs if a trusted standalone validator exists.
needle='        if isinstance(payload, dict) and type(payload.get("format")) is int and payload["format"] == 3:\n'
assert py.count(needle)==1
py=py.replace(needle,needle+
              '            if any(isinstance(s, dict) and isinstance(s.get("interaction"), dict) and s["interaction"].get("kind") == "game" for s in payload.get("scenes", []) if isinstance(payload.get("scenes"), list)):\n'
              '                raise ValueError("Interactive Arcade packs are not supported in this music-first edition")\n',1)
py=py.replace('("gtm_visual_worlds_vol1", "gtm_arcade_builtin_420")',
              '("gtm_visual_worlds_vol1", "gtm_arcade_builtin_420", "gtm_visual_experiments_442")')
PY.write_text(py)
for file in ("plugin.json","package.json"):
    p=Path(file);x=json.loads(p.read_text());assert x.get("version")=="4.4.1",file
    x["version"]=VERSION
    x["description"]="GTM 4.4.2 Music-First Preview: preserved soundtracks, crossfade, Visual Worlds, and passive Arcade-inspired visuals, without playable games."
    if file=="plugin.json":
        x["publish"]["description"]=x["description"]
    p.write_text(json.dumps(x,indent=2,ensure_ascii=False)+"\n")
# Historical game tests are deliberately not executed as current requirements.
for f in Path("tests").glob("*"):
    if any(word in f.name for word in
      ("ARCADE_LIFECYCLE","BUILTIN_GAMES","BUILTIN_BACKEND","CONTROLLER_GOAL","GOAL_AND_POWERS",
       "AI_TOURNAMENT","AI_BALANCE","UNIVERSAL_ENGINE","_4.4.1_VERSION_CONSISTENCY")):
        f.unlink()
print("MUSIC-FIRST TRANSFORM COMPLETE",len(source),"frontend characters; 17 built-in scenes retained")
