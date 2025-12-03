# 📧 Configuración Final de SMTP

## ✅ Estado Actual

- ✅ Servidor Express creado (`server/emailServer.ts`)
- ✅ Frontend actualizado para comunicarse con el servidor
- ✅ Nodemailer configurado en el backend
- ✅ Scripts de package.json actualizados

---

## 🚀 Cómo funciona ahora

### Arquitectura:

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Frontend  │ ──────> │   Backend    │ ──────> │ Servidor    │
│  (Vite)     │  HTTP   │   Express    │  SMTP   │   Email     │
│  Puerto     │ Request │   Puerto     │         │             │
│   3000      │         │    3001      │         │             │
└─────────────┘         └──────────────┘         └─────────────┘
```

1. Usuario se inscribe en el frontend
2. Frontend envía datos al backend Express (puerto 3001)
3. Backend usa nodemailer para enviar email por SMTP
4. Email llega al inscripto

---

## 📝 Variables de Entorno Necesarias

Agrega esto a tu `.env.local`:

```bash
# Supabase (ya configurado)
VITE_SUPABASE_URL=https://olvpbofiznaewodoldfb.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...

# URL del servidor de email (opcional, por defecto localhost:3001)
VITE_EMAIL_SERVER_URL=http://localhost:3001

# SMTP Configuration
SMTP_HOST=mail.orsai.org  # (o el que te den)
SMTP_PORT=587
SMTP_USER=tech@orsai.org
SMTP_PASSWORD=tu_contraseña_aqui
SMTP_FROM_NAME=Sala Orsai
SMTP_FROM_EMAIL=tech@orsai.org

# Puerto del servidor de email (opcional)
EMAIL_SERVER_PORT=3001

# Gemini (si lo usas)
GEMINI_API_KEY=AIzaSyACaa3QSiEZvhqaM5K0GbVkRTZBbT49atQ
```

---

## 🎯 Ejecutar el Proyecto

### Opción 1: Todo junto (Recomendado)
```bash
npm run dev
```
Esto iniciará:
- ✅ Frontend en `http://localhost:3000`
- ✅ Servidor de email en `http://localhost:3001`

### Opción 2: Por separado

**Terminal 1 - Frontend:**
```bash
npm run dev:frontend
```

**Terminal 2 - Servidor de Email:**
```bash
npm run dev:email
```

---

## 🧪 Probar la Configuración

### Test 1: Verificar que el servidor de email está corriendo

```bash
curl http://localhost:3001/health
```

Deberías ver:
```json
{
  "status": "ok",
  "smtp_configured": true,
  "timestamp": "2024-..."
}
```

### Test 2: Probar conexión SMTP

```bash
curl http://localhost:3001/test-smtp
```

### Test 3: Hacer una inscripción real

1. Ve a `http://localhost:3000`
2. Completa el formulario con TU email
3. Revisa tu bandeja de entrada
4. Revisa SPAM si no lo ves

---

## 📊 Logs del Servidor

El servidor de email mostrará:

```
═══════════════════════════════════════
📧 Servidor de Email iniciado
🌐 Puerto: 3001
📬 SMTP: ✅ Configurado
═══════════════════════════════════════

✅ Email enviado: <message-id>
```

---

## 🐛 Solución de Problemas

### Error: "ECONNREFUSED localhost:3001"
- El servidor de email no está corriendo
- Ejecuta: `npm run dev:email` en una terminal

### Error: "SMTP not configured"
- Falta configurar las variables SMTP en `.env.local`
- Verifica que todas las variables estén presentes

### Error: "Invalid login"
- Usuario o contraseña incorrectos
- Verifica las credenciales con el administrador del servidor

### Error: "Connection timeout"
- Puerto incorrecto
- Firewall bloqueando la conexión
- Verifica host y puerto con el administrador

---

## 🔒 Seguridad

✅ **Buenas prácticas:**
- Las credenciales están solo en el servidor (backend)
- El frontend solo hace requests HTTP
- Las credenciales NO se exponen al navegador
- `.env.local` está en `.gitignore`

---

## 🚀 Producción

Para producción necesitarás:

1. **Deploy del Backend:**
   - Heroku, Railway, Render, etc.
   - Configurar variables de entorno en el servicio
   - Obtener la URL del backend

2. **Actualizar Frontend:**
   - Cambiar `VITE_EMAIL_SERVER_URL` a la URL de producción
   - Ejemplo: `VITE_EMAIL_SERVER_URL=https://tu-backend.herokuapp.com`

3. **Build:**
   ```bash
   npm run build
   ```

---

## ✅ Checklist

- [ ] Variables SMTP agregadas a `.env.local`
- [ ] Servidor de email corriendo (`npm run dev:email`)
- [ ] Frontend corriendo (`npm run dev:frontend`)
- [ ] Test de conexión exitoso
- [ ] Email de prueba recibido

---

Una vez que me des las credenciales SMTP, actualizaré el `.env.local` y podremos hacer pruebas.

