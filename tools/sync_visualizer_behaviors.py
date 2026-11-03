#!/usr/bin/env python3
"""Synchronize trusted built-in behavior source into GTM's compiled JS snapshot.

Only for developer-controlled code changes. Does not execute imported pack ZIPs.
The original full TS/React project is not part of this plugin, so this targeted
marker patch is safer than manually editing long compiled bundle sections.
"""
from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent
BUNDLE=ROOT/'dist/index.js'
SOURCE=ROOT/'src/visualizer-behaviors/runtime-414.js'
INPUT=ROOT/'src/visualizer-behaviors/controller-418.js'
PROGRAM=ROOT/'src/visualizer-behaviors/pack-program-418.js'
ARCADE=ROOT/'src/visualizer-behaviors/arcade-421.js'
OPEN='// GTM 4.1.4: bounded, non-executable visualizer behavior runtime.'
LEGACY_OPEN='// GTM 4.1.3: bounded, non-executable visualizer behavior runtime.'
CLOSE='function gtm404RegisterPacks(packs){'
text=BUNDLE.read_text()
source=SOURCE.read_text().rstrip()+'\n'+INPUT.read_text().rstrip()+'\n'+PROGRAM.read_text().rstrip()+'\n'+ARCADE.read_text().rstrip()+'\n'
start_marker=OPEN if OPEN in text else LEGACY_OPEN
assert text.count(start_marker)==1 and text.count(CLOSE)==1, 'Bundle markers changed'
assert source.startswith(OPEN) and CLOSE not in source, 'Behavior source malformed'
start=text.index(start_marker);end=text.index(CLOSE,start)
new=text[:start]+source.rstrip()+'\n'+text[end:]
if new!=text:
    BUNDLE.write_text(new)
    print('Updated bundled built-in visualizer behaviors')
else:
    print('Visualizer behaviors already synchronized')

# 4.1.5: keep trusted declarative scenery renderer aligned with the bundle.
SCENERY=ROOT/'src/visualizer-behaviors/scenery-415.js'
SCENE_OPEN='// GTM 4.1.5: trusted, bounded scenery renderer.'
SCENE_CLOSE='function gtm404RenderPacked(canvas,mode,data,paletteName,theme,visual){'
new_source=SCENERY.read_text()
body=BUNDLE.read_text()
assert body.count(SCENE_OPEN)==1 and body.count(SCENE_CLOSE)==1
start=body.index(SCENE_OPEN);end=body.index(SCENE_CLOSE,start)
if body[start:end]!=new_source.rstrip()+'\n':
    BUNDLE.write_text(body[:start]+new_source.rstrip()+'\n'+body[end:])
    print('Updated bundled scenery renderer')
