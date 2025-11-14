const nodemailer = require('nodemailer');

async function sendPurchaseNotification(datos) {
  try {
    // Validar datos requeridos
    if (!datos.correo || !datos.medicamentos || !Array.isArray(datos.medicamentos)) {
      throw new Error('Faltan datos requeridos para enviar el correo');
    }

    // Configurar transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Verificar conexión
    await transporter.verify();
    console.log('✅ Servidor de correo listo');

    // Lista de medicamentos para el cliente
    const medicamentosListaCliente = datos.medicamentos
      .map(med => `${med.nombre} - Cantidad: ${med.cantidad}`)
      .join('\n');

    // Lista de medicamentos para el admin
    const medicamentosListaAdmin = datos.medicamentos
      .map(med => `- ${med.nombre} (x${med.cantidad})`)
      .join('\n');

    // Mensaje para el cliente
    const mensajeCliente = `
Hola ${datos.nombre},

¡Gracias por tu compra en PharmaCenter!

📋 DATOS DE ENTREGA:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Nombre: ${datos.nombre}
Teléfono: ${datos.telefono}
Email: ${datos.correo}
Dirección: ${datos.direccion}
Ciudad: ${datos.ciudad}
NIT: ${datos.nit}

🛒 DETALLE DEL PEDIDO:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${medicamentosListaCliente}

💰 TOTAL: Q${datos.total}

📞 PRÓXIMOS PASOS:
Nos pondremos en contacto contigo en las próximas horas para coordinar la entrega de tu pedido.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PharmaCenter Guatemala
📧 contacto@pharmacenter.store
📱 WhatsApp: [TU_NUMERO]

* Este es un correo automático, por favor no responder.
    `.trim();

    // Mensaje para el admin
    const mensajeAdmin = `
🔔 NUEVA COMPRA RECIBIDA

👤 DATOS DEL CLIENTE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Nombre: ${datos.nombre}
Teléfono: ${datos.telefono}
Email: ${datos.correo}
Dirección: ${datos.direccion}
Ciudad: ${datos.ciudad}
NIT: ${datos.nit}

📦 PRODUCTOS SOLICITADOS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${medicamentosListaAdmin}

💰 TOTAL: Q${datos.total}

⚡ ACCIÓN REQUERIDA:
Contactar al cliente lo antes posible para confirmar disponibilidad y coordinar entrega.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Sistema PharmaCenter
    `.trim();

    // Enviar correo al cliente
    const infoCliente = await transporter.sendMail({
      from: `"PharmaCenter Guatemala" <${process.env.EMAIL_USER}>`,
      to: datos.correo,
      subject: '✅ Confirmación de Compra - PharmaCenter',
      text: mensajeCliente
    });

    console.log('✅ Correo enviado al cliente:', infoCliente.messageId);

    // Enviar correo al administrador
    const infoAdmin = await transporter.sendMail({
      from: `"Sistema PharmaCenter" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `🔔 Nueva Compra - ${datos.nombre}`,
      text: mensajeAdmin
    });

    console.log('✅ Correo enviado al admin:', infoAdmin.messageId);

    return true;

  } catch (error) {
    console.error('❌ Error en sendPurchaseNotification:', error);
    throw error;
  }
}

module.exports = { sendPurchaseNotification };