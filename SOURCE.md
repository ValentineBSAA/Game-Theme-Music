# Source integrity and release channels

## What is published and what is being prepared?

- **4.4.1 Public Beta:** Maintainer-accepted candidate for release, **ZIP upload pending**. [Release notes](docs/RELEASE_NOTES_4.4.1.md) and [expected checksum](docs/RELEASE_MANIFEST_4.4.1.md).
- **4.1.2:** [Most recent currently published release on GitHub](https://github.com/ValentineBSAA/Game-Theme-Music/releases/tag/V4.1.2) at the time of the 4.4.1 documentation update.
- **3.7.0:** [Older stable release](https://github.com/ValentineBSAA/Game-Theme-Music/releases/tag/V3.7.0).

**Important version boundary:** The repository's **main branch still carries 4.1.2 runtime code** in [dist/index.js](dist/index.js), [main.py](main.py), [plugin.json](plugin.json), and [package.json](package.json). Updating public beta documentation **does not upgrade those binaries, tests or manifests to 4.4.1**. They must be synchronized separately from the exact approved beta installer before the main branch can be described as 4.4.1 source.

The installed 4.4.1 beta ZIP contains a more recent frontend/backend and Arcade implementation than the current main-branch runtime snapshot. Do not compare the current main-branch JS with 4.4.1 release notes and assume it is the same code.

## Reproducibility and installation

The repository does not contain the original complete reproducible TypeScript/React project. The main branch contains a compiled frontend plus Python backend. An automatically generated GitHub **“Source code” ZIP is not an installable Decky plugin**.

Install only the **maintainer-uploaded plugin ZIP** from [Releases](https://github.com/ValentineBSAA/Game-Theme-Music/releases). The expected SHA-256 of the 4.4.1 candidate handoff is:

`f287d2f85eb5e52ec64b38eb4e6702292139e6db128ea379899db88b956cb537`

This checksum identifies the specific candidate supplied for the release upload. If a different binary is uploaded or rebuilt, the checksum and manifest must be updated to reflect what is actually published.

## Validation boundaries

The 4.4.1 candidate passed automated regressions and received maintainer-reported Steam Deck verification of its enlarged Chess board and several other Arcade games. That does **not** establish verified source parity with main, universal performance on every SteamOS version, or completed Chess gameplay. See [TESTING.md](TESTING.md) and [Chess alpha notes](docs/RELEASE_NOTES_4.4.1.md).

[4.1.2 checksum](docs/RELEASE_MANIFEST_4.1.2.md) · [4.4.1 candidate checksum](docs/RELEASE_MANIFEST_4.4.1.md) · [License](LICENSE) · [Third-party notices](THIRD-PARTY-NOTICES.md)
