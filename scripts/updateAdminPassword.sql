-- =====================================================
-- ACTUALIZAR CONTRASEÑA DEL ADMINISTRADOR
-- =====================================================
-- Ejecuta este SQL en Supabase para actualizar el hash de contraseña
--
-- Email:      gabo@orsai.org
-- Contraseña: fca702db776bb8a47966006e0649cd01
-- =====================================================

UPDATE administradores
SET password_hash = '$2b$10$SLMhnOVQKmjh/mZ7iHLluOiO4c/tJb1lReBRkYTJXcaGhAIt3D322',
    updated_at = NOW()
WHERE email = 'gabo@orsai.org';

-- Verificar que se actualizó correctamente
SELECT email, nombre, activo, 
       substring(password_hash, 1, 20) as hash_preview,
       updated_at
FROM administradores
WHERE email = 'gabo@orsai.org';

