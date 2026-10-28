#!/usr/bin/env python3
"""Build GTM 3.7.0 from the checksum-verified 3.6.9 package.
Reconstruct the exact hardware-tested frontend and backend. Never download
unverified runtime components or silently repack an unknown baseline.
"""
import argparse,base64,gzip,hashlib,json,zipfile
from pathlib import Path
ORIGINAL='84364fe71ef5a65b9fae513ba0e8449cf670017f9d51b2da2807df9186d6a1df'
OLD_JS='f3fcb26f1c1b68f7d3a5f69dd03bf41b4f1e2ab7126db8ee8c57b4e85fecffbf'
NEW_JS='2334ab4bda984e392316e602e64dd1bc02312c37566c79cf5e4ac594281be5bd'
NEW_PY='d54e34b209554f21018b21a205417d65dd2d5589e740849eb8492cce1243a89a'
PATCH='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'
HEAD="""## 3.7.0 — Optional Now Playing HUD

- **Show mini player HUD** switch in Settings → Interface & feedback (ON by default for upgrades).
- OFF instantly hides the SAO-style Now Playing overlay and suppresses future game, Ambient, Store, track-change, and playback-error ribbon events without stopping or muting music.
- Cancels queued Quick Access replays, delayed popups, and HUD diagnostics when OFF. Re-enabling waits for a fresh real playback event rather than surprising the user with an old notification.
- Separate from Theme notifications, mini-player position, and SAO HUD visualizer settings.
- Existing saved preferences remain intact; 3.6.9 ResonaDeck audio focus and the playback engine are unchanged.

"""
def check(data,want,label):
    got=hashlib.sha256(data).hexdigest()
    if got!=want:raise RuntimeError(f"{label}: {got}, expected {want}")
def swap(s,a,b,label):
    count=s.count(a)
    if count!=1:raise RuntimeError(f"{label}: expected exactly one match; got {count} ({a[:60]})")
    return s.replace(a,b,1)
def main():
    ap=argparse.ArgumentParser()
    ap.add_argument('--baseline',required=True)
    ap.add_argument('--output',required=True)
    ap.add_argument('--src-out',required=True)
    opt=ap.parse_args()
    check(Path(opt.baseline).read_bytes(),ORIGINAL,'original ZIP')
    prefix='Game-Theme-Music/'
    with zipfile.ZipFile(opt.baseline) as old:
        entries=old.infolist()
        data={item.filename:old.read(item) for item in entries if not item.is_dir()}
    jskey=prefix+'dist/index.js';check(data[jskey],OLD_JS,'baseline frontend')
    s=data[jskey].decode()
    replacements=json.loads(gzip.decompress(base64.b64decode(PATCH)).decode())
    for old,new in replacements:s=swap(s,old,new,'HUD patch')
    s=swap(s,
      '        interruptedRibbonRef.current = null;\n        pendingTest.current = false;\n        const brain = gtmNotificationBrainState();',
      '        interruptedRibbonRef.current = null;\n        pendingTest.current = false;\n        // A test armed just before OFF must not appear when the HUD is re-enabled.\n        consumedTest.current = Math.max(Number(consumedTest.current || 0), Number(testToken || 0));\n        const brain = gtmNotificationBrainState();','final test cancellation')
    s=swap(s,
      '    }, [presentation.enabled, presentation.ready]);\n\n    // Quick Access is only a visibility gate.',
      '    }, [presentation.enabled, presentation.ready, testToken]);\n\n    // Quick Access is only a visibility gate.','final test dependency')
    data[jskey]=s.encode();check(data[jskey],NEW_JS,'3.7.0 compiled frontend')
    pykey=prefix+'main.py';py=data[pykey].decode()
    py=swap(py,'"""Game Theme Music 3.6.9 backend.','"""Game Theme Music 3.7.0 backend.','backend header')
    py=swap(py,'getattr(decky, "DECKY_PLUGIN_VERSION", "3.6.9")','getattr(decky, "DECKY_PLUGIN_VERSION", "3.7.0")','backend version')
    data[pykey]=py.encode();check(data[pykey],NEW_PY,'3.7.0 backend')
    pkgkey=prefix+'package.json';pkg=json.loads(data[pkgkey])
    pkg['version']='3.7.0'
    pkg['description']='Game Theme Music 3.7.0 adds an optional mini-player HUD visibility toggle while preserving existing audio and ResonaDeck integration.'
    data[pkgkey]=(json.dumps(pkg,indent=2,ensure_ascii=False)+'\n').encode()
    mkey=prefix+'plugin.json';m=json.loads(data[mkey])
    m['publish']['description']='Game Theme Music 3.7.0 adds a user-controlled Show mini player HUD switch. Hide the SAO-style Now Playing overlay without interrupting game, Ambient, or Store music.'
    m['description']='Game Theme Music 3.7.0 adds a persistent mini-player HUD on/off setting while preserving the 3.6.9 ResonaDeck audio-focus bridge and established music playback.'
    data[mkey]=(json.dumps(m,indent=2,ensure_ascii=False)+'\n').encode()
    data[prefix+'CHANGELOG.md']=(HEAD+data[prefix+'CHANGELOG.md'].decode()).encode()
    r=data[prefix+'README.md'].decode()
    r=swap(r,'optional passive activity visualization, four-second event display, and silent normal Stop events.','optional passive activity visualization, five-second event display, silent normal Stop events, and a persistent Show mini player HUD toggle (ON by default).','README HUD')
    r=swap(r,'# Game Theme Music 3.5.1','# Game Theme Music 3.7.0','README header')
    r=r.replace('## Steam Deck Soundtrack Manager','## Steam Deck Soundtrack Manager\n\n**New in 3.7.0:** Settings → Interface & feedback → **Show mini player HUD**. Turn OFF to hide Now Playing ribbons without disabling audio. Default ON. Reported by Dollet and tested on a physical Steam Deck.',1)
    data[prefix+'README.md']=r.encode()
    for name in ('VALIDATION_3.7.0.md','STORE_LISTING_3.7.0.md'):
        data[prefix+name]=Path('docs',name).read_bytes()
    out_src=Path(opt.src_out);(out_src/'dist').mkdir(parents=True,exist_ok=True)
    (out_src/'main.py').write_bytes(data[pykey])
    (out_src/'dist/index.js').write_bytes(data[jskey])
    out=Path(opt.output);out.parent.mkdir(parents=True,exist_ok=True)
    with zipfile.ZipFile(out,'w',allowZip64=True) as z:
        for info in entries:z.writestr(info,b'' if info.is_dir() else data[info.filename])
        for name in ('VALIDATION_3.7.0.md','STORE_LISTING_3.7.0.md'):
            z.writestr(prefix+name,data[prefix+name],compress_type=zipfile.ZIP_DEFLATED)
    with zipfile.ZipFile(out) as z:
        if z.testzip() is not None:raise RuntimeError('ZIP CRC failure')
        check(z.read(jskey),NEW_JS,'packaged frontend')
        check(z.read(pykey),NEW_PY,'packaged backend')
    print('VERIFIED GTM 3.7.0 ZIP',out.stat().st_size,'SHA256',hashlib.sha256(out.read_bytes()).hexdigest())
if __name__=='__main__':main()
