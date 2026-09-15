'use strict';

const { spawn } = require('child_process');

function shellForPlatform(platform) {
  if (platform === 'win32') {
    return { file: process.env.ComSpec || 'cmd.exe', args: ['/d', '/s', '/c'] };
  }
  return { file: process.env.SHELL || '/bin/sh', args: ['-lc'] };
}

function run(command, options = {}) {
  const shell = shellForPlatform(process.platform);
  return new Promise((resolve, reject) => {
    const child = spawn(shell.file, shell.args.concat(command), {
      cwd: options.cwd,
      env: options.env || process.env,
      windowsHide: true,
    });
    let output = '';
    let error = '';
    child.stdout.on('data', (chunk) => { output += chunk; });
    child.stderr.on('data', (chunk) => { error += chunk; });
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) return resolve(output);
      const failure = new Error(error || `Command exited with code ${code}`);
      failure.code = code;
      failure.stdout = output;
      reject(failure);
    });
  });
}

module.exports = { run, shellForPlatform };
