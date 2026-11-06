# Game Theme Music · Historical development archive

**Current supported release:** [Game Theme Music 4.5.8](https://github.com/ValentineBSAA/Game-Theme-Music/releases/tag/V4.5.8) · [Home](../../README.md) · [Release notes](../RELEASE_NOTES_4.5.8.md) · [Changelog](../../CHANGELOG.md)

This archive preserves earlier development material without burying the repository's current plugin files under hundreds of old versions. **These are historical snapshots, not the current Decky Store description, installation instructions, or proof of current compatibility.**

| Collection | Contents | Files |
| --- | --- | ---: |
| [Older Store listings](store-listings/) | Prior `STORE_LISTING_*.md` drafts from the 3.x release series. | 22 |
| [Earlier development notes](legacy-root-notes/) | Release notes, prototype ideas, old validation reports, test results and one-time planning documents formerly in the repository root. | 198 |
| [Historical regression scripts](../../tests/archive/legacy-root/) | Old version-specific test scripts and one-time regression launchers previously in the root directory. | 168 |

**Why are the historical scripts separate?** Many were designed for a specific 3.x or 4.x runtime, assumed the old root directory layout, or relied on other version-matched files. Treat them as preserved evidence, **not a maintained, ready-to-run test suite against 4.5.8**. To reproduce an older test, inspect the original Git commit or tag and its original file paths. Current version-aware source checks continue to run through [GitHub Actions](../../.github/workflows/publish-369-source.yml).

The two root-level 4.4.9 Pong regression files were deliberately left in place because the existing version-aware CI references them when validating that historical source version.

## Where to go now

- [Readme and installation](../../README.md)
- [Current release notes, 4.5.8](../RELEASE_NOTES_4.5.8.md)
- [Maintainer support policy](../MAINTENANCE.md)
- [Version history](../../CHANGELOG.md)
- [Source integrity and verification](../../SOURCE.md)
- [Current screenshots](../SCREENSHOTS.md)

Nothing here was rewritten to pretend earlier experiments shipped in the current release. All original revisions also remain recoverable through Git history. Legacy links copied from older notes may point to their original root paths; use these archive folders or an older tagged commit to locate those files.
