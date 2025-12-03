-- =====================================================
-- TABLA DE ADMINISTRADORES PARA SALA ORSAI
-- =====================================================
-- Ejecuta este script en el SQL Editor de Supabase
-- DESPUÉS de haber ejecutado supabase-schema.sql
-- =====================================================

-- Tabla de administradores
CREATE TABLE IF NOT EXISTS administradores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  activo BOOLEAN DEFAULT true,
  ultimo_acceso TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para búsquedas por email
CREATE INDEX IF NOT EXISTS idx_administradores_email ON administradores(email);

-- Trigger para actualizar updated_at automáticamente
CREATE TRIGGER update_administradores_updated_at
  BEFORE UPDATE ON administradores
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS
ALTER TABLE administradores ENABLE ROW LEVEL SECURITY;

-- Política: Solo permitir lectura con autenticación
-- (En este caso, la validación se hace en el código)
CREATE POLICY "Los administradores pueden leer sus propios datos"
  ON administradores FOR SELECT
  USING (true);

CREATE POLICY "Los administradores pueden actualizar último acceso"
  ON administradores FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- INSERTAR ADMINISTRADOR INICIAL
-- =====================================================
-- Usuario: gabo@orsai.org
-- Contraseña sin hashear: fca702db776bb8a47966006e0649cd01
-- (Esta contraseña se hasheará desde el código)
-- =====================================================

-- NOTA: La contraseña ya viene hasheada con bcrypt
-- Contraseña sin hashear: fca702db776bb8a47966006e0649cd01
INSERT INTO administradores (email, nombre, password_hash, activo)
VALUES (
  'gabo@orsai.org',
  'Gabriel',
  '$2b$10$SLMhnOVQKmjh/mZ7iHLluOiO4c/tJb1lReBRkYTJXcaGhAIt3D322',
  true
)
ON CONFLICT (email) DO UPDATE
SET password_hash = EXCLUDED.password_hash;

-- =====================================================
-- FIN DEL SCHEMA DE ADMINISTRADORES
-- =====================================================

