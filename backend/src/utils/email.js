require('dotenv').config();
const nodemailer = require('nodemailer');

// Configuración del transportador de correo
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Función para enviar alerta de inventario bajo
const sendLowStockAlert = async (medicamentos) => {
  try {
    const medicamentosListaHTML = medicamentos.map(med => 
      `<li>${med.nombre}: Quedan ${med.cantidadinventario} unidades (umbral: ${med.umbral_minimo})</li>`
    ).join('');

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ALERT_RECIPIENTS,
      subject: 'Alerta: Medicamentos con inventario bajo',
      html: `
        <h2>Alerta de Inventario Bajo</h2>
        <p>Los siguientes medicamentos están por debajo del umbral mínimo:</p>
        <ul>${medicamentosListaHTML}</ul>
        <p>Por favor, reabastezca estos medicamentos lo antes posible.</p>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Correo de alerta enviado:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error al enviar correo de alerta:', error);
    return false;
  }
};

module.exports = {
  sendLowStockAlert
};