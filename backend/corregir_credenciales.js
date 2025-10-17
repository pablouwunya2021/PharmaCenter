const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', 'env') });

// Configuración de la base de datos
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5433,
  database: process.env.DB_NAME || 'pharmacenter_db',
  user: process.env.DB_USER || 'pharma_user',
  password: process.env.DB_PASSWORD || 'pharma_password123',
});

async function corregirCredenciales() {
  try {
    console.log('🔧 Corrigiendo credenciales de usuarios...\n');
    
    // Credenciales a corregir
    const credenciales = [
      { correo: 'admin@pharmacenter.com', password: 'admin123', nombre: 'Administrador' },
      { correo: 'ana.torres@email.com', password: 'ana123', nombre: 'Ana Torres' }
    ];
    
    for (const cred of credenciales) {
      console.log(`\n📧 Procesando: ${cred.correo}`);
      
      // Generar nuevo hash
      const nuevoHash = await bcrypt.hash(cred.password, 10);
      console.log(`   - Hash generado: ${nuevoHash.substring(0, 30)}...`);
      
      // Actualizar en la base de datos
      const result = await pool.query(
        'UPDATE Usuario SET contrasena = $1 WHERE correo = $2 RETURNING idusuario, nombre, correo, rol',
        [nuevoHash, cred.correo]
      );
      
      if (result.rowCount > 0) {
        const usuario = result.rows[0];
        console.log(`   - ✅ Actualizado: ${usuario.nombre} (ID: ${usuario.idusuario})`);
        console.log(`   - Rol: ${usuario.rol}`);
        console.log(`   - Nueva contraseña: ${cred.password}`);
        
        // Verificar que funciona
        const verificacion = await pool.query(
          'SELECT contrasena FROM Usuario WHERE correo = $1',
          [cred.correo]
        );
        
        const match = await bcrypt.compare(cred.password, verificacion.rows[0].contrasena);
        if (match) {
          console.log(`   - ✅ Verificación exitosa: El login funcionará`);
        } else {
          console.log(`   - ❌ ERROR: La verificación falló`);
        }
      } else {
        console.log(`   - ❌ Usuario no encontrado en la base de datos`);
      }
    }
    
    console.log('\n\n🎉 ¡Proceso completado!');
    console.log('\n📝 Credenciales actualizadas:');
    console.log('   Admin: admin@pharmacenter.com / admin123');
    console.log('   Usuario: ana.torres@email.com / ana123');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await pool.end();
  }
}

// Ejecutar
corregirCredenciales();
