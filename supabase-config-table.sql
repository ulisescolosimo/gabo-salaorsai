-- Tabla para almacenar configuraciones editables de la aplicación
-- Ejecutar en Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insertar configuración inicial con el texto del encabezado (HTML)
INSERT INTO public.config (key, value, description)
VALUES (
  'public_form_header',
  '<h1>Reservá tus entradas para la Sala Orsai.</h1><p><strong>Invitaciones exclusivas para miembros de Comunidad Orsai.</strong></p><p>Simplemente completá el formulario. Si ya lo hiciste, llegá 15 minutos antes de la función a la puerta de la Sala Casals en el Paseo La Plaza. Te resultará más cómodo entrar por Montevideo 310.</p><p><strong>Por favor, reservá solo si estás seguro de que podés venir.</strong></p><p>Así le das la oportunidad a otra persona de disfrutar el evento.</p>',
  'Texto del encabezado del formulario público'
)
ON CONFLICT (key) DO NOTHING;

-- Habilitar Row Level Security
ALTER TABLE public.config ENABLE ROW LEVEL SECURITY;

-- Política: Todos pueden leer las configuraciones
CREATE POLICY "Allow public read access on config"
  ON public.config
  FOR SELECT
  USING (true);

-- Política: Solo administradores pueden actualizar (sin autenticación por ahora)
-- Cuando tengas autenticación de admin, puedes ajustar esta política
CREATE POLICY "Allow admin update on config"
  ON public.config
  FOR UPDATE
  USING (true);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_config_updated_at
  BEFORE UPDATE ON public.config
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

