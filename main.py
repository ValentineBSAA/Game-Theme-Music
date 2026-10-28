"""Game Theme Music 3.7.0 backend.

Cached audio is streamed over a tokenized loopback server. Provider, storage,
update, health, and diagnostic operations are exposed as Decky RPC methods.
"""

from __future__ import annotations

import asyncio
import base64
import datetime
import glob
import hashlib
import json
import logging
import os
import platform
import re
import secrets
import shutil
import ssl
import time
import urllib.parse
import zipfile
from collections import deque
from pathlib import Path
from typing import Any

import aiohttp
from aiohttp import web
import certifi

import decky
from settings import SettingsManager  # type: ignore


logging.basicConfig(level=logging.INFO)
logger = getattr(decky, "logger", logging.getLogger(__name__))

PLUGIN_VERSION = getattr(decky, "DECKY_PLUGIN_VERSION", "3.7.0")
INDEX_VERSION = 1
DEFAULT_STORAGE_LIMIT_MB = 2048
MAX_AUDIO_BYTES = 2 * 1024**3
MAX_HTML_BYTES = 6 * 1024**2
MAX_ARTWORK_BYTES = 8 * 1024**2

# 3.5.6: keep following the provider until yt-dlp actually exhausts the search.
# The UI remains 20-at-a-time; these are only safety ceilings, not a claim that
# YouTube has no more matches. If a ceiling is reached we report that honestly.
YOUTUBE_SEARCH_PAGE_SIZE = 20
YOUTUBE_SEARCH_MAX_VISIBLE = 500
YOUTUBE_SEARCH_MAX_RAW = 1500
YOUTUBE_SEARCH_MAX_DURATION_SECONDS = 20 * 60
YOUTUBE_SEARCH_LINE_TIMEOUT = 18.0
YOUTUBE_SEARCH_SESSION_TTL = 300.0

AUDIO_DOWNLOAD_EXTENSIONS = (
    "mp3", "ogg", "flac", "m4a", "wav", "aac", "opus", "webm", "weba", "mp4"
)
MIME_TYPES = {
    "m4a": "audio/mp4",
    "mp3": "audio/mpeg",
    "webm": "audio/webm",
    "weba": "audio/webm",
    "ogg": "audio/ogg",
    "wav": "audio/wav",
    "aac": "audio/aac",
    "flac": "audio/flac",
    "opus": "audio/ogg",
    "mp4": "audio/mp4",
}
SAFE_MEDIA_ID = re.compile(r"^[A-Za-z0-9._-]{1,128}$")
SENSITIVE_KEY = re.compile(r"(token|secret|password|cookie|authorization)", re.I)
URL_PATTERN = re.compile(r"https?://[^\s\"'<>]+")


def get_audio_filename(media_id: str) -> str:
    """Return a stable path-safe stem while preserving the old URL mapping."""
    if media_id.startswith(("https://", "http://")):
        # Compatibility key for downloads made by 1.8 and older.
        return hashlib.md5(media_id.encode("utf-8")).hexdigest()  # noqa: S324
    if SAFE_MEDIA_ID.fullmatch(media_id):
        return media_id
    return "id_" + hashlib.sha256(media_id.encode("utf-8")).hexdigest()[:32]


def infer_download_extension(url: str) -> str:
    path = urllib.parse.urlsplit(url).path
    extension = path.rsplit(".", 1)[-1].lower() if "." in path else ""
    return extension if extension in AUDIO_DOWNLOAD_EXTENSIONS else "webm"


def infer_response_audio_extension(content_type: str, fallback: str) -> str:
    mime = str(content_type or "").split(";", 1)[0].strip().lower()
    return {
        "audio/mpeg": "mp3",
        "audio/mp4": "m4a",
        "video/mp4": "mp4",
        "audio/webm": "webm",
        "video/webm": "webm",
        "audio/ogg": "ogg",
        "application/ogg": "ogg",
        "audio/aac": "aac",
        "audio/flac": "flac",
        "audio/wav": "wav",
        "audio/x-wav": "wav",
    }.get(mime, fallback)


def get_ytdlp_path() -> str:
    binary = "yt-dlp.exe" if platform.system() == "Windows" else "yt-dlp"
    return os.path.join(decky.DECKY_PLUGIN_DIR, "bin", binary)


def get_js_runtime_path() -> str:
    binary = "qjs.exe" if platform.system() == "Windows" else "qjs"
    return os.path.join(decky.DECKY_PLUGIN_DIR, "bin", binary)


def get_ytdlp_runtime_args() -> tuple[str, ...]:
    runtime_path = get_js_runtime_path()
    if os.path.isfile(runtime_path):
        return ("--js-runtimes", f"quickjs:{runtime_path}")
    logger.warning("Bundled QuickJS is missing; YouTube support may be limited.")
    return ()


def get_ytdlp_env() -> dict[str, str]:
    """Avoid Decky's stale OpenSSL search path for native helper binaries."""
    env = os.environ.copy()
    bin_path = os.path.join(decky.DECKY_PLUGIN_DIR, "bin")
    env["PATH"] = f"{bin_path}:{env.get('PATH', '')}"
    env["LD_LIBRARY_PATH"] = "/usr/lib:/usr/lib64:/lib:/lib64"
    return env


def _now_iso() -> str:
    return datetime.datetime.now(datetime.timezone.utc).isoformat()


def _safe_json_write(path: str, value: Any) -> None:
    os.makedirs(os.path.dirname(path), exist_ok=True)
    temporary = f"{path}.tmp"
    with open(temporary, "w", encoding="utf-8") as file:
        json.dump(value, file, ensure_ascii=False, indent=2)
        file.flush()
        os.fsync(file.fileno())
    os.replace(temporary, path)


def _read_binary_vdf_cstring(data: bytes, pos: int) -> tuple[str, int]:
    end = data.find(b"\x00", pos)
    if end < 0:
        raise ValueError("unterminated binary VDF string")
    return data[pos:end].decode("utf-8", errors="replace"), end + 1


def _parse_binary_vdf_object(data: bytes, pos: int = 0) -> tuple[dict[str, Any], int]:
    """Parse the small KeyValues1 subset used by Steam shortcuts.vdf."""
    result: dict[str, Any] = {}
    length = len(data)
    while pos < length:
        value_type = data[pos]
        pos += 1
        if value_type == 0x08:  # object terminator
            break
        key, pos = _read_binary_vdf_cstring(data, pos)
        if value_type == 0x00:  # nested object
            value, pos = _parse_binary_vdf_object(data, pos)
        elif value_type == 0x01:  # string
            value, pos = _read_binary_vdf_cstring(data, pos)
        elif value_type == 0x02:  # signed int32
            if pos + 4 > length:
                raise ValueError("truncated int32 in binary VDF")
            value = int.from_bytes(data[pos:pos + 4], "little", signed=True)
            pos += 4
        elif value_type == 0x03:  # float32, unused here
            if pos + 4 > length:
                raise ValueError("truncated float in binary VDF")
            pos += 4
            value = None
        elif value_type == 0x07:  # uint64
            if pos + 8 > length:
                raise ValueError("truncated uint64 in binary VDF")
            value = int.from_bytes(data[pos:pos + 8], "little", signed=False)
            pos += 8
        elif value_type == 0x0A:  # int64 on newer KeyValues writers
            if pos + 8 > length:
                raise ValueError("truncated int64 in binary VDF")
            value = int.from_bytes(data[pos:pos + 8], "little", signed=True)
            pos += 8
        else:
            # shortcuts.vdf uses objects, strings and int32s. Failing this one
            # file is safer than trying to guess an unknown field width.
            raise ValueError(f"unsupported binary VDF type {value_type:#x}")
        if value is not None:
            result[key] = value
    return result, pos


def _steam_shortcut_files(home: str) -> list[Path]:
    roots = [
        Path(home) / ".steam" / "steam" / "userdata",
        Path(home) / ".steam" / "root" / "userdata",
        Path(home) / ".local" / "share" / "Steam" / "userdata",
    ]
    paths: dict[str, Path] = {}
    for root in roots:
        try:
            for path in root.glob("*/config/shortcuts.vdf"):
                if path.is_file():
                    paths[str(path.resolve())] = path
        except Exception:
            continue
    return sorted(paths.values(), key=lambda item: item.stat().st_mtime if item.exists() else 0, reverse=True)


def _read_steam_shortcuts(home: str) -> list[dict[str, Any]]:
    """Return non-Steam shortcut names keyed by the uint32 appid Steam exposes."""
    by_id: dict[str, dict[str, Any]] = {}
    for path in _steam_shortcut_files(home):
        try:
            payload, _ = _parse_binary_vdf_object(path.read_bytes(), 0)
            shortcuts = payload.get("shortcuts", payload)
            if not isinstance(shortcuts, dict):
                continue
            for entry in shortcuts.values():
                if not isinstance(entry, dict):
                    continue
                raw_id = entry.get("appid")
                name = str(entry.get("appname") or "").strip()
                if not name or not isinstance(raw_id, int):
                    continue
                app_u32 = raw_id & 0xFFFFFFFF
                app_id = str(app_u32)
                signed_id = str(app_u32 - 0x100000000) if app_u32 >= 0x80000000 else app_id
                shortcut_game_id = str((app_u32 << 32) | 0x02000000)
                by_id.setdefault(app_id, {
                    "id": app_id,
                    "aliases": list(dict.fromkeys([app_id, signed_id, shortcut_game_id])),
                    "name": name,
                    "exe": str(entry.get("exe") or ""),
                    "start_dir": str(entry.get("StartDir") or entry.get("startdir") or ""),
                    "source": "shortcuts.vdf",
                })
        except Exception as error:
            logger.debug("Could not parse Steam shortcuts file %s: %s", path, error)
    return sorted(by_id.values(), key=lambda item: str(item.get("name", "")).casefold())


