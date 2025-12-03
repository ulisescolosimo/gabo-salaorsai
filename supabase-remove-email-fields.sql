-- =====================================================
-- ELIMINAR CAMPOS DE EMAIL DE LA TABLA SHOWS
-- =====================================================
-- El contenido de los emails ahora se maneja en n8n
-- Ejecuta este SQL para limpiar la base de datos
-- =====================================================

-- Eliminar columna de asunto del email
ALTER TABLE shows 
DROP COLUMN IF EXISTS email_subject;

-- Eliminar columna de cuerpo del email
ALTER TABLE shows 
DROP COLUMN IF EXISTS texto_personalizado_mail;

-- =====================================================
-- VERIFICAR LOS CAMBIOS
-- =====================================================
SELECT 
  column_name,
  data_type
FROM information_schema.columns
WHERE table_name = 'shows'
ORDER BY ordinal_position;

-- =====================================================
-- FIN
-- =====================================================

