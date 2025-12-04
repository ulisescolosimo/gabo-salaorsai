# 📧 Sistema de Templates de Email Personalizables

## 🎯 Descripción General

Este sistema permite personalizar los emails de confirmación por cada evento desde el panel de administrador. Cada show puede tener su propio template HTML o usar el template por defecto.

## 🚀 Características

- ✅ **Templates personalizables por evento** - Cada show puede tener su propio diseño de email
- ✅ **Variables dinámicas** - Inserción automática de datos del inscripto y del evento
- ✅ **Template por defecto** - Fallback automático si no se especifica uno personalizado
- ✅ **Editor en el panel admin** - Interfaz visual para editar templates
- ✅ **Compatible con eventos múltiples** - Distintos templates para distintos eventos

## 📋 Variables Disponibles

Todas estas variables se reemplazan automáticamente en el email:

```
{{NOMBRE_COMPLETO}}          - Nombre y apellido del inscripto
{{EMAIL}}                    - Email del inscripto
{{TELEFONO}}                 - Teléfono (o "No especificado")
{{CANTIDAD_ENTRADAS}}        - Número de entradas (1 o 2)
{{SHOW_TITULO}}              - Título del evento
{{SHOW_DESCRIPCION}}         - Descripción del evento
{{FECHA_EVENTO_FORMATEADA}}  - Fecha y hora formateada (ej: "viernes, 15 de marzo de 2024 a las 20:00 hs")
{{FECHA_INSCRIPCION}}        - Fecha de inscripción
```

## 🛠️ Archivos Creados

### 1. **supabase-add-email-template.sql**
Script SQL para agregar el campo `email_template` a la tabla `shows` e incluye el template por defecto.

**Ejecutar en Supabase:**
```sql
-- Copiar y pegar el contenido del archivo en el SQL Editor de Supabase
```

### 2. **N8N-EMAIL-TEMPLATE-UPDATE.md**
Guía detallada para actualizar tu flujo de n8n con el procesamiento de templates dinámicos.

**Pasos principales:**
1. Agregar un nodo "Code" después del Webhook
2. Configurar el código de procesamiento de templates
3. Actualizar el nodo de Gmail para usar el HTML dinámico

### 3. **n8n-gabo-flow-actualizado.json**
Flujo completo de n8n ya configurado con el sistema de templates. Puedes importarlo directamente en n8n.

**Para importar:**
1. Ir a n8n → Workflows
2. Click en "Import from File"
3. Seleccionar `n8n-gabo-flow-actualizado.json`
4. Configurar tus credenciales (Gmail y Google Sheets)
5. Activar el workflow

### 4. **template-email-ejemplo.html**
Template HTML de ejemplo que puedes usar como base para personalizar.

## 📝 Cómo Usar

### Desde el Panel de Administrador

1. **Accede al panel admin** (`/admin`)
2. **Ve a "Gestión de Shows"**
3. **Edita un show** o crea uno nuevo
4. **Click en "Editar Template"** para abrir el editor
5. **Pega tu HTML personalizado** o modifica el existente
6. **Usa las variables** donde necesites datos dinámicos
7. **Guarda el show**

### Ejemplo de Personalización

Para un evento especial, podrías agregar instrucciones específicas:

```html
<tr>
  <td style="padding:0 30px 20px 30px; font-size:14px; color:#333333; line-height:1.6;">
    <p style="margin:0 0 12px 0;">
      <strong>⚠️ IMPORTANTE para este evento:</strong><br>
      Este show incluye una masterclass antes de la función. 
      Te pedimos llegar 30 minutos antes para aprovechar al máximo la experiencia.
    </p>
    <p style="margin:0 0 12px 0;">
      El evento comenzará puntualmente a las {{FECHA_EVENTO_FORMATEADA}}.
    </p>
  </td>
</tr>
```

## 🔄 Flujo de Trabajo

