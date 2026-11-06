# Source integrity and release packaging

## Published stable: Game Theme Music 4.6.7

**Release:** [V4.6.7](https://github.com/ValentineBSAA/Game-Theme-Music/releases/tag/V4.6.7) · November 6, 2026  
**Installable ZIP:** [Game-Theme-Music-4.6.7.zip](https://github.com/ValentineBSAA/Game-Theme-Music/releases/download/V4.6.7/Game-Theme-Music-4.6.7.zip) · **42,599,088 bytes**  
**SHA-256:** `e287f1905c4981537e2756a0827b4bc3eb4364bc30db43d8f987690814ba166d`  
This SHA-256 **matches GitHub's release-asset digest** and the locally prepared installer. [Checksum file](docs/RELEASE_ASSET_SHA256_4.6.7.txt).

### Published ZIP versus checked-in source

**The release's named ZIP is the supported installable build.** At the time of this documentation update, main-branch compiled runtime/metadata still reflect an older release (4.5.8); updating documentation does **not** make those files byte-identical to the 4.6.7 ZIP. Treat the published ZIP as authoritative for installation. A separate runtime source synchronization and matching tests are required before claiming that the main branch builds 4.6.7.

Bundled **YT-DLP** and **QuickJS** executables remain in the installable ZIP. Large binaries and other third-party components may not exist in the repository checkout. GitHub's automatically generated **Source code** ZIP is not a full Decky installation archive.

### Verification and history

The maintainer physically verified both Store music surfaces, exit detection, the context-menu controls, ResonaDeck audio priority and enabled/idle visualizer behavior. Frequency response to ResonaDeck music was seen after refreshing its share toggle; automatic startup handshake has not been comprehensively verified. Syntax, ZIP integrity and focused regression checks were also performed during package preparation.

Previous releases [V4.5.8](https://github.com/ValentineBSAA/Game-Theme-Music/releases/tag/V4.5.8) and [V4.4.9](https://github.com/ValentineBSAA/Game-Theme-Music/releases/tag/V4.4.9) remain available for historical reference. No older installer is needed to install 4.6.7.

[Release notes](docs/RELEASE_NOTES_4.6.7.md) · [Testing](TESTING.md) · [Release index](docs/RELEASE_INDEX.md) · [Third-party licenses](THIRD-PARTY-NOTICES.md)
