# Validation — Game Theme Music 3.4.3

## Targeted fixes
- Online search result A action opens preview instead of downloading.
- Preview automatically starts when playable audio resolves.
- Download + Add is an explicit second action and shows the exact destination.
- Back/B closes the preview via ModalRoot onCancel.
- Game playlist rows have a direct Preview / Stop Preview control.
- Track editor has Preview Changes, playback range, full-track reset, global/custom fades, Save Changes, and Cancel.
- Save and Cancel explicitly close the Decky modal handle.
- Track editor and preview close on route changes to prevent stranded modal overlays.
- Modal surfaces copy the live 3.0.7 semantic theme variables rather than hardcoding cyan/navy colors.

## Regression locks
- gtmV307BootstrapTheme unchanged from 3.0.7.
- GtmV301AdaptiveThemeRuntime unchanged from 3.0.7.
- useGtmV301ShoulderNavigation unchanged from 3.0.7.
- yt-dlp and QuickJS binaries unchanged from 3.0.7.
- 3.4.1 native single-step directional navigation remains in place.
- 3.4.2 manager context, automatic game search, grid/list results, and manager history remain in place.