class Plugin:
    yt_process: asyncio.subprocess.Process | None = None
    yt_process_lock = asyncio.Lock()
    ssl_context = ssl.create_default_context(cafile=certifi.where())

    music_path = f"{decky.DECKY_PLUGIN_RUNTIME_DIR}/music"
    cache_path = f"{decky.DECKY_PLUGIN_RUNTIME_DIR}/cache"
    diagnostics_path = f"{decky.DECKY_PLUGIN_RUNTIME_DIR}/diagnostics"
    artwork_path = f"{decky.DECKY_PLUGIN_RUNTIME_DIR}/artwork"

    def __init__(self):
        self._stream_runner: web.AppRunner | None = None
        self._stream_site: web.TCPSite | None = None
        self._stream_port: int | None = None
        self._stream_token = secrets.token_urlsafe(24)
        self._preferred_stream_port = 0
        self._load_stream_endpoint_state()
        self._errors: deque[dict[str, str]] = deque(maxlen=50)
        self._download_lock = asyncio.Lock()
        self._pinned_ids: set[str] = set()
        self._download_index: dict[str, Any] = {
            "version": INDEX_VERSION,
            "files": {},
        }
        self._search_cache: dict[str, tuple[float, list[dict[str, Any]]]] = {}
        self._search_cache_ttl = YOUTUBE_SEARCH_SESSION_TTL
        # 3.5.5: one paged YouTube discovery process stays alive while the user
        # browses a query. This preserves YouTube continuation state and lets us
        # skip unsuitable long-form mixes without falsely declaring end-of-list.
        self._paged_search_process: asyncio.subprocess.Process | None = None
        self._paged_search_lock = asyncio.Lock()
        self._paged_search_term = ""
        self._paged_search_rows: list[dict[str, Any]] = []
        self._paged_search_ids: set[str] = set()
        self._paged_search_raw_seen = 0
        self._paged_search_exhausted = True
        self._paged_search_started = 0.0
        self._paged_search_last_timeout = False
        # 2.7.22+: provider URL cache and single-flight resolver. YouTube CDN URLs
        # are temporary, but re-running yt-dlp on every shortcut-page visit is
        # needlessly expensive. Cache only until shortly before the provider
        # expiry and share one resolver task across concurrent callers.
        self._resolved_url_cache: dict[str, tuple[float, str]] = {}
        self._resolved_url_tasks: dict[str, asyncio.Task[str | None]] = {}
        # 2.7.23: keep temporary provider URLs across frontend/plugin reloads so
        # a still-valid YouTube CDN URL does not need another yt-dlp extraction.
        self._resolved_cache_save_task: asyncio.Task[None] | None = None
        self._startup_maintenance_task: asyncio.Task[None] | None = None
        self._materialize_tasks: dict[str, asyncio.Task[bool]] = {}
        self._download_index_save_task: asyncio.Task[None] | None = None
        # 3.4.5: short-lived loopback preview proxies let Chromium play remote
        # provider audio before any file is downloaded. Download jobs expose
        # real byte progress to the couch UI without blocking the modal.
        self._preview_sources: dict[str, dict[str, Any]] = {}
        # 3.5.6: local-import previews are registered before import so the
        # Soundtrack Manager can browse, audition, and queue files in-place.
        self._import_preview_sources: dict[str, str] = {}
        self._download_jobs: dict[str, dict[str, Any]] = {}
        self._download_job_tasks: dict[str, asyncio.Task[None]] = {}
        # 3.4.7: preview URL warm-up happens immediately after a search so the
        # result the user picks is usually ready before the preview dialog opens.
        # Keep it bounded; spawning yt-dlp for every result at once would waste
        # CPU/network on the Deck.
        self._preview_warm_tasks: set[asyncio.Task[Any]] = set()

    @property
    def index_path(self) -> str:
        return os.path.join(self.music_path, "downloads.json")

    @property
    def resolved_url_cache_path(self) -> str:
        return os.path.join(
            decky.DECKY_PLUGIN_RUNTIME_DIR, "resolved-provider-urls.json"
        )

    @property
    def stream_endpoint_state_path(self) -> str:
        return os.path.join(decky.DECKY_PLUGIN_RUNTIME_DIR, "stream-endpoint.json")

    def _load_stream_endpoint_state(self) -> None:
        try:
            with open(self.stream_endpoint_state_path, "r", encoding="utf-8") as file:
                raw = json.load(file)
            port = int(raw.get("port") or 0)
            token = str(raw.get("token") or "")
            if 1024 <= port <= 65535:
                self._preferred_stream_port = port
            if re.fullmatch(r"[A-Za-z0-9_-]{16,128}", token):
                self._stream_token = token
        except Exception:
            pass

    def _save_stream_endpoint_state(self) -> None:
        try:
            os.makedirs(decky.DECKY_PLUGIN_RUNTIME_DIR, exist_ok=True)
            temporary = self.stream_endpoint_state_path + ".part"
            with open(temporary, "w", encoding="utf-8") as file:
                json.dump({"port": int(self._stream_port or self._preferred_stream_port or 0), "token": self._stream_token}, file)
            os.replace(temporary, self.stream_endpoint_state_path)
            try:
                os.chmod(self.stream_endpoint_state_path, 0o600)
            except Exception:
                pass
        except Exception as error:
            logger.debug("Could not persist loopback endpoint: %s", error)

    @property
    def error_log_path(self) -> str:
        log_dir = getattr(
            decky, "DECKY_PLUGIN_LOG_DIR", decky.DECKY_PLUGIN_RUNTIME_DIR
        )
        return os.path.join(log_dir, "health-errors.jsonl")

    async def _main(self):
        logger.info("Initializing Game Theme Music %s", PLUGIN_VERSION)
        self.settings = SettingsManager(
            name="config", settings_directory=decky.DECKY_PLUGIN_SETTINGS_DIR
        )
        for directory in (self.music_path, self.cache_path, self.diagnostics_path, self.artwork_path):
            os.makedirs(directory, exist_ok=True)
        for binary in (get_ytdlp_path(), get_js_runtime_path()):
            try:
                path = Path(binary)
                if path.exists():
                    path.chmod(0o755)
            except Exception as error:
                self._record_error("startup", error)
        self._load_download_index()
        self._load_resolved_url_cache()
        # Make the loopback server available before housekeeping. Reconciliation
        # and storage-limit work are important, but they are not startup-critical
        # and should never hold up the first Decky/Home render.
        await self._start_stream_server()
        logger.info("Loopback audio server listening on port %s", self._stream_port)
        self._startup_maintenance_task = asyncio.create_task(
            self._run_startup_maintenance()
        )

    async def _unload(self):
        await self.cancel_search()
        for task in (
            self._startup_maintenance_task,
            self._resolved_cache_save_task,
            self._download_index_save_task,
        ):
            if task is not None and not task.done():
                task.cancel()
        for task in list(self._materialize_tasks.values()):
            if not task.done():
                task.cancel()
        self._materialize_tasks.clear()
        for task in list(self._download_job_tasks.values()):
            if not task.done():
                task.cancel()
        self._download_job_tasks.clear()
        for task in list(self._preview_warm_tasks):
            if not task.done():
                task.cancel()
        self._preview_warm_tasks.clear()
        self._preview_sources.clear()
        self._import_preview_sources.clear()
        # Best-effort final persistence; this is tiny and avoids losing a freshly
        # resolved URL when Decky reloads the plugin.
        try:
            await asyncio.to_thread(self._save_resolved_url_cache)
            await asyncio.to_thread(self._save_download_index)
        except Exception:
            pass
        if self._stream_runner is not None:
            try:
                await self._stream_runner.cleanup()
            finally:
                self._stream_runner = None
                self._stream_site = None
                self._stream_port = None

    def _record_error(self, area: str, error: Exception | str) -> None:
        message = self._sanitize_text(str(error))[:1000]
        entry = {"time": _now_iso(), "area": area, "message": message}
        self._errors.append(entry)
        logger.error("%s: %s", area, message)
        try:
            os.makedirs(os.path.dirname(self.error_log_path), exist_ok=True)
            with open(self.error_log_path, "a", encoding="utf-8") as file:
                file.write(json.dumps(entry, ensure_ascii=False) + "\n")
        except Exception:
            logger.exception("Could not persist health error")

    @staticmethod
    def _sanitize_text(value: str) -> str:
        home = getattr(decky, "DECKY_USER_HOME", "")
        if home:
            value = value.replace(home, "$DECKY_USER_HOME")

        def strip_query(match: re.Match[str]) -> str:
            parts = urllib.parse.urlsplit(match.group(0))
            return urllib.parse.urlunsplit(
                (parts.scheme, parts.netloc, parts.path, "", "")
            )

        return URL_PATTERN.sub(strip_query, value)

    @classmethod
    def _sanitize_value(cls, value: Any, key: str = "") -> Any:
        if SENSITIVE_KEY.search(key):
            return "[redacted]"
        if isinstance(value, dict):
            return {
                str(child_key): cls._sanitize_value(child_value, str(child_key))
                for child_key, child_value in value.items()
            }
        if isinstance(value, list):
            return [cls._sanitize_value(item) for item in value]
        if isinstance(value, str):
            return cls._sanitize_text(value)
        return value

    async def set_setting(self, key, value):
        self.settings.setSetting(key, value)

    async def get_setting(self, key, default):
        return self.settings.getSetting(key, default)

    async def get_user_home(self):
        return getattr(decky, "DECKY_USER_HOME", "/home/deck")

    async def list_steam_shortcuts(self):
        """Resolve non-Steam shortcut IDs to their real Steam display names."""
        home = getattr(decky, "DECKY_USER_HOME", "/home/deck")
        try:
            return await asyncio.to_thread(_read_steam_shortcuts, home)
        except Exception as error:
            self._record_error("steam-shortcuts", error)
            return []

    async def probe_steam_store_surface(self):
        '''Best-effort native Steam Store probe through Chromium remote debugging.

        3.6.2 uses this only when the normal GamepadUI route classifier says the
        surface is ambiguous ("other"/overlay). A concrete Home, Library, or
        game route always outranks this result on the frontend, so a stale Store
        webview can never keep Store Music alive after navigation.
        '''
        endpoint = "http://127.0.0.1:8080/json"
        timeout = aiohttp.ClientTimeout(total=1.15, connect=0.25, sock_read=0.55)

        def clean(value: Any) -> str:
            return str(value or "").strip()

        def lower(value: Any) -> str:
            return clean(value).lower()

        def is_decky_or_plugin(value: str) -> bool:
            text = lower(value)
            return any(marker in text for marker in (
                "deckbrew", "plugins.deckbrew", "127.0.0.1:1337",
                "localhost:1337", "/decky/store", "gamethememusic-manager",
            ))

        def looks_store(value: str) -> bool:
            text = lower(value)
            if not text or is_decky_or_plugin(text):
                return False
            return any(marker in text for marker in (
                "store.steampowered.com", "steam://store", "/steamstore",
                "#/store", "tab=store", "storehome",
            )) or bool(re.search(r"(^|[\s/#])store([/?#\s]|$)", text))

        try:
            async with aiohttp.ClientSession(timeout=timeout) as session:
                async with session.get(endpoint) as response:
                    if response.status != 200:
                        return {"active": False, "source": "cef-json-http", "status": response.status}
                    rows = await response.json(content_type=None)
                if not isinstance(rows, list):
                    return {"active": False, "source": "cef-json-shape"}

                direct: list[dict[str, Any]] = []
                shells: list[dict[str, Any]] = []
                for raw in rows[:40]:
                    if not isinstance(raw, dict):
                        continue
                    title = clean(raw.get("title"))
                    url = clean(raw.get("url"))
                    combined = f"{title} {url}"
                    if looks_store(combined):
                        direct.append(raw)
                        continue
                    low = lower(combined)
                    if (
                        "steamloopback.host" in low
                        or title in {"SP", "sp", "SharedJSContext", "Steam", "SteamUI", "GamepadUI", "Library"}
                        or "steam shared context" in low
                    ):
                        shells.append(raw)

                expression = r'''(() => {
                    try {
                        const href = String(location?.href || '');
                        const title = String(document?.title || '');
                        const full = (href + ' ' + title).toLowerCase();
                        const looksStore = full.includes('store.steampowered.com') || full.includes('steam://store') || full.includes('/steamstore') || full.includes('#/store') || full.includes('tab=store') || full.includes('storehome') || /(^|[\s/#])store([/?#\s]|$)/.test(full);
                        const visibleElement = (el) => {
                            try {
                                const rect = el.getBoundingClientRect();
                                const style = getComputedStyle(el);
                                return rect.width > 30 && rect.height > 30 && style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity || '1') > 0;
                            } catch (_) { return false; }
                        };
                        const storeFrames = [...document.querySelectorAll('iframe,webview')].filter((el) => {
                            const src = String(el.getAttribute('src') || el.src || '').toLowerCase();
                            return (src.includes('store.steampowered.com') || src.includes('/store')) && !src.includes('deckbrew') && visibleElement(el);
                        });
                        return {
                            href,
                            title,
                            visible: document.visibilityState !== 'hidden' && !document.hidden && Number(innerWidth || 0) > 100 && Number(innerHeight || 0) > 100,
                            focused: typeof document.hasFocus === 'function' ? document.hasFocus() : false,
                            storeSignal: looksStore,
                            storeFrame: storeFrames.length > 0
                        };
                    } catch (_) {
                        return { visible: false, focused: false, storeSignal: false, storeFrame: false };
                    }
                })()'''

                async def evaluate(tab: dict[str, Any]) -> dict[str, Any] | None:
                    ws_url = clean(tab.get("webSocketDebuggerUrl"))
                    if not ws_url:
                        return None
                    try:
                        async with session.ws_connect(ws_url, receive_timeout=0.45, autoping=True) as ws:
                            await ws.send_json({
                                "id": 1,
                                "method": "Runtime.evaluate",
                                "params": {"expression": expression, "returnByValue": True},
                            })
                            deadline = time.monotonic() + 0.45
                            while time.monotonic() < deadline:
                                message = await asyncio.wait_for(ws.receive(), timeout=max(0.05, deadline - time.monotonic()))
                                if message.type != aiohttp.WSMsgType.TEXT:
                                    continue
                                payload = json.loads(message.data)
                                if payload.get("id") != 1:
                                    continue
                                value = payload.get("result", {}).get("result", {}).get("value")
                                return value if isinstance(value, dict) else None
                    except Exception:
                        return None
                    return None

                candidates = (direct[:4] + shells[:3])
                if not candidates:
                    return {"active": False, "source": "cef-no-store-tabs", "tabs": len(rows)}

                states = await asyncio.gather(*(evaluate(tab) for tab in candidates), return_exceptions=False)
                for tab, state in zip(candidates, states):
                    if not isinstance(state, dict):
                        continue
                    title = clean(tab.get("title"))
                    url = clean(tab.get("url"))
                    direct_match = looks_store(f"{title} {url}") or bool(state.get("storeSignal"))
                    frame_match = bool(state.get("storeFrame"))
                    visible = bool(state.get("visible"))
                    if visible and (direct_match or frame_match):
                        return {
                            "active": True,
                            "source": "cef-store-tab" if direct_match else "cef-store-frame",
                            "title": title[:120],
                            "url": url[:240],
                            "focused": bool(state.get("focused")),
                            "visible": True,
                            "tabs": len(rows),
                        }

                return {
                    "active": False,
                    "source": "cef-store-hidden",
                    "tabs": len(rows),
                    "storeCandidates": len(direct),
                    "shellCandidates": len(shells),
                }
        except Exception as error:
            logger.debug("Steam Store CEF probe failed: %s", error)
            return {"active": False, "source": "cef-probe-error", "error": str(error)[:160]}

    def _settings_value(self, key: str, default: Any) -> Any:
        try:
            settings = self.settings.getSetting("settings", {})
            return settings.get(key, default) if isinstance(settings, dict) else default
        except Exception:
            return default

    async def _start_stream_server(self, preferred_port: int | None = None, strict: bool = False) -> None:
        if self._stream_runner is not None:
            return

        async def start_on(port: int) -> None:
            app = web.Application()
            app.router.add_get("/audio/{token}/{filename}", self._serve_audio)
            app.router.add_get("/artwork/{token}/{filename}", self._serve_artwork)
            app.router.add_get("/preview/{token}/{preview_id}", self._serve_preview)
            app.router.add_get("/import-audio/{token}/{preview_id}", self._serve_import_audio)
            runner = web.AppRunner(app, access_log=None)
            await runner.setup()
            site = web.TCPSite(runner, "127.0.0.1", port, reuse_address=True)
            try:
                await site.start()
            except Exception:
                await runner.cleanup()
                raise
            server = getattr(site, "_server", None)
            sockets = getattr(server, "sockets", None) or []
            if not sockets:
                await runner.cleanup()
                raise RuntimeError("Audio server did not expose a listening socket")
            self._stream_runner = runner
            self._stream_site = site
            self._stream_port = int(sockets[0].getsockname()[1])
            self._preferred_stream_port = self._stream_port
            self._save_stream_endpoint_state()

        requested = int(preferred_port or self._preferred_stream_port or 0)
        if requested:
            try:
                await start_on(requested)
                return
            except OSError:
                if strict:
                    raise
            except Exception:
                if strict:
                    raise
        await start_on(0)

    async def adopt_stream_endpoint(self, port: int, token: str):
        """Rebind the new backend to the URL already owned by the playing Audio element.

        This makes Decky updates a true transport handoff: Chromium keeps the same
        src/currentTime while the replacement backend resumes range requests at the
        old loopback URL. The endpoint remains loopback-only.
        """
        desired_port = int(port or 0)
        desired_token = str(token or "").strip()
        if not (1024 <= desired_port <= 65535) or not re.fullmatch(r"[A-Za-z0-9_-]{16,128}", desired_token):
            return False
        if self._stream_runner is not None and self._stream_port == desired_port and secrets.compare_digest(self._stream_token, desired_token):
            return True
        if self._stream_runner is not None:
            try:
                await self._stream_runner.cleanup()
            finally:
                self._stream_runner = None
                self._stream_site = None
                self._stream_port = None
        self._stream_token = desired_token
        self._preferred_stream_port = desired_port
        for _ in range(12):
            try:
                await self._start_stream_server(desired_port, strict=True)
                return self._stream_port == desired_port
            except OSError:
                await asyncio.sleep(0.12)
            except Exception as error:
                logger.debug("Could not adopt previous stream endpoint: %s", error)
                await asyncio.sleep(0.12)
        await self._start_stream_server(0, strict=False)
        return False

    async def _serve_audio(self, request: web.Request) -> web.StreamResponse:
        if not secrets.compare_digest(
            request.match_info["token"], self._stream_token
        ):
            raise web.HTTPNotFound()
        filename = urllib.parse.unquote(request.match_info["filename"])
        if filename != os.path.basename(filename):
            raise web.HTTPNotFound()
        candidate = os.path.realpath(os.path.join(self.music_path, filename))
        music_root = os.path.realpath(self.music_path)
        extension = Path(candidate).suffix.lower().lstrip(".")
        if (
            os.path.dirname(candidate) != music_root
            or not os.path.isfile(candidate)
            or extension not in AUDIO_DOWNLOAD_EXTENSIONS
        ):
            raise web.HTTPNotFound()
        self._touch_download_by_file(filename)
        response = web.FileResponse(candidate)
        response.content_type = MIME_TYPES.get(extension, "audio/webm")
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Accept-Ranges"] = "bytes"
        response.headers["Cache-Control"] = "private, max-age=3600"
        return response

    def _safe_import_audio_path(self, value: str) -> Path | None:
        """Resolve a user-owned audio file without allowing arbitrary filesystem reads."""
        try:
            home = Path(getattr(decky, "DECKY_USER_HOME", "/home/deck")).expanduser().resolve()
            candidate = Path(str(value or "")).expanduser().resolve(strict=True)
            if candidate == home or home not in candidate.parents:
                return None
            if not candidate.is_file():
                return None
            if candidate.suffix.lower().lstrip(".") not in AUDIO_DOWNLOAD_EXTENSIONS:
                return None
            return candidate
        except Exception:
            return None

    async def _serve_import_audio(self, request: web.Request) -> web.StreamResponse:
        if not secrets.compare_digest(request.match_info["token"], self._stream_token):
            raise web.HTTPNotFound()
        preview_id = str(request.match_info.get("preview_id") or "")
        candidate = self._safe_import_audio_path(self._import_preview_sources.get(preview_id, ""))
        if candidate is None:
            self._import_preview_sources.pop(preview_id, None)
            raise web.HTTPNotFound()
        extension = candidate.suffix.lower().lstrip(".")
        response = web.FileResponse(candidate)
        response.content_type = MIME_TYPES.get(extension, "audio/mpeg")
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Accept-Ranges"] = "bytes"
        response.headers["Cache-Control"] = "no-store"
        return response

    async def list_import_audio(self, location: str = "music"):
        """List audio in a friendly Deck folder for the in-manager import browser."""
        home = Path(getattr(decky, "DECKY_USER_HOME", "/home/deck")).expanduser().resolve()
        roots = {
            "music": home / "Music",
            "downloads": home / "Downloads",
            "home": home,
        }
        key = str(location or "music").lower()
        root = roots.get(key, roots["music"])
        try:
            root = root.resolve(strict=True)
        except Exception:
            return {"location": key, "path": str(root), "rows": [], "total": 0, "truncated": False}
        if root != home and home not in root.parents:
            raise ValueError("Import folder must stay inside the Deck user's home folder")
        rows: list[dict[str, Any]] = []
        candidates: list[Path] = []
        try:
            for candidate in root.iterdir():
                try:
                    if candidate.is_file() and candidate.suffix.lower().lstrip(".") in AUDIO_DOWNLOAD_EXTENSIONS:
                        candidates.append(candidate)
                except OSError:
                    continue
        except OSError as error:
            self._record_error("local-import-list", error)
            return {"location": key, "path": str(root), "rows": [], "total": 0, "truncated": False}
        candidates.sort(key=lambda item: item.name.casefold())
        total = len(candidates)
        for candidate in candidates[:300]:
            try:
                stat = candidate.stat()
            except OSError:
                continue
            preview_id = hashlib.sha256(str(candidate).encode("utf-8")).hexdigest()[:28]
            self._import_preview_sources[preview_id] = str(candidate)
            if self._stream_runner is None:
                await self._start_stream_server()
            rows.append({
                "id": preview_id,
                "name": candidate.name,
                "title": candidate.stem,
                "path": str(candidate),
                "size": int(stat.st_size),
                "modified": float(stat.st_mtime),
                "extension": candidate.suffix.lower().lstrip("."),
                "preview_url": f"http://127.0.0.1:{self._stream_port}/import-audio/{self._stream_token}/{preview_id}",
            })
        return {
            "location": key,
            "path": str(root),
            "rows": rows,
            "total": total,
            "truncated": total > len(rows),
        }

    def _artwork_stem(self, media_id: str) -> str:
        return get_audio_filename(str(media_id or ""))

    def _find_artwork_file(self, media_id: str) -> str | None:
        stem = self._artwork_stem(media_id)
        for extension in ("jpg", "jpeg", "png", "webp"):
            candidate = os.path.join(self.artwork_path, f"{stem}.{extension}")
            if os.path.isfile(candidate):
                return candidate
        return None

    def _delete_artwork(self, media_id: str) -> None:
        stem = self._artwork_stem(media_id)
        for extension in ("jpg", "jpeg", "png", "webp"):
            Path(os.path.join(self.artwork_path, f"{stem}.{extension}")).unlink(missing_ok=True)

    async def _serve_artwork(self, request: web.Request) -> web.StreamResponse:
        if not secrets.compare_digest(request.match_info["token"], self._stream_token):
            raise web.HTTPNotFound()
        filename = urllib.parse.unquote(request.match_info["filename"])
        if filename != os.path.basename(filename):
            raise web.HTTPNotFound()
        candidate = os.path.realpath(os.path.join(self.artwork_path, filename))
        artwork_root = os.path.realpath(self.artwork_path)
        extension = Path(candidate).suffix.lower().lstrip(".")
        if os.path.dirname(candidate) != artwork_root or not os.path.isfile(candidate) or extension not in {"jpg", "jpeg", "png", "webp"}:
            raise web.HTTPNotFound()
        response = web.FileResponse(candidate)
        response.content_type = {"jpg": "image/jpeg", "jpeg": "image/jpeg", "png": "image/png", "webp": "image/webp"}.get(extension, "image/jpeg")
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Cache-Control"] = "private, max-age=86400"
        return response

    def _steam_game_artwork_candidates(self, app_id: int) -> list[str]:
        app_id = int(app_id or 0) & 0xFFFFFFFF
        if not app_id:
            return []
        home = getattr(decky, "DECKY_USER_HOME", "/home/deck")
        roots = [
            os.path.join(home, ".steam", "steam"),
            os.path.join(home, ".local", "share", "Steam"),
        ]
        variants = {str(app_id)}
        if app_id >= 0x80000000:
            variants.add(str(app_id - 0x100000000))
            variants.add(str((app_id << 32) | 0x02000000))
        candidates: list[tuple[int, str]] = []
        seen: set[str] = set()
        def add(path: str, score: int) -> None:
            real = os.path.realpath(path)
            if real in seen or not os.path.isfile(real):
                return
            if Path(real).suffix.lower() not in {".jpg", ".jpeg", ".png", ".webp"}:
                return
            try:
                size = os.path.getsize(real)
            except OSError:
                return
            if size <= 0 or size > MAX_ARTWORK_BYTES:
                return
            seen.add(real)
            candidates.append((score + min(size // 200000, 12), real))
        for root in roots:
            cache_dir = os.path.join(root, "appcache", "librarycache", str(app_id))
            if os.path.isdir(cache_dir):
                for path in glob.glob(os.path.join(cache_dir, "**", "*"), recursive=True):
                    name = os.path.basename(path).lower()
                    score = 100
                    if "hero" in name: score += 80
                    elif "header" in name: score += 70
                    elif "capsule" in name: score += 55
                    elif "library" in name: score += 35
                    add(path, score)
            flat_cache = os.path.join(root, "appcache", "librarycache")
            for variant in variants:
                for path in glob.glob(os.path.join(flat_cache, f"{variant}*")):
                    name = os.path.basename(path).lower()
                    add(path, 150 + (60 if "hero" in name else 45 if "header" in name else 0))
            for grid_dir in glob.glob(os.path.join(root, "userdata", "*", "config", "grid")):
                for variant in variants:
                    for suffix, score in (("_hero", 320), ("_header", 300), ("", 240), ("p", 190), ("_logo", 100)):
                        for ext in ("png", "jpg", "jpeg", "webp"):
                            add(os.path.join(grid_dir, f"{variant}{suffix}.{ext}"), score)
        candidates.sort(key=lambda item: item[0], reverse=True)
        return [path for _, path in candidates]

    async def steam_game_artwork_url(self, app_id: int):
        clean_id = int(app_id or 0) & 0xFFFFFFFF
        if not clean_id:
            return None
        cache_id = f"gameart_{clean_id}"
        existing = await self.local_artwork_url(cache_id)
        if existing:
            return existing
        try:
            candidates = await asyncio.to_thread(self._steam_game_artwork_candidates, clean_id)
            for candidate in candidates:
                try:
                    data = await asyncio.to_thread(Path(candidate).read_bytes)
                    mime = {".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp"}.get(Path(candidate).suffix.lower(), "")
                    saved = await asyncio.to_thread(self._save_artwork_bytes, cache_id, data, mime)
                    if saved:
                        return await self.local_artwork_url(cache_id)
                except Exception:
                    continue
            # 3.5.2: if Steam has not cached artwork locally yet, fetch the same
            # first-party assets through the backend and then serve them locally.
            # This avoids Chromium/external-resource inconsistencies in Decky.
            if clean_id < 0x80000000:
                remote_candidates = [
                    f"https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/{clean_id}/library_hero.jpg",
                    f"https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/{clean_id}/capsule_616x353.jpg",
                    f"https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/{clean_id}/header.jpg",
                    f"https://cdn.cloudflare.steamstatic.com/steam/apps/{clean_id}/library_hero.jpg",
                    f"https://cdn.cloudflare.steamstatic.com/steam/apps/{clean_id}/header.jpg",
                ]
                timeout = aiohttp.ClientTimeout(total=6, connect=3, sock_read=4)
                async with aiohttp.ClientSession(timeout=timeout) as session:
                    for url in remote_candidates:
                        try:
                            async with session.get(url, ssl=self.ssl_context, allow_redirects=True) as response:
                                if response.status >= 400:
                                    continue
                                content_length = int(response.headers.get("content-length", "0") or 0)
                                if content_length > MAX_ARTWORK_BYTES:
                                    continue
                                data = await response.content.read(MAX_ARTWORK_BYTES + 1)
                                if not data or len(data) > MAX_ARTWORK_BYTES:
                                    continue
                                saved = await asyncio.to_thread(self._save_artwork_bytes, cache_id, data, response.headers.get("content-type", ""))
                                if saved:
                                    return await self.local_artwork_url(cache_id)
                        except Exception:
                            continue
        except Exception as error:
            self._record_error("steam-game-artwork", error)
        return None

    def _steam_game_import_artwork_candidates(self, app_id: int) -> list[str]:
        """Prefer Steam library/grid capsule art for Local Import.

        The normal game-art resolver intentionally prefers hero/header images for
        wide manager banners. Import is a different slot, so it gets a separate
        candidate list and cache instead of reusing the hero winner.
        """
        app_id = int(app_id or 0) & 0xFFFFFFFF
        if not app_id:
            return []
        home = getattr(decky, "DECKY_USER_HOME", "/home/deck")
        roots = [
            os.path.join(home, ".steam", "steam"),
            os.path.join(home, ".local", "share", "Steam"),
        ]
        variants = {str(app_id)}
        if app_id >= 0x80000000:
            variants.add(str(app_id - 0x100000000))
            variants.add(str((app_id << 32) | 0x02000000))
        candidates: list[tuple[int, str]] = []
        seen: set[str] = set()

        def add(path: str, score: int) -> None:
            real = os.path.realpath(path)
            if real in seen or not os.path.isfile(real):
                return
            if Path(real).suffix.lower() not in {".jpg", ".jpeg", ".png", ".webp"}:
                return
            try:
                size = os.path.getsize(real)
            except OSError:
                return
            if size <= 0 or size > MAX_ARTWORK_BYTES:
                return
            seen.add(real)
            candidates.append((score + min(size // 200000, 12), real))

        for root in roots:
            cache_dir = os.path.join(root, "appcache", "librarycache", str(app_id))
            if os.path.isdir(cache_dir):
                for path in glob.glob(os.path.join(cache_dir, "**", "*"), recursive=True):
                    name = os.path.basename(path).lower()
                    score = 100
                    if "600x900" in name or "portrait" in name:
                        score += 420
                    elif "capsule" in name or "library" in name:
                        score += 300
                    elif "header" in name:
                        score += 80
                    elif "hero" in name:
                        score += 40
                    add(path, score)
            for grid_dir in glob.glob(os.path.join(root, "userdata", "*", "config", "grid")):
                for variant in variants:
                    # Steam custom-grid convention: the plain / portrait image is
                    # preferred for the tall Import card; hero/header are fallback.
                    for suffix, score in (("", 520), ("p", 500), ("_portrait", 490), ("_header", 160), ("_hero", 120), ("_logo", 40)):
                        for ext in ("png", "jpg", "jpeg", "webp"):
                            add(os.path.join(grid_dir, f"{variant}{suffix}.{ext}"), score)
        candidates.sort(key=lambda item: item[0], reverse=True)
        return [path for _, path in candidates]

    async def steam_game_import_artwork_url(self, app_id: int):
        clean_id = int(app_id or 0) & 0xFFFFFFFF
        if not clean_id:
            return None
        # Separate cache identity prevents a previously cached wide hero from
        # poisoning the Local Import portrait/library-art slot.
        cache_id = f"gameart_import_v367_{clean_id}"
        existing = await self.local_artwork_url(cache_id)
        if existing:
            return existing
        try:
            # 3.6.6: Local Import has a dedicated Steam capsule slot. For real
            # Steam apps, prefer Steam's portrait library capsule before any
            # locally cached hero/header asset so the hero resolver can never
            # leak back into Import through Steam's local cache ordering.
            if clean_id < 0x80000000:
                remote_candidates = [
                    f"https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/{clean_id}/library_600x900.jpg",
                    f"https://cdn.cloudflare.steamstatic.com/steam/apps/{clean_id}/library_600x900.jpg",
                ]
                timeout = aiohttp.ClientTimeout(total=5, connect=2.5, sock_read=3.5)
                async with aiohttp.ClientSession(timeout=timeout) as session:
                    for url in remote_candidates:
                        try:
                            async with session.get(url, ssl=self.ssl_context, allow_redirects=True) as response:
                                if response.status >= 400:
                                    continue
                                content_length = int(response.headers.get("content-length", "0") or 0)
                                if content_length > MAX_ARTWORK_BYTES:
                                    continue
                                data = await response.content.read(MAX_ARTWORK_BYTES + 1)
                                if not data or len(data) > MAX_ARTWORK_BYTES:
                                    continue
                                saved = await asyncio.to_thread(self._save_artwork_bytes, cache_id, data, response.headers.get("content-type", ""))
                                if saved:
                                    return await self.local_artwork_url(cache_id)
                        except Exception:
                            continue
            candidates = await asyncio.to_thread(self._steam_game_import_artwork_candidates, clean_id)
            for candidate in candidates:
                try:
                    data = await asyncio.to_thread(Path(candidate).read_bytes)
                    mime = {".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp"}.get(Path(candidate).suffix.lower(), "")
                    saved = await asyncio.to_thread(self._save_artwork_bytes, cache_id, data, mime)
                    if saved:
                        return await self.local_artwork_url(cache_id)
                except Exception:
                    continue
            if clean_id < 0x80000000:
                remote_candidates = [
                    f"https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/{clean_id}/capsule_616x353.jpg",
                    f"https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/{clean_id}/header.jpg",
                    f"https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/{clean_id}/library_hero.jpg",
                ]
                timeout = aiohttp.ClientTimeout(total=5, connect=2.5, sock_read=3.5)
                async with aiohttp.ClientSession(timeout=timeout) as session:
                    for url in remote_candidates:
                        try:
                            async with session.get(url, ssl=self.ssl_context, allow_redirects=True) as response:
                                if response.status >= 400:
                                    continue
                                content_length = int(response.headers.get("content-length", "0") or 0)
                                if content_length > MAX_ARTWORK_BYTES:
                                    continue
                                data = await response.content.read(MAX_ARTWORK_BYTES + 1)
                                if not data or len(data) > MAX_ARTWORK_BYTES:
                                    continue
                                saved = await asyncio.to_thread(self._save_artwork_bytes, cache_id, data, response.headers.get("content-type", ""))
                                if saved:
                                    return await self.local_artwork_url(cache_id)
                        except Exception:
                            continue
        except Exception as error:
            self._record_error("steam-game-import-artwork", error)
        return None

    async def local_artwork_url(self, media_id: str):
        art = self._find_artwork_file(str(media_id or ""))
        if art is None:
            return None
        if self._stream_runner is None:
            await self._start_stream_server()
        assert self._stream_port is not None
        filename = urllib.parse.quote(os.path.basename(art), safe="")
        return f"http://127.0.0.1:{self._stream_port}/artwork/{self._stream_token}/{filename}"

    async def local_artwork_data_url(self, media_id: str):
        """Return cached artwork inline for UI surfaces that reject loopback images.

        The Now Playing ribbon lives in Steam UI's overlay tree, where image fetches
        from a freshly-rebound localhost endpoint can intermittently render blank.
        Data URLs make the small notification artwork self-contained and survive
        frontend/backend handoffs. Keep the RPC payload bounded; larger artwork
        continues to use the regular loopback URL elsewhere.
        """
        art = self._find_artwork_file(str(media_id or ""))
        if art is None:
            return None
        try:
            size = os.path.getsize(art)
            if size <= 0 or size > 2 * 1024**2:
                return None
            data = await asyncio.to_thread(Path(art).read_bytes)
            ext = Path(art).suffix.lower()
            mime = {".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp"}.get(ext)
            if not mime or not data:
                return None
            return f"data:{mime};base64,{base64.b64encode(data).decode('ascii')}"
        except Exception as error:
            self._record_error("inline-artwork", error)
            return None

    def _save_artwork_bytes(self, media_id: str, data: bytes, content_type: str = "") -> str | None:
        if not data or len(data) > MAX_ARTWORK_BYTES:
            return None
        kind = str(content_type or "").split(";", 1)[0].strip().lower()
        if data.startswith(b"\xff\xd8\xff") or kind in {"image/jpeg", "image/jpg"}:
            extension = "jpg"
        elif data.startswith(b"\x89PNG\r\n\x1a\n") or kind == "image/png":
            extension = "png"
        elif data.startswith(b"RIFF") and data[8:12] == b"WEBP" or kind == "image/webp":
            extension = "webp"
        else:
            return None
        os.makedirs(self.artwork_path, exist_ok=True)
        stem = self._artwork_stem(media_id)
        target = os.path.join(self.artwork_path, f"{stem}.{extension}")
        temporary = f"{target}.part"
        with open(temporary, "wb") as file:
            file.write(data)
        os.replace(temporary, target)
        for other in ("jpg", "jpeg", "png", "webp"):
            other_path = os.path.join(self.artwork_path, f"{stem}.{other}")
            if other_path != target:
                Path(other_path).unlink(missing_ok=True)
        return target

    def _extract_embedded_artwork(self, media_id: str, audio_path: str) -> str | None:
        """Best-effort embedded cover extraction for imported/local audio.

        Mutagen is bundled with GTM 3.5.0 so imported MP3/FLAC/M4A/etc. cover
        art can remain available offline without relying on a remote thumbnail.
        """
        try:
            from mutagen import File as MutagenFile  # type: ignore
        except Exception:
            return None
        try:
            media = MutagenFile(audio_path)
            if media is None:
                return None
            pictures = list(getattr(media, "pictures", []) or [])
            for picture in pictures:
                data = bytes(getattr(picture, "data", b"") or b"")
                mime = str(getattr(picture, "mime", "") or "")
                saved = self._save_artwork_bytes(media_id, data, mime)
                if saved:
                    return saved
            tags = getattr(media, "tags", None)
            if tags is not None and hasattr(tags, "getall"):
                for picture in tags.getall("APIC") or []:
                    saved = self._save_artwork_bytes(media_id, bytes(getattr(picture, "data", b"") or b""), str(getattr(picture, "mime", "") or ""))
                    if saved:
                        return saved
            if tags is not None:
                try:
                    covers = tags.get("covr") or []
                    if not isinstance(covers, (list, tuple)):
                        covers = [covers]
                    for cover in covers:
                        saved = self._save_artwork_bytes(media_id, bytes(cover), "")
                        if saved:
                            return saved
                except Exception:
                    pass
        except Exception as error:
            self._record_error("embedded-artwork", error)
        return None

    async def cache_artwork(self, media_id: str, source_url: str = "", provider: str = ""):
        clean_id = str(media_id or "").strip()
        if not clean_id:
            return None
        existing = await self.local_artwork_url(clean_id)
        if existing:
            return existing
        clean_url = str(source_url or "").strip()
        clean_provider = str(provider or "").strip().lower()
        if not clean_url and (clean_provider == "youtube" or re.fullmatch(r"[A-Za-z0-9_-]{11}", clean_id)):
            clean_url = f"https://i.ytimg.com/vi/{urllib.parse.quote(clean_id, safe='')}/hqdefault.jpg"
        if not clean_url.startswith(("https://", "http://")):
            return None
        try:
            timeout = aiohttp.ClientTimeout(total=12, connect=5, sock_read=8)
            async with aiohttp.ClientSession(timeout=timeout) as session:
                async with session.get(clean_url, ssl=self.ssl_context, allow_redirects=True) as response:
                    if response.status >= 400:
                        return None
                    content_length = int(response.headers.get("content-length", "0") or 0)
                    if content_length > MAX_ARTWORK_BYTES:
                        return None
                    data = await response.content.read(MAX_ARTWORK_BYTES + 1)
                    if len(data) > MAX_ARTWORK_BYTES:
                        return None
                    saved = await asyncio.to_thread(self._save_artwork_bytes, clean_id, data, response.headers.get("content-type", ""))
                    if not saved:
                        return None
                    for entry in self._download_index.setdefault("files", {}).values():
                        if str(entry.get("id") or "") == clean_id:
                            entry["thumbnail"] = clean_url
                    self._schedule_download_index_save()
                    return await self.local_artwork_url(clean_id)
        except Exception:
            # Offline is a normal state. Missing artwork must never affect audio.
            return None

    async def _serve_preview(self, request: web.Request) -> web.StreamResponse:
        """Proxy one short-lived provider stream through GTM's loopback server.

        Chromium inside Steam can reliably play localhost audio, while signed
        provider URLs may fail through Steam's external-resource bridge.  This
        endpoint never persists bytes to disk.  Range requests are forwarded so
        the HTML audio element can seek normally.
        """
        if not secrets.compare_digest(request.match_info["token"], self._stream_token):
            raise web.HTTPNotFound()
        preview_id = str(request.match_info.get("preview_id") or "")
        entry = self._preview_sources.get(preview_id)
        if not entry or float(entry.get("expires", 0)) <= time.time():
            self._preview_sources.pop(preview_id, None)
            raise web.HTTPNotFound()
        url = str(entry.get("url") or "")
        if not url.startswith(("https://", "http://")):
            raise web.HTTPNotFound()
        headers = {
            "User-Agent": "Mozilla/5.0 GameThemeMusic/3.4.5",
            "Accept": "*/*",
            "Referer": "https://www.youtube.com/" if str(entry.get("provider") or "") == "youtube" else "https://downloads.khinsider.com/",
        }
        range_header = request.headers.get("Range")
        if range_header:
            headers["Range"] = range_header
        timeout = aiohttp.ClientTimeout(total=None, connect=10, sock_read=45)
        try:
            async with aiohttp.ClientSession(timeout=timeout) as session:
                async with session.get(url, headers=headers, ssl=self.ssl_context, allow_redirects=True) as upstream:
                    if upstream.status >= 400:
                        raise web.HTTPBadGateway(text=f"Preview provider returned {upstream.status}")
                    response = web.StreamResponse(status=upstream.status if upstream.status in (200, 206) else 200)
                    response.headers["Access-Control-Allow-Origin"] = "*"
                    response.headers["Accept-Ranges"] = upstream.headers.get("Accept-Ranges", "bytes")
                    response.headers["Cache-Control"] = "no-store"
                    content_type = upstream.headers.get("Content-Type")
                    if content_type:
                        response.headers["Content-Type"] = content_type
                    for key in ("Content-Length", "Content-Range"):
                        value = upstream.headers.get(key)
                        if value:
                            response.headers[key] = value
                    await response.prepare(request)
                    try:
                        async for chunk in upstream.content.iter_chunked(128 * 1024):
                            await response.write(chunk)
                        await response.write_eof()
                    except (ConnectionResetError, asyncio.CancelledError):
                        pass
                    return response
        except web.HTTPException:
            raise
        except Exception as error:
            self._record_error("preview-proxy", error)
            raise web.HTTPBadGateway(text="Remote preview failed")

    async def create_preview_url(self, url: str, media_id: str = "", provider: str = "youtube"):
        """Return a localhost URL for remote preview without downloading it."""
        clean = str(url or "").strip()
        if not clean:
            return None
        if clean.startswith(("http://127.0.0.1:", "data:", "blob:")):
            return clean
        if not clean.startswith(("https://", "http://")):
            return None
        if self._stream_runner is None:
            await self._start_stream_server()
        now = time.time()
        for key, entry in list(self._preview_sources.items()):
            if float(entry.get("expires", 0)) <= now:
                self._preview_sources.pop(key, None)
        preview_id = secrets.token_urlsafe(18)
        self._preview_sources[preview_id] = {
            "url": clean,
            "media_id": str(media_id or ""),
            "provider": str(provider or "remote"),
            "expires": now + 30 * 60,
        }
        assert self._stream_port is not None
        return f"http://127.0.0.1:{self._stream_port}/preview/{self._stream_token}/{preview_id}"

    def _download_job_update(self, job_id: str, **values: Any) -> None:
        if not job_id:
            return
        job = self._download_jobs.get(job_id)
        if job is None:
            return
        job.update(values)
        job["updated_at"] = time.time()

    async def start_download_job(self, url: str, media_id: str, title: str = "", provider: str = "youtube", thumbnail_url: str = ""):
        """Start a background provider download and return a pollable job id."""
        clean_url = str(url or "").strip()
        clean_id = str(media_id or "").strip()
        if not clean_id:
            raise ValueError("Missing media id")
        local = self.local_match(get_audio_filename(clean_id))
        job_id = secrets.token_urlsafe(12)
        now = time.time()
        self._download_jobs[job_id] = {
            "id": job_id, "status": "complete" if local else "queued",
            "progress": 100.0 if local else 0.0, "downloaded": 0, "total": 0,
            "error": "", "updated_at": now,
        }
        # prune old completed jobs
        for key, job in list(self._download_jobs.items()):
            if key != job_id and now - float(job.get("updated_at", now)) > 900:
                self._download_jobs.pop(key, None)
        if local:
            if thumbnail_url:
                asyncio.create_task(self.cache_artwork(clean_id, str(thumbnail_url or ""), str(provider or "")))
            return job_id
        if not clean_url.startswith(("https://", "http://")):
            self._download_job_update(job_id, status="error", error="No downloadable provider URL")
            return job_id

        async def worker() -> None:
            try:
                self._download_job_update(job_id, status="downloading", progress=0.0)
                await self.download_url(clean_url, clean_id, str(title or ""), str(provider or "remote"), job_id)
                await self.cache_artwork(clean_id, str(thumbnail_url or ""), str(provider or ""))
                self._download_job_update(job_id, status="complete", progress=100.0)
            except asyncio.CancelledError:
                self._download_job_update(job_id, status="cancelled", error="Download cancelled")
                raise
            except Exception as error:
                self._download_job_update(job_id, status="error", error=str(error))
            finally:
                self._download_job_tasks.pop(job_id, None)

        task = asyncio.create_task(worker())
        self._download_job_tasks[job_id] = task
        return job_id

    async def get_download_job(self, job_id: str):
        job = self._download_jobs.get(str(job_id or ""))
        return dict(job) if job else {"id": str(job_id or ""), "status": "missing", "progress": 0, "error": "Download job expired"}

    async def _stop_paged_search_process(self) -> None:
        process = self._paged_search_process
        self._paged_search_process = None
        if process is not None and process.returncode is None:
            process.terminate()
            try:
                # Do not call communicate() here. A page RPC may currently be
                # awaiting stdout.readline(); wait() avoids two coroutines
                # competing for the same pipe during game-start/unload cancel.
                await asyncio.wait_for(process.wait(), timeout=5)
            except TimeoutError:
                process.kill()
                await process.wait()

    def _reset_paged_search_state(self) -> None:
        self._paged_search_term = ""
        self._paged_search_rows = []
        self._paged_search_ids = set()
        self._paged_search_raw_seen = 0
        self._paged_search_exhausted = True
        self._paged_search_started = 0.0
        self._paged_search_last_timeout = False

    async def cancel_search(self):
        if self.yt_process is not None and self.yt_process.returncode is None:
            self.yt_process.terminate()
            try:
                await asyncio.wait_for(self.yt_process.communicate(), timeout=5)
            except TimeoutError:
                self.yt_process.kill()
                await self.yt_process.communicate()
        self.yt_process = None
        await self._stop_paged_search_process()
        self._reset_paged_search_state()

    async def _start_paged_yt_search(self, clean_term: str) -> None:
        await self._stop_paged_search_process()
        ytdlp_path = get_ytdlp_path()
        if os.path.exists(ytdlp_path):
            os.chmod(ytdlp_path, 0o755)
        self._paged_search_process = await asyncio.create_subprocess_exec(
            ytdlp_path,
            *get_ytdlp_runtime_args(),
            f"ytsearch{YOUTUBE_SEARCH_MAX_RAW}:{clean_term}",
            "--flat-playlist",
            "--lazy-playlist",
            "--dump-json",
            "--playlist-end",
            str(YOUTUBE_SEARCH_MAX_RAW),
            "--no-warnings",
            "--quiet",
            "--socket-timeout",
            "8",
            "--retries",
            "1",
            "--extractor-retries",
            "1",
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
            limit=8 * 1024**2,
            env=get_ytdlp_env(),
        )
        self._paged_search_term = clean_term
        self._paged_search_rows = []
        self._paged_search_ids = set()
        self._paged_search_raw_seen = 0
        self._paged_search_exhausted = False
        self._paged_search_started = time.monotonic()
        self._paged_search_last_timeout = False

    async def _fill_paged_yt_search(self, requested_visible_end: int) -> None:
        process = self._paged_search_process
        if process is None or process.stdout is None:
            self._paged_search_exhausted = True
            return

        self._paged_search_last_timeout = False
        while (
            len(self._paged_search_rows) < requested_visible_end
            and not self._paged_search_exhausted
            and self._paged_search_raw_seen < YOUTUBE_SEARCH_MAX_RAW
        ):
            try:
                raw_line = await asyncio.wait_for(
                    process.stdout.readline(), timeout=YOUTUBE_SEARCH_LINE_TIMEOUT
                )
            except TimeoutError:
                # A YouTube continuation can occasionally take longer than the
                # first page. Keep the process/session alive and let the next UI
                # page request resume instead of calling this "end of results".
                self._paged_search_last_timeout = True
                break

            if not raw_line:
                self._paged_search_exhausted = True
                try:
                    return_code = await process.wait()
                    if return_code not in (0, None) and process.stderr:
                        stderr = (await process.stderr.read()).decode(
                            "utf-8", errors="replace"
                        ).strip()
                        if stderr:
                            self._record_error("youtube-search", stderr)
                except Exception as error:
                    self._record_error("youtube-search", error)
                break

            self._paged_search_raw_seen += 1
            try:
                entry = json.loads(raw_line)
                info = self.entry_to_info(entry)
            except (json.JSONDecodeError, TypeError):
                continue

            media_id = str(info.get("id") or "")
            title = str(info.get("title") or "")
            if not media_id or not title or media_id in self._paged_search_ids:
                continue

            duration = info.get("duration")
            if isinstance(duration, (int, float)) and duration > YOUTUBE_SEARCH_MAX_DURATION_SECONDS:
                # Preserve the long-standing "track, not multi-hour mix" rule,
                # but crucially continue reading later YouTube search results.
                continue

            self._paged_search_ids.add(media_id)
            self._paged_search_rows.append(info)

        if self._paged_search_raw_seen >= YOUTUBE_SEARCH_MAX_RAW:
            self._paged_search_exhausted = True
            await self._stop_paged_search_process()

    async def search_yt_results_page(self, term: str, limit: int = 20, offset: int = 0):
        """Return a continuation-aware metadata page for Soundtrack Manager.

        3.5.5 fixes the old short-page bug: yt-dlp filtering could turn a raw
        20-result page into 9 or 19 usable tracks, and the frontend incorrectly
        treated that as provider exhaustion. We now stream one deeper YouTube
        search, filter rows locally, and report continuation state explicitly.
        """
        clean_term = str(term or "").strip()
        if not clean_term:
            return {"rows": [], "has_more": False, "end_reason": "empty"}
        try:
            limit = max(1, min(YOUTUBE_SEARCH_PAGE_SIZE, int(limit)))
        except (TypeError, ValueError):
            limit = YOUTUBE_SEARCH_PAGE_SIZE
        try:
            offset = max(0, min(YOUTUBE_SEARCH_MAX_VISIBLE - 1, int(offset)))
        except (TypeError, ValueError):
            offset = 0
        requested_end = min(YOUTUBE_SEARCH_MAX_VISIBLE, offset + limit)

        async with self._paged_search_lock:
            now = time.monotonic()
            same_term = self._paged_search_term.casefold() == clean_term.casefold()
            stale_restart = (
                same_term
                and offset == 0
                and self._paged_search_started > 0
                and now - self._paged_search_started > YOUTUBE_SEARCH_SESSION_TTL
            )
            if not same_term or stale_restart:
                await self._start_paged_yt_search(clean_term)
            elif (
                self._paged_search_process is None
                and not self._paged_search_exhausted
                and len(self._paged_search_rows) < requested_end
            ):
                await self._start_paged_yt_search(clean_term)

            await self._fill_paged_yt_search(requested_end)
            rows = self._paged_search_rows[offset:requested_end]
            self._schedule_preview_warm([str(row.get("id") or "") for row in rows])

            cached_beyond_page = len(self._paged_search_rows) > requested_end
            provider_can_continue = (
                not self._paged_search_exhausted
                and self._paged_search_raw_seen < YOUTUBE_SEARCH_MAX_RAW
            )
            visible_cap_reached = requested_end >= YOUTUBE_SEARCH_MAX_VISIBLE
            has_more = (cached_beyond_page or provider_can_continue) and not visible_cap_reached

            if visible_cap_reached:
                end_reason = "visible_cap"
            elif self._paged_search_last_timeout and provider_can_continue:
                end_reason = "continuation_wait"
            elif self._paged_search_raw_seen >= YOUTUBE_SEARCH_MAX_RAW:
                end_reason = "raw_cap"
            elif self._paged_search_exhausted:
                end_reason = "exhausted"
            else:
                end_reason = "more"

            self._search_cache[clean_term.casefold()] = (
                time.monotonic(), list(self._paged_search_rows)
            )
            return {
                "rows": rows,
                "has_more": bool(has_more),
                "end_reason": end_reason,
                "offset": offset,
                "next_offset": offset + len(rows),
                "usable_seen": len(self._paged_search_rows),
                "raw_seen": self._paged_search_raw_seen,
                "visible_cap": YOUTUBE_SEARCH_MAX_VISIBLE,
            }

    async def search_yt_results(self, term: str, limit: int = 20, offset: int = 0):
        """Backward-compatible list-only wrapper for 3.5.4-era frontends."""
        page = await self.search_yt_results_page(term, limit, offset)
        return list(page.get("rows") or [])

    async def search_yt(self, term: str):
        await self.cancel_search()
        ytdlp_path = get_ytdlp_path()
        if os.path.exists(ytdlp_path):
            os.chmod(ytdlp_path, 0o755)
        try:
            self.yt_process = await asyncio.create_subprocess_exec(
                ytdlp_path,
                *get_ytdlp_runtime_args(),
                f"ytsearch12:{term}",
                "--flat-playlist",
                "--dump-json",
                "--playlist-end",
                "12",
                "--match-filters",
                f"duration<?{20 * 60}",
                "--no-playlist",
                "--no-warnings",
                "--quiet",
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
                limit=10 * 1024**2,
                env=get_ytdlp_env(),
            )
        except Exception as error:
            self._record_error("youtube-search", error)
            raise

    async def next_yt_result(self):
        async with self.yt_process_lock:
            if not self.yt_process or not self.yt_process.stdout:
                return None
            try:
                line = (
                    await asyncio.wait_for(
                        self.yt_process.stdout.readline(), timeout=30
                    )
                ).strip()
            except TimeoutError as error:
                self._record_error("youtube-search-timeout", error)
                await self.cancel_search()
                return None
            if not line:
                if (
                    self.yt_process.returncode not in (None, 0)
                    and self.yt_process.stderr
                ):
                    stderr = (await self.yt_process.stderr.read()).decode(
                        "utf-8", errors="replace"
                    )
                    self._record_error(
                        "youtube-search", stderr or "yt-dlp search failed"
                    )
                return None
            try:
                return self.entry_to_info(json.loads(line))
            except (json.JSONDecodeError, TypeError) as error:
                self._record_error("youtube-search-json", error)
                return None

    @staticmethod
    def entry_to_info(entry):
        thumbnails = entry.get("thumbnails") or []
        thumbnail = entry.get("thumbnail") or (
            thumbnails[0].get("url") if thumbnails else None
        )
        return {
            "url": entry.get("url"),
            "title": entry.get("title"),
            "id": entry.get("id"),
            "thumbnail": thumbnail,
            "duration": entry.get("duration"),
        }

    async def fetch_url(self, url: str):
        try:
            timeout = aiohttp.ClientTimeout(total=15, connect=5)
            async with aiohttp.ClientSession(timeout=timeout) as session:
                headers = {"User-Agent": "Mozilla/5.0 GameThemeMusic/1.9"}
                async with session.get(
                    url, headers=headers, ssl=self.ssl_context
                ) as response:
                    response.raise_for_status()
                    body = await response.content.read(MAX_HTML_BYTES + 1)
                    if len(body) > MAX_HTML_BYTES:
                        raise ValueError("Provider page exceeded the 6 MB limit")
                    return body.decode(
                        response.charset or "utf-8", errors="replace"
                    )
        except Exception as error:
            self._record_error("provider-fetch", error)
            return ""

    def local_match(self, file_stem: str) -> str | None:
        # Hot path: use downloads.json instead of walking/globbing the music
        # directory every time a game page or search card asks about a track.
        for filename, entry in self._download_index.setdefault("files", {}).items():
            if Path(filename).stem != file_stem:
                continue
            path = os.path.join(self.music_path, filename)
            extension = Path(filename).suffix.lower().lstrip(".")
            if extension in AUDIO_DOWNLOAD_EXTENSIONS and os.path.isfile(path):
                return path

        # Compatibility fallback for a file copied in behind our back. Repair
        # the index once found so later calls stay on the fast path.
        filename = glob.escape(file_stem)
        matches = [
            path
            for path in glob.glob(f"{self.music_path}/{filename}.*")
            if os.path.isfile(path)
            and path.rsplit(".", 1)[-1].lower() in AUDIO_DOWNLOAD_EXTENSIONS
        ]
        match = sorted(matches)[0] if matches else None
        if match is not None:
            self._touch_download(file_stem, match)
        return match

    async def local_audio_url(self, media_id: str):
        local_match = self.local_match(get_audio_filename(media_id))
        if local_match is None:
            return None
        if self._stream_runner is None:
            await self._start_stream_server()
        assert self._stream_port is not None
        self._touch_download(media_id, local_match)
        filename = urllib.parse.quote(os.path.basename(local_match), safe="")
        return (
            f"http://127.0.0.1:{self._stream_port}/audio/"
            f"{self._stream_token}/{filename}"
        )

    async def local_audio_exists(self, media_id: str):
        return self.local_match(get_audio_filename(media_id)) is not None

    async def local_audio_exists_many(self, media_ids: list[str]):
        result: dict[str, bool] = {}
        for raw in media_ids[:64]:
            media_id = str(raw or "")
            if media_id:
                result[media_id] = (
                    self.local_match(get_audio_filename(media_id)) is not None
                )
        return result

    async def local_audio_urls_many(self, media_ids: list[str]):
        """Resolve a bounded batch of already-downloaded tracks in one RPC."""
        result: dict[str, str] = {}
        seen: set[str] = set()
        for raw in media_ids[:32]:
            media_id = str(raw or "").strip()
            if not media_id or media_id in seen:
                continue
            seen.add(media_id)
            url = await self.local_audio_url(media_id)
            if url:
                result[media_id] = str(url)
        return result

    async def _run_startup_maintenance(self) -> None:
        try:
            # Let Steam Home, Decky globals, and the plugin panel finish their
            # first paint before touching the download index.
            await asyncio.sleep(4.0)
            self._reconcile_download_index()
            await self.enforce_storage_limit(reconcile=False)
        except asyncio.CancelledError:
            raise
        except Exception as error:
            self._record_error("startup-maintenance", error)

    def _load_resolved_url_cache(self) -> None:
        try:
            with open(self.resolved_url_cache_path, "r", encoding="utf-8") as file:
                raw = json.load(file)
            items = raw.get("items", {}) if isinstance(raw, dict) else {}
            now = time.time()
            for media_id, value in items.items():
                if not isinstance(value, dict):
                    continue
                url = str(value.get("url") or "")
                expires_at = float(value.get("expiresAt") or 0)
                if (
                    media_id
                    and url.startswith(("https://", "http://"))
                    and expires_at > now + 30
                ):
                    self._resolved_url_cache[str(media_id)] = (expires_at, url)
        except FileNotFoundError:
            pass
        except Exception as error:
            self._record_error("resolved-url-cache-read", error)

    def _save_resolved_url_cache(self) -> None:
        now = time.time()
        items: dict[str, dict[str, Any]] = {}
        for media_id, (expires_at, url) in list(self._resolved_url_cache.items()):
            if expires_at <= now + 15:
                continue
            items[media_id] = {"expiresAt": expires_at, "url": url}
        _safe_json_write(
            self.resolved_url_cache_path,
            {"version": 1, "savedAt": _now_iso(), "items": items},
        )

    async def _save_resolved_url_cache_debounced(self) -> None:
        try:
            await asyncio.sleep(0.2)
            await asyncio.to_thread(self._save_resolved_url_cache)
        except asyncio.CancelledError:
            raise
        except Exception as error:
            self._record_error("resolved-url-cache-write", error)

    def _schedule_resolved_url_cache_save(self) -> None:
        try:
            loop = asyncio.get_running_loop()
        except RuntimeError:
            # No running loop during unusual teardown paths. The final unload
            # flush will persist whatever remains in memory.
            return
        task = self._resolved_cache_save_task
        if task is not None and not task.done():
            return
        self._resolved_cache_save_task = loop.create_task(
            self._save_resolved_url_cache_debounced()
        )

    def _resolved_url_get(self, media_id: str) -> str | None:
        cached = self._resolved_url_cache.get(media_id)
        if cached is None:
            return None
        expires_at, url = cached
        if expires_at <= time.time():
            self._resolved_url_cache.pop(media_id, None)
            self._schedule_resolved_url_cache_save()
            return None
        return url

    def _resolved_url_put(self, media_id: str, url: str) -> None:
        now = time.time()
        expires_at = now + 30 * 60
        try:
            query = urllib.parse.parse_qs(urllib.parse.urlsplit(url).query)
            provider_expiry = int((query.get("expire") or [0])[0])
            if provider_expiry > now + 90:
                expires_at = min(expires_at, provider_expiry - 90)
        except Exception:
            pass
        self._resolved_url_cache[media_id] = (max(now + 60, expires_at), url)
        self._schedule_resolved_url_cache_save()

    async def _resolve_youtube_url(self, media_id: str) -> str | None:
        url = (
            media_id
            if media_id.startswith("https://")
            else f"https://www.youtube.com/watch?v={media_id}"
        )
        try:
            # -g asks yt-dlp for only the final playable URL instead of building
            # and serialising the full JSON metadata object. The extractor work
            # remains robust, but the hot path has less overhead.
            process = await asyncio.create_subprocess_exec(
                get_ytdlp_path(),
                *get_ytdlp_runtime_args(),
                url,
                "-g",
                "-f",
                "bestaudio[protocol^=http][protocol!*=m3u8]/bestaudio/best",
                "--no-playlist",
                "--no-warnings",
                "--quiet",
                "--extractor-args",
                "youtube:player-client=android,web",
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE,
                env=get_ytdlp_env(),
            )
            stdout, stderr = await asyncio.wait_for(process.communicate(), timeout=20)
            if process.returncode != 0 or not stdout.strip():
                raise RuntimeError(
                    stderr.decode("utf-8", errors="replace")
                    or "yt-dlp returned no URL"
                )
            for line in stdout.decode("utf-8", errors="replace").splitlines():
                candidate = line.strip()
                if candidate.startswith(("https://", "http://")):
                    return candidate
            raise RuntimeError("yt-dlp returned no playable URL")
        except Exception as error:
            self._record_error("youtube-resolve", error)
            return None

    async def single_yt_url(self, media_id: str):
        local_url = await self.local_audio_url(media_id)
        if local_url:
            return local_url
        if media_id.startswith("local_"):
            return None
        cached = self._resolved_url_get(media_id)
        if cached:
            return cached
        task = self._resolved_url_tasks.get(media_id)
        if task is None or task.done():
            task = asyncio.create_task(self._resolve_youtube_url(media_id))
            self._resolved_url_tasks[media_id] = task
        try:
            resolved = await task
            if resolved:
                self._resolved_url_put(media_id, resolved)
            return resolved
        finally:
            if self._resolved_url_tasks.get(media_id) is task and task.done():
                self._resolved_url_tasks.pop(media_id, None)

    def _schedule_preview_warm(self, media_ids: list[str], limit: int = 8) -> None:
        """Warm a small number of YouTube playable URLs in the background.

        Search results are metadata-only and return immediately.  This helper
        starts URL extraction *after* the result list exists, before the user
        presses A.  single_yt_url() is already cached + single-flight, so a
        foreground preview simply joins the same task instead of launching a
        second yt-dlp process.
        """
        ids: list[str] = []
        seen: set[str] = set()
        for value in media_ids:
            media_id = str(value or '').strip()
            if not media_id or media_id in seen or media_id.startswith('local_'):
                continue
            if self._resolved_url_get(media_id):
                continue
            seen.add(media_id)
            ids.append(media_id)
            if len(ids) >= max(1, min(12, int(limit))):
                break
        if not ids:
            return

        async def runner() -> None:
            # Two concurrent extractors noticeably improve couch latency without
            # turning a search into an yt-dlp stampede on the Deck.
            semaphore = asyncio.Semaphore(2)

            async def warm_one(media_id: str) -> None:
                async with semaphore:
                    try:
                        await self.single_yt_url(media_id)
                    except asyncio.CancelledError:
                        raise
                    except Exception:
                        # Warm-up is opportunistic. The explicit preview path will
                        # surface a real error if this result is chosen later.
                        pass

            await asyncio.gather(*(warm_one(media_id) for media_id in ids))

        task = asyncio.create_task(runner())
        self._preview_warm_tasks.add(task)
        task.add_done_callback(lambda finished: self._preview_warm_tasks.discard(finished))

    async def cache_resolved_audio(
        self,
        media_id: str,
        url: str,
        title: str = '',
        provider: str = 'youtube',
        settle_delay: float = 6.0,
    ):
        """Queue persistent caching without competing with first playback."""
        if not media_id or not url or url.startswith("data:"):
            return False
        if await self.local_audio_exists(media_id):
            return True
        key = get_audio_filename(media_id)
        task = self._materialize_tasks.get(key)
        if task is not None and not task.done():
            return True

        async def materialize() -> bool:
            try:
                # Native Steam re-entry benefits from a shorter settle delay
                # after a cold exact-track recovery. Non-Steam callers keep the
                # proven six-second default. Clamp caller input defensively.
                try:
                    delay = max(0.0, min(10.0, float(settle_delay)))
                except (TypeError, ValueError):
                    delay = 6.0
                await asyncio.sleep(delay)
                if await self.local_audio_exists(media_id):
                    return True
                # We already paid yt-dlp to obtain a proven direct audio URL. Do
                # not launch yt-dlp a second time. Saving that exact stream is both
                # cheaper and faster, and the resulting webm/m4a file is natively
                # playable by Chromium on SteamOS.
                try:
                    return await self.download_url(
                        url, media_id, title, provider or "remote"
                    )
                except Exception:
                    return False
            finally:
                self._materialize_tasks.pop(key, None)

        self._materialize_tasks[key] = asyncio.create_task(materialize())
        return True

    async def download_yt_audio(self, media_id: str, title: str = ''):
        url = (
            media_id
            if media_id.startswith("https://")
            else f"https://www.youtube.com/watch?v={media_id}"
        )
        filename = get_audio_filename(media_id)
        existing = self.local_match(filename)
        if existing is not None:
            self._touch_download(media_id, existing, "youtube", title or None)
            return True

        has_ffmpeg = shutil.which("ffmpeg") is not None
        format_args = (
            ["-x", "--audio-format", "mp3", "--audio-quality", "128K"]
            if has_ffmpeg
            else [
                "-f",
                "bestaudio[protocol^=http][protocol!*=m3u8]/bestaudio/best",
            ]
        )
        args = [
            get_ytdlp_path(),
            *get_ytdlp_runtime_args(),
            url,
            *format_args,
            "-o",
            f"{filename}.%(ext)s",
            "-P",
            self.music_path,
            "--no-playlist",
            "--no-warnings",
            "--quiet",
            "--extractor-args",
            "youtube:player-client=android,web",
        ]
        async with self._download_lock:
            try:
                process = await asyncio.create_subprocess_exec(
                    *args,
                    stdout=asyncio.subprocess.PIPE,
                    stderr=asyncio.subprocess.PIPE,
                    env=get_ytdlp_env(),
                )
                _, stderr = await asyncio.wait_for(
                    process.communicate(), timeout=360
                )
                if process.returncode != 0:
                    raise RuntimeError(
                        stderr.decode("utf-8", errors="replace")
                        or "yt-dlp download failed"
                    )
                local_file = self.local_match(filename)
                if local_file is None or os.path.getsize(local_file) == 0:
                    raise RuntimeError(
                        "Download completed without a playable output file"
                    )
                self._touch_download(media_id, local_file, "youtube", title or None)
                await self.enforce_storage_limit()
                return True
            except Exception as error:
                self._record_error("youtube-download", error)
                raise

    async def download_url(self, url: str, media_id: str, title: str = '', provider: str = 'khinsider', progress_job_id: str = ''):
        if url.startswith("data:"):
            return True
        filename = get_audio_filename(media_id)
        extension = infer_download_extension(url)
        file_path = os.path.join(
            self.music_path, f"{filename}.{extension}"
        )
        temporary = f"{file_path}.part"
        timeout = aiohttp.ClientTimeout(total=300, connect=10)
        headers = {
            "User-Agent": "Mozilla/5.0 GameThemeMusic/1.9",
            "Referer": (
                "https://www.youtube.com/"
                if provider == "youtube"
                else (media_id if media_id.startswith("https://") else "https://downloads.khinsider.com/")
            ),
        }
        async with self._download_lock:
            try:
                written = 0
                async with aiohttp.ClientSession(timeout=timeout) as session:
                    async with session.get(
                        url, headers=headers, ssl=self.ssl_context
                    ) as response:
                        response.raise_for_status()
                        # Direct YouTube CDN URLs often end in /videoplayback with
                        # no useful extension. Preserve the actual response format
                        # so the loopback server advertises the correct MIME type.
                        response_extension = infer_response_audio_extension(
                            response.headers.get("content-type", ""), extension
                        )
                        if response_extension != extension:
                            extension = response_extension
                            file_path = os.path.join(
                                self.music_path, f"{filename}.{extension}"
                            )
                            temporary = f"{file_path}.part"
                        length = int(
                            response.headers.get("content-length", "0") or 0
                        )
                        self._download_job_update(progress_job_id, status="downloading", total=length, downloaded=0, progress=0.0)
                        if length > MAX_AUDIO_BYTES:
                            raise ValueError(
                                "Remote audio exceeds the 2 GB limit"
                            )
                        with open(temporary, "wb") as file:
                            async for chunk in response.content.iter_chunked(
                                256 * 1024
                            ):
                                written += len(chunk)
                                progress = min(99.5, (written * 100.0 / length)) if length > 0 else None
                                self._download_job_update(progress_job_id, downloaded=written, total=length, progress=progress)
                                if written > MAX_AUDIO_BYTES:
                                    raise ValueError(
                                        "Remote audio exceeds the 2 GB limit"
                                    )
                                file.write(chunk)
                if written == 0:
                    raise ValueError("Provider returned an empty audio file")
                os.replace(temporary, file_path)
                self._touch_download(
                    media_id, file_path, provider or "remote", title or None
                )
                self._download_job_update(progress_job_id, status="complete", downloaded=written, total=written if length <= 0 else length, progress=100.0)
                await self.enforce_storage_limit()
                return True
            except Exception as error:
                Path(temporary).unlink(missing_ok=True)
                self._download_job_update(progress_job_id, status="error", error=str(error))
                self._record_error("provider-download", error)
                raise

    async def import_local_audio(self, source_path: str):
        source = Path(source_path).expanduser().resolve(strict=True)
        if not source.is_file():
            raise ValueError("Choose a regular audio file")
        extension = source.suffix.lower().lstrip(".")
        if extension not in AUDIO_DOWNLOAD_EXTENSIONS:
            raise ValueError("Unsupported audio type")
        size = source.stat().st_size
        if size <= 0 or size > MAX_AUDIO_BYTES:
            raise ValueError("Audio file must be between 1 byte and 2 GB")

        digest = hashlib.sha256()
        with source.open("rb") as file:
            while chunk := file.read(1024 * 1024):
                digest.update(chunk)
        media_id = f"local_{digest.hexdigest()[:24]}"
        target = Path(self.music_path) / f"{media_id}.{extension}"
        temporary = target.with_suffix(target.suffix + ".part")
        shutil.copyfile(source, temporary)
        os.replace(temporary, target)
        self._touch_download(
            media_id, str(target), "local", source.stem
        )
        try:
            await asyncio.to_thread(self._extract_embedded_artwork, media_id, str(target))
        except Exception:
            pass
        await self.enforce_storage_limit()
        return {
            "id": media_id,
            "title": source.stem,
            "provider": "local",
            "thumbnail": (await self.local_artwork_url(media_id)) or "",
            "size": size,
            "url": await self.local_audio_url(media_id),
        }

    def _load_download_index(self) -> None:
        try:
            with open(self.index_path, "r", encoding="utf-8") as file:
                value = json.load(file)
            if (
                isinstance(value, dict)
                and isinstance(value.get("files"), dict)
            ):
                self._download_index = value
                # 2.9.5: preserve playlist ownership across backend restarts.
                # Reconciliation runs before the frontend necessarily has time
                # to resend its pinned IDs. Seed the in-memory pin set from the
                # persisted download index so startup maintenance can never
                # downgrade assigned game-theme files to eviction candidates.
                self._pinned_ids = {
                    str(entry.get("id"))
                    for entry in value.get("files", {}).values()
                    if isinstance(entry, dict)
                    and entry.get("pinned")
                    and entry.get("id")
                }
        except FileNotFoundError:
            pass
        except Exception as error:
            self._record_error("storage-index-read", error)

    def _save_download_index(self) -> None:
        _safe_json_write(self.index_path, self._download_index)

    async def _save_download_index_debounced(self) -> None:
        try:
            await asyncio.sleep(0.18)
            await asyncio.to_thread(self._save_download_index)
        except asyncio.CancelledError:
            raise
        except Exception as error:
            self._record_error("storage-index-write", error)

    def _schedule_download_index_save(self) -> None:
        try:
            loop = asyncio.get_running_loop()
        except RuntimeError:
            self._save_download_index()
            return
        task = self._download_index_save_task
        if task is not None and not task.done():
            return
        self._download_index_save_task = loop.create_task(
            self._save_download_index_debounced()
        )

    def _reconcile_download_index(self) -> None:
        os.makedirs(self.music_path, exist_ok=True)
        files = self._download_index.setdefault("files", {})
        present: set[str] = set()
        for entry in os.scandir(self.music_path):
            if (
                not entry.is_file()
                or entry.name == "downloads.json"
                or entry.name.endswith(".part")
            ):
                continue
            extension = Path(entry.name).suffix.lower().lstrip(".")
            if extension not in AUDIO_DOWNLOAD_EXTENSIONS:
                continue
            present.add(entry.name)
            existing = files.get(entry.name, {})
            media_id = existing.get("id", Path(entry.name).stem)
            existing.update(
                {
                    "file": entry.name,
                    "id": media_id,
                    "title": existing.get(
                        "title", Path(entry.name).stem
                    ),
                    "provider": existing.get("provider", "unknown"),
                    "thumbnail": existing.get("thumbnail", ""),
                    "size": entry.stat().st_size,
                    "lastAccess": existing.get(
                        "lastAccess", entry.stat().st_mtime
                    ),
                    # 2.9.5: _pinned_ids is seeded from the persisted
                    # index at startup and refreshed by the frontend. This
                    # prevents the four-second reconcile pass from unpinning
                    # assigned tracks before localForage finishes loading.
                    "pinned": media_id in self._pinned_ids,
                }
            )
            files[entry.name] = existing
        for filename in list(files):
            if filename not in present:
                files.pop(filename, None)
        self._save_download_index()

    def _touch_download(
        self,
        media_id: str,
        path: str,
        provider: str | None = None,
        title: str | None = None,
        thumbnail: str | None = None,
    ) -> None:
        filename = os.path.basename(path)
        if not os.path.isfile(path):
            return
        old = self._download_index.setdefault("files", {}).get(
            filename, {}
        )
        self._download_index["files"][filename] = {
            "file": filename,
            "id": media_id,
            "title": title or old.get("title") or media_id,
            "provider": provider or old.get("provider") or "unknown",
            "thumbnail": thumbnail or old.get("thumbnail") or "",
            "size": os.path.getsize(path),
            "lastAccess": time.time(),
            "pinned": media_id in self._pinned_ids,
        }
        self._schedule_download_index_save()

    def _touch_download_by_file(self, filename: str) -> None:
        entry = self._download_index.setdefault("files", {}).get(
            filename
        )
        if entry:
            entry["lastAccess"] = time.time()
            self._schedule_download_index_save()

    async def set_pinned_ids(
        self, media_ids: list[str], enforce_limit: bool = True
    ):
        self._pinned_ids = {
            str(media_id) for media_id in media_ids if media_id
        }
        for entry in self._download_index.setdefault(
            "files", {}
        ).values():
            entry["pinned"] = entry.get("id") in self._pinned_ids
        self._save_download_index()
        # 2.9.5 startup pin sync is metadata-critical but not housekeeping-
        # critical. Let the already-scheduled four-second maintenance pass do
        # the directory reconciliation instead of scanning Download Storage on
        # the first UI paint.
        if not enforce_limit:
            return {
                "count": len(self._pinned_ids),
                "deferredEnforcement": True,
            }
        return await self.enforce_storage_limit()

    async def sync_download_metadata(self, tracks: list[dict[str, Any]]):
        """Repair human metadata for existing downloaded files.

        The frontend owns the per-game playlist cache, so it supplies known
        title/provider/game names. This upgrades old ID-only downloads without
        renaming or redownloading audio.
        """
        known: dict[str, dict[str, Any]] = {}
        for raw in tracks[:2048]:
            if not isinstance(raw, dict):
                continue
            media_id = str(raw.get("id") or "")
            if not media_id:
                continue
            title = str(raw.get("title") or "").strip()
            provider = str(raw.get("provider") or "").strip()
            thumbnail = str(raw.get("thumbnail") or "").strip()
            games = [
                str(name).strip()
                for name in (raw.get("games") or [])
                if str(name).strip()
            ][:24]
            current = known.setdefault(
                media_id,
                {"title": "", "provider": "", "thumbnail": "", "games": []},
            )
            if title and title not in {
                media_id,
                "Imported 1.8 theme",
            }:
                current["title"] = title
            if provider and provider != "unknown":
                current["provider"] = provider
            if thumbnail:
                current["thumbnail"] = thumbnail
            current["games"] = sorted(
                set(current["games"]) | set(games)
            )[:24]

        changed = 0
        for entry in self._download_index.setdefault("files", {}).values():
            media_id = str(entry.get("id") or "")
            meta = known.get(media_id)
            if not meta:
                continue
            before = (
                entry.get("title"),
                entry.get("provider"),
                entry.get("thumbnail"),
                tuple(entry.get("games") or []),
            )
            if meta["title"]:
                entry["title"] = meta["title"]
            if meta["provider"]:
                entry["provider"] = meta["provider"]
            if meta.get("thumbnail"):
                entry["thumbnail"] = meta["thumbnail"]
                if not self._find_artwork_file(media_id):
                    asyncio.create_task(self.cache_artwork(media_id, meta["thumbnail"], meta.get("provider", "")))
            elif not self._find_artwork_file(media_id) and meta.get("provider") == "youtube":
                asyncio.create_task(self.cache_artwork(media_id, "", "youtube"))
            if meta["games"]:
                entry["games"] = meta["games"]
            after = (
                entry.get("title"),
                entry.get("provider"),
                entry.get("thumbnail"),
                tuple(entry.get("games") or []),
            )
            if before != after:
                changed += 1

        if changed:
            self._save_download_index()
        return {"updated": changed, "known": len(known)}

    async def repair_track_metadata(self, media_ids: list[str]):
        """Recover human titles for legacy ID-only YouTube entries.

        One bounded yt-dlp process resolves a small batch. Failures are harmless:
        existing audio and assignments are never renamed or removed.
        """
        unique: list[str] = []
        for raw_id in media_ids[:60]:
            media_id = str(raw_id or "").strip()
            if media_id and media_id not in unique:
                unique.append(media_id)
            if len(unique) >= 30:
                break
        if not unique:
            return {"attempted": 0, "updated": 0, "tracks": []}

        bad_titles = {"", "Imported 1.8 theme", "Unknown downloaded theme", "Ambient track", "Store track"}
        entries_by_id: dict[str, list[dict[str, Any]]] = {}
        for entry in self._download_index.setdefault("files", {}).values():
            entries_by_id.setdefault(str(entry.get("id") or ""), []).append(entry)

        resolved: dict[str, dict[str, str]] = {}
        pending: list[tuple[str, str]] = []
        for media_id in unique:
            matches = entries_by_id.get(media_id, [])
            provider = next((str(e.get("provider") or "") for e in matches if str(e.get("provider") or "") not in {"", "unknown"}), "")
            title = next((str(e.get("title") or "").strip() for e in matches if str(e.get("title") or "").strip() not in bad_titles and str(e.get("title") or "").strip() != media_id), "")
            if title:
                resolved[media_id] = {"id": media_id, "title": title, "provider": provider or "youtube"}
                continue
            if media_id.startswith("local_") or provider == "local":
                filename = next((str(e.get("file") or "") for e in matches if e.get("file")), "")
                stem = Path(filename).stem if filename else ""
                if stem and stem != media_id:
                    resolved[media_id] = {"id": media_id, "title": stem.replace("_", " ").strip(), "provider": "local"}
                continue
            if provider == "khinsider" or "khinsider.com" in media_id:
                continue
            if media_id.startswith(("http://", "https://")):
                if "youtube.com" not in media_id and "youtu.be" not in media_id:
                    continue
                url = media_id
            else:
                url = f"https://www.youtube.com/watch?v={urllib.parse.quote(media_id, safe='_-')}"
            pending.append((media_id, url))

        if pending:
            ytdlp_path = get_ytdlp_path()
            try:
                if os.path.isfile(ytdlp_path):
                    os.chmod(ytdlp_path, 0o755)
                    process = await asyncio.create_subprocess_exec(
                        ytdlp_path,
                        *get_ytdlp_runtime_args(),
                        "--skip-download",
                        "--dump-json",
                        "--no-playlist",
                        "--no-warnings",
                        "--quiet",
                        "--socket-timeout", "8",
                        "--retries", "1",
                        "--extractor-retries", "1",
                        *[url for _, url in pending],
                        stdout=asyncio.subprocess.PIPE,
                        stderr=asyncio.subprocess.PIPE,
                        limit=8 * 1024**2,
                        env=get_ytdlp_env(),
                    )
                    stdout, _stderr = await asyncio.wait_for(process.communicate(), timeout=45)
                    lines = [line for line in stdout.splitlines() if line.strip()]
                    for index, raw_line in enumerate(lines[: len(pending)]):
                        try:
                            data = json.loads(raw_line)
                        except (json.JSONDecodeError, TypeError):
                            continue
                        title = str(data.get("title") or "").strip()
                        if not title:
                            continue
                        result_id = str(data.get("id") or "").strip()
                        original = None
                        for candidate_id, _url in pending:
                            if candidate_id == result_id or candidate_id.endswith(result_id):
                                original = candidate_id
                                break
                        if original is None and index < len(pending):
                            original = pending[index][0]
                        if original:
                            resolved[original] = {"id": original, "title": title, "provider": "youtube"}
            except TimeoutError as error:
                self._record_error("metadata-repair-timeout", error)
                try:
                    process.kill()
                    await process.communicate()
                except Exception:
                    pass
            except Exception as error:
                self._record_error("metadata-repair", error)

        updated = 0
        for media_id, info in resolved.items():
            for entry in entries_by_id.get(media_id, []):
                before = (entry.get("title"), entry.get("provider"))
                entry["title"] = info["title"]
                if info.get("provider"):
                    entry["provider"] = info["provider"]
                if before != (entry.get("title"), entry.get("provider")):
                    updated += 1
        if updated:
            self._save_download_index()
        return {"attempted": len(unique), "updated": updated, "tracks": list(resolved.values())}

    async def list_downloads(self, refresh: bool = False):
        if refresh:
            self._reconcile_download_index()

        result: list[dict[str, Any]] = []
        for raw in sorted(
            self._download_index.get("files", {}).values(),
            key=lambda entry: float(entry.get("lastAccess", 0)),
            reverse=True,
        ):
            entry = dict(raw)
            media_id = str(entry.get("id") or "")
            title = str(entry.get("title") or "").strip()
            # Old downloads often used the opaque provider/media key as title.
            entry["displayTitle"] = (
                title
                if title and title != media_id and title not in {"Imported 1.8 theme", "Unknown downloaded theme"}
                else f"Legacy track · …{media_id[-8:]}" if media_id else "Legacy track"
            )
            entry["displayId"] = (
                f"…{media_id[-8:]}" if len(media_id) > 8 else media_id
            )
            entry["games"] = [
                str(name)
                for name in (entry.get("games") or [])
                if str(name).strip()
            ]
            entry["localArtwork"] = (await self.local_artwork_url(media_id)) or ""
            if not entry["localArtwork"] and not entry.get("thumbnail") and str(entry.get("provider") or "") == "youtube":
                asyncio.create_task(self.cache_artwork(media_id, "", "youtube"))
            result.append(entry)
        return result

    async def delete_download(self, media_id: str):
        deleted = 0
        expected_stem = get_audio_filename(media_id)
        for filename, entry in list(
            self._download_index.setdefault("files", {}).items()
        ):
            if (
                entry.get("id") != media_id
                and Path(filename).stem != expected_stem
            ):
                continue
            path = os.path.join(self.music_path, filename)
            if os.path.isfile(path):
                os.remove(path)
                deleted += 1
            self._download_index["files"].pop(filename, None)
        self._delete_artwork(media_id)
        self._save_download_index()
        return deleted

    async def clear_downloads(self):
        for filename in list(
            self._download_index.setdefault("files", {})
        ):
            path = os.path.join(self.music_path, filename)
            if os.path.isfile(path):
                os.remove(path)
        for entry in os.scandir(self.music_path):
            if (
                entry.is_file()
                and Path(entry.name).suffix.lower().lstrip(".")
                in AUDIO_DOWNLOAD_EXTENSIONS
            ):
                os.remove(entry.path)
        self._download_index["files"] = {}
        if os.path.isdir(self.artwork_path):
            for entry in os.scandir(self.artwork_path):
                if entry.is_file() and Path(entry.name).suffix.lower().lstrip(".") in {"jpg", "jpeg", "png", "webp"}:
                    Path(entry.path).unlink(missing_ok=True)
        self._save_download_index()

    async def enforce_storage_limit(
        self, limit_mb: int | None = None, reconcile: bool = True
    ):
        if limit_mb is None:
            raw = self._settings_value(
                "storageLimitMb", DEFAULT_STORAGE_LIMIT_MB
            )
            try:
                limit_mb = max(0, int(raw))
            except (TypeError, ValueError):
                limit_mb = DEFAULT_STORAGE_LIMIT_MB
        if reconcile:
            self._reconcile_download_index()
        entries = list(
            self._download_index.get("files", {}).values()
        )
        total = sum(int(entry.get("size", 0)) for entry in entries)
        removed: list[str] = []
        limit_bytes = limit_mb * 1024 * 1024
        if limit_bytes > 0 and total > limit_bytes:
            candidates = sorted(
                (
                    entry
                    for entry in entries
                    if not entry.get("pinned")
                ),
                key=lambda entry: float(entry.get("lastAccess", 0)),
            )
            for entry in candidates:
                if total <= limit_bytes:
                    break
                path = os.path.join(
                    self.music_path, str(entry.get("file", ""))
                )
                try:
                    size = int(entry.get("size", 0))
                    if os.path.isfile(path):
                        os.remove(path)
                    self._download_index["files"].pop(
                        entry.get("file"), None
                    )
                    self._delete_artwork(str(entry.get("id", "")))
                    total -= size
                    removed.append(str(entry.get("id", "")))
                except Exception as error:
                    self._record_error("storage-eviction", error)
        self._save_download_index()
        return {
            "limitMb": limit_mb,
            "usedBytes": max(0, total),
            "count": len(
                self._download_index.get("files", {})
            ),
            "removed": removed,
        }

    async def export_cache(self, cache: dict):
        os.makedirs(self.cache_path, exist_ok=True)
        filename = (
            "backup-"
            + datetime.datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
            + ".json"
        )
        full_path = os.path.join(self.cache_path, filename)
        _safe_json_write(full_path, cache)
        return full_path

    async def list_cache_backups(self):
        try:
            return sorted(
                [
                    file.rsplit(".", 1)[0]
                    for file in os.listdir(self.cache_path)
                    if file.endswith(".json")
                    and os.path.isfile(
                        os.path.join(self.cache_path, file)
                    )
                ],
                reverse=True,
            )
        except FileNotFoundError:
            return []

    async def import_cache(self, name: str):
        safe_name = os.path.basename(name)
        path = os.path.join(self.cache_path, f"{safe_name}.json")
        with open(path, "r", encoding="utf-8") as file:
            return json.load(file)

    async def clear_cache(self):
        try:
            for file in os.listdir(self.cache_path):
                full_path = os.path.join(self.cache_path, file)
                if os.path.isfile(full_path):
                    os.remove(full_path)
        except FileNotFoundError:
            pass

    async def _binary_version(
        self, binary: str, timeout: int = 10
    ) -> str | None:
        if not os.path.isfile(binary):
            return None
        process = await asyncio.create_subprocess_exec(
            binary,
            "--version",
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
            env=get_ytdlp_env(),
        )
        stdout, stderr = await asyncio.wait_for(
            process.communicate(), timeout=timeout
        )
        if process.returncode != 0:
            raise RuntimeError(
                stderr.decode("utf-8", errors="replace")
                or "Version check failed"
            )
        return (
            stdout.decode("utf-8", errors="replace")
            .strip()
            .splitlines()[0]
        )

    async def _quickjs_version(self) -> str | None:
        binary = get_js_runtime_path()
        if not os.path.isfile(binary):
            return None
        process = await asyncio.create_subprocess_exec(
            binary,
            "--help",
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE,
            env=get_ytdlp_env(),
        )
        stdout, stderr = await asyncio.wait_for(
            process.communicate(), timeout=10
        )
        output = (
            stdout.decode("utf-8", errors="replace")
            + "\n"
            + stderr.decode("utf-8", errors="replace")
        )
        version = next(
            (
                line.strip()
                for line in output.splitlines()
                if line.startswith("QuickJS version ")
            ),
            None,
        )
        if not version:
            raise RuntimeError("QuickJS did not report its version")
        return version

    async def get_health(self, deep: bool = False):
        checks: list[dict[str, Any]] = []

        def add(
            check_id: str,
            label: str,
            status: str,
            message: str,
            **details: Any,
        ) -> None:
            checks.append(
                {
                    "id": check_id,
                    "label": label,
                    "status": status,
                    "message": message,
                    **details,
                }
            )

        for check_id, label, directory in (
            (
                "settings",
                "Settings folder",
                decky.DECKY_PLUGIN_SETTINGS_DIR,
            ),
            (
                "runtime",
                "Runtime folder",
                decky.DECKY_PLUGIN_RUNTIME_DIR,
            ),
            ("music", "Music cache", self.music_path),
        ):
            writable = (
                os.path.isdir(directory)
                and os.access(directory, os.W_OK)
            )
            add(
                check_id,
                label,
                "ok" if writable else "error",
                "Writable" if writable else "Not writable",
            )

        try:
            version = await self._binary_version(get_ytdlp_path())
            add(
                "yt-dlp",
                "YouTube helper",
                "ok" if version else "error",
                version or "Missing",
            )
        except Exception as error:
            add(
                "yt-dlp",
                "YouTube helper",
                "error",
                self._sanitize_text(str(error)),
            )

        try:
            version = await self._quickjs_version()
            add(
                "quickjs",
                "JavaScript runtime",
                "ok" if version else "error",
                version or "Missing",
            )
        except Exception as error:
            add(
                "quickjs",
                "JavaScript runtime",
                "error",
                self._sanitize_text(str(error)),
            )

        add(
            "stream",
            "Local audio streaming",
            "ok" if self._stream_port else "error",
            (
                f"Listening on loopback port {self._stream_port}"
                if self._stream_port
                else "Not running"
            ),
        )
        ffmpeg = shutil.which("ffmpeg")
        add(
            "ffmpeg",
            "Audio conversion",
            "ok" if ffmpeg else "warning",
            (
                "Available"
                if ffmpeg
                else "Optional; native formats will be used"
            ),
        )

        if deep:
            status, message = "error", "No result"
            process: asyncio.subprocess.Process | None = None
            try:
                process = await asyncio.create_subprocess_exec(
                    get_ytdlp_path(),
                    *get_ytdlp_runtime_args(),
                    "ytsearch1:Steam Deck startup music",
                    "--simulate",
                    "--no-playlist",
                    "--print",
                    "%(id)s",
                    "--no-warnings",
                    stdout=asyncio.subprocess.PIPE,
                    stderr=asyncio.subprocess.PIPE,
                    env=get_ytdlp_env(),
                )
                stdout, stderr = await asyncio.wait_for(
                    process.communicate(), timeout=40
                )
                if process.returncode == 0 and stdout.strip():
                    status, message = (
                        "ok",
                        "Metadata lookup succeeded",
                    )
                else:
                    message = (
                        self._sanitize_text(
                            stderr.decode(
                                "utf-8", errors="replace"
                            )
                        )[:240]
                        or "No result"
                    )
            except Exception as error:
                if process and process.returncode is None:
                    process.kill()
                message = self._sanitize_text(str(error))
            add(
                "youtube-provider",
                "YouTube provider",
                status,
                message,
            )

            html = await self.fetch_url(
                "https://downloads.khinsider.com/"
            )
            add(
                "khinsider-provider",
                "KHInsider provider",
                "ok" if html else "error",
                (
                    "Website reachable"
                    if html
                    else "Website unavailable"
                ),
            )

        storage = await self.enforce_storage_limit()
        severities = {check["status"] for check in checks}
        overall = (
            "error"
            if "error" in severities
            else "warning"
            if "warning" in severities
            else "ok"
        )
        return {
            "overall": overall,
            "generatedAt": _now_iso(),
            "pluginVersion": PLUGIN_VERSION,
            "deckyVersion": getattr(
                decky, "DECKY_VERSION", "unknown"
            ),
            "checks": checks,
            "storage": storage,
            "recentErrors": list(self._errors)[-10:],
        }

    async def export_diagnostics(self, frontend_diagnostics: dict | None = None):
        os.makedirs(self.diagnostics_path, exist_ok=True)
        timestamp = datetime.datetime.now().strftime(
            "%Y%m%d-%H%M%S"
        )
        filename = (
            f"GameThemeMusic-diagnostics-{timestamp}.zip"
        )
        output = os.path.join(self.diagnostics_path, filename)
        health = await self.get_health(deep=False)
        if not isinstance(frontend_diagnostics, dict):
            frontend_diagnostics = {}
        # Keep the exported frontend payload bounded even if a future frontend
        # accidentally sends an oversized recorder. Sanitization below removes
        # home paths and URL query strings just like the rest of diagnostics.
        trace = frontend_diagnostics.get("navigationTrace", [])
        if isinstance(trace, list):
            frontend_diagnostics["navigationTrace"] = trace[-200:]
        safe_frontend_diagnostics = self._sanitize_value(frontend_diagnostics)
        try:
            settings = self.settings.getSetting("settings", {})
        except Exception:
            settings = {}

        manifests: dict[str, Any] = {}
        for name in ("plugin.json", "package.json"):
            path = os.path.join(decky.DECKY_PLUGIN_DIR, name)
            try:
                with open(path, "r", encoding="utf-8") as file:
                    manifests[name] = json.load(file)
            except Exception as error:
                manifests[name] = {"error": str(error)}

        log_tail = ""
        log_path = getattr(decky, "DECKY_PLUGIN_LOG", "")
        if log_path and os.path.isfile(log_path):
            with open(log_path, "rb") as file:
                file.seek(
                    max(
                        0,
                        os.path.getsize(log_path) - 200_000,
                    )
                )
                log_tail = file.read().decode(
                    "utf-8", errors="replace"
                )

        safe_index = {
            "version": self._download_index.get(
                "version", INDEX_VERSION
            ),
            "files": [
                {
                    "id": entry.get("id"),
                    "provider": entry.get("provider"),
                    "size": entry.get("size"),
                    "lastAccess": entry.get("lastAccess"),
                    "pinned": entry.get("pinned"),
                    "extension": Path(
                        str(entry.get("file", ""))
                    ).suffix,
                }
                for entry in self._download_index.get(
                    "files", {}
                ).values()
            ],
        }
        with zipfile.ZipFile(
            output, "w", compression=zipfile.ZIP_DEFLATED
        ) as archive:
            archive.writestr(
                "health.json",
                json.dumps(
                    self._sanitize_value(health), indent=2
                ),
            )
            archive.writestr(
                "settings-sanitized.json",
                json.dumps(
                    self._sanitize_value(settings), indent=2
                ),
            )
            archive.writestr(
                "manifests.json",
                json.dumps(
                    self._sanitize_value(manifests), indent=2
                ),
            )
            archive.writestr(
                "download-metadata.json",
                json.dumps(
                    self._sanitize_value(safe_index), indent=2
                ),
            )
            archive.writestr(
                "recent-errors.json",
                json.dumps(
                    self._sanitize_value(list(self._errors)),
                    indent=2,
                ),
            )
            archive.writestr(
                "frontend-diagnostics.json",
                json.dumps(safe_frontend_diagnostics, indent=2),
            )
            archive.writestr(
                "frontend-navigation-trace.json",
                json.dumps(
                    safe_frontend_diagnostics.get("navigationTrace", []),
                    indent=2,
                ),
            )
            archive.writestr(
                "plugin-log-tail.txt",
                self._sanitize_text(log_tail),
            )
            archive.writestr(
                "README.txt",
                "Contains health results, versions, redacted logs, metadata, "
                "and the persistent frontend navigation/theme flight recorder. "
                "No audio files are included.\n",
            )

        desktop_path = None
        desktop = (
            Path(getattr(decky, "DECKY_USER_HOME", ""))
            / "Desktop"
        )
        try:
            if desktop.is_dir() and os.access(desktop, os.W_OK):
                copy = desktop / filename
                shutil.copy2(output, copy)
                desktop_path = str(copy)
        except Exception as error:
            self._record_error(
                "diagnostics-desktop-copy", error
            )
        return {
            "path": output,
            "desktopPath": desktop_path,
            "filename": filename,
        }

    async def update_yt_dlp(self):
        target = Path(get_ytdlp_path())
        temporary = target.with_name(f"{target.name}.tmp")
        previous = target.with_name(f"{target.name}.previous")
        try:
            target.parent.mkdir(parents=True, exist_ok=True)
            timeout = aiohttp.ClientTimeout(
                total=180, connect=10
            )
            async with aiohttp.ClientSession(
                timeout=timeout
            ) as session:
                async with session.get(
                    "https://api.github.com/repos/"
                    "yt-dlp/yt-dlp/releases/latest",
                    ssl=self.ssl_context,
                ) as response:
                    response.raise_for_status()
                    release = await response.json()
                tag = release.get("tag_name", "unknown")
                if platform.system() == "Windows":
                    asset_name = "yt-dlp.exe"
                elif (
                    platform.system() == "Linux"
                    and platform.machine().lower()
                    in ("x86_64", "amd64")
                ):
                    asset_name = "yt-dlp_linux"
                else:
                    return {
                        "success": False,
                        "message": (
                            "Automatic update is unsupported "
                            "on this platform"
                        ),
                    }
                asset = next(
                    (
                        item
                        for item in release.get("assets", [])
                        if item.get("name") == asset_name
                    ),
                    None,
                )
                if not asset:
                    return {
                        "success": False,
                        "message": (
                            f"Release does not contain {asset_name}"
                        ),
                    }
                digest = hashlib.sha256()
                async with session.get(
                    asset["browser_download_url"],
                    ssl=self.ssl_context,
                ) as response:
                    response.raise_for_status()
                    with open(temporary, "wb") as file:
                        async for chunk in (
                            response.content.iter_chunked(
                                256 * 1024
                            )
                        ):
                            digest.update(chunk)
                            file.write(chunk)
                expected = asset.get("digest")
                actual = f"sha256:{digest.hexdigest()}"
                if expected and expected != actual:
                    raise ValueError(
                        "Downloaded yt-dlp failed its "
                        "SHA-256 integrity check"
                    )
            temporary.chmod(0o755)
            # Validate the candidate before it can replace the known-good copy.
            await self._binary_version(str(temporary))
            if target.exists():
                shutil.copy2(target, previous)
            os.replace(temporary, target)
            try:
                installed = await self._binary_version(str(target))
            except Exception:
                if previous.exists():
                    shutil.copy2(previous, target)
                    target.chmod(0o755)
                raise
            return {
                "success": True,
                "message": (
                    f"Updated yt-dlp to {tag} ({installed})"
                ),
                "canRollback": previous.exists(),
            }
        except Exception as error:
            temporary.unlink(missing_ok=True)
            self._record_error("yt-dlp-update", error)
            return {
                "success": False,
                "message": self._sanitize_text(str(error)),
                "canRollback": previous.exists(),
            }

    async def rollback_yt_dlp(self):
        current = Path(get_ytdlp_path())
        previous = current.with_name(
            f"{current.name}.previous"
        )
        if not previous.exists():
            return {
                "success": False,
                "message": (
                    "No previous yt-dlp build is available"
                ),
            }
        temporary = current.with_name(
            f"{current.name}.rollback-tmp"
        )
        try:
            if current.exists():
                shutil.copy2(current, temporary)
            shutil.copy2(previous, current)
            current.chmod(0o755)
            version = await self._binary_version(str(current))
            if temporary.exists():
                shutil.copy2(temporary, previous)
            temporary.unlink(missing_ok=True)
            return {
                "success": True,
                "message": f"Restored yt-dlp {version}",
            }
        except Exception as error:
            if temporary.exists():
                shutil.copy2(temporary, current)
            temporary.unlink(missing_ok=True)
            self._record_error("yt-dlp-rollback", error)
            return {
                "success": False,
                "message": self._sanitize_text(str(error)),
            }
