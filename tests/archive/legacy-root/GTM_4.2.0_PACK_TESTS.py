"""4.1.4 Effects Pack SDK v2 safety, compatibility and import tests."""
import asyncio,copy,importlib.util,json,logging,math,sys,tempfile,types,zipfile
from pathlib import Path
ROOT=Path(__file__).parent
with tempfile.TemporaryDirectory(prefix='gtm414_') as tmp:
    sys.modules['decky']=types.SimpleNamespace(DECKY_PLUGIN_RUNTIME_DIR=tmp,DECKY_PLUGIN_DIR=str(ROOT),DECKY_PLUGIN_SETTINGS_DIR=tmp,DECKY_PLUGIN_LOG_DIR=tmp,logger=logging.getLogger('gtm414'))
    sys.modules['settings']=types.SimpleNamespace(SettingsManager=type('SM',(),{}))
    spec=importlib.util.spec_from_file_location('gtm414backend',ROOT/'main.py')
    mod=importlib.util.module_from_spec(spec);spec.loader.exec_module(mod)
    p=object.__new__(mod.Plugin)
    builtin=json.loads((ROOT/'visualizer-packs/volume1/manifest.json').read_text())
    starter=json.loads((ROOT/'visualizer-packs/sdk-examples/manifest-v2.json').read_text())
    assert builtin['format']==2 and len(p._validate_visualizer_pack(builtin)['scenes'])==12
    assert starter['format']==2 and len(p._validate_visualizer_pack(starter)['scenes'])==3
    older=copy.deepcopy(starter);older['format']=1
    for scene in older['scenes']:
        scene.pop('overlays',None)
        for layer in scene['layers']:layer.pop('audio',None)
    assert p._validate_visualizer_pack(older)['format']==1
    # Validate forbidden code, unsafe params, extreme work, nonfinite values, bad fields.
    corruptions=[
        lambda d:d['scenes'][0]['overlays'][0].update(effect='custom_script'),
        lambda d:d['scenes'][0]['overlays'][0].update(color='javascript:alert(1)'),
        lambda d:d['scenes'][0]['overlays'][0].update(density=999999),
        lambda d:d['scenes'][0]['overlays'][0].update(speed=math.inf),
        lambda d:d['scenes'][0]['overlays'][0].update(trigger='media_play'),
        lambda d:d['scenes'][0]['layers'][0]['audio']['intensity'].update(source='network'),
        lambda d:d['scenes'][0]['layers'][0]['audio']['intensity'].update(amount=math.nan),
        lambda d:d['scenes'][0]['layers'][0]['audio'].update(foo={'source':'beat','amount':1}),
        lambda d:d['scenes'][0]['layers'][0].update(intensity=math.nan),
        lambda d:d['scenes'][0].update(overlays=d['scenes'][0]['overlays']*9),
    ]
    for change in corruptions:
        bad=copy.deepcopy(starter);change(bad)
        try:p._validate_visualizer_pack(bad)
        except ValueError:pass
        else:raise AssertionError('Unsafe pack field accepted')
    async def test():
        loaded=await p.list_visualizer_packs()
        assert len(loaded['packs'])==2
        filename=Path(tmp)/'starter.zip'
        with zipfile.ZipFile(filename,'w',zipfile.ZIP_DEFLATED) as z:z.writestr('manifest.json',json.dumps(starter))
        added=await p.install_visualizer_pack(str(filename))
        assert added['ok'] and added['scene_count']==3,added
        loaded=await p.list_visualizer_packs()
        assert len(loaded['packs'])==3 and len(loaded['packs'][-1]['scenes'])==3
        assert loaded['packs'][-1]['scenes'][0]['overlays'][0]['effect']=='sparks'
        # In-place pack upgrades preserve scene ownership; other packs cannot claim it.
        updated=copy.deepcopy(starter);updated['version']='1.0.1'
        with zipfile.ZipFile(filename,'w') as z:z.writestr('manifest.json',json.dumps(updated))
        assert (await p.install_visualizer_pack(str(filename)))['ok']
        collision=copy.deepcopy(starter);collision['pack_id']='different_publisher'
        with zipfile.ZipFile(filename,'w') as z:z.writestr('manifest.json',json.dumps(collision))
        rejected=await p.install_visualizer_pack(str(filename))
        assert not rejected['ok'] and 'already belongs' in rejected['error'],rejected
        assert (await p.uninstall_visualizer_pack(starter['pack_id']))['ok']
        assert len((await p.list_visualizer_packs())['packs'])==2
    asyncio.run(test())
print('PASS GTM 4.1.4: 12 built-ins, v1 compatibility, v2 audio/overlays, ZIP import, upgrade, collisions, security bounds')
