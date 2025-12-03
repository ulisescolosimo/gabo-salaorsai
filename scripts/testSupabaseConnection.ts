/**
 * Script para verificar la conexión a Supabase y el estado de las tablas
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://olvpbofiznaewodoldfb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sdnBib2Zpem5hZXdvZG9sZGZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3NzEzNDksImV4cCI6MjA4MDM0NzM0OX0.85p_R_vc6OKw-K5MK-G3HS6IyEf5zQbbn01bRtqRsLU';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log('🔍 Verificando conexión a Supabase...\n');

  try {
    // Test 1: Verificar tabla shows
    console.log('1️⃣ Verificando tabla "shows"...');
    const { data: shows, error: showsError } = await supabase
      .from('shows')
      .select('count');
    
    if (showsError) {
      console.log('   ❌ Error:', showsError.message);
      console.log('   ⚠️  La tabla "shows" no existe. Ejecuta supabase-schema.sql\n');
    } else {
      console.log('   ✅ Tabla "shows" existe\n');
    }

    // Test 2: Verificar tabla inscriptos
    console.log('2️⃣ Verificando tabla "inscriptos"...');
    const { data: inscriptos, error: inscriptosError } = await supabase
      .from('inscriptos')
      .select('count');
    
    if (inscriptosError) {
      console.log('   ❌ Error:', inscriptosError.message);
      console.log('   ⚠️  La tabla "inscriptos" no existe. Ejecuta supabase-schema.sql\n');
    } else {
      console.log('   ✅ Tabla "inscriptos" existe\n');
    }

    // Test 3: Verificar tabla administradores
    console.log('3️⃣ Verificando tabla "administradores"...');
    const { data: admins, error: adminsError } = await supabase
      .from('administradores')
      .select('*');
    
    if (adminsError) {
      console.log('   ❌ Error:', adminsError.message);
      console.log('   ⚠️  La tabla "administradores" no existe. Ejecuta supabase-admin-table.sql\n');
      console.log('   📋 ACCIÓN REQUERIDA:');
      console.log('   1. Ve a: https://olvpbofiznaewodoldfb.supabase.co');
      console.log('   2. SQL Editor → New Query');
      console.log('   3. Copia el contenido de supabase-admin-table.sql');
      console.log('   4. Ejecuta el query\n');
    } else {
      console.log('   ✅ Tabla "administradores" existe');
      console.log(`   📊 Cantidad de administradores: ${admins?.length || 0}`);
      
      if (admins && admins.length > 0) {
        console.log('\n   👥 Administradores encontrados:');
        admins.forEach((admin: any) => {
          console.log(`      - ${admin.email} (${admin.nombre}) - Activo: ${admin.activo}`);
        });
      } else {
        console.log('\n   ⚠️  No hay administradores creados. Ejecuta el SQL de supabase-admin-table.sql');
      }
      console.log('');
    }

    // Test 4: Verificar administrador específico
    console.log('4️⃣ Verificando administrador gabo@orsai.org...');
    const { data: gaboAdmin, error: gaboError } = await supabase
      .from('administradores')
      .select('*')
      .eq('email', 'gabo@orsai.org')
      .single();
    
    if (gaboError) {
      if (gaboError.code === 'PGRST116') {
        console.log('   ❌ El administrador gabo@orsai.org NO existe');
        console.log('   📋 Ejecuta este SQL en Supabase:\n');
        console.log(`INSERT INTO administradores (email, nombre, password_hash, activo)`);
        console.log(`VALUES (`);
        console.log(`  'gabo@orsai.org',`);
        console.log(`  'Gabriel',`);
        console.log(`  '$2b$10$SLMhnOVQKmjh/mZ7iHLluOiO4c/tJb1lReBRkYTJXcaGhAIt3D322',`);
        console.log(`  true`);
        console.log(`);\n`);
      } else {
        console.log('   ❌ Error:', gaboError.message);
      }
    } else {
      console.log('   ✅ Administrador gabo@orsai.org existe!');
      console.log(`   - Nombre: ${gaboAdmin.nombre}`);
      console.log(`   - Activo: ${gaboAdmin.activo}`);
      console.log(`   - Hash de contraseña: ${gaboAdmin.password_hash.substring(0, 20)}...`);
      console.log('');
    }

    console.log('========================================');
    console.log('✅ Diagnóstico completado');
    console.log('========================================\n');

  } catch (error: any) {
    console.error('❌ Error general:', error.message);
  }
}

testConnection();

