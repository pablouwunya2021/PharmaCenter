const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'pharma_user',
  host: process.env.DB_HOST || 'postgres', // Nombre del servicio en docker-compose
  database: process.env.DB_NAME || 'pharmacenter_db',
  password: process.env.DB_PASSWORD || 'pharma_password123',
  port: process.env.DB_PORT || 5432
});

module.exports = {
  query: (text, params) => pool.query(text, params)
};