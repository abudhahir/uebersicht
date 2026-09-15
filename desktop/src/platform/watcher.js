'use strict';

const fs = require('fs');

function watch(directory, callback) {
  const watcher = fs.watch(directory, { recursive: true }, (eventType, filename) => {
    if (filename) callback({ eventType, path: filename.toString() });
  });
  return () => watcher.close();
}

module.exports = watch;
