# GTM trusted behavior source | 4.1.4 Preview

The canonical editable runtime is `runtime-414.js`. After editing it, run:

```shell
python3 tools/sync_visualizer_behaviors.py
node --check dist/index.js
node GTM_4.1.4_REGRESSION.cjs
python3 GTM_4.1.4_PACK_TESTS.py
```

Read `GTM_4.1.4_EFFECTS_PACK_SDK.md` for the complete developer map, pack schema, effect ID registry, gameplay rules, and hardware QA procedure.

**Security:** external ZIP files cannot execute JS. User-defined scene packs can compose allowed legacy effects and 17 shared procedural overlays and bind safe audio modulators. New gameplay hooks remain engine-maintainer code.
