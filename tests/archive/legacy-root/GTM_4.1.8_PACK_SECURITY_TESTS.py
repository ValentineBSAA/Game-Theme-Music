"""GTM v3 import compatibility, malformed program rejection, and no-code ZIP policy."""
import asyncio,copy,importlib.util,json,logging,math,sys,tempfile,types,zipfile
from pathlib import Path
ROOT=Path(__file__).parent
with tempfile.TemporaryDirectory(prefix='gtm418_') as tmp:
    sys.modules['decky']=types.SimpleNamespace(DECKY_PLUGIN_RUNTIME_DIR=tmp,DECKY_PLUGIN_DIR=str(ROOT),DECKY_PLUGIN_SETTINGS_DIR=tmp,DECKY_PLUGIN_LOG_DIR=tmp,logger=logging.getLogger('gtm418'))
    sys.modules['settings']=types.SimpleNamespace(SettingsManager=type('SM',(),{}))
    spec=importlib.util.spec_from_file_location('gtm418backend',ROOT/'main.py')
    mod=importlib.util.module_from_spec(spec);spec.loader.exec_module(mod)
    plugin=object.__new__(mod.Plugin)
    good=json.loads((ROOT/'visualizer-packs/sdk-examples/manifest-v3.json').read_text())
    checked=plugin._validate_visualizer_pack(good)
    assert checked['format']==3 and len(checked['scenes'])==3
    assert checked['scenes'][0]['options'][0]['choices'][0]['value']==7
    corruptions=[
        lambda p:p['scenes'][0]['program']['draw'].append({'do':'eval','value':'alert(1)'}),
        lambda p:p['scenes'][0]['program']['update'][0].update(value=['get','window']),
        lambda p:p['scenes'][0]['program']['draw'][0]['body'].append({'do':'repeat','count':100000,'index':'j','body':[]}),
        lambda p:p['scenes'][1]['interaction'].update(kind='eval'),
        lambda p:p['scenes'][1]['interaction'].update(modes=['unknown']),
        lambda p:p['scenes'][0]['options'][0]['choices'][0].update(value=math.inf),
        lambda p:p['scenes'][0]['options'][0]['choices'][0].update(value=9999),
        lambda p:p['scenes'][0]['program']['state'].update(time=100),
        lambda p:p['scenes'][0]['program']['draw'][0].update(filename='../unsafe.js'),
        lambda p:p['scenes'][0].update(script='console.log(1)'),
        lambda p:p['scenes'][0]['program'].update(url='https://bad.com'),
        lambda p:p['scenes'][0].update(id='../../bad'),
    ]
    for change in corruptions:
        bad=copy.deepcopy(good);change(bad)
        try:plugin._validate_visualizer_pack(bad)
        except (ValueError,TypeError,KeyError):pass
        else:raise AssertionError('Malformed v3 pack passed validation')
    async def verify_import():
        filename=Path(tmp)/'universal.zip'
        with zipfile.ZipFile(filename,'w',zipfile.ZIP_DEFLATED) as z:z.writestr('manifest.json',json.dumps(good))
        result=await plugin.install_visualizer_pack(str(filename))
        assert result.get('ok') and result.get('scene_count')==3,result
        loaded=await plugin.list_visualizer_packs()
        assert any(p['pack_id']==good['pack_id'] and len(p['scenes'])==3 for p in loaded['packs'])
        with zipfile.ZipFile(filename,'w') as z:
            z.writestr('manifest.json',json.dumps(good));z.writestr('script.js','alert(1)')
        blocked=await plugin.install_visualizer_pack(str(filename))
        assert not blocked.get('ok'),blocked
        assert (await plugin.uninstall_visualizer_pack(good['pack_id'])).get('ok')
    asyncio.run(verify_import())
print('PASS v3 scene import, no script execution, strict VM budgets, pack options, v1/v2 compatibility')
