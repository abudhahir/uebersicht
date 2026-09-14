'use strict';

const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const createPersistence = require('./platform/persistence');
const { createWidgetWindow } = require('./platform/window');
const { displays } = require('./platform/display');
const { createTray, notify } = require('./platform/system');
const { setStartAtLogin } = require('./platform/startup');

const PORT = Number(process.env.UEBERSICHT_PORT || 41416);
const repositoryRoot = path.resolve(__dirname, '..', '..');
const widgetDirectory = process.env.UEBERSICHT_WIDGET_DIR ||
  path.join(app.getPath('home'), 'Übersicht');
let server;
let tray;
const windows = new Map();

function serverPath() {
  return process.env.UEBERSICHT_SERVER ||
    path.join(repositoryRoot, 'server', 'release', 'server.js');
}

function startServer() {
  server = spawn(process.execPath, [serverPath(), '-d', widgetDirectory, '-p', String(PORT)], {
    cwd: repositoryRoot,
    env: { ...process.env, ELECTRON_RUN_AS_NODE: '1' },
    stdio: ['ignore', 'pipe', 'pipe'],
    windowsHide: true,
  });
  server.stderr.on('data', (data) => notify('Übersicht server error', data.toString()));
}

function closeWindows() {
  for (const group of windows.values()) {
    group.background.close();
    if (group.foreground) group.foreground.close();
  }
  windows.clear();
}

function syncWindows() {
  const url = `http://127.0.0.1:${PORT}/`;
  const active = new Set();
  for (const display of displays()) {
    active.add(display.id);
    if (!windows.has(display.id)) {
      windows.set(display.id, {
        background: createWidgetWindow(display.bounds, `${url}${display.id}/background`, false),
        foreground: createWidgetWindow(display.bounds, `${url}${display.id}/foreground`, true),
      });
    }
  }
  for (const id of windows.keys()) {
    if (!active.has(id)) {
      windows.get(id).background.close();
      windows.get(id).foreground.close();
      windows.delete(id);
    }
  }
}

async function start() {
  await app.whenReady();
  createPersistence(app.getPath('userData'));
  setStartAtLogin(process.env.UEBERSICHT_START_AT_LOGIN === '1');
  startServer();
  tray = createTray({
    onRefresh: () => syncWindows(),
    onPreferences: () => {},
    onQuit: () => app.quit(),
  });
  syncWindows();
  screen.on('display-added', syncWindows);
  screen.on('display-removed', syncWindows);
  screen.on('display-metrics-changed', syncWindows);
  ipcMain.handle('platform-info', () => ({
    platform: process.platform,
    displays: displays(),
    shell: process.platform === 'win32' ? 'cmd' : 'posix',
  }));
}

app.on('window-all-closed', (event) => event.preventDefault());
app.on('before-quit', () => {
  closeWindows();
  if (server) server.kill();
  if (tray) tray.destroy();
});
start();
