const nodemailer = require('nodemailer');

async function sendPurchaseNotification(datos) {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔍 INICIO sendPurchaseNotification');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  try {
    // 1. Mostrar datos recibidos
    console.log('📦 Datos recibidos:', JSON.stringify(datos, null, 2));
    
    // 2. Validar datos requeridos
    console.log('🔍 Validando datos...');
    if (!datos.correo || !datos.medicamentos || !Array.isArray(datos.medicamentos)) {
      console.error('❌ Validación fallida:', {
        correo: !!datos.correo,
        medicamentos: !!datos.medicamentos,
        esArray: Array.isArray(datos.medicamentos)
      });
      throw new Error('Faltan datos requeridos para enviar el correo');
    }
    console.log('✅ Datos validados correctamente');

    // 3. Verificar variables de entorno
    console.log('🔍 Verificando variables de entorno...');
    console.log('EMAIL_USER:', process.env.EMAIL_USER ? '✅ Configurado' : '❌ NO configurado');
    console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '✅ Configurado' : '❌ NO configurado');
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      throw new Error('Variables de entorno EMAIL_USER o EMAIL_PASSWORD no configuradas');
    }

    // 4. Configurar transporter
    console.log('🔍 Configurando transporter...');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
    console.log('✅ Transporter configurado');

    // 5. Verificar conexión
    console.log('🔍 Verificando conexión con servidor de correo...');
    await transporter.verify();
    console.log('✅ Servidor de correo listo');

    // 6. Preparar listas de medicamentos
    console.log('🔍 Preparando listas de medicamentos...');
    const medicamentosListaCliente = datos.medicamentos
      .map(med => `${med.nombre} - Cantidad: ${med.cantidad}`)
      .join('\n');
    
    const medicamentosListaAdmin = datos.medicamentos
      .map(med => `- ${med.nombre} (x${med.cantidad})`)
      .join('\n');
    console.log('✅ Listas preparadas');

    // 7. Crear mensajes
    console.log('🔍 Creando mensajes...');
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

* Este es un correo automático, por favor no responder.
    `.trim();

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
    console.log('✅ Mensajes creados');

    // 8. Enviar correo al cliente
    console.log('🔍 Enviando correo al cliente...');
    console.log('   Destinatario:', datos.correo);
    const infoCliente = await transporter.sendMail({
      from: `"PharmaCenter Guatemala" <${process.env.EMAIL_USER}>`,
      to: datos.correo,
      subject: '✅ Confirmación de Compra - PharmaCenter',
      text: mensajeCliente
    });
    console.log('✅ Correo enviado al cliente:', infoCliente.messageId);

    // 9. Enviar correo al administrador
    console.log('🔍 Enviando correo al administrador...');
    const adminEmail = process.env.ALERT_RECIPIENTS 
      ? process.env.ALERT_RECIPIENTS.split(',')[0].trim() 
      : process.env.EMAIL_USER;
    console.log('   Destinatario admin:', adminEmail);
    
    const infoAdmin = await transporter.sendMail({
      from: `"Sistema PharmaCenter" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject: `🔔 Nueva Compra - ${datos.nombre}`,
      text: mensajeAdmin
    });
    console.log('✅ Correo enviado al admin:', infoAdmin.messageId);

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ PROCESO COMPLETADO EXITOSAMENTE');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    return true;

  } catch (error) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('❌ ERROR EN sendPurchaseNotification');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('Tipo de error:', error.name);
    console.error('Mensaje:', error.message);
    console.error('Stack completo:', error.stack);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    throw error;
  }
}

module.exports = { sendPurchaseNotification };
