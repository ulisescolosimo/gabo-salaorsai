# 🔐 Configuración de Autenticación de Administradores

Esta guía te ayudará a configurar el sistema de autenticación para administradores en Supabase.

---

## 📋 ¿Qué se ha implementado?

✅ **Tabla de administradores** en Supabase con:
- Email único
- Contraseñas hasheadas con bcrypt
- Control de estado activo/inactivo
- Registro de último acceso

✅ **Sistema de login seguro** que:
- Valida credenciales contra la base de datos
- Hashea contraseñas para seguridad
- Actualiza último acceso automáticamente

✅ **Usuario administrador inicial**:
- **Email**: `gabo@orsai.org`
- **Contraseña**: `fca702db776bb8a47966006e0649cd01`

---

## 🚀 Pasos para Configurar

### Paso 1: Ejecutar el Schema de Administradores

1. Ve a tu proyecto en Supabase: https://olvpbofiznaewodoldfb.supabase.co
2. Menú lateral → **SQL Editor**
3. **New Query**
4. Abre el archivo `supabase-admin-table.sql`
5. **Copia TODO el contenido** del archivo
6. Pégalo en el editor y haz clic en **Run**

Esto creará:
- ✅ Tabla `administradores`
- ✅ Índices y triggers
- ✅ Políticas de seguridad
- ✅ **Usuario administrador inicial con email `gabo@orsai.org`**

### Paso 2: Verificar que se creó el administrador

En Supabase:
1. Ve a **Table Editor**
2. Selecciona la tabla `administradores`
3. Deberías ver el usuario `gabo@orsai.org`

---

## 🔑 Credenciales del Administrador Inicial

```
Email:      gabo@orsai.org
Contraseña: fca702db776bb8a47966006e0649cd01
```

⚠️ **IMPORTANTE**: Guarda estas credenciales en un lugar seguro. Una vez que accedas por primera vez, considera cambiar la contraseña.

---

## 🧪 Probar el Login

1. Reinicia tu servidor si está corriendo:
   ```bash
   npm run dev
   ```

2. Ve a la ruta de login: `http://localhost:5173/login` (o la URL que uses)

3. Ingresa las credenciales:
   - **Email**: `gabo@orsai.org`
   - **Contraseña**: `fca702db776bb8a47966006e0649cd01`

4. Deberías ser redirigido al dashboard de administración

---

## 👥 Agregar Más Administradores

### Opción 1: Desde Supabase (Manual)

1. Ve a **Table Editor** → `administradores`
2. Haz clic en **Insert** → **Insert row**
3. Necesitas hashear la contraseña primero:

**Para generar el hash de una contraseña:**

```bash
# Ejecuta este script con la contraseña deseada
npx tsx scripts/createAdminUser.ts
```

Edita el archivo `scripts/createAdminUser.ts` y cambia:
```typescript
const EMAIL = 'nuevo@admin.com';
const PASSWORD = 'tu_contraseña_aqui';
const NOMBRE = 'Nombre del Admin';
```

Luego ejecuta el script y copia el SQL generado.

### Opción 2: Crear Interfaz de Gestión de Admins

Si necesitas una interfaz para gestionar administradores desde la app, puedo crear:
- Componente para agregar/editar administradores
- Función para cambiar contraseñas
- Lista de administradores activos

Avísame si lo necesitas.

---

## 🔒 Seguridad

### Contraseñas
- ✅ Todas las contraseñas se hashean con bcrypt (10 rondas de salt)
- ✅ Nunca se almacenan en texto plano
- ✅ La comparación se hace de forma segura

### Políticas de Seguridad (RLS)
- ✅ Row Level Security habilitado
- ✅ Solo usuarios autenticados pueden leer datos de administradores
- ✅ Las actualizaciones están controladas

### Recomendaciones Adicionales
- 🔐 Usa contraseñas fuertes (mínimo 12 caracteres)
- 🔄 Cambia las contraseñas periódicamente
- 📱 Considera implementar 2FA en el futuro
- 🚫 No compartas credenciales

---

## 🗂️ Estructura de la Tabla Administradores

```sql
administradores (
  id              UUID (Primary Key)
  email           TEXT (Unique, NOT NULL)
  nombre          TEXT (NOT NULL)
  password_hash   TEXT (NOT NULL)
  activo          BOOLEAN (Default: true)
  ultimo_acceso   TIMESTAMP WITH TIME ZONE
  created_at      TIMESTAMP WITH TIME ZONE
  updated_at      TIMESTAMP WITH TIME ZONE
)
```

---

## 🔧 Archivos Modificados/Creados

### Creados:
- ✅ `supabase-admin-table.sql` - Schema de tabla administradores
- ✅ `scripts/createAdminUser.ts` - Script para generar hashes
- ✅ `ADMIN-SETUP.md` - Esta guía

### Modificados:
- ✅ `types.ts` - Agregado tipo `Administrador`
- ✅ `services/supabaseDatabase.ts` - Agregadas funciones de autenticación
- ✅ `components/admin/Login.tsx` - Actualizado para usar Supabase
- ✅ `package.json` - Agregadas dependencias: `bcryptjs`, `@types/bcryptjs`, `tsx`

---

## 🐛 Solución de Problemas

### "Credenciales incorrectas" pero estoy seguro que son correctas

1. Verifica que ejecutaste el SQL de `supabase-admin-table.sql`
2. Verifica en Table Editor que existe el usuario
3. Verifica que el campo `activo` esté en `true`
4. Revisa la consola del navegador para más detalles del error

### "Error al conectar con la base de datos"

1. Verifica que las variables de entorno estén en `.env.local`
2. Reinicia el servidor después de agregar las variables
3. Verifica en Supabase que las políticas RLS estén correctas

### Quiero cambiar la contraseña de un admin

Ejecuta este SQL en Supabase:

```sql
-- Primero genera el hash con el script:
-- npx tsx scripts/createAdminUser.ts

-- Luego ejecuta:
UPDATE administradores
SET password_hash = 'NUEVO_HASH_AQUI',
    updated_at = NOW()
WHERE email = 'gabo@orsai.org';
```

---

## 📚 Próximos Pasos Opcionales

¿Quieres agregar más funcionalidad?

- [ ] Recuperación de contraseña por email
- [ ] Interfaz para gestionar administradores desde el dashboard
- [ ] Roles y permisos diferenciados
- [ ] Auditoría de acciones de administradores
- [ ] Autenticación de dos factores (2FA)

Avísame si necesitas implementar alguna de estas funcionalidades.

---

¡Tu sistema de autenticación de administradores está listo! 🎉

