# Configuración del Texto del Formulario Público

## Resumen

Se ha implementado un sistema para editar el texto del encabezado del formulario público desde el panel de administración, con un **editor WYSIWYG** (What You See Is What You Get) profesional.

## ¿Qué se implementó?

### 1. Base de Datos
- **Tabla nueva**: `config` en Supabase
- **Campos**: 
  - `key`: identificador único de la configuración
  - `value`: valor del texto (soporta Markdown)
  - `description`: descripción de la configuración
  - `updated_at`: fecha de última actualización

### 2. Panel de Administración
- **Nueva pestaña**: "Configuración" en el panel de admin
- **Editor WYSIWYG**: editor visual con barra de herramientas (usando Tiptap)
- **Vista previa**: para ver cómo quedará el texto antes de guardarlo

### 3. Formulario Público
- **Renderizado dinámico**: el texto se carga desde la base de datos
- **Formato HTML**: renderiza el HTML generado por el editor visual

## Pasos para usar la funcionalidad

### 1. Ejecutar el SQL en Supabase

1. Ingresa a tu proyecto de Supabase
2. Ve a **SQL Editor**
3. Ejecuta el archivo `supabase-config-table.sql`

```sql
-- Este archivo crea la tabla config y la configura con el texto inicial
```

### 2. Editar el texto desde el panel de administración

1. Ingresa al panel de administración: `/admin`
2. Ve a la pestaña **"Configuración"** (ícono de engranaje)
3. Haz clic en **"Editar"**
4. Usa la barra de herramientas visual para dar formato al texto
5. Usa el botón **"Vista Previa"** para ver cómo quedará
6. Haz clic en **"Guardar"** cuando estés satisfecho

### 3. Herramientas del Editor WYSIWYG

El editor incluye una barra de herramientas con las siguientes opciones:

#### 🔄 Deshacer/Rehacer
- **Deshacer**: Revierte el último cambio
- **Rehacer**: Vuelve a aplicar el cambio deshecho

#### 📝 Títulos
- **H1**: Título principal (más grande)
- **H2**: Subtítulo
- **H3**: Título terciario

#### ✏️ Formato de texto
- **Negrita** (B): Texto en negrita
- **Cursiva** (I): Texto en cursiva
- **Subrayado** (U): Texto subrayado

#### 📋 Listas
- **Lista con viñetas**: Lista no ordenada
- **Lista numerada**: Lista ordenada

#### ↔️ Alineación
- **Alinear a la izquierda**: Alineación por defecto
- **Centrar**: Texto centrado
- **Alinear a la derecha**: Texto a la derecha

#### 🔗 Enlaces
- **Insertar enlace**: Crea enlaces a otras páginas
  - Selecciona el texto que quieres convertir en enlace
  - Haz clic en el botón de enlace
  - Ingresa la URL
  - Para eliminar un enlace, deja la URL vacía

#### 💡 Ejemplo de uso
1. Escribe tu texto directamente en el editor
2. Selecciona el texto que quieres formatear
3. Haz clic en el botón correspondiente (negrita, cursiva, etc.)
4. El formato se aplica inmediatamente
5. Lo que ves es lo que obtienes (WYSIWYG)

## Archivos modificados

- ✅ `supabase-config-table.sql` - Script SQL para crear la tabla
- ✅ `types.ts` - Agregado tipo `Config`
- ✅ `services/supabaseDatabase.ts` - Métodos para leer/actualizar configuraciones
- ✅ `components/admin/ConfigEditor.tsx` - Componente de edición con WYSIWYG
- ✅ `components/ui/RichTextEditor.tsx` - **Nuevo** Editor WYSIWYG con Tiptap
- ✅ `pages/AdminDashboard.tsx` - Agregada pestaña de configuración
- ✅ `pages/PublicForm.tsx` - Renderizado dinámico del HTML
- ✅ `index.css` - Estilos personalizados para el editor y el formulario
- ✅ `package.json` - Dependencias: Tiptap y extensiones

## Ventajas

✨ **Sin necesidad de editar código**: Los cambios al texto se hacen desde el admin, sin tocar archivos de código.

✨ **Editor visual (WYSIWYG)**: Ves exactamente cómo quedará el texto mientras lo editas, sin necesidad de conocer HTML o Markdown.

✨ **Barra de herramientas intuitiva**: Botones fáciles de usar para formato de texto, listas, enlaces, etc.

✨ **Vista previa en tiempo real**: Puedes ver exactamente cómo se verá el texto en el formulario público antes de guardarlo.

✨ **Formato rico**: Títulos, negritas, cursivas, subrayados, listas, enlaces y alineación de texto.

✨ **Histórico automático**: La tabla guarda `updated_at` para saber cuándo fue la última modificación.

✨ **Fácil de extender**: Puedes agregar más configuraciones simplemente insertando nuevas filas en la tabla `config`.

## Próximos pasos posibles

- Agregar más configuraciones editables (ej: pie de página, textos de emails, etc.)
- Implementar un historial de versiones
- Agregar soporte para imágenes en el editor
- Crear un sistema de plantillas predefinidas
- Agregar más opciones de formato (colores, tamaños de fuente, etc.)

## Soporte

Si necesitas ayuda o quieres agregar más funcionalidades, no dudes en consultarme.

