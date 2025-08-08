const db = require('../models/db');
const { sendLowStockAlert } = require('./email');
const cron = require('node-cron');

const checkInventoryLevels = async () => {
  try {
    const sqlQuery = `
      SELECT idMedicamento, nombre, cantidadInventario, umbral_minimo 
      FROM Medicamento 
      WHERE cantidadInventario < umbral_minimo
    `;
    
    const result = await db.query(sqlQuery, []);
    const medicamentosBajos = result.rows;

    if (medicamentosBajos.length > 0) {
      await sendLowStockAlert(medicamentosBajos);
      console.log(`Alerta enviada para ${medicamentosBajos.length} medicamentos`);
      return true;
    } else {
      console.log('Todos los medicamentos tienen niveles adecuados');
      return false;
    }
  } catch (error) {
    console.error('Error al verificar niveles de inventario:', error);
    return false;
  }
};

// Programar la verificación diaria
const scheduleInventoryChecks = () => {
  cron.schedule('45 15,21 * * *', () => {
    checkInventoryLevels();
  });
};

module.exports = {
  checkInventoryLevels,
  scheduleInventoryChecks
};