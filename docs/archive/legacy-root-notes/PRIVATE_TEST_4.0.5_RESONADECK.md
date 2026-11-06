# GTM 4.0.5 Private Test — ResonaDeck Visualizer Receiver

This build is based on the **published 4.0.4 RC4** installer, not a rebuild. It adds an isolated-frame compatible telemetry listener plus acknowledgements; existing GTM Live Footer and music player remain in control. ResonaDeck 1.3.3 only sends normalized read-only frequency data.

Test: install both private builds, choose a GTM footer scene, start ResonaDeck music, manually activate capture in ResonaDeck Settings, then return to Home. If real PCM is available, GTM should draw that scene using ResonaDeck frequency data even while GTM Ambient playback yields audio focus. If the source denies capture, no artificial bars or fake music reaction is generated.

This is a **private compatibility hotfix** and does not replace the public 4.0.4 GitHub release.
