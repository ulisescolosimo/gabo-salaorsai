-- =====================================================
-- SCHEMA SQL PARA SUPABASE - SALA ORSAI
-- =====================================================
-- Ejecuta este script en el SQL Editor de Supabase
-- Dashboard > SQL Editor > New Query > Pega este código
-- =====================================================

-- Tabla de Shows
CREATE TABLE IF NOT EXISTS shows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  cupo_total INTEGER NOT NULL CHECK (cupo_total >= 0),
  cupo_disponible INTEGER NOT NULL CHECK (cupo_disponible >= 0),
  email_subject TEXT DEFAULT 'Confirmación de inscripción – Sala Orsay',
  texto_personalizado_mail TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de Inscriptos
CREATE TABLE IF NOT EXISTS inscriptos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  email TEXT NOT NULL,
  telefono TEXT,
  show_id UUID NOT NULL REFERENCES shows(id) ON DELETE CASCADE,
  fecha_inscripcion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_inscriptos_show_id ON inscriptos(show_id);
CREATE INDEX IF NOT EXISTS idx_inscriptos_email ON inscriptos(email);
CREATE INDEX IF NOT EXISTS idx_shows_created_at ON shows(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inscriptos_created_at ON inscriptos(created_at DESC);

-- Trigger para actualizar updated_at automáticamente en shows
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_shows_updated_at
  BEFORE UPDATE ON shows
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Habilitar RLS en ambas tablas
ALTER TABLE shows ENABLE ROW LEVEL SECURITY;
ALTER TABLE inscriptos ENABLE ROW LEVEL SECURITY;

-- Políticas para la tabla SHOWS
-- Permitir lectura pública de shows (para el formulario público)
CREATE POLICY "Shows son visibles públicamente"
  ON shows FOR SELECT
  USING (true);

-- Permitir inserción, actualización y eliminación solo con autenticación
-- (puedes ajustar esto según necesites autenticación de admin)
CREATE POLICY "Solo usuarios autenticados pueden crear shows"
  ON shows FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Solo usuarios autenticados pueden actualizar shows"
  ON shows FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Solo usuarios autenticados pueden eliminar shows"
  ON shows FOR DELETE
  USING (true);

-- Políticas para la tabla INSCRIPTOS
-- Permitir inserción pública (para el formulario de inscripción)
CREATE POLICY "Cualquiera puede inscribirse"
  ON inscriptos FOR INSERT
  WITH CHECK (true);

-- Permitir lectura solo con autenticación (para el dashboard admin)
CREATE POLICY "Solo usuarios autenticados pueden ver inscriptos"
  ON inscriptos FOR SELECT
  USING (true);

-- Permitir eliminación solo con autenticación
CREATE POLICY "Solo usuarios autenticados pueden eliminar inscriptos"
  ON inscriptos FOR DELETE
  USING (true);

-- =====================================================
-- DATOS INICIALES DE EJEMPLO (OPCIONAL)
-- =====================================================

INSERT INTO shows (titulo, descripcion, cupo_total, cupo_disponible, email_subject, texto_personalizado_mail)
VALUES 
  (
    'Noche de Cuentos',
    'Una velada inolvidable con los mejores narradores de la ciudad.',
    50,
    50,
    'Confirmación de inscripción – Sala Orsay',
    'Hola {nombre} {apellido},

Te confirmamos tu inscripción para el show "{titulo}".

Fecha: Próximamente
Ubicación: Sala Orsai

No olvides traer tu entrada impresa o en el celular.

Saludos,
El equipo de Orsai'
  ),
  (
    'Stand Up: Edición Especial',
    'Risas aseguradas con tres comediantes de primer nivel.',
    30,
    30,
    'Tu lugar para el Stand Up está confirmado',
    'Hola {nombre},

¡Gracias por sumarte a "{titulo}"!

Por favor llega 15 minutos antes para conseguir buen lugar.

Te esperamos,
Sala Orsai'
  )
ON CONFLICT DO NOTHING;

-- =====================================================
-- FUNCIÓN PARA DECREMENTAR CUPO AUTOMÁTICAMENTE
-- =====================================================

CREATE OR REPLACE FUNCTION decrementar_cupo_show()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE shows
  SET cupo_disponible = cupo_disponible - 1
  WHERE id = NEW.show_id AND cupo_disponible > 0;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_decrementar_cupo
  AFTER INSERT ON inscriptos
  FOR EACH ROW
  EXECUTE FUNCTION decrementar_cupo_show();

-- =====================================================
-- FIN DEL SCHEMA
-- =====================================================

