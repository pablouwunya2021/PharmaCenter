require('dotenv').config();
const nodemailer = require('nodemailer');

// Usa el mismo transportador que ya tienes
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Función para enviar notificación de compra
const sendPurchaseNotification = async (datosCompra) => {
  try {
    const { nombre, correo, telefono, direccion, nit, ciudad, medicamentos, total } = datosCompra;

    const medicamentosListaHTML = medicamentos.map(med => 
      `<li>${med.nombre} x${med.cantidad}</li>`
    ).join('');

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ALERT_RECIPIENTS,
      subject: 'Nueva compra realizada - Farmacia Bethesda',
      html: `
        <h2>Se ha realizado una compra</h2>
        <p><strong>Por parte de:</strong> ${nombre} (${correo})</p>
        <p><strong>Teléfono:</strong> ${telefono}</p>
        <p><strong>Dirección:</strong> ${direccion}</p>
        ${nit && nit !== 'N/A' ? `<p><strong>NIT:</strong> ${nit}</p>` : ''}
        ${ciudad && ciudad !== 'N/A' ? `<p><strong>Ciudad:</strong> ${ciudad}</p>` : ''}
        
        <h3>Que incluye:</h3>
        <ul>${medicamentosListaHTML}</ul>
        
        <h3>Por un total de: $${total}</h3>
        
        <p><small>Fecha: ${new Date().toLocaleString('es-GT')}</small></p>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Correo de compra enviado:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error al enviar correo de compra:', error);
    return false;
  }
};

module.exports = {
  sendPurchaseNotification
};