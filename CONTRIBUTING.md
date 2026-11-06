# Contributing to Game Theme Music

**Maintainer: Valentine · Current public version: 4.6.7 · Active maintenance**

Thank you for your interest in improving GTM. The current music-first experience is **feature-complete for its present direction**. Contributions are most valuable when they repair or verify something existing rather than expand the plugin into a new product.

## Before opening a pull request

- Check the [maintenance policy](docs/MAINTENANCE.md), [existing issues](https://github.com/ValentineBSAA/Game-Theme-Music/issues) and [current Getting Started guide](docs/GETTING_STARTED.md).
- For larger changes, open a bug report first so the issue can be reproduced and the scope understood.
- Keep changes focused: bug fix, compatibility repair, documentation correction, regression test, or narrowly scoped accessibility/quality-of-life improvement.
- Do not introduce new playable Arcade/multiplayer features or assume the historical 4.4.1 beta is an available release. The present Arcade is watch-only.

## Change safety

- Preserve music playback, stored playlists and explicit OFF choices. Visualizers themselves are **optional** and must never be required for music.
- Keep controller navigation and Default/Couch-TV layouts usable, including with CSS themes.
- Avoid changing the published 4.6.7 tag or release ZIP for a source-only/documentation PR.
- Never put access tokens, account credentials, user-private music libraries or personally identifying details in commits or issue logs.
- Write or update a regression test when feasible. Explain which behavior was tested in the PR.
- Prefer an actual Steam Deck or docked setup check for UI, audio focus and sleep/wake work. Be clear when hardware testing was not available.

## Existing tests

The read-only [GTM regression workflow](.github/workflows/publish-369-source.yml) checks runtime metadata, JavaScript/Python syntax, AI spectator scoring, 12 physics modes and shuffle setting persistence on pull requests. The default-branch runtime can lag behind the published installer (see SOURCE.md). A green run on older code isn't proof of 4.6.7 archive parity or full Deck compatibility.

## Reviews and expectations

There is no guaranteed response time or automatic merge approval. The maintainer chooses which changes fit GTM's maintenance scope. Reports and fixes may be deferred if they can't be reproduced or if the cost and risk outweigh the benefit.

[Current release](https://github.com/ValentineBSAA/Game-Theme-Music/releases/tag/V4.6.7) · [Bug form](https://github.com/ValentineBSAA/Game-Theme-Music/issues/new?template=bug_report.md) · [Maintenance policy](docs/MAINTENANCE.md)
