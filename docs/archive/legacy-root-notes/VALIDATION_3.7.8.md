> **SUPERSEDED IN 3.7.9:** Physical testing revealed that the full-screen Showcase could not be closed with B. The previous API-mock pass was insufficient. The unsafe Showcase and launch actions were removed in 3.7.9; see SAFETY_HOTFIX_3.7.9.md.

# GTM 3.7.8 Preview validation record

## Automated/static tests performed in the build environment

- PASS: Node.js JavaScript syntax check of the **exact** bundled `dist/index.js`.
- PASS: Python compilation of `main.py`.
- PASS: packaged ZIP CRC check and version consistency (package.json, main.py, frontend).
- PASS: simulated WebGL2 renderer API test, five modes, resource cleanup.
- PASS: simulated WebGL1 renderer API test, five modes, resource cleanup.
- PASS: simulated no-GPU path returns a Canvas fallback trigger.
- PASS: existing ten curated scene IDs and both settings selectors preserved; two new Showcase entry points added.
- PASS: original runtime helper executable permissions and unmodified binary bytes preserved in the repackaging process.

## Limitations and physical tests still required

This environment blocks GPU browser contexts, so **WebGL shader compilation and cinematic output could not be physically or visually verified here**. Browser API mocks verify renderer orchestration, not GPU shaders. The bundled shaders are derived from the separately tested Cinematic Visualizer Lab prototype. **No new Steam Deck hardware tests have been performed on this release.**

1. Install through Decky, confirm actual version 3.7.8 (not a 3.7.7 alias).
2. Enter Home with Ambient music, select each of the five Featured Worlds and confirm the object appears and responds to genuine beats.
3. Open Cinematic Showcase from either settings layout. Confirm the diagnostic reports WebGL2, WebGL1, or Canvas fallback; verify visible Close and B/Escape.
4. Verify GPU scenes remain below cards, do not capture controls, and disappear when Quick Access or Steam menus are open.
5. Switch back and forth between Featured Worlds and Signature modes; confirm each return still renders (fresh-canvas regression).
6. Verify silence, pause, track changes, plugin reload and system suspend/resume do not freeze audio or strand GPU resources.
7. Confirm Home screen UI responsiveness at 60Hz and other refresh rates; check actual Deck FPS/power/temperature and CSS Loader interactions.
8. Confirm Catherine Classic (Steam), NFS Most Wanted (non-Steam), Store, Ambient and ResonaDeck audio-focus behavior unchanged.
9. Reboot and verify scene selection, palette, Off preference and other options persist.

**Do not promote to Stable until the Deck passes these checks.**
