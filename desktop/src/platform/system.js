'use strict';

const { app, Menu, Notification, Tray, shell } = require('electron');
const path = require('path');

function createSystemMenu({ onRefresh, onPreferences, onQuit }) {
  const template = [
    { label: 'Refresh all widgets', click: onRefresh },
    { label: 'Preferences', click: onPreferences },
    { type: 'separator' },
    { label: 'Open widget directory', click: () => shell.openPath(app.getPath('documents')) },
    { type: 'separator' },
    { label: 'Quit', click: onQuit },
  ];
  return Menu.buildFromTemplate(template);
}

function createTray(callbacks) {
  const icon = path.join(__dirname, '..', '..', '..', 'Uebersicht', 'status-icon.png');
  const tray = new Tray(icon);
  tray.setToolTip('Übersicht');
  tray.setContextMenu(createSystemMenu(callbacks));
  return tray;
}

function notify(title, body) {
  if (Notification.isSupported()) new Notification({ title, body }).show();
}

module.exports = { createTray, notify };
