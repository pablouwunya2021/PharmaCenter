// Polyfills para Newman
if (typeof global === 'undefined') {
  global = globalThis;
}

// Cargar y ejecutar el script principal
require('./newman.run.js');
