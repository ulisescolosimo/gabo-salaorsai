/**
 * Script para crear el usuario administrador inicial en Supabase
 * 
 * Uso:
 * 1. Asegúrate de tener las variables de entorno configuradas en .env.local
 * 2. Ejecuta: npx tsx scripts/createAdminUser.ts
 */

import bcrypt from 'bcryptjs';

const EMAIL = 'gabo@orsai.org';
const PASSWORD = 'fca702db776bb8a47966006e0649cd01';
const NOMBRE = 'Gabriel';

async function createAdmin() {
  console.log('🔐 Generando hash de contraseña...');
  
  // Hashear la contraseña
  const passwordHash = await bcrypt.hash(PASSWORD, 10);
  
  console.log('\n✅ Contraseña hasheada exitosamente!\n');
  console.log('========================================');
  console.log('📋 INFORMACIÓN DEL ADMINISTRADOR INICIAL');
  console.log('========================================');
  console.log(`Email:      ${EMAIL}`);
  console.log(`Contraseña: ${PASSWORD}`);
  console.log(`Nombre:     ${NOMBRE}`);
  console.log('========================================\n');
  
  console.log('🗄️  Ejecuta este SQL en Supabase:\n');
  console.log('-- Crear administrador inicial');
  console.log(`INSERT INTO administradores (email, nombre, password_hash, activo)`);
  console.log(`VALUES (`);
  console.log(`  '${EMAIL}',`);
  console.log(`  '${NOMBRE}',`);
  console.log(`  '${passwordHash}',`);
  console.log(`  true`);
  console.log(`)`);
  console.log(`ON CONFLICT (email) DO UPDATE`);
  console.log(`SET password_hash = EXCLUDED.password_hash;`);
  console.log('\n========================================\n');
  
  console.log('⚠️  IMPORTANTE: Guarda estas credenciales en un lugar seguro!\n');
}

createAdmin().catch(console.error);

