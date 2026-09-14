'use strict';

const fs = require('fs');
const path = require('path');

function createPersistence(userDataPath) {
  const settingsDir = path.join(userDataPath, 'settings');
  const settingsFile = path.join(settingsDir, 'WidgetSettings.json');

  return {
    settingsDir,
    load() {
      try {
        return JSON.parse(fs.readFileSync(settingsFile, 'utf8'));
      } catch (error) {
        return {};
      }
    },
    save(settings) {
      fs.mkdirSync(settingsDir, { recursive: true });
      const temporaryFile = `${settingsFile}.tmp`;
      fs.writeFileSync(temporaryFile, JSON.stringify(settings, null, 2));
      fs.renameSync(temporaryFile, settingsFile);
    },
  };
}

module.exports = createPersistence;
