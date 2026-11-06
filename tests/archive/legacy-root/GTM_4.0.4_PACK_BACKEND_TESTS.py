"""Offline format/ZIP-import test; does not need a Steam Deck installation."""
from pathlib import Path
from types import ModuleType
import asyncio
import importlib.util
import json
import os
import sys
import tempfile
import zipfile

ROOT = Path(__file__).parent
with tempfile.TemporaryDirectory(prefix="gtm404-pack-test-") as directory:
    runtime = Path(directory) / 'runtime';runtime.mkdir()
    settings = Path(directory) / 'settings';settings.mkdir()
    fake_decky = ModuleType('decky')
    fake_decky.DECKY_PLUGIN_VERSION='4.0.4'
    fake_decky.DECKY_PLUGIN_RUNTIME_DIR=str(runtime)
    fake_decky.DECKY_PLUGIN_DIR=str(ROOT)
    fake_decky.DECKY_PLUGIN_SETTINGS_DIR=str(settings)
    fake_decky.DECKY_PLUGIN_LOG_DIR=str(runtime)
    import logging
    fake_decky.logger=logging.getLogger('gtm404_test')
    sys.modules['decky']=fake_decky
    fake_settings=ModuleType('settings')
    class SettingsManager:
        def __init__(self, *args, **kwargs): pass
    fake_settings.SettingsManager=SettingsManager
    sys.modules['settings']=fake_settings
    spec=importlib.util.spec_from_file_location('gtm404_test_main',ROOT/'main.py')
    module=importlib.util.module_from_spec(spec);sys.modules[spec.name]=module
    spec.loader.exec_module(module)
    plugin=module.Plugin()
    builtin=json.loads((ROOT/'visualizer-packs/volume1/manifest.json').read_text())
    assert plugin._validate_visualizer_pack(builtin)['pack_id']=='gtm_visual_worlds_vol1'
    assert len(builtin['scenes'])==10
    assert len({x['layers'][0]['effect'] for x in builtin['scenes']})==10
    assert len(asyncio.run(plugin.list_visualizer_packs())['packs'])==1
    custom=json.loads(json.dumps(builtin));custom['pack_id']='community_sample_one'
    custom['name']='Community Sample One'
    custom['scenes']=custom['scenes'][:1]
    custom['scenes'][0]['id']='world_custom_crt'
    archive=Path(directory)/'good.zip'
    with zipfile.ZipFile(archive,'w') as z:z.writestr('manifest.json',json.dumps(custom))
    result=asyncio.run(plugin.install_visualizer_pack(str(archive)))
    assert result['ok'],result
    assert len(asyncio.run(plugin.list_visualizer_packs())['packs'])==2
    assert (runtime/'visualizer-packs/community_sample_one.json').exists()
    assert asyncio.run(plugin.uninstall_visualizer_pack('community_sample_one'))['ok']
    assert len(asyncio.run(plugin.list_visualizer_packs())['packs'])==1
    # Malicious ZIPs must not be extracted or executed.
    bad=Path(directory)/'bad.zip'
    with zipfile.ZipFile(bad,'w') as z:
        z.writestr('manifest.json',json.dumps(custom))
        z.writestr('../../escape.py','print("bad")')
    result=asyncio.run(plugin.install_visualizer_pack(str(bad)))
    assert not result['ok'],result
    assert not Path(directory,'escape.py').exists()
    broken=json.loads(json.dumps(custom));broken['scenes'][0]['layers'][0]['effect']='arbitrary_js'
    with zipfile.ZipFile(bad,'w') as z:z.writestr('manifest.json',json.dumps(broken))
    result=asyncio.run(plugin.install_visualizer_pack(str(bad)))
    assert not result['ok']
    print('PASS 4.0.4 backend: built-in pack, safe import, persistence, uninstall, reject traversal, reject code')