```
Usuario se inscribe
    ↓
App consulta el show en Supabase (incluye email_template)
    ↓
App registra la inscripción
    ↓
App envía datos + template al webhook de n8n
    ↓
n8n recibe el template (personalizado o null)
    ↓
n8n procesa variables en el template
    ↓
n8n envía el email personalizado
    ↓
n8n guarda en Google Sheets
```

## 🎨 Tips para Templates

### 1. **Mantén la estructura básica**
El template debe ser un HTML completo con `<!DOCTYPE>`, `<html>`, `<head>` y `<body>`.

### 2. **Usa tablas para el layout**
Los emails funcionan mejor con tablas que con divs y flex:
```html
<table role="presentation" cellpadding="0" cellspacing="0" width="600">
  <!-- contenido -->
</table>
```

### 3. **Estilos inline**
Todos los estilos deben estar inline (no usar CSS externo):
```html
<p style="color:#333; font-size:14px;">Texto</p>
```

### 4. **Prueba en diferentes clientes**
Los emails se ven diferente en Gmail, Outlook, Apple Mail, etc.

### 5. **Usa las variables correctamente**
Asegúrate de escribir las variables exactamente como se muestran (con mayúsculas):
```html
<!-- ✅ CORRECTO -->
Hola {{NOMBRE_COMPLETO}}

<!-- ❌ INCORRECTO -->
Hola {{nombre_completo}}
Hola {{ NOMBRE_COMPLETO }}
Hola {NOMBRE_COMPLETO}
```

## 🧪 Pruebas

### 1. **Sin template personalizado**
```
1. Crea un show sin modificar el template
2. Inscríbete en ese show
3. Verifica que recibes el email con el template por defecto
```

### 2. **Con template personalizado**
```
1. Edita un show existente
2. Agrega un mensaje especial en el template
3. Guarda los cambios
4. Inscríbete en ese show
5. Verifica que recibes el email con tu mensaje especial
```

### 3. **Verificar variables**
```
1. Revisa que todas las variables se hayan reemplazado
2. No debe aparecer ningún {{}} en el email recibido
3. Los datos deben corresponder a tu inscripción
```

## ⚠️ Solución de Problemas

### Email no se envía
- Verifica que n8n esté activo
- Revisa los logs de n8n para errores
- Confirma que el webhook está recibiendo los datos

### Variables no se reemplazan
- Verifica que estés usando el formato exacto: `{{VARIABLE}}`
- Confirma que el nodo "Code" en n8n está procesando correctamente
- Revisa que no haya espacios extra en las variables

### Template no se aplica
- Confirma que el campo `email_template` existe en Supabase
- Verifica que guardaste el show después de editar el template
- Revisa que la app está enviando el campo al webhook

### Email se ve mal
- Valida que tu HTML sea correcto (usa un validador HTML)
- Prueba el email en diferentes clientes (Gmail, Outlook, etc.)
- Usa solo estilos inline
- Evita CSS moderno (flex, grid) - usa tablas

## 📚 Recursos Adicionales

- **HTML Email Templates**: [Cerberus Email Templates](https://tedgoas.github.io/Cerberus/)
- **Email Testing**: [Litmus](https://litmus.com/) o [Email on Acid](https://www.emailonacid.com/)
- **Guía de HTML para Emails**: [Campaign Monitor Guide](https://www.campaignmonitor.com/dev-resources/guides/coding/)

## 🔐 Seguridad

- Los templates se almacenan en Supabase (backend seguro)
- Solo administradores autenticados pueden editarlos
- El sistema sanitiza automáticamente las variables de usuario
- n8n procesa los templates en el servidor, no en el cliente

## 🆘 Soporte

Si necesitas ayuda:

1. **Revisa la documentación** en `N8N-EMAIL-TEMPLATE-UPDATE.md`
2. **Verifica los logs** de n8n
3. **Usa el template de ejemplo** como base
4. **Contacta al desarrollador** con detalles del problema

---

**¡Listo para personalizar tus emails!** 🎉

