import asyncio, importlib.util, json, logging, sys, tempfile, types
from pathlib import Path
ROOT=Path(__file__).parent
with tempfile.TemporaryDirectory() as tmp:
    sys.modules['decky']=types.SimpleNamespace(DECKY_PLUGIN_RUNTIME_DIR=tmp, DECKY_PLUGIN_DIR=str(ROOT), DECKY_PLUGIN_SETTINGS_DIR=tmp, DECKY_PLUGIN_LOG_DIR=tmp, logger=logging.getLogger('gtm420'))
    sys.modules['settings']=types.SimpleNamespace(SettingsManager=type('SM',(),{}))
    spec=importlib.util.spec_from_file_location('gtm420backend',ROOT/'main.py')
    mod=importlib.util.module_from_spec(spec);spec.loader.exec_module(mod)
    obj=object.__new__(mod.Plugin)
    builtin=json.loads((ROOT/'visualizer-packs/arcade/manifest.json').read_text())
    validated=obj._validate_visualizer_pack(builtin)
    assert validated['format']==3 and len(validated['scenes'])==5
    async def test():
        packs=await obj.list_visualizer_packs()
        assert not packs['errors'] and len(packs['packs'])==2,packs['errors']
        found=[p for p in packs['packs'] if p['pack_id']=='gtm_arcade_builtin_420']
        assert len(found)==1 and len(found[0]['scenes'])==5
        assert not (await obj.uninstall_visualizer_pack('gtm_arcade_builtin_420'))['ok']
        assert not (await obj.uninstall_visualizer_pack('gtm_visual_worlds_vol1'))['ok']
    asyncio.run(test())
print('PASS 5 included scenes at startup, safe v3 validation, both native collections protected')
