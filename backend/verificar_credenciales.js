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

async function verificarCredenciales() {
  try {
    console.log('🔍 Verificando credenciales de usuarios...\n');
    
    // Obtener usuarios a verificar
    const usuarios = [
      { correo: 'admin@pharmacenter.com', password: 'admin123' },
      { correo: 'ana.torres@email.com', password: 'ana123' }
    ];
    
    for (const credencial of usuarios) {
      console.log(`\n📧 Verificando: ${credencial.correo}`);
      
      // Buscar usuario en la base de datos
      const result = await pool.query(
        'SELECT idusuario, nombre, correo, contrasena, rol, LENGTH(contrasena) as password_length FROM Usuario WHERE correo = $1',
        [credencial.correo]
      );
      
      if (result.rows.length === 0) {
        console.log(`❌ Usuario NO EXISTE en la base de datos`);
        continue;
      }
      
      const usuario = result.rows[0];
      console.log(`✅ Usuario encontrado:`);
      console.log(`   - ID: ${usuario.idusuario}`);
      console.log(`   - Nombre: ${usuario.nombre}`);
      console.log(`   - Rol: ${usuario.rol}`);
      console.log(`   - Longitud de contraseña: ${usuario.password_length} caracteres`);
      
      // Determinar si es hash o texto plano
      const esHash = usuario.contrasena.startsWith('$2a$') || usuario.contrasena.startsWith('$2b$');
      
      if (esHash) {
        console.log(`   - Formato: Hash bcrypt detectado ✓`);
        
        // Intentar comparar con la contraseña de prueba
        const match = await bcrypt.compare(credencial.password, usuario.contrasena);
        
        if (match) {
          console.log(`   - ✅ Contraseña "${credencial.password}" es CORRECTA`);
        } else {
          console.log(`   - ❌ Contraseña "${credencial.password}" NO coincide`);
          
          // Intentar con las contraseñas comunes conocidas
          const passwordsComunes = ['admin123', 'ana123', 'user123', '123456'];
          console.log(`   - Probando contraseñas comunes...`);
          
          for (const pwd of passwordsComunes) {
            const testMatch = await bcrypt.compare(pwd, usuario.contrasena);
            if (testMatch) {
              console.log(`   - ✅ ENCONTRADA: La contraseña es "${pwd}"`);
              break;
            }
          }
        }
      } else {
        console.log(`   - ⚠️  Formato: Texto plano detectado`);
        console.log(`   - Contraseña almacenada: ${usuario.contrasena}`);
        
        if (usuario.contrasena === credencial.password) {
          console.log(`   - ✅ Contraseña en texto plano coincide`);
          console.log(`   - ⚠️  ACCIÓN REQUERIDA: Ejecutar hash_passwords.js para hashear`);
        } else {
          console.log(`   - ❌ Contraseña en texto plano NO coincide`);
        }
      }
    }
    
    // Resumen general
    console.log('\n\n📊 RESUMEN GENERAL:');
    const resumen = await pool.query(`
      SELECT 
        COUNT(*) as total_usuarios,
        COUNT(CASE WHEN LENGTH(contrasena) >= 50 THEN 1 END) as usuarios_con_hash,
        COUNT(CASE WHEN LENGTH(contrasena) < 50 THEN 1 END) as usuarios_sin_hash
      FROM Usuario
    `);
    
    const { total_usuarios, usuarios_con_hash, usuarios_sin_hash } = resumen.rows[0];
    console.log(`Total de usuarios: ${total_usuarios}`);
    console.log(`Con hash: ${usuarios_con_hash}`);
    console.log(`Sin hash (texto plano): ${usuarios_sin_hash}`);
    
    if (parseInt(usuarios_sin_hash) > 0) {
      console.log('\n⚠️  ADVERTENCIA: Hay usuarios con contraseñas en texto plano');
      console.log('💡 Ejecuta: node scripts/hash_passwords.js');
    } else {
      console.log('\n✅ Todas las contraseñas están hasheadas correctamente');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await pool.end();
  }
}

// Ejecutar
verificarCredenciales();
