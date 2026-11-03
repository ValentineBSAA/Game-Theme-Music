from pathlib import Path
from tempfile import TemporaryDirectory
import ast,types,logging,os,json,zipfile
SOURCE=Path(__file__).resolve().parent.parent.joinpath('main.py').read_text()
module=ast.parse(SOURCE)
cls=next(n for n in module.body if isinstance(n,ast.ClassDef) and any(isinstance(m,ast.AsyncFunctionDef) and m.name=='get_visualizer_shuffle_preference' for m in n.body))
methods=[n for n in cls.body if isinstance(n,(ast.FunctionDef,ast.AsyncFunctionDef)) and n.name in ('_gtm444_shuffle_sidecar','get_visualizer_shuffle_preference','set_visualizer_shuffle_preference')]
assert len(methods)==3
miniclass=ast.ClassDef(name='TestPlugin',bases=[],keywords=[],body=methods,decorator_list=[])
code=compile(ast.fix_missing_locations(ast.Module(body=[miniclass],type_ignores=[])),'inline-methods','exec')
class DummyManager:
 def __init__(self):self.data={}
 def setSetting(self,k,v):self.data[k]=v
 def getSetting(self,k,default=None):return self.data.get(k,default)
with TemporaryDirectory() as tmp:
 env={'Path':Path,'decky':types.SimpleNamespace(DECKY_PLUGIN_SETTINGS_DIR=tmp),'json':json,'os':os,'logger':logging.getLogger('test')}
 exec(code,env)
 inst=env['TestPlugin']();inst.settings=DummyManager()
 import asyncio
 async def checks():
  # A brand new plugin defaults off.
  assert (await inst.get_visualizer_shuffle_preference())=={'exists':False,'enabled':False}
  # Existing user OFF survives a sidecar-free upgrade.
  inst.settings.setSetting('settings',{'homeReactiveVisualizerShuffleAll':False,'volume':.33})
  assert (await inst.get_visualizer_shuffle_preference())=={'exists':True,'enabled':False}
  # Create dedicated boolean, simulate full settings unexpectedly changed on update.
  assert (await inst.set_visualizer_shuffle_preference(False))['enabled']==False
  path=Path(tmp,'gtm-visualizer-shuffle-v1.json')
  assert path.exists() and json.loads(path.read_text())['enabled'] is False
  inst.settings.setSetting('settings',{'homeReactiveVisualizerShuffleAll':True,'volume':.33})
  assert (await inst.get_visualizer_shuffle_preference())=={'exists':True,'enabled':False}
  # Reconstructed backend after Decky restart still loads OFF, without same object.
  fresh=env['TestPlugin']();fresh.settings=DummyManager()
  fresh.settings.setSetting('settings',{'homeReactiveVisualizerShuffleAll':True})
  assert (await fresh.get_visualizer_shuffle_preference())['enabled'] is False
  await fresh.set_visualizer_shuffle_preference(True)
  assert (await fresh.get_visualizer_shuffle_preference())['enabled'] is True
  assert json.loads(path.read_text())['enabled'] is True
  # No forced false: turning back off must also persist correctly.
  await fresh.set_visualizer_shuffle_preference(False)
  assert (await fresh.get_visualizer_shuffle_preference())['enabled'] is False
  assert not path.with_suffix('.json.tmp').exists()
 asyncio.run(checks())
print('PASS backend sidecar: migration, OFF across update/restart, explicit ON then OFF, atomic file')

