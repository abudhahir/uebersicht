'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { shellForPlatform } = require('../src/platform/shell');

test('uses cmd.exe on Windows', () => {
  assert.deepEqual(shellForPlatform('win32'), {
    file: process.env.ComSpec || 'cmd.exe',
    args: ['/d', '/s', '/c'],
  });
});

test('uses a login POSIX shell elsewhere', () => {
  assert.deepEqual(shellForPlatform('linux'), {
    file: process.env.SHELL || '/bin/sh',
    args: ['-lc'],
  });
});
