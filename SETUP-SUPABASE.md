# 🚀 Configuración de Supabase para Sala Orsai

Esta guía te ayudará a configurar tu base de datos en Supabase para que el proyecto funcione correctamente.

---

## 📋 Paso 1: Configurar Variables de Entorno

Ya deberías tener estas credenciales en tu archivo `.env.local`:

```bash
VITE_SUPABASE_URL=https://olvpbofiznaewodoldfb.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Si no las has agregado, añádelas ahora al archivo `.env.local` en la raíz del proyecto.

---

## 🗄️ Paso 2: Ejecutar el Schema SQL

1. Ve a tu proyecto en Supabase: https://olvpbofiznaewodoldfb.supabase.co
2. En el menú lateral, selecciona **SQL Editor**
3. Haz clic en **New Query**
4. Abre el archivo `supabase-schema.sql` de este proyecto
5. **Copia todo el contenido** del archivo
6. **Pégalo** en el editor SQL de Supabase
7. Haz clic en **Run** (o presiona `Ctrl + Enter`)

El script creará:
- ✅ Tabla `shows` con campos para gestionar los eventos
- ✅ Tabla `inscriptos` con relación a shows
- ✅ Índices para optimizar consultas
- ✅ Políticas de seguridad (RLS) configuradas
- ✅ Trigger para decrementar cupo automáticamente
- ✅ Datos de ejemplo (2 shows de prueba)

---

## 🔐 Paso 3: Verificar Políticas de Seguridad (Opcional)

Las políticas ya están configuradas en el schema, pero puedes verificarlas:

1. Ve a **Authentication > Policies**
2. Deberías ver:
   - **Tabla shows**: Lectura pública, escritura autenticada
   - **Tabla inscriptos**: Inserción pública, lectura/eliminación autenticada

### ⚠️ Importante sobre Autenticación

Actualmente, las políticas están configuradas para permitir todas las operaciones (`USING (true)`), ya que el proyecto usa un sistema de login simple.

**Si quieres mayor seguridad:**
- Configura Supabase Auth para usuarios admin
- Modifica las políticas para validar `auth.uid()`

---

## 🧪 Paso 4: Probar la Conexión

1. Asegúrate de que las variables de entorno estén en `.env.local`
2. Reinicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
3. Abre el formulario público y verifica que se carguen los shows
4. Intenta hacer una inscripción de prueba
5. Ve al dashboard de admin y verifica que aparezca la inscripción

---

## 📊 Paso 5: Ver tus Datos en Supabase

Puedes ver y editar tus datos directamente en Supabase:

1. Ve a **Table Editor** en el menú lateral
2. Selecciona la tabla `shows` o `inscriptos`
3. Verás todos los registros en formato tabla
4. Puedes editar, agregar o eliminar registros manualmente

---

## 🔄 Migración desde LocalStorage (Opcional)

Si ya tenías datos en `localStorage` y quieres migrarlos:

1. Abre la consola del navegador en tu app
2. Ejecuta:
   ```javascript
   console.log(localStorage.getItem('sala_orsai_shows'));
   console.log(localStorage.getItem('sala_orsai_inscriptos'));
   ```
3. Copia los datos JSON
4. En Supabase Table Editor, usa **Insert > Insert row** para agregar los registros manualmente

---

## ✅ ¡Listo!

Tu proyecto ahora está conectado a Supabase. Todos los datos se guardarán en la nube y serán persistentes.

### Archivos Modificados:
- ✅ `services/supabaseClient.ts` - Cliente de Supabase
- ✅ `services/supabaseDatabase.ts` - Servicio de base de datos
- ✅ Componentes actualizados para usar Supabase en lugar de localStorage

### Archivos Antiguos (ya no se usan):
- `services/mockDatabase.ts` - Puedes eliminarlo si ya no lo necesitas

---

## 🐛 Solución de Problemas

### Error: "Missing credentials"
- Verifica que `.env.local` esté en la raíz del proyecto
- Asegúrate de que las variables empiecen con `VITE_`
- Reinicia el servidor después de editar `.env.local`

### Error: "relation 'shows' does not exist"
- Ejecuta el schema SQL completo en Supabase
- Verifica en Table Editor que las tablas se hayan creado

### Los datos no se guardan
- Verifica las políticas RLS en Supabase
- Revisa la consola del navegador para ver errores específicos

---

## 📚 Recursos Útiles

- [Documentación de Supabase](https://supabase.com/docs)
- [Row Level Security (RLS)](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)


