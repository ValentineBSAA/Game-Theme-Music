"""Pack scenery compatibility/security regression tests."""
import copy, importlib.util, json, logging, math, sys, tempfile, types
from pathlib import Path
r=Path(__file__).parent
with tempfile.TemporaryDirectory(prefix='gtm415_') as temp:
    sys.modules['decky']=types.SimpleNamespace(DECKY_PLUGIN_RUNTIME_DIR=temp,DECKY_PLUGIN_DIR=str(r),DECKY_PLUGIN_SETTINGS_DIR=temp,DECKY_PLUGIN_LOG_DIR=temp,logger=logging.getLogger('gtm415'))
    sys.modules['settings']=types.SimpleNamespace(SettingsManager=type('SettingsManager',(),{}))
    spec=importlib.util.spec_from_file_location('gtm415backend',r/'main.py')
    mod=importlib.util.module_from_spec(spec);spec.loader.exec_module(mod)
    p=object.__new__(mod.Plugin)
    payload=json.loads((r/'visualizer-packs/volume1/manifest.json').read_text())
    validated=p._validate_visualizer_pack(payload)
    arena={s['id']:s for s in validated['scenes']}
    assert {arena['world_neon_pong']['background']['style'],arena['world_pong_thunder']['background']['style'],arena['world_pong_starlight']['background']['style']}=={'arcade','storm','stars'}
    assert not any('background' in s for s in validated['scenes'] if s['id'] not in ('world_neon_pong','world_pong_thunder','world_pong_starlight'))
    sample=json.loads((r/'visualizer-packs/sdk-examples/manifest-v2.json').read_text())
    validated_sample=p._validate_visualizer_pack(sample)
    assert validated_sample['scenes'][-1]['background']['style']=='sunset'
    assert validated_sample['scenes'][-1]['background']['reactivity']==1
    legacy=copy.deepcopy(sample);legacy['format']=1
    for sc in legacy['scenes']:
        sc.pop('overlays',None);sc.pop('background',None)
        for layer in sc['layers']:layer.pop('audio',None)
    assert p._validate_visualizer_pack(legacy)['format']==1
    changes=(
        lambda bg:bg.update(style='custom_html'),
        lambda bg:bg.update(base='white'),
        lambda bg:bg.update(accent='javascript:alert(1)'),
        lambda bg:bg.update(density=math.nan),
        lambda bg:bg.update(motion=10),
        lambda bg:bg.update(reactivity=10),
        lambda bg:bg.update(reactivity=math.nan),
        lambda bg:bg.update(src='https://example.com/photo'),
        lambda bg:bg.update(shader='anything'),
    )
    for mutate in changes:
        bad=copy.deepcopy(payload)
        mutate(next(sc for sc in bad['scenes'] if sc['id']=='world_neon_pong')['background'])
        try:p._validate_visualizer_pack(bad)
        except ValueError:pass
        else:raise AssertionError('Invalid scenery manifest accepted')
print('PASS 4.1.5: three distinct builtin sceneries, sample, v1 compatibility, rejected unsafe backdrops')
