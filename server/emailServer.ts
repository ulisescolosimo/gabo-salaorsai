import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config({ path: '.env.local' });

const app = express();
const PORT = process.env.EMAIL_SERVER_PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Configuración SMTP
const SMTP_CONFIG = {
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
};

const FROM_CONFIG = {
  name: process.env.SMTP_FROM_NAME || 'Sala Orsai',
  email: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER,
};

// Verificar configuración SMTP
const isSmtpConfigured = () => {
  return !!(SMTP_CONFIG.host && SMTP_CONFIG.auth.user && SMTP_CONFIG.auth.pass);
};

// Crear transporter
let transporter: nodemailer.Transporter | null = null;

if (isSmtpConfigured()) {
  transporter = nodemailer.createTransport(SMTP_CONFIG);
  console.log('✅ SMTP configurado correctamente');
} else {
  console.warn('⚠️  SMTP no configurado - Los emails se simularán');
}

// Endpoint de health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    smtp_configured: isSmtpConfigured(),
    timestamp: new Date().toISOString(),
  });
});

// Endpoint para enviar email
app.post('/send-email', async (req, res) => {
  try {
    const { to, subject, body } = req.body;

    // Validación
    if (!to || !subject || !body) {
      return res.status(400).json({
        success: false,
        error: 'Faltan campos requeridos: to, subject, body',
      });
    }

    // Si SMTP no está configurado, simular
    if (!isSmtpConfigured() || !transporter) {
      console.log('📧 Simulando envío de email:');
      console.log(`   To: ${to}`);
      console.log(`   Subject: ${subject}`);
      console.log(`   Body: ${body.substring(0, 100)}...`);

      return res.json({
        success: true,
        simulated: true,
        message: 'Email simulado (SMTP no configurado)',
      });
    }

    // Enviar email real
    const info = await transporter.sendMail({
      from: `"${FROM_CONFIG.name}" <${FROM_CONFIG.email}>`,
      to: to,
      subject: subject,
      text: body,
      html: body.replace(/\n/g, '<br>'),
    });

    console.log('✅ Email enviado:', info.messageId);

    res.json({
      success: true,
      messageId: info.messageId,
      message: 'Email enviado correctamente',
    });
  } catch (error: any) {
    console.error('❌ Error al enviar email:', error.message);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Endpoint para probar conexión SMTP
app.get('/test-smtp', async (req, res) => {
  if (!isSmtpConfigured() || !transporter) {
    return res.status(400).json({
      success: false,
      error: 'SMTP no configurado',
    });
  }

  try {
    await transporter.verify();
    res.json({
      success: true,
      message: 'Conexión SMTP exitosa',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('═══════════════════════════════════════');
  console.log('📧 Servidor de Email iniciado');
  console.log(`🌐 Puerto: ${PORT}`);
  console.log(`📬 SMTP: ${isSmtpConfigured() ? '✅ Configurado' : '⚠️  No configurado'}`);
  console.log('═══════════════════════════════════════\n');
});

