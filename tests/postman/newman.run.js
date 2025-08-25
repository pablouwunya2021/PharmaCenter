const newman = require('newman');
const fs = require('fs');
const path = require('path');

// Pequeño parser de argumentos
function parseArgs(argv) {
  const args = argv.slice(2);
  const opts = { reporters: 'cli' };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    switch (a) {
      case '--help':
      case '-h':
        opts.help = true;
        break;
      case '--collection':
      case '-c':
        opts.collectionFile = args[++i];
        break;
      case '--env':
      case '-e':
        opts.envFile = args[++i];
        break;
      case '--reporters':
      case '-r':
        opts.reporters = args[++i];
        break;
      case '--bail':
        opts.bail = true;
        break;
      default:
        // ignora argumentos desconocidos
        break;
    }
  }
  return opts;
}

function usage() {
  console.log(`
Uso:
  node tests/postman/newman.run.js [opciones]

Opciones:
  -h, --help                 Muestra esta ayuda
  -c, --collection <ruta>    Ruta a una colección Postman (.json). Por defecto usa la colección inline.
  -e, --env <ruta>           Ruta a un environment Postman (.json)
  -r, --reporters <lista>    Reporters separados por coma (ej: cli,junit). Por defecto: cli
      --bail                 Falla al primer error

Ejemplos:
  node tests/postman/newman.run.js
  node tests/postman/newman.run.js -c postman/collections/api.json -e postman/envs/dev.json -r cli,junit
`);
}

// Carga JSON desde ruta relativa/absoluta
function loadJson(filePath) {
  const full = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);
  return JSON.parse(fs.readFileSync(full, 'utf8'));
}

const collection = {
  info: { name: 'Echo GET contrato básico', schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json' },
  item: [
    {
      name: 'GET echo foo=bar',
      request: {
        method: 'GET',
        url: 'https://postman-echo.com/get?foo=bar'
      },
      event: [
        {
          listen: 'test',
          script: {
            exec: [
              "pm.test('status es 200', function () { pm.response.to.have.status(200); });",
              "pm.test('foo=bar en respuesta', function () {",
              "  const json = pm.response.json();",
              "  pm.expect(json.args.foo).to.eql('bar');",
              "});"
            ]
          }
        }
      ]
    }
  ]
};

// Ejecutor
(function main() {
  const opts = parseArgs(process.argv);
  if (opts.help) {
    usage();
    process.exit(0);
  }

  const runOptions = {
    collection: opts.collectionFile ? loadJson(opts.collectionFile) : collection,
    reporters: (opts.reporters || 'cli').split(','),
    bail: opts.bail || false
  };

  if (opts.envFile) {
    runOptions.environment = loadJson(opts.envFile);
  }

  newman.run(runOptions, function (err, summary) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    const failures = summary.run.failures || [];
    const stats = summary.run.stats || {};
    console.log(`Assertions: ${stats.assertions?.total ?? 0} (failed: ${stats.assertions?.failed ?? 0})`);
    console.log(`Requests:   ${stats.requests?.total ?? 0}`);
    console.log(`Pruebas Postman: ${failures.length === 0 ? 'OK' : 'FALLAS'}`);
    process.exit(failures.length === 0 ? 0 : 1);
  });
})();
