-- =====================================================
-- AGREGAR FECHA Y HORA A LA TABLA SHOWS
-- =====================================================
-- Ejecuta este SQL en Supabase para agregar los campos
-- de fecha y hora a los eventos existentes
-- =====================================================

-- Agregar columna de fecha del evento
ALTER TABLE shows 
ADD COLUMN IF NOT EXISTS fecha_evento DATE;

-- Agregar columna de hora del evento
ALTER TABLE shows 
ADD COLUMN IF NOT EXISTS hora_evento TIME;

-- Agregar índice para búsquedas por fecha
CREATE INDEX IF NOT EXISTS idx_shows_fecha_evento 
ON shows(fecha_evento);

-- Comentarios descriptivos
COMMENT ON COLUMN shows.fecha_evento IS 'Fecha del evento (YYYY-MM-DD)';
COMMENT ON COLUMN shows.hora_evento IS 'Hora del evento (HH:MM)';

-- =====================================================
-- OPCIONAL: Actualizar shows existentes con fecha ejemplo
-- =====================================================
-- Si quieres asignar una fecha por defecto a los shows existentes:
-- UPDATE shows 
-- SET fecha_evento = CURRENT_DATE + INTERVAL '7 days'
-- WHERE fecha_evento IS NULL;

-- =====================================================
-- VERIFICAR LOS CAMBIOS
-- =====================================================
SELECT 
  id, 
  titulo, 
  fecha_evento, 
  hora_evento,
  cupo_disponible,
  cupo_total
FROM shows
ORDER BY fecha_evento ASC NULLS LAST;

-- =====================================================
-- FIN
-- =====================================================

