# Validation — 3.4.1

## Root-cause fix

3.4.0 had two independent owners for the same D-pad/left-stick direction press:

1. Decky/Steam native `Focusable` navigation.
2. GTM's raw `SteamClient.Input.RegisterForControllerInputMessages` spatial-navigation listener.

That caused the exact on-device failure pattern: adjacent controls were skipped, focus crossed panes unexpectedly, activation could disagree with the visible focus, and custom `scrollIntoView` calls could move the viewport.

3.4.1 removes the custom directional layer entirely. Decky native `Focusable` flow is now the only owner of Up/Down/Left/Right. The proven 3.0.7 LB/RB section-switch handler remains unchanged.

## Native flow contract checked

- Games two-pane container: `flow-children="right"`
- Games filters: `right`
- Game list: `down`
- Source actions: `right`
- Playlist list: `down`
- Per-track actions: `right`
- Library list: `down`
- Find Music toolbar: `right`
- Find Music results: `down`
- Import actions: `right`

## Regression locks checked

Byte-for-byte match against 3.0.7:

- `gtmV307BootstrapTheme`
- `GtmV301AdaptiveThemeRuntime`
- `useGtmV301ShoulderNavigation`

Byte-for-byte match against 3.4.0:

- `main.py`
- bundled `yt-dlp`
- bundled QuickJS (`qjs`)

## Static validation

- JavaScript syntax: PASS
- Python compilation: PASS
- package/plugin JSON parsing: PASS
- custom GTM D-pad/left-stick hook absent: PASS
- custom GTM D-pad constants absent: PASS
- all required native Focusable flow groups present: PASS
- ZIP integrity: PASS

## Hardware gate

Steam's actual gamepad navigation tree is authoritative. Final confirmation remains a physical-controller walk on Deck: each D-pad press must move exactly one logical control, A must activate the visibly focused control, and no directional press may shove the manager viewport sideways.
