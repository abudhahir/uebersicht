# Windows/Linux compatibility matrix

| Capability | Windows | Linux X11 | Linux Wayland |
| --- | --- | --- | --- |
| React/JSX widgets | Supported | Supported | Supported |
| HTTP/WebSocket widget protocol | Supported | Supported | Supported |
| Multi-monitor rendering | Supported through Electron display APIs | Supported | Compositor-dependent |
| Transparent fullscreen windows | Supported | Supported | Compositor-dependent |
| Click-through background widgets | Supported | Supported | Compositor-dependent |
| Desktop-layer/behind-icons behavior | Best effort; z-order differs from macOS | Best effort; WM-dependent | Often unavailable |
| Widget commands | `cmd.exe` by default; PowerShell/WSL can be invoked explicitly | User POSIX shell | User POSIX shell |
| File watching | Node watcher | Node watcher; recursive support depends on Node/filesystem | Node watcher; compositor-independent |
| Tray menu | Native Electron tray | Native Electron tray | Desktop-environment-dependent |
| Notifications | Native toast notifications | Desktop notification service | Desktop-environment-dependent |
| AppleScript | Not available; use the local protocol/CLI planned for a follow-up | Not available; use the local protocol/CLI planned for a follow-up | Not available; use the local protocol/CLI planned for a follow-up |
| Automatic updates | Requires signed Windows packaging/update service | Package/AppImage update strategy required | Package/AppImage update strategy required |

## Test matrix

Each release should test:

1. One and two displays, including negative virtual-screen coordinates and DPI
   scaling.
2. Background and interactive widgets, mouse enter/leave, reload, and tray
   actions.
3. Widget add/change/remove events and persistence across restart.
4. Shell commands with stdout, stderr, non-zero exit, Unicode, and timeouts.
5. X11 desktop environments and at least one Wayland compositor, recording
   unsupported window behaviors rather than silently claiming compatibility.
