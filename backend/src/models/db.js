const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'pharma_user',
  host: process.env.DB_HOST || 'localhost', // 'postgres' en Docker, 'localhost' en local
  database: process.env.DB_NAME || 'pharmacenter_db',
  password: process.env.DB_PASSWORD || 'pharma_password123',
  port: process.env.DB_PORT || 5433, // ojo: tu conexión usa 5433
  max: 20, // conexiones máximas en el pool
  idleTimeoutMillis: 30000, // 30s idle antes de cerrar
  connectionTimeoutMillis: 2000, // 2s timeout al conectar
});

// Log de eventos para depuración
pool.on('connect', () => {
  console.log('✅ Conectado a la base de datos');
});

pool.on('error', (err) => {
  console.error('❌ Error inesperado en la base de datos', err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
