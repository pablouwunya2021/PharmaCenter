const bcrypt = require('bcryptjs');

// Lista de usuarios y contraseñas
const users = [
  { email: 'admin@pharmacenter.com', password: 'admin123' },
  { email: 'ana.torres@email.com', password: 'ana123' },
  { email: 'luis.martinez@email.com', password: 'luis123' },
  { email: 'maria.gomez@email.com', password: 'maria123' },
  { email: 'carlos.ruiz@email.com', password: 'carlos123' },
  { email: 'laura.lopez@email.com', password: 'laura123' },
  { email: 'pedro.sanchez@email.com', password: 'pedro123' },
  { email: 'lucia.fernandez@email.com', password: 'lucia123' },
  { email: 'miguel.diaz@email.com', password: 'miguel123' },
  { email: 'sandra.romero@email.com', password: 'sandra123' },
  { email: 'jorge.herrera@email.com', password: 'jorge123' }
];

async function generateHashes() {
  console.log('Generando hashes para las contraseñas...\n');
  
  for (const user of users) {
    try {
      const hash = await bcrypt.hash(user.password, 10);
      console.log(`-- ${user.email} / ${user.password}`);
      console.log(`'${hash}',`);
      console.log('');
    } catch (error) {
      console.error(`Error generando hash para ${user.email}:`, error);
    }
  }
  
  console.log('Hashes generados exitosamente!');
  console.log('\nAhora puedes copiar estos hashes al archivo init.sql');
}

// Ejecutar solo si es llamado directamente
if (require.main === module) {
  generateHashes();
}

module.exports = { generateHashes };