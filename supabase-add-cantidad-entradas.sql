-- =====================================================
-- AGREGAR CAMPO CANTIDAD_ENTRADAS A INSCRIPTOS
-- =====================================================
-- Permite que cada inscripción reserve 1 o 2 entradas
-- =====================================================

-- Agregar columna cantidad_entradas
ALTER TABLE inscriptos 
ADD COLUMN IF NOT EXISTS cantidad_entradas INTEGER NOT NULL DEFAULT 1
CHECK (cantidad_entradas >= 1 AND cantidad_entradas <= 2);

-- Comentario descriptivo
COMMENT ON COLUMN inscriptos.cantidad_entradas 
IS 'Cantidad de entradas reservadas (1 o 2)';

-- =====================================================
-- ACTUALIZAR TRIGGER PARA DECREMENTAR CUPO CORRECTO
-- =====================================================

-- Reemplazar el trigger existente para considerar cantidad_entradas
CREATE OR REPLACE FUNCTION decrementar_cupo_show()
RETURNS TRIGGER AS $$
BEGIN
  -- Decrementar cupo según la cantidad de entradas solicitadas
  UPDATE shows
  SET cupo_disponible = cupo_disponible - NEW.cantidad_entradas
  WHERE id = NEW.show_id 
    AND cupo_disponible >= NEW.cantidad_entradas;
  
  -- Verificar que se pudo decrementar
  IF NOT FOUND THEN
    RAISE EXCEPTION 'No hay suficiente cupo disponible para % entradas', NEW.cantidad_entradas;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- El trigger ya existe, pero lo recreamos para asegurar
DROP TRIGGER IF EXISTS trigger_decrementar_cupo ON inscriptos;

CREATE TRIGGER trigger_decrementar_cupo
  BEFORE INSERT ON inscriptos
  FOR EACH ROW
  EXECUTE FUNCTION decrementar_cupo_show();

-- =====================================================
-- ACTUALIZAR INSCRIPCIONES EXISTENTES (Si las hay)
-- =====================================================
-- Por defecto, todas las inscripciones existentes tendrán 1 entrada
UPDATE inscriptos 
SET cantidad_entradas = 1 
WHERE cantidad_entradas IS NULL;

-- =====================================================
-- VERIFICAR LOS CAMBIOS
-- =====================================================
SELECT 
  column_name,
  data_type,
  column_default,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'inscriptos' 
  AND column_name = 'cantidad_entradas';

-- Ver algunas inscripciones con la nueva columna
SELECT 
  id,
  nombre,
  apellido,
  email,
  cantidad_entradas,
  fecha_inscripcion
FROM inscriptos
ORDER BY created_at DESC
LIMIT 5;

-- =====================================================
-- FIN
-- =====================================================


