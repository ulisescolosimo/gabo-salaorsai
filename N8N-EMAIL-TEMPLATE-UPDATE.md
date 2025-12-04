# Actualización de n8n para Templates de Email Dinámicos

## 📋 Resumen

Este documento explica cómo modificar tu flujo de n8n para permitir templates de email personalizados por evento. Ahora cada show puede tener su propio template HTML en Supabase.

## 🎯 Objetivo

Permitir que desde el panel de administrador se pueda:
- Personalizar el email de confirmación para cada evento
- Agregar instrucciones especiales para eventos específicos
- Mantener un template por defecto para eventos sin personalización

## 🔧 Cambios en la Base de Datos

Ya se agregó el campo `email_template` a la tabla `shows` en Supabase. Ejecuta este script si aún no lo has hecho:

```sql
-- Ver archivo: supabase-add-email-template.sql
```

## 📝 Variables del Template

El sistema ahora usa variables de reemplazo que n8n debe procesar:

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `{{NOMBRE_COMPLETO}}` | Nombre y apellido del inscripto | Juan Pérez |
| `{{EMAIL}}` | Email del inscripto | juan@ejemplo.com |
| `{{TELEFONO}}` | Teléfono del inscripto | 11 1234-5678 |
| `{{CANTIDAD_ENTRADAS}}` | Número de entradas reservadas | 2 |
| `{{SHOW_TITULO}}` | Título del evento | Orsai en Vivo |
| `{{SHOW_DESCRIPCION}}` | Descripción del evento | Show especial de... |
| `{{FECHA_EVENTO_FORMATEADA}}` | Fecha y hora formateada | viernes, 15 de marzo de 2024 a las 20:00 hs |
| `{{FECHA_INSCRIPCION}}` | Fecha de inscripción | 2024-03-10T15:30:00 |

## 🛠️ Modificaciones Necesarias en n8n

### Paso 1: Agregar un nodo de "Code" o "Set" después del Webhook

Necesitas procesar el template antes de enviarlo. Agrega un nodo entre el **Webhook** y el **Send a message (Gmail)**.

### Paso 2: Configurar el nodo de procesamiento

Crea un nodo **"Code"** con este JavaScript:

```javascript
// Obtener los datos del webhook
const inscripto = $input.item.json.body.inscripto;
const show = $input.item.json.body.show;

// Template HTML - usar el personalizado o el por defecto
let emailTemplate = show.email_template;

// Si no hay template personalizado, usar el por defecto (el que está actualmente hardcodeado)
if (!emailTemplate) {
  emailTemplate = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Confirmación de inscripción</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<!-- ... resto del template por defecto ... -->
</html>`;
}

// Reemplazar todas las variables
const nombreCompleto = `${inscripto.nombre} ${inscripto.apellido}`;

emailTemplate = emailTemplate
  .replace(/\{\{NOMBRE_COMPLETO\}\}/g, nombreCompleto)
  .replace(/\{\{EMAIL\}\}/g, inscripto.email)
  .replace(/\{\{TELEFONO\}\}/g, inscripto.telefono || 'No especificado')
  .replace(/\{\{CANTIDAD_ENTRADAS\}\}/g, inscripto.cantidad_entradas)
  .replace(/\{\{SHOW_TITULO\}\}/g, show.titulo)
  .replace(/\{\{SHOW_DESCRIPCION\}\}/g, show.descripcion)
  .replace(/\{\{FECHA_EVENTO_FORMATEADA\}\}/g, show.fecha_evento_formateada)
  .replace(/\{\{FECHA_INSCRIPCION\}\}/g, inscripto.fecha_inscripcion);

// Retornar todos los datos incluyendo el template procesado
return {
  inscripto: inscripto,
  show: show,
  emailHtml: emailTemplate
};
```

### Paso 3: Actualizar el nodo de Gmail

Modifica el nodo **"Send a message"** para usar el HTML procesado:

1. En el campo **"Message"**, cambia de contenido hardcodeado a:
   ```
   ={{ $json.emailHtml }}
   ```

2. El campo **"Send to"** sigue igual:
   ```
   ={{ $json.inscripto.email }}
   ```

3. El campo **"Subject"** puede personalizarse también:
   ```
   =Confirmación: {{ $json.show.titulo }}
   ```

### Paso 4: Actualizar el nodo de Google Sheets (opcional)

El nodo de Google Sheets puede seguir igual, pero asegúrate de que las referencias apunten correctamente al nodo anterior. Si agregaste el nodo "Code", las referencias deben ser:

```
={{ $('Code').item.json.inscripto.nombre }}
={{ $('Code').item.json.inscripto.apellido }}
// etc...
```

## 🎨 Template Por Defecto

El template por defecto está incluido en el archivo `supabase-add-email-template.sql` y es el mismo que actualmente tienes en n8n. Las variables han sido reemplazadas para usar el nuevo formato `{{VARIABLE}}`.

## 📊 Flujo Completo Actualizado

```
[Webhook] 
    ↓
[Code: Procesar Template]  ← NUEVO
    ↓
[Gmail: Enviar Email] (usa $json.emailHtml)
    ↓
[Google Sheets: Guardar datos]
```

## ✅ Validación

Para probar que todo funciona:

1. **Sin template personalizado**: 
   - Crea un show sin template personalizado
   - Inscríbete y verifica que recibes el email con el template por defecto

2. **Con template personalizado**:
   - Edita un show en el panel de admin
   - Agrega un mensaje especial en el template
   - Inscríbete y verifica que recibes el email personalizado

3. **Verificar variables**:
   - Confirma que todas las variables se reemplazan correctamente
   - No deberían aparecer `{{` en el email final

## 🚨 Importante

- **Respaldo**: Antes de modificar n8n, exporta tu flujo actual como backup
- **Testing**: Prueba en un ambiente de desarrollo primero
- **Variables**: Asegúrate de que todas las variables usen el formato exacto `{{NOMBRE_VARIABLE}}`
- **HTML válido**: Los templates deben ser HTML válido para que se vean correctamente

## 🔄 Alternativa Más Simple (Sin Code Node)

Si prefieres no usar JavaScript en n8n, puedes usar el campo de **"Message"** con una expresión condicional:

```
={{ $json.body.show.email_template ? $json.body.show.email_template.replace('{{NOMBRE_COMPLETO}}', $json.body.inscripto.nombre + ' ' + $json.body.inscripto.apellido).replace('{{EMAIL}}', $json.body.inscripto.email)... : '<!-- template por defecto hardcodeado -->' }}
```

Sin embargo, esto es menos legible y más difícil de mantener.

## 📞 Soporte

Si tienes problemas con la implementación:
1. Verifica que el campo `email_template` existe en Supabase
2. Confirma que el webhook está recibiendo el campo `show.email_template`
3. Revisa los logs de n8n para ver si hay errores en el procesamiento
4. Verifica que las variables están en el formato correcto

---

**Nota**: Esta actualización es compatible con versiones anteriores. Los shows que no tienen template personalizado seguirán usando el template por defecto.

