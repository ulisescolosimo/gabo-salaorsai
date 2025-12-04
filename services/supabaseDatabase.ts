import { supabase } from './supabaseClient';
import { Show, Inscripto, Administrador, Config } from '../types';
import bcrypt from 'bcryptjs';

export const db = {
  // ==================== SHOWS ====================
  
  getShows: async (): Promise<Show[]> => {
    const { data, error } = await supabase
      .from('shows')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error al obtener shows:', error);
      throw new Error(`Error al cargar los shows: ${error.message}`);
    }

    return data || [];
  },

  getShowById: async (id: string): Promise<Show | undefined> => {
    const { data, error } = await supabase
      .from('shows')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No se encontró el registro
        return undefined;
      }
      console.error('Error al obtener show:', error);
      throw new Error(`Error al cargar el show: ${error.message}`);
    }

    return data;
  },

  saveShow: async (show: Partial<Show>): Promise<Show> => {
    if (show.id) {
      // Actualizar show existente
      const { data, error } = await supabase
        .from('shows')
        .update({
          titulo: show.titulo,
          descripcion: show.descripcion,
          cupo_total: show.cupo_total,
          fecha_evento: show.fecha_evento || null,
          hora_evento: show.hora_evento || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', show.id)
        .select()
        .single();

      if (error) {
        console.error('Error al actualizar show:', error);
        throw new Error(`Error al actualizar el show: ${error.message}`);
      }

      // Si el cupo total cambió, ajustar el cupo disponible
      if (show.cupo_total !== undefined) {
        const oldShow = await db.getShowById(show.id);
        if (oldShow) {
          const quotaDiff = show.cupo_total - oldShow.cupo_total;
          const newCupoDisponible = Math.max(
            0,
            Math.min(show.cupo_total, oldShow.cupo_disponible + quotaDiff)
          );

          const { data: updatedData, error: updateError } = await supabase
            .from('shows')
            .update({ cupo_disponible: newCupoDisponible })
            .eq('id', show.id)
            .select()
            .single();

          if (updateError) {
            console.error('Error al ajustar cupo disponible:', updateError);
            throw new Error(`Error al ajustar el cupo: ${updateError.message}`);
          }

          return updatedData;
        }
      }

      return data;
    } else {
      // Crear nuevo show
      const newShow = {
        titulo: show.titulo!,
        descripcion: show.descripcion!,
        cupo_total: show.cupo_total!,
        cupo_disponible: show.cupo_total!, // Empieza igual al cupo total
        fecha_evento: show.fecha_evento || null,
        hora_evento: show.hora_evento || null,
      };

      const { data, error } = await supabase
        .from('shows')
        .insert([newShow])
        .select()
        .single();

      if (error) {
        console.error('Error al crear show:', error);
        throw new Error(`Error al crear el show: ${error.message}`);
      }

      return data;
    }
  },

  deleteShow: async (id: string): Promise<void> => {
    const { error } = await supabase.from('shows').delete().eq('id', id);

    if (error) {
      console.error('Error al eliminar show:', error);
      throw new Error(`Error al eliminar el show: ${error.message}`);
    }
  },

  markShowAsComplete: async (id: string): Promise<Show> => {
    const { data, error } = await supabase
      .from('shows')
      .update({
        cupo_disponible: 0,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error al marcar show como completo:', error);
      throw new Error(`Error al marcar el show como completo: ${error.message}`);
    }

    return data;
  },

  reopenShow: async (id: string): Promise<Show> => {
    // Obtener el show actual para saber el cupo total
    const show = await db.getShowById(id);
    if (!show) {
      throw new Error('Show no encontrado');
    }

    // Contar cuántos inscriptos tiene
    const { count, error: countError } = await supabase
      .from('inscriptos')
      .select('*', { count: 'exact', head: true })
      .eq('show_id', id);

    if (countError) {
      console.error('Error al contar inscriptos:', countError);
      throw new Error(`Error al contar inscriptos: ${countError.message}`);
    }

    const inscriptosCount = count || 0;
    const newCupoDisponible = Math.max(0, show.cupo_total - inscriptosCount);

    const { data, error } = await supabase
      .from('shows')
      .update({
        cupo_disponible: newCupoDisponible,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error al reabrir show:', error);
      throw new Error(`Error al reabrir el show: ${error.message}`);
    }

    return data;
  },

  // ==================== INSCRIPTOS ====================

  registerUser: async (
    data: Omit<Inscripto, 'id' | 'created_at' | 'fecha_inscripcion'>
  ): Promise<Inscripto> => {
    // Validación en el cliente
    if (!data.email || data.email.trim() === '') {
      throw new Error('El email es obligatorio para completar la inscripción.');
    }
    if (!data.nombre || !data.apellido) {
      throw new Error('Nombre y Apellido son obligatorios.');
    }

    // Validar cantidad de entradas
    const cantidadEntradas = data.cantidad_entradas || 1;
    if (cantidadEntradas < 1 || cantidadEntradas > 2) {
      throw new Error('Debes seleccionar entre 1 y 2 entradas.');
    }

    // Verificar que el show existe y tiene cupo disponible
    const show = await db.getShowById(data.show_id);
    if (!show) {
      throw new Error('El show seleccionado no existe.');
    }
    if (show.cupo_disponible <= 0) {
      throw new Error('Lo sentimos, el cupo para este show está completo.');
    }
    if (show.cupo_disponible < cantidadEntradas) {
      throw new Error(
        `Solo quedan ${show.cupo_disponible} lugar${show.cupo_disponible === 1 ? '' : 'es'} disponible${show.cupo_disponible === 1 ? '' : 's'}. Por favor selecciona ${show.cupo_disponible === 1 ? '1 entrada' : show.cupo_disponible + ' entradas'}.`
      );
    }

    // Verificar que el email no esté ya inscripto en este show
    const { data: existingInscripcion, error: checkError } = await supabase
      .from('inscriptos')
      .select('id')
      .eq('email', data.email.toLowerCase().trim())
      .eq('show_id', data.show_id)
      .single();

    if (existingInscripcion) {
      throw new Error('Este email ya está inscripto en este show');
    }
    
    // Si hay error pero no es "not found", lanzar el error
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error al verificar inscripción existente:', checkError);
      throw new Error('Error al verificar la inscripción.');
    }

    // Crear la inscripción
    const newInscripto = {
      nombre: data.nombre,
      apellido: data.apellido,
      email: data.email,
      telefono: data.telefono || '',
      show_id: data.show_id,
      cantidad_entradas: cantidadEntradas,
      fecha_inscripcion: new Date().toISOString(),
    };

    const { data: inscriptoData, error } = await supabase
      .from('inscriptos')
      .insert([newInscripto])
      .select()
      .single();

    if (error) {
      console.error('Error al registrar usuario:', error);
      throw new Error(`Error al registrar la inscripción: ${error.message}`);
    }

    // El trigger en Supabase ya decrementa el cupo automáticamente
    // No necesitamos hacerlo manualmente aquí

    return inscriptoData;
  },

  getInscriptos: async (): Promise<Inscripto[]> => {
    const { data, error } = await supabase
      .from('inscriptos')
      .select(
        `
        *,
        shows (
          titulo
        )
      `
      )
      .order('fecha_inscripcion', { ascending: false });

    if (error) {
      console.error('Error al obtener inscriptos:', error);
      throw new Error(`Error al cargar las inscripciones: ${error.message}`);
    }

    // Mapear los datos para incluir show_titulo
    return (
      data?.map((inscripto: any) => ({
        id: inscripto.id,
        nombre: inscripto.nombre,
        apellido: inscripto.apellido,
        email: inscripto.email,
        telefono: inscripto.telefono,
        show_id: inscripto.show_id,
        show_titulo: inscripto.shows?.titulo || 'Show Eliminado',
        cantidad_entradas: inscripto.cantidad_entradas,
        fecha_inscripcion: inscripto.fecha_inscripcion,
        created_at: inscripto.created_at,
      })) || []
    );
  },

  // ==================== ADMINISTRADORES ====================

  loginAdmin: async (email: string, password: string): Promise<Administrador> => {
    // Buscar administrador por email
    const { data: admin, error } = await supabase
      .from('administradores')
      .select('*')
      .eq('email', email)
      .eq('activo', true)
      .single();

    if (error || !admin) {
      throw new Error('Credenciales incorrectas');
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, admin.password_hash);
    
    if (!isPasswordValid) {
      throw new Error('Credenciales incorrectas');
    }

    // Actualizar último acceso
    await supabase
      .from('administradores')
      .update({ ultimo_acceso: new Date().toISOString() })
      .eq('id', admin.id);

    return admin;
  },

  getAdminByEmail: async (email: string): Promise<Administrador | undefined> => {
    const { data, error } = await supabase
      .from('administradores')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return undefined;
      }
      console.error('Error al obtener administrador:', error);
      throw new Error(`Error al buscar administrador: ${error.message}`);
    }

    return data;
  },

  // ==================== CONFIGURACIONES ====================

  getConfig: async (key: string): Promise<Config | undefined> => {
    const { data, error } = await supabase
      .from('config')
      .select('*')
      .eq('key', key)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return undefined;
      }
      console.error('Error al obtener configuración:', error);
      throw new Error(`Error al cargar la configuración: ${error.message}`);
    }

    return data;
  },

  updateConfig: async (key: string, value: string): Promise<Config> => {
    const { data, error } = await supabase
      .from('config')
      .update({ value })
      .eq('key', key)
      .select()
      .single();

    if (error) {
      console.error('Error al actualizar configuración:', error);
      throw new Error(`Error al actualizar la configuración: ${error.message}`);
    }

    return data;
  },

  getAllConfigs: async (): Promise<Config[]> => {
    const { data, error } = await supabase
      .from('config')
      .select('*')
      .order('key', { ascending: true });

    if (error) {
      console.error('Error al obtener configuraciones:', error);
      throw new Error(`Error al cargar las configuraciones: ${error.message}`);
    }

    return data || [];
  },
};

