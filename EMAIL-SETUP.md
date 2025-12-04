# 📧 Configuración de Envío de Emails (SMTP)

Esta guía te ayudará a configurar el envío real de emails de confirmación mediante SMTP.

---

## 📋 Credenciales SMTP Necesarias

Necesitas agregar estas variables a tu archivo `.env.local`:

```bash
# SMTP Configuration
SMTP_HOST=smtp.tuservidor.com
SMTP_PORT=587
SMTP_USER=tu-email@ejemplo.com
SMTP_PASSWORD=tu_contraseña
SMTP_FROM_NAME=Sala Orsai
SMTP_FROM_EMAIL=tu-email@ejemplo.com
```

---

## 🔧 Configuración por Proveedor

### 📮 Gmail

**Requisitos:**
- Cuenta de Gmail
- Contraseña de aplicación (NO la contraseña normal)

**Pasos:**

1. Ve a tu cuenta de Google: https://myaccount.google.com/
2. Seguridad → Verificación en dos pasos (actívala si no está activada)
3. Busca "Contraseñas de aplicaciones"
4. Genera una nueva contraseña para "Correo"
5. Copia la contraseña generada (16 caracteres)

**Configuración en `.env.local`:**
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASSWORD=abcd efgh ijkl mnop  # La contraseña de 16 caracteres
SMTP_FROM_NAME=Sala Orsai
SMTP_FROM_EMAIL=tu-email@gmail.com
```

---

### 📮 Microsoft 365 / Outlook

**Configuración en `.env.local`:**
```bash
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=tu-email@outlook.com
SMTP_PASSWORD=tu_contraseña
SMTP_FROM_NAME=Sala Orsai
SMTP_FROM_EMAIL=tu-email@outlook.com
```

---

### 📮 SendGrid (Recomendado para producción)

**Ventajas:**
- 100 emails gratis por día
- Alta tasa de entrega
- No requiere autenticación en dos pasos

**Pasos:**

1. Crea cuenta en: https://sendgrid.com
2. Crea un API Key en Settings → API Keys
3. Verifica tu dominio (opcional pero recomendado)

**Configuración en `.env.local`:**
```bash
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey  # Literalmente escribe "apikey"
SMTP_PASSWORD=SG.tu_api_key_aqui
SMTP_FROM_NAME=Sala Orsai
SMTP_FROM_EMAIL=email-verificado@tudominio.com
```

---

### 📮 Hosting Personalizado

Si tienes un hosting con cPanel o similar:

1. Crea una cuenta de email en tu cPanel
2. Busca la configuración SMTP en tu panel
3. Generalmente es:

```bash
SMTP_HOST=mail.tudominio.com
SMTP_PORT=587
SMTP_USER=noreply@tudominio.com
SMTP_PASSWORD=tu_contraseña
SMTP_FROM_NAME=Sala Orsai
SMTP_FROM_EMAIL=noreply@tudominio.com
```

---

## 🧪 Probar el Envío de Emails

Una vez configurado:

1. Reinicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

2. Ve al formulario público

3. Completa una inscripción de prueba **con tu email personal**

4. Verifica que llegue el email de confirmación

5. Revisa la carpeta de SPAM si no lo ves en la bandeja de entrada

---

## 🔒 Seguridad

⚠️ **IMPORTANTE:**
- Nunca subas el archivo `.env.local` a Git
- Usa contraseñas de aplicación, no contraseñas principales
- Para Gmail, activa verificación en dos pasos
- Considera usar SendGrid para producción

---

## 🐛 Solución de Problemas

### Error: "Invalid login"
- Verifica usuario y contraseña
- Para Gmail, asegúrate de usar contraseña de aplicación
- Verifica que la cuenta no tenga restricciones

### Error: "Connection timeout"
- Verifica el puerto (587 para TLS, 465 para SSL)
- Verifica el host
- Puede que tu hosting/ISP bloquee el puerto

### Los emails llegan a SPAM
- Configura SPF y DKIM en tu dominio
- Usa un servicio profesional como SendGrid
- Evita palabras spam en el asunto/cuerpo

### Error: "Self signed certificate"
Para desarrollo local, puedes usar:
```bash
SMTP_SECURE=false
SMTP_REJECT_UNAUTHORIZED=false
```

---

## 📊 Variables de Entorno Completas

Tu `.env.local` debería verse así:

```bash
# Supabase
VITE_SUPABASE_URL=https://olvpbofiznaewodoldfb.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=gabo@orsai.org
SMTP_PASSWORD=abcd efgh ijkl mnop
SMTP_FROM_NAME=Sala Orsai
SMTP_FROM_EMAIL=gabo@orsai.org

# Gemini (opcional)
GEMINI_API_KEY=AIzaSyACaa3QSiEZvhqaM5K0GbVkRTZBbT49atQ
```

---

## ✅ Estado Actual

- ✅ Nodemailer instalado
- ✅ Servicio de email preparado
- ⏳ Esperando credenciales SMTP

**Próximo paso:** Agrega las credenciales SMTP a `.env.local` y reinicia el servidor.

---

¿Qué proveedor de email vas a usar? Puedo ayudarte con la configuración específica.



