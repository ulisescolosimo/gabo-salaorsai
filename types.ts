
export interface Show {
  id: string;
  titulo: string;
  descripcion: string;
  fecha_evento?: string;  // Fecha del evento (YYYY-MM-DD)
  hora_evento?: string;   // Hora del evento (HH:MM)
  cupo_total: number;
  cupo_disponible: number;
  created_at: string;
  updated_at: string;
}

export interface Inscripto {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  show_id: string;
  show_titulo?: string; // For CSV export convenience
  cantidad_entradas: number; // 1 o 2 entradas
  fecha_inscripcion: string;
  created_at: string;
}

export interface DashboardStats {
  totalShows: number;
  totalInscriptos: number;
  showsCompletos: number;
}

export interface Administrador {
  id: string;
  email: string;
  nombre: string;
  password_hash: string;
  activo: boolean;
  ultimo_acceso?: string;
  created_at: string;
  updated_at: string;
}
