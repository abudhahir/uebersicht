'use strict';

const { BrowserWindow } = require('electron');

function createWidgetWindow(bounds, url, interactive) {
  const window = new BrowserWindow({
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height,
    frame: false,
    transparent: true,
    resizable: false,
    movable: false,
    skipTaskbar: true,
    show: false,
    focusable: interactive,
    alwaysOnTop: interactive,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  if (!interactive) {
    window.setIgnoreMouseEvents(true, { forward: true });
    window.setAlwaysOnTop(false);
    if (process.platform === 'linux') window.setKiosk(true);
  }
  window.loadURL(url);
  window.once('ready-to-show', () => window.showInactive());
  return window;
}

module.exports = { createWidgetWindow };
