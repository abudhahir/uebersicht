'use strict';

const { screen } = require('electron');

function displays() {
  return screen.getAllDisplays().map((display) => ({
    id: String(display.id),
    name: display.label || `Display ${display.id}`,
    bounds: display.bounds,
    workArea: display.workArea,
    scaleFactor: display.scaleFactor,
    primary: display.id === screen.getPrimaryDisplay().id,
  }));
}

module.exports = { displays };
