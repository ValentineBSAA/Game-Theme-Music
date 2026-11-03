"""Backend manifest ZIP validation test without Decky/Steam. No external network."""
import asyncio,importlib.util,io,json,logging,os,sys,tempfile,types,zipfile
from pathlib import Path
ROOT=Path(__file__).parent
with tempfile.TemporaryDirectory(prefix='gtm404_pack_') as tmp:
    sys.modules['decky']=types.SimpleNamespace(DECKY_PLUGIN_RUNTIME_DIR=tmp,DECKY_PLUGIN_DIR=str(ROOT),DECKY_PLUGIN_SETTINGS_DIR=tmp,DECKY_PLUGIN_LOG_DIR=tmp,logger=logging.getLogger('test'))
    sys.modules['settings']=types.SimpleNamespace(SettingsManager=type('SM',(),{}))
    spec=importlib.util.spec_from_file_location('gtm404_backend',ROOT/'main.py');mod=importlib.util.module_from_spec(spec);spec.loader.exec_module(mod)
    plugin=object.__new__(mod.Plugin)
    builtin=json.loads((ROOT/'visualizer-packs/volume1/manifest.json').read_text())
    assert len(plugin._validate_visualizer_pack(builtin)['scenes'])==12
    async def test():
        loaded=await plugin.list_visualizer_packs()
        assert loaded['ok'] and loaded['packs'][0]['pack_id']=='gtm_visual_worlds_vol1',loaded
        custom=json.loads(json.dumps(builtin))
        custom['pack_id']='gtm_test_custom';custom['scenes'][0]['id']='world_test_custom'
        custom['scenes']=custom['scenes'][:1]
        filepath=Path(tmp)/'test.zip'
        with zipfile.ZipFile(filepath,'w',zipfile.ZIP_DEFLATED) as z:z.writestr('manifest.json',json.dumps(custom))
        assert (await plugin.install_visualizer_pack(str(filepath)))['ok']
        loaded=await plugin.list_visualizer_packs()
        assert len(loaded['packs'])==3, [p['pack_id'] for p in loaded['packs']]
        assert (await plugin.uninstall_visualizer_pack('gtm_test_custom'))['ok']
        assert len((await plugin.list_visualizer_packs())['packs'])==2
        assert not (await plugin.uninstall_visualizer_pack('gtm_visual_worlds_vol1'))['ok']
        assert not (await plugin.uninstall_visualizer_pack('gtm_arcade_builtin_420'))['ok']
        filepath=Path(tmp)/'evil.zip'
        with zipfile.ZipFile(filepath,'w') as z:z.writestr('manifest.json',json.dumps(custom));z.writestr('attack.js','eval("oops")')
        assert not (await plugin.install_visualizer_pack(str(filepath)))['ok']
        custom['scenes'][0]['layers'][0]['effect']='javascript';filepath=Path(tmp)/'bad.zip'
        with zipfile.ZipFile(filepath,'w') as z:z.writestr('manifest.json',json.dumps(custom))
        assert not (await plugin.install_visualizer_pack(str(filepath)))['ok']
        assert len((await plugin.list_visualizer_packs())['packs'])==2
    asyncio.run(test())
print('PASS GTM 4.0.4: built-in pack, safe ZIP import, persistence, remove, protected built-in, forbidden scripts & bad effects rejected')
