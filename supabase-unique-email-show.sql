-- =====================================================
-- CONSTRAINT UNIQUE PARA EMAIL + SHOW
-- =====================================================
-- Evita que un mismo email se inscriba dos veces al mismo show
-- Ejecuta este SQL en Supabase
-- =====================================================

-- Crear índice único para la combinación de email y show_id
-- Esto garantiza a nivel de base de datos que no haya duplicados
CREATE UNIQUE INDEX IF NOT EXISTS idx_inscriptos_email_show_unique 
ON inscriptos(lower(email), show_id);

-- Comentario descriptivo
COMMENT ON INDEX idx_inscriptos_email_show_unique 
IS 'Evita que un mismo email se inscriba dos veces al mismo show (case insensitive)';

-- =====================================================
-- VERIFICAR QUE FUNCIONA
-- =====================================================

-- Este query debería devolver el índice creado
SELECT 
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'inscriptos' 
  AND indexname = 'idx_inscriptos_email_show_unique';

-- =====================================================
-- OPCIONAL: Limpiar duplicados existentes (si hay)
-- =====================================================
-- Ejecuta esto SOLO si ya tienes inscripciones duplicadas
-- y quieres mantener solo la primera inscripción de cada email por show

/*
DELETE FROM inscriptos
WHERE id IN (
  SELECT id
  FROM (
    SELECT 
      id,
      ROW_NUMBER() OVER (
        PARTITION BY lower(email), show_id 
        ORDER BY created_at ASC
      ) as row_num
    FROM inscriptos
  ) t
  WHERE row_num > 1
);
*/

-- =====================================================
-- FIN
-- =====================================================

