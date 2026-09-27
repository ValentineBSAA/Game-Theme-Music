# Third-party notices

Game Theme Music 3.6.9 bundles or uses third-party software. The short labels below are summaries only; the applicable upstream license terms remain authoritative.

## yt-dlp

- Version bundled in Game Theme Music 3.6.9: **2026.08.19**
- Bundled form: upstream standalone Linux x86_64 executable
- Project: https://github.com/yt-dlp/yt-dlp
- SHA-256: `58162f9bfdc27458ea47bfcb311cf47028f17d8154a8bf7d689861d46399230a`

yt-dlp’s own project code is licensed under **The Unlicense**. However, yt-dlp explicitly notes that distributed executable builds can contain code from third-party projects under additional licenses. PyInstaller-bundled executables are treated upstream as combined works under **GPLv3+** and include additional third-party license terms.

For that reason, the bundled executable should not be described simply as “yt-dlp — The Unlicense.”

Upstream licensing information:

- https://github.com/yt-dlp/yt-dlp#licensing
- https://github.com/yt-dlp/yt-dlp/blob/master/THIRD_PARTY_LICENSES.txt

Game Theme Music does not claim ownership of yt-dlp or its bundled third-party components.

## QuickJS

- Version bundled in Game Theme Music 3.6.9: **2026-06-04**
- Component: Linux x86_64 `qjs`
- Project: https://bellard.org/quickjs/
- SHA-256: `772504dcdc78b5ebb3f2c991e8d121ec727c002ac81d4208546fcd3b81c97cd1`
- License: MIT

## Mutagen

- Version: **1.47.0**
- Project: https://github.com/quodlibet/mutagen
- Purpose: local embedded-cover extraction for offline artwork on imported audio
- License: GPL-2.0-or-later

## ThemeDeck feature research

Game Theme Music 2.8.0 was informed by public feature and Steam-library-scanning patterns from ThemeDeck by BrenticusMaximus.

- License: BSD 3-Clause

## User-downloaded media

Game Theme Music includes tools that can interact with supported online media sources. Users are responsible for downloading only media they are permitted to download and use under the applicable service terms, copyright rules, and local law.

## Release packaging

Where an upstream executable bundles multiple third-party components, Game Theme Music relies on the upstream project’s published third-party notices and license texts rather than collapsing the executable to a single license label.
