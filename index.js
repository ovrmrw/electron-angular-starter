'use strict';
function __export(m) {
  for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, '__esModule', { value: true });
if (process.env.NODE_ENV === 'development') {
  // Load *.ts files directly.
  require('ts-node').register();
  __export(require('./server'));
} else {
  // Load transpiled *.js files.
  __export(require('./.dist/server'));
}
