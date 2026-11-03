#!/usr/bin/env python3
"""Standalone community pack ZIP builder and schema validator, no private GTM code."""
import json, sys, zipfile
from pathlib import Path
from gtm_pack_v3 import validate_pack, COLOR, SCENERIES, OVERLAYS, CATEGORIES, EFFECTS

def safe_legacy_fields(payload):
    # Public format-2 fields needed by the shared v3 validator; GTM validates
    # once again on actual import with its full private backend implementation.
    scenes=[]
    for scene in payload['scenes']:
        if scene['category'] not in CATEGORIES:raise ValueError('Unknown category')
        bg=scene.get('background',{})
        if bg:
            if bg.get('style') not in SCENERIES:raise ValueError('Unknown scenery')
            for k in ('base','accent'):
                if not COLOR.fullmatch(bg.get(k,'')):raise ValueError('Invalid scenery color')
        for overlay in scene.get('overlays',[]):
            if overlay.get('effect') not in OVERLAYS:raise ValueError('Invalid overlay')
            if overlay.get('trigger') not in ('always','beat','bass','treble'):raise ValueError('Invalid trigger')
            if overlay.get('color')!='auto' and not COLOR.fullmatch(overlay.get('color','')):raise ValueError('Invalid overlay color')
        for layer in scene.get('layers',[]):
            if layer.get('effect') not in EFFECTS:raise ValueError('Invalid built-in layer')
        scenes.append(scene)
    return {'scenes':scenes}

def main():
    if len(sys.argv)<2:raise SystemExit('Usage: python pack_validate.py manifest.json [pack.zip]')
    path=Path(sys.argv[1]);data=json.loads(path.read_text(encoding='utf8'))
    result=validate_pack(data,safe_legacy_fields)
    print('VALID',result['pack_id'],'scenes:',len(result['scenes']))
    if len(sys.argv)>2:
        with zipfile.ZipFile(sys.argv[2],'w',compression=zipfile.ZIP_DEFLATED) as z:
            z.writestr('manifest.json',json.dumps(data,ensure_ascii=False,indent=2)+'\n')
        print('CREATED',sys.argv[2])
if __name__=='__main__':main()
