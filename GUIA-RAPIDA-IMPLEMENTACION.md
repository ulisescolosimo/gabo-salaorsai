# 🚀 Guía Rápida de Implementación - Templates de Email

## ⏱️ Tiempo estimado: 15-20 minutos

---

## Paso 1️⃣: Actualizar Supabase (5 min)

### 1.1 Abre Supabase
- Ve a tu proyecto en [https://supabase.com](https://supabase.com)
- Click en **"SQL Editor"** en el menú lateral

### 1.2 Ejecuta el script SQL
- Abre el archivo `supabase-add-email-template.sql`
- Copia TODO el contenido
- Pégalo en el SQL Editor de Supabase
- Click en **"Run"** o presiona `Ctrl+Enter`

### 1.3 Verifica
Deberías ver algo como:
```
Success. No rows returned
```

Y al final, una tabla mostrando tus shows con el estado del template.

✅ **Listo: Base de datos actualizada**

---

## Paso 2️⃣: Actualizar n8n (10 min)

Tienes **2 opciones**:

### Opción A: Importar flujo completo (Recomendado)

1. **Descarga tu flujo actual** (backup):
   - En n8n, abre tu workflow "Gabo Flow"
   - Click en el menú `...` → **Export**
   - Guarda como `gabo-flow-backup.json`

2. **Importa el nuevo flujo**:
   - En n8n, click en **"+ Add workflow"**
   - Click en el menú `...` → **Import from File**
   - Selecciona `n8n-gabo-flow-actualizado.json`

3. **Configura las credenciales**:
   - Nodo **"Enviar Email"**: Selecciona tu cuenta de Gmail
   - Nodo **"Guardar en Google Sheets"**: Selecciona tu cuenta de Google Sheets

4. **Desactiva el flujo viejo** y **activa el nuevo**

### Opción B: Modificar flujo existente

Sigue las instrucciones detalladas en: **`N8N-EMAIL-TEMPLATE-UPDATE.md`**

✅ **Listo: n8n configurado**

---

## Paso 3️⃣: Probar el sistema (5 min)

### 3.1 Accede al panel de admin
```
http://tu-dominio.com/admin
```

### 3.2 Edita un show
1. Ve a **"Gestión de Shows"**
2. Click en **"Editar"** en cualquier show
3. Busca la sección **"Template de Email Personalizado"**
4. Click en **"Editar Template"**

### 3.3 Personaliza el template
Agrega un mensaje especial, por ejemplo:

```html
<tr>
  <td style="padding:10px 30px 20px 30px; background-color:#fff3cd; border-left:4px solid #ff6b35; font-size:14px; color:#333;">
    <p style="margin:0 0 10px 0; font-weight:bold;">
      ⚠️ IMPORTANTE PARA ESTE SHOW:
    </p>
    <p style="margin:0;">
      Este es un evento especial que incluye una masterclass exclusiva. 
      ¡Llegá 30 minutos antes para aprovechar al máximo!
    </p>
  </td>
</tr>
```

### 3.4 Guarda y prueba
1. Click en **"Guardar Show"**
2. Abre el formulario público: `http://tu-dominio.com`
3. Inscríbete en ese show con tu email
4. Revisa tu bandeja de entrada

✅ **Listo: ¡Deberías recibir el email personalizado!**

---

## 🎯 Verificación Final

### ✓ Checklist

- [ ] Campo `email_template` agregado en Supabase
- [ ] Flujo de n8n actualizado y activo
- [ ] Puedes editar templates desde el panel admin
- [ ] Recibiste un email de prueba con el template personalizado
- [ ] Las variables se reemplazaron correctamente (no aparecen `{{}}`)

---

## 🆘 Problemas Comunes

### "Error: column email_template does not exist"
**Solución:** Ejecuta el script SQL en Supabase (Paso 1)

### "No recibo el email"
**Solución:** 
- Verifica que n8n esté activo
- Revisa la pestaña de Spam
- Mira los logs en n8n (click en el workflow → Executions)

### "Las variables no se reemplazan"
**Solución:**
- Verifica que el nodo "Code" esté antes del nodo de Gmail
- Confirma que el campo "Message" en Gmail use: `={{ $json.emailHtml }}`

### "El template no se muestra en el admin"
**Solución:**
- Refresca la aplicación (`Ctrl+F5`)
- Verifica que no haya errores en la consola del navegador

---

## 📚 Documentación Completa

- **Detalles técnicos de n8n**: `N8N-EMAIL-TEMPLATE-UPDATE.md`
- **Guía completa del sistema**: `EMAIL-TEMPLATES-README.md`
- **Template de ejemplo**: `template-email-ejemplo.html`

---

## 💡 Siguientes Pasos

Ahora puedes:

1. **Personalizar cada evento** con instrucciones específicas
2. **Crear diferentes diseños** para diferentes tipos de shows
3. **Agregar imágenes y logos** (usando URLs absolutas)
4. **Experimentar con estilos** para mejorar la apariencia

---

## 🎉 ¡Felicitaciones!

Ya tenés un sistema flexible de emails que podés personalizar sin tocar código. Cada evento puede tener su propio mensaje especial. 🚀

**¿Necesitas ayuda?** Revisa `EMAIL-TEMPLATES-README.md` para más detalles.

