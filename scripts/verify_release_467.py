#!/usr/bin/env python3
"""Audit GTM 4.6.7 and optionally repack a verified local installer.

A binary-aware packager, NOT a rebuild from missing original React/TS sources.
"""
import argparse
import hashlib
import json
import re
import sys
import zipfile
from pathlib import Path

PREFIX = 'Game-Theme-Music/'
MANIFEST = 'docs/VERIFIED_RUNTIME_4.6.7.md'
REQUIRED = {'dist/index.js', 'main.py', 'package.json', 'plugin.json'}


def sha(data):
    return hashlib.sha256(data).hexdigest()


def safe(path):
    return (path and not path.startswith('/') and '\\' not in path and
            all(part not in ('', '.', '..') for part in path.rstrip('/').split('/')))


def tracked(repo):
    manifest = (repo / MANIFEST).read_text(encoding='utf-8')
    matches = re.findall(r'^\| \x60([^\x60]+)\x60 \| \x60([a-f0-9]{64})\x60 \|$', manifest, re.M)
    if len(matches) < 4 or len(set(path for path, _ in matches)) != len(matches):
        raise ValueError('Invalid or duplicate verified-runtime manifest entries')
    expected = dict(matches)
    if not REQUIRED <= expected.keys():
        raise ValueError('Missing critical runtime checksums')
    files = {}
    for name, digest in expected.items():
        if not safe(name):
            raise ValueError('Unsafe manifest path: ' + name)
        data = (repo / name).read_bytes()
        if sha(data) != digest:
            raise ValueError('Tracked checksum mismatch: ' + name)
        files[name] = data
    if (json.loads(files['package.json'])['version'] != '4.6.7' or
            json.loads(files['plugin.json'])['version'] != '4.6.7' or
            b'const GTM_VERSION = "4.6.7";' not in files['dist/index.js']):
        raise ValueError('Runtime and metadata version mismatch')
    return files


def package_files(baseline, checked):
    contents = {}
    total = 0
    with zipfile.ZipFile(baseline) as z:
        if len(z.infolist()) > 5000 or z.testzip() is not None:
            raise ValueError('Bad ZIP CRC or unsafe file count')
        for item in z.infolist():
            name = item.filename
            if not safe(name) or (item.external_attr >> 16) & 0o170000 == 0o120000:
                raise ValueError('Unsafe ZIP member: ' + name)
            if item.is_dir():
                continue
            if not name.startswith(PREFIX):
                raise ValueError('Wrong package root: ' + name)
            relative = name[len(PREFIX):]
            if not relative or relative in contents:
                raise ValueError('Duplicate ZIP member: ' + name)
            total += item.file_size
            if total > 512 * 1024 * 1024:
                raise ValueError('ZIP too large')
            contents[relative] = z.read(item)
    if not all(x in contents for x in ('bin/yt-dlp', 'bin/qjs')):
        raise ValueError('Bundled runtime dependencies missing')
    for name, data in checked.items():
        if contents.get(name) != data:
            raise ValueError('Packaged runtime differs from verified source: ' + name)
    return contents


def repack(output, files):
    if output.exists() or output.with_suffix(output.suffix + '.part').exists():
        raise ValueError('Refusing to overwrite an existing output')
    output.parent.mkdir(parents=True, exist_ok=True)
    part = output.with_suffix(output.suffix + '.part')
    try:
        with zipfile.ZipFile(part, 'w', allowZip64=True) as z:
            for name in sorted(files):
                info = zipfile.ZipInfo(PREFIX + name, (1980, 1, 1, 0, 0, 0))
                info.compress_type = zipfile.ZIP_DEFLATED
                info.external_attr = 0o100644 << 16
                z.writestr(info, files[name], compresslevel=6)
        with zipfile.ZipFile(part) as z:
            if z.testzip() is not None or len(z.namelist()) != len(files):
                raise ValueError('Repacked ZIP did not validate')
            for name, data in files.items():
                if z.read(PREFIX + name) != data:
                    raise ValueError('Repacked file mismatch: ' + name)
        part.rename(output)
    finally:
        if part.exists():
            part.unlink()


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--repo', type=Path, default=Path(__file__).resolve().parent.parent)
    p.add_argument('--baseline', type=Path, help='A trusted local GTM 4.6.7 installer ZIP')
    p.add_argument('--output', type=Path, help='New deterministic comparison ZIP, requires --baseline')
    a = p.parse_args()
    if a.output and not a.baseline:
        p.error('--output needs --baseline')
    if a.output and a.baseline and a.output.resolve() == a.baseline.resolve():
        p.error('Output cannot overwrite input')
    files = tracked(a.repo)
    print(f'PASS: {len(files)} SHA-256-verified GTM 4.6.7 tracked files')
    if a.baseline:
        original = package_files(a.baseline, files)
        print(f'PASS: {len(original)} installer files match tracked runtime; input SHA-256 {sha(a.baseline.read_bytes())}')
        if a.output:
            original.update(files)
            repack(a.output, original)
            print(f'PASS: deterministic comparison ZIP {a.output} (SHA-256 {sha(a.output.read_bytes())})')
    print('Scope: runtime verification and packaging only; original frontend sources are not reconstructed.')


if __name__ == '__main__':
    try:
        main()
    except (OSError, ValueError, KeyError, zipfile.BadZipFile, json.JSONDecodeError) as error:
        print(f'FAIL: {error}', file=sys.stderr)
        sys.exit(1)
