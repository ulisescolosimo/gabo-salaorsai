# 🔗 Integración con n8n

Esta guía explica cómo funciona la integración con n8n para el envío de emails.

---

## 🎯 ¿Qué es n8n?

n8n es una plataforma de automatización que permite crear flujos de trabajo (workflows). En este proyecto, se usa para enviar emails de confirmación automáticamente.

---

## 📡 Webhook Configurado

**URL del Webhook:**
```
https://orsai.app.n8n.cloud/webhook-test/2ef6c45f-ef60-456b-b1c5-e8d8a7249193
```

---

## 📤 Datos que se envían

Cuando alguien se inscribe, se hace un POST al webhook con la siguiente estructura:

```json
{
  "inscripto": {
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "juan@ejemplo.com",
    "telefono": "11 1234-5678",
    "fecha_inscripcion": "2024-01-15T10:30:00Z"
  },
  "show": {
    "titulo": "Noche de Cuentos",
    "descripcion": "Una velada inolvidable...",
    "fecha_evento": "2024-02-20",
    "hora_evento": "20:30",
    "fecha_evento_formateada": "martes 20 de febrero de 2024 a las 20:30 hs"
  },
  "email": {
    "to": "juan@ejemplo.com",
    "subject": "Confirmación de inscripción – Sala Orsay",
    "body": "Hola Juan Pérez,\n\nTe confirmamos tu inscripción..."
  }
}
```

---

## 🔧 Configuración en n8n

### Workflow Sugerido:

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Webhook   │ --> │   Procesar   │ --> │   Enviar    │
│   Trigger   │     │    Datos     │     │    Email    │
└─────────────┘     └──────────────┘     └─────────────┘
```

### Pasos en n8n:

1. **Webhook (ya configurado)**
   - Método: POST
   - Recibe los datos JSON

2. **Email (Gmail, SMTP, SendGrid, etc.)**
   - To: `{{ $json.inscripto.email }}`
   - Subject: `{{ $json.email.subject }}`
   - Body: `{{ $json.email.body }}`

### Ejemplo de configuración del nodo Email:

```json
{
  "to": "{{ $json.inscripto.email }}",
  "subject": "{{ $json.email.subject }}",
  "text": "{{ $json.email.body }}",
  "html": "{{ $json.email.body.replace('\\n', '<br>') }}"
}
```

---

## ✅ Ventajas de usar n8n

1. ✅ **No necesitas servidor SMTP en el código**
2. ✅ **Configuración visual del workflow**
3. ✅ **Puedes agregar pasos adicionales:**
   - Guardar en Google Sheets
   - Notificar por Slack/Discord
   - Registrar en CRM
   - Enviar SMS
4. ✅ **Logs y monitoreo en n8n**
5. ✅ **Fácil de modificar sin tocar código**

---

## 🧪 Probar la Integración

### Desde el navegador (DevTools Console):

```javascript
fetch('https://orsai.app.n8n.cloud/webhook-test/2ef6c45f-ef60-456b-b1c5-e8d8a7249193', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    inscripto: {
      nombre: "Test",
      apellido: "Usuario",
      email: "test@ejemplo.com",
      telefono: "11 1111-1111",
      fecha_inscripcion: new Date().toISOString()
    },
    show: {
      titulo: "Show de Prueba",
      descripcion: "Test",
      fecha_evento: "2024-12-31",
      hora_evento: "20:00",
      fecha_evento_formateada: "martes 31 de diciembre de 2024 a las 20:00 hs"
    },
    email: {
      to: "test@ejemplo.com",
      subject: "Test desde código",
      body: "Este es un email de prueba"
    }
  })
})
.then(r => r.json())
.then(d => console.log('✅ Respuesta:', d))
.catch(e => console.error('❌ Error:', e));
```

### Desde la aplicación:

1. Ve al formulario público
2. Completa una inscripción con tu email
3. Verifica que llegue el email
4. Revisa los logs en n8n

---

## 📊 Estructura del Código

### Flujo de Inscripción:

```
Usuario completa formulario
        ↓
PublicForm.tsx llama a db.registerUser()
        ↓
Se guarda en Supabase
        ↓
PublicForm.tsx llama a emailService.sendConfirmation()
        ↓
emailService.ts hace POST al webhook de n8n
        ↓
n8n recibe datos y envía email
        ↓
Usuario recibe email de confirmación
```

### Archivo: `services/emailService.ts`

- ✅ Template personalizable con variables
- ✅ Formato de fecha en español
- ✅ POST directo al webhook
- ✅ Manejo de errores
- ✅ Modo desarrollo (no falla si webhook no responde)

---

## 🔒 Seguridad

### Webhook Público:
- ⚠️ El webhook está expuesto públicamente
- ⚠️ Cualquiera con la URL puede enviar requests

### Recomendaciones:

1. **Agregar autenticación en n8n:**
   - Header personalizado
   - Token de autenticación

2. **Validación en n8n:**
   - Verificar formato de datos
   - Validar email con regex
   - Rate limiting

3. **Rotación del webhook:**
   - Cambiar la URL periódicamente
   - Usar variables de entorno

### Configuración Recomendada (Futuro):

```typescript
const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL;
const N8N_AUTH_TOKEN = import.meta.env.VITE_N8N_AUTH_TOKEN;

// En el fetch:
headers: {
  'Content-Type': 'application/json',
  'X-Auth-Token': N8N_AUTH_TOKEN
}
```

---

## 🐛 Solución de Problemas

### Email no llega
1. Verifica que el webhook está activo en n8n
2. Revisa los logs de ejecución en n8n
3. Verifica la configuración del nodo de email
4. Revisa la carpeta de SPAM

### Error en el webhook
1. Verifica que la URL sea correcta
2. Verifica que n8n esté activo
3. Revisa los logs del navegador (F12)

### Datos incorrectos
1. Verifica el workflow en n8n
2. Revisa los datos que llegan al webhook
3. Ajusta el mapping de variables

---

## 📚 Variables Disponibles en Templates

En el campo "Cuerpo del Email" de los shows, puedes usar:

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `{nombre}` | Nombre del inscripto | Juan |
| `{apellido}` | Apellido del inscripto | Pérez |
| `{titulo}` | Título del show | Noche de Cuentos |
| `{fecha}` | Fecha y hora completa | martes 20 de febrero... |
| `{fecha_evento}` | Alias de {fecha} | martes 20 de febrero... |
| `{hora}` | Solo la hora | 20:30 |
| `{telefono}` | Teléfono del inscripto | 11 1234-5678 |

---

## ✅ Estado Actual

- ✅ Webhook configurado
- ✅ Código actualizado para usar n8n
- ✅ Template con variables funcionando
- ✅ Fecha y hora incluidas
- ⏳ Pendiente: Configurar workflow en n8n

---

## 🚀 Próximos Pasos

1. Configurar el workflow en n8n para recibir el webhook
2. Agregar nodo de email (Gmail, SMTP, SendGrid, etc.)
3. Hacer una inscripción de prueba
4. Verificar que el email llegue correctamente

---

¿Necesitas ayuda para configurar el workflow en n8n?

