"""GTM 4.4.2: verified visual-world migration and forbidden interactive ZIPs."""
import asyncio
import importlib.util
import json
import logging
import sys
import tempfile
import types
import zipfile
from pathlib import Path

ROOT=Path(__file__).resolve().parent.parent
with tempfile.TemporaryDirectory(prefix="gtm442-musicfirst-") as tmp:
    sys.modules["decky"]=types.SimpleNamespace(
        DECKY_PLUGIN_RUNTIME_DIR=tmp,
        DECKY_PLUGIN_DIR=str(ROOT),
        DECKY_PLUGIN_SETTINGS_DIR=tmp,
        DECKY_PLUGIN_LOG_DIR=tmp,
        logger=logging.getLogger("gtm-musicfirst-test"))
    sys.modules["settings"]=types.SimpleNamespace(SettingsManager=type("SettingsManager",(),{}))
    spec=importlib.util.spec_from_file_location("gtm_musicfirst_main",ROOT/"main.py")
    mod=importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    p=object.__new__(mod.Plugin)
    core=json.loads((ROOT/"visualizer-packs/volume1/manifest.json").read_text())
    art=json.loads((ROOT/"visualizer-packs/experiments/manifest.json").read_text())
    assert len(p._validate_visualizer_pack(core)["scenes"])==12
    accepted=p._validate_visualizer_pack(art)
    assert len(accepted["scenes"])==5 and art["format"]==2
    ids={s["id"] for s in core["scenes"]+art["scenes"]}
    assert len(ids)==17
    assert len([s for s in art["scenes"] if s.get("program") or s.get("interaction")])==0
    assert all(s.get("category")=="experiments" for s in art["scenes"])
    assert all(s["layers"] and s.get("background") for s in art["scenes"])
    try:
        p._validate_visualizer_pack({"format":3,"scenes":[{"id":"world_attack",
            "interaction":{"kind":"game"}}]})
    except ValueError as e:
        assert "Interactive Arcade packs" in str(e)
    else:
        raise AssertionError("Interactive games must be rejected")
    async def run():
        response=await p.list_visualizer_packs()
        assert response["ok"] and not response["errors"],response
        assert len(response["packs"])==2,response
        assert {v["pack_id"] for v in response["packs"]}=={
            "gtm_visual_worlds_vol1","gtm_visual_experiments_442"}
        for protected in ("gtm_visual_worlds_vol1","gtm_visual_experiments_442"):
            assert not (await p.uninstall_visualizer_pack(protected))["ok"]
        custom=json.loads(json.dumps(art))
        custom["pack_id"]="gtm_custom_visual_scene"
        custom["scenes"]=custom["scenes"][:1]
        custom["scenes"][0]["id"]="world_custom_visual_scene"
        filename=Path(tmp)/"custom.zip"
        with zipfile.ZipFile(filename,"w") as z:
            z.writestr("manifest.json",json.dumps(custom))
        assert (await p.install_visualizer_pack(str(filename)))["ok"]
        assert len((await p.list_visualizer_packs())["packs"])==3
        assert (await p.uninstall_visualizer_pack("gtm_custom_visual_scene"))["ok"]
    asyncio.run(run())
print("PASS GTM 4.4.2: 17 safe visualizers, no game execution, 2 protected built-ins, safe community ZIP import")
