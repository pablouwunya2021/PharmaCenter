const { TextEncoder, TextDecoder } = require('util');

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Polyfill para global (requerido por Newman)
if (typeof global === 'undefined') {
  global = globalThis;
}
