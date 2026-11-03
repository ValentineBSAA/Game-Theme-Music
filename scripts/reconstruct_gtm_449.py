#!/usr/bin/env python3
"""Rebuild GTM 4.4.9 from the checksum-verified 4.4.1 release and source delta.

No external input other than the original public 4.4.1 ZIP is trusted. The
manifest checks every changed file against the exact user-tested 4.4.9 ZIP.
The output is a directly installable Decky ZIP, not an Actions wrapper.
"""
from __future__ import annotations
import argparse
import base64
import hashlib
import io
import json
import shutil
import subprocess
import tarfile
import tempfile
import zipfile
from pathlib import Path
from PIL import Image

ROOT = 'Game-Theme-Music/'
PNG_NAMES = ('icon.png', 'logo.png', 'assets/icon.png', 'assets/logo.png')
EXCLUDE_SOURCE = ('bin/', 'mutagen/')

def digest(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()

def is_safe(s: str) -> bool:
    p=Path(s)
    return s and not p.is_absolute() and '..' not in p.parts and '\\' not in s

def load_delta(path: Path):
    raw=base64.b64decode(''.join(path.read_text().split()),validate=True)
    with tempfile.TemporaryDirectory() as folder:
        zst=Path(folder)/'delta.tar.zst'; tar=Path(folder)/'delta.tar'
        zst.write_bytes(raw)
        subprocess.run(['zstd','-q','-d','-f',str(zst),'-o',str(tar)],check=True)
        with tarfile.open(tar,'r') as archive:
            members=archive.getmembers()
            assert all(m.isfile() and is_safe(m.name) for m in members)
            return {m.name:archive.extractfile(m).read() for m in members}

def reconstruct(original_zip: Path, payload: Path):
    delta=load_delta(payload)
    manifest=json.loads(delta['manifest.json'])
    original_raw=original_zip.read_bytes()
    assert digest(original_raw)==manifest['original_sha256'], 'Incorrect 4.4.1 base archive'
    with zipfile.ZipFile(original_zip) as z:
        assert z.testzip() is None
        files={n[len(ROOT):]:z.read(n) for n in z.namelist() if n.startswith(ROOT) and not n.endswith('/')}
        assert all(is_safe(k) for k in files)
    seen=set()
    with tempfile.TemporaryDirectory() as folder:
        base=Path(folder)
        for name,encoded in delta.items():
            if name == 'manifest.json': continue
            if name.startswith('files/'):
                target=name[len('files/'):]
                assert is_safe(target) and target in manifest['changed']
                assert target not in files or digest(files[target])!=digest(encoded)
                files[target]=encoded
            elif name.startswith('zpatch/') and name.endswith('.zst'):
                target=name[len('zpatch/'):-len('.zst')]
                assert is_safe(target) and target in files and target in manifest['changed']
                basefile=base/'original';patchfile=base/'delta.zst';result=base/'new'
                basefile.write_bytes(files[target]);patchfile.write_bytes(encoded)
                subprocess.run(['zstd','-q','-d','-f',f'--patch-from={basefile}',str(patchfile),'-o',str(result)],check=True)
                files[target]=result.read_bytes()
            else: raise AssertionError(f'Unexpected payload entry: {name}')
            assert target not in seen, f'Duplicate target {target}'
            seen.add(target)
    icon_source=files['assets/game-theme-music-icon.webp']
    with Image.open(io.BytesIO(icon_source)) as im:
        icon=io.BytesIO(); im.convert('RGBA').save(icon,format='PNG',optimize=True)
    for name in PNG_NAMES:
        files[name]=icon.getvalue()
    for path,sha in manifest['changed'].items():
        assert path in files, f'Missing updated file: {path}'
        assert digest(files[path])==sha, f'Not the tested 4.4.9 file: {path}'
    assert set(manifest['changed'])==seen.union(PNG_NAMES), 'Unaccounted changed files'
    for p in ('plugin.json','package.json','visualizer-packs/arcade/manifest.json'):
        assert json.loads(files[p])['version']=='4.4.9',p
    assert 'const GTM_VERSION = "4.4.9";' in files['dist/index.js'].decode()
    assert '4.4.9' in files['main.py'].decode()
    assert b'const GTM_VERSION' in files['dist/index.js']
    assert '32 ball' in files['RELEASE_NOTES_4.4.9.md'].decode() or '32 power' in files['RELEASE_NOTES_4.4.9.md'].decode()
    print('PASS reconstructed 4.4.9 with',len(files),'files; original ZIP SHA',manifest['zip_sha256'])
    return files

def write_zip(files:dict[str,bytes], output:Path):
    output.parent.mkdir(parents=True,exist_ok=True)
    with zipfile.ZipFile(output,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=6) as z:
        for name,data in files.items(): z.writestr(ROOT+name,data)
    with zipfile.ZipFile(output) as z:
        assert z.testzip() is None
        assert len(z.namelist())==len(files)
        assert z.read(ROOT+'plugin.json')==files['plugin.json']
    print('PASS direct installable ZIP',output,output.stat().st_size,'bytes')

def copy_source(files:dict[str,bytes],repo:Path):
    num=0
    for name,data in files.items():
        if name.startswith(EXCLUDE_SOURCE):continue
        if name.startswith('release-payload/'):continue
        dest=repo/name
        assert is_safe(name)
        dest.parent.mkdir(parents=True,exist_ok=True)
        if not dest.exists() or dest.read_bytes()!=data:
            dest.write_bytes(data)
            num+=1
    print('PASS synchronized source and docs:',num,'changed/new tracked files')

def main():
    p=argparse.ArgumentParser()
    p.add_argument('--original',required=True,type=Path)
    p.add_argument('--payload',type=Path,default=Path('release-payload/gtm449-source-delta.tar.zst.b64'))
    p.add_argument('--output',required=True,type=Path)
    p.add_argument('--repo-dir',type=Path)
    a=p.parse_args()
    files=reconstruct(a.original,a.payload)
    write_zip(files,a.output)
    if a.repo_dir: copy_source(files,a.repo_dir)

if __name__=='__main__': main()