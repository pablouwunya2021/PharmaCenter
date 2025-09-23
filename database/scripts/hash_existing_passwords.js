const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
require('dotenv').config();

// Configuración de la base de datos
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5433,
  database: process.env.DB_NAME || 'pharmacenter_db',
  user: process.env.DB_USER || 'pharma_user',
  password: process.env.DB_PASSWORD || 'pharma_password123',
});

async function hashExistingPasswords() {
  try {
    console.log('Iniciando actualización de contraseñas...');
    
    // Obtener todos los usuarios con contraseñas en texto plano
    const result = await pool.query(
      'SELECT idusuario, correo, contrasena FROM Usuario WHERE LENGTH(contrasena) < 50'
    );
    
    console.log(`Encontrados ${result.rows.length} usuarios con contraseñas sin hash`);
    
    for (const user of result.rows) {
      try {
        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(user.contrasena, 10);
        
        // Actualizar en la base de datos
        await pool.query(
          'UPDATE Usuario SET contrasena = $1 WHERE idusuario = $2',
          [hashedPassword, user.idusuario]
        );
        
        console.log(`✓ Contraseña actualizada para: ${user.correo}`);
      } catch (error) {
        console.error(`✗ Error al actualizar ${user.correo}:`, error.message);
      }
    }
    
    console.log('¡Actualización completada!');
  } catch (error) {
    console.error('Error general:', error);
  } finally {
    await pool.end();
  }
}

// Ejecutar solo si es llamado directamente
if (require.main === module) {
  hashExistingPasswords();
}

module.exports = { hashExistingPasswords };