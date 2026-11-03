import asyncio
import importlib.util
import json
import logging
from pathlib import Path
import sys
import tempfile
import types
root=Path(__file__).resolve().parent.parent
# Import main with a Decky-like non-pip stub in a supported test process.
mod=types.ModuleType('decky')
mod.DECKY_PLUGIN_DIR=str(root)
mod.DECKY_PLUGIN_RUNTIME_DIR=str(Path(tempfile.mkdtemp()))
mod.logger=logging.getLogger('arcade-backend-test')
sys.modules['decky']=mod
fake=types.ModuleType('settings')
fake.SettingsManager=object
sys.modules['settings']=fake
sys.path.insert(0,str(root))
import main
p=main.Plugin.__new__(main.Plugin)
manifest=json.loads((root/'visualizer-packs/arcade/manifest.json').read_text())
valid=p._validate_visualizer_pack(manifest)
assert len(valid['scenes'])==5
print('PASS five active non-Pong game manifests validate through Decky backend')
# Reproduce sys.path without the bundled validator. Validator still loads from
# its own trusted plugin directory rather than silently dropping the games.
sys.path=[item for item in sys.path if item!=str(root)]
sys.modules.pop('gtm_pack_v3',None)
p._validate_visualizer_pack(manifest)
print('PASS format-3 validator loads even when Decky sys.path omits plugin root')
response=asyncio.run(p.list_visualizer_packs())
assert response['ok'],response
assert len(response['packs'])==2,response
assert len(response['packs'][1]['scenes'])==5,response
assert not response['errors'],response['errors']
print('PASS backend list enumerates six active built-in Arcade games')
