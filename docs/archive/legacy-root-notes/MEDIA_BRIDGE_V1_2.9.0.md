# Game Theme Music Media Bridge v1

GTM 2.9.0 exposes a small observer-only bridge for optional companion Decky plugins. It is intended for visual integrations such as a live wallpaper, Home-screen footer visualizer, artwork treatment, or other presentation layers. GTM remains fully functional when no companion plugin is installed.

## Discovery

The bridge is exposed in the Gaming Mode renderer as:

```js
window.GameThemeMusicBridge
window.__GTM_MEDIA_BRIDGE__ // compatibility alias
```

A companion that starts before GTM can listen for:

```text
gtm:bridge:ready
```

State changes are also announced as:

```text
gtm:bridge:state
```

GTM dismount announces:

```text
gtm:bridge:unavailable
```

The ready/unavailable event detail contains `protocolVersion` and `pluginVersion`. State-event detail contains the same snapshot returned by `getState()`.

## Protocol

`protocolVersion` is **1**. Companion plugins should key compatibility to the protocol version rather than the GTM release number.

The bridge exposes:

```js
{
  protocolVersion: 1,
  pluginVersion: "2.9.0",
  capabilities: {
    state: true,
    metadata: true,
    timing: true,
    artwork: true,
    surfaceContext: true,
    audioTelemetry: true,
    telemetryBands: 12,
    telemetryHz: 20,
    playbackControl: false
  },
  getState(),
  subscribe(listener),
  subscribeAudioTelemetry(listener)
}
```

Both subscribe methods return an unsubscribe function.

## State snapshot

`getState()` and `subscribe()` provide a snapshot shaped like:

```js
{
  protocolVersion,
  pluginVersion,
  timestamp,
  environment: {
    desktopMode,
    uiMode,
    surface,
    surfaceLabel
  },
  playback: {
    state,
    playing,
    paused,
    kind,          // idle | ambient | store | game-theme | preview
    owner,
    appId,
    gameName,
    trackKey,
    title,
    provider,
    artwork,
    nextTitle,
    playlistIndex,
    playlistTotal,
    currentTime,
    duration,
    volume
  }
}
```

Timing values are seconds. `getState()` can be polled by a visual surface when smooth progress is needed; ordinary state subscriptions are event-driven so GTM does not generate needless updates.

## Audio telemetry

`subscribeAudioTelemetry(listener)` is explicitly opt-in. With no telemetry subscribers, GTM creates no external analyzer and performs no telemetry sampling.

When Steam exposes a capturable stream, packets are emitted at up to 20 Hz:

```js
{
  protocolVersion,
  pluginVersion,
  timestamp,
  available: true,
  active: true,
  bands: [/* 12 normalized 0..1 bands */],
  low,
  mid,
  high,
  rms,
  peak
}
```

When capture is unavailable, the listener receives `available: false` and zeroed telemetry. A companion should fall back to a non-reactive animation or hide its visualizer. It must not treat unavailable telemetry as a playback failure.

GTM uses `HTMLMediaElement.captureStream()` / `mozCaptureStream()` when available and a separate `AudioContext` analyzer. The analyzer never becomes part of the playback output graph.

## Safety boundary

Media Bridge v1 is intentionally read-only. It does **not** expose Play, Pause, Stop, Previous, Next, seek, volume, playlist mutation, provider resolution, or AudioEngine ownership.

This boundary is permanent for protocol v1. A visual companion should react to GTM, never drive GTM.

## Recommended live-wallpaper behavior

For a Home-screen footer visualizer or audio-reactive wallpaper:

1. Subscribe to normal GTM state when the companion plugin mounts.
2. Enable audio telemetry only while the visual surface is actually visible.
3. Unsubscribe from telemetry immediately when leaving Home or hiding the wallpaper.
4. Use `environment.desktopMode` and `playback.playing` as hard visibility gates.
5. Treat telemetry as optional enhancement. Metadata/artwork/state remain useful when real audio capture is unavailable.

This keeps visual work out of GTM's playback-critical path and prevents background FFT work when the user cannot see it.
