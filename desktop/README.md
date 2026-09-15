# Cross-platform desktop host

This Electron host preserves the existing widget server and HTTP/WebSocket
protocol while replacing the Cocoa shell. Build the server first with
`cd ../server && npm run release`, then run `npm install` and `npm start` here.

The host creates transparent windows for every display, a click-through
background window, an interactive foreground window, and a tray menu. Windows
uses `cmd.exe` for widget commands; Linux uses the user's POSIX shell. The
server still owns widget discovery, bundling, state, and hot reload.

Linux support targets X11 first. Wayland compositors may restrict desktop-layer
windows, global click-through behavior, or always-on-bottom placement.
