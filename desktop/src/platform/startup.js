'use strict';

const { app } = require('electron');

function setStartAtLogin(enabled) {
  if (process.platform === 'linux' || process.platform === 'darwin' || process.platform === 'win32') {
    app.setLoginItemSettings({ openAtLogin: enabled });
  }
}

module.exports = { setStartAtLogin };
