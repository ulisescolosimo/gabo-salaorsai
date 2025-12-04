/**
 * Script para probar la configuración SMTP
 * 
 * Uso:
 * 1. Configura las variables SMTP en .env.local
 * 2. Ejecuta: npx tsx scripts/testSMTP.ts
 */

import nodemailer from 'nodemailer';

// Lee las variables de entorno directamente del proceso
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587');
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;
const SMTP_FROM_NAME = process.env.SMTP_FROM_NAME || 'Sala Orsai';
const SMTP_FROM_EMAIL = process.env.SMTP_FROM_EMAIL || SMTP_USER;

async function testSMTP() {
  console.log('🔍 Verificando configuración SMTP...\n');

  // Verificar variables de entorno
  console.log('📋 Configuración detectada:');
  console.log(`   Host: ${SMTP_HOST || '❌ NO CONFIGURADO'}`);
  console.log(`   Puerto: ${SMTP_PORT}`);
  console.log(`   Usuario: ${SMTP_USER || '❌ NO CONFIGURADO'}`);
  console.log(`   Contraseña: ${SMTP_PASSWORD ? '✅ Configurada' : '❌ NO CONFIGURADA'}`);
  console.log(`   From Name: ${SMTP_FROM_NAME}`);
  console.log(`   From Email: ${SMTP_FROM_EMAIL}\n`);

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASSWORD) {
    console.log('❌ Faltan credenciales SMTP en .env.local\n');
    console.log('Agrega estas variables a tu .env.local:');
    console.log('SMTP_HOST=smtp.gmail.com');
    console.log('SMTP_PORT=587');
    console.log('SMTP_USER=tu-email@gmail.com');
    console.log('SMTP_PASSWORD=tu_contraseña');
    console.log('SMTP_FROM_NAME=Sala Orsai');
    console.log('SMTP_FROM_EMAIL=tu-email@gmail.com\n');
    return;
  }

  // Crear transporter
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASSWORD,
    },
  });

  // Test 1: Verificar conexión
  console.log('1️⃣ Probando conexión SMTP...');
  try {
    await transporter.verify();
    console.log('   ✅ Conexión exitosa!\n');
  } catch (error: any) {
    console.log('   ❌ Error de conexión:', error.message);
    console.log('\n💡 Posibles soluciones:');
    console.log('   - Verifica que el host y puerto sean correctos');
    console.log('   - Verifica usuario y contraseña');
    console.log('   - Para Gmail, usa contraseña de aplicación');
    console.log('   - Verifica que tu firewall no bloquee el puerto\n');
    return;
  }

  // Test 2: Enviar email de prueba
  console.log('2️⃣ ¿Enviar email de prueba? (presiona Ctrl+C para cancelar)\n');
  
  // Esperar 3 segundos antes de enviar
  await new Promise(resolve => setTimeout(resolve, 3000));

  console.log('📧 Enviando email de prueba...');
  try {
    const info = await transporter.sendMail({
      from: `"${SMTP_FROM_NAME}" <${SMTP_FROM_EMAIL}>`,
      to: SMTP_USER, // Envía a ti mismo
      subject: '✅ Test SMTP - Sala Orsai',
      text: 'Este es un email de prueba del sistema de inscripciones de Sala Orsai.\n\nSi recibiste este email, ¡tu configuración SMTP está funcionando correctamente!',
      html: '<h2>✅ Test SMTP Exitoso</h2><p>Este es un email de prueba del sistema de inscripciones de <strong>Sala Orsai</strong>.</p><p>Si recibiste este email, ¡tu configuración SMTP está funcionando correctamente!</p>',
    });

    console.log('   ✅ Email enviado exitosamente!');
    console.log(`   📨 Message ID: ${info.messageId}\n`);
    console.log('🎉 ¡Todo configurado correctamente!');
    console.log(`📬 Revisa tu bandeja de entrada: ${SMTP_USER}\n`);
  } catch (error: any) {
    console.log('   ❌ Error al enviar:', error.message);
    console.log('\n💡 Posibles soluciones:');
    console.log('   - Verifica que el email FROM esté verificado');
    console.log('   - Para Gmail, verifica los permisos de aplicaciones menos seguras');
    console.log('   - Revisa los límites de envío de tu proveedor\n');
  }
}

testSMTP().catch(console.error);



