import { Show, Inscripto } from '../types';

const SHOWS_KEY = 'sala_orsai_shows';
const INSCRIPTOS_KEY = 'sala_orsai_inscriptos';

// Helper to simulate delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Seed data if empty
const seedData = () => {
  if (!localStorage.getItem(SHOWS_KEY)) {
    const initialShows: Show[] = [
      {
        id: '1',
        titulo: 'Noche de Cuentos',
        descripcion: 'Una velada inolvidable con los mejores narradores de la ciudad.',
        cupo_total: 50,
        cupo_disponible: 45,
        email_subject: 'Confirmación de inscripción – Sala Orsay',
        texto_personalizado_mail: 'Hola {nombre} {apellido},\n\nTe confirmamos tu inscripción para el show "{titulo}".\n\nFecha: Próximamente\nUbicación: Sala Orsai\n\nNo olvides traer tu entrada impresa o en el celular.\n\nSaludos,\nEl equipo de Orsai',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '2',
        titulo: 'Stand Up: Edición Especial',
        descripcion: 'Risas aseguradas con tres comediantes de primer nivel.',
        cupo_total: 30,
        cupo_disponible: 0, // Sold out example
        email_subject: 'Tu lugar para el Stand Up está confirmado',
        texto_personalizado_mail: 'Hola {nombre},\n\n¡Gracias por sumarte a "{titulo}"!\n\nPor favor llega 15 minutos antes para conseguir buen lugar.\n\nTe esperamos,\nSala Orsai',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
    localStorage.setItem(SHOWS_KEY, JSON.stringify(initialShows));
  }
  if (!localStorage.getItem(INSCRIPTOS_KEY)) {
    localStorage.setItem(INSCRIPTOS_KEY, JSON.stringify([]));
  }
};

seedData();

export const db = {
  getShows: async (): Promise<Show[]> => {
    await delay(300);
    const data = localStorage.getItem(SHOWS_KEY);
    return data ? JSON.parse(data) : [];
  },

  getShowById: async (id: string): Promise<Show | undefined> => {
    await delay(100);
    const shows: Show[] = JSON.parse(localStorage.getItem(SHOWS_KEY) || '[]');
    return shows.find((s) => s.id === id);
  },

  saveShow: async (show: Partial<Show>): Promise<Show> => {
    await delay(400);
    const shows: Show[] = JSON.parse(localStorage.getItem(SHOWS_KEY) || '[]');
    
    if (show.id) {
      // Update
      const index = shows.findIndex((s) => s.id === show.id);
      if (index === -1) throw new Error('Show no encontrado');
      
      const oldShow = shows[index];
      // Adjust available quota if total quota changed
      const quotaDiff = (show.cupo_total || oldShow.cupo_total) - oldShow.cupo_total;
      
      const updatedShow: Show = {
        ...oldShow,
        ...show,
        cupo_disponible: oldShow.cupo_disponible + quotaDiff,
        updated_at: new Date().toISOString(),
      };
      
      // Safety check
      if (updatedShow.cupo_disponible < 0) updatedShow.cupo_disponible = 0;
      if (updatedShow.cupo_disponible > updatedShow.cupo_total) updatedShow.cupo_disponible = updatedShow.cupo_total;

      shows[index] = updatedShow;
      localStorage.setItem(SHOWS_KEY, JSON.stringify(shows));
      return updatedShow;
    } else {
      // Create
      const newShow: Show = {
        id: crypto.randomUUID(),
        titulo: show.titulo!,
        descripcion: show.descripcion!,
        cupo_total: show.cupo_total!,
        cupo_disponible: show.cupo_total!, // Starts equal to total
        email_subject: show.email_subject || 'Confirmación de inscripción – Sala Orsay',
        texto_personalizado_mail: show.texto_personalizado_mail || 'Hola {nombre},\n\nTe confirmamos tu inscripción para {titulo}.\n\nSaludos!',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      shows.push(newShow);
      localStorage.setItem(SHOWS_KEY, JSON.stringify(shows));
      return newShow;
    }
  },

  deleteShow: async (id: string): Promise<void> => {
    await delay(400);
    const shows: Show[] = JSON.parse(localStorage.getItem(SHOWS_KEY) || '[]');
    const filteredShows = shows.filter((s) => s.id !== id);
    localStorage.setItem(SHOWS_KEY, JSON.stringify(filteredShows));
  },

  registerUser: async (data: Omit<Inscripto, 'id' | 'created_at' | 'fecha_inscripcion'>): Promise<Inscripto> => {
    await delay(600);
    
    // Server-side validation
    if (!data.email || data.email.trim() === '') {
        throw new Error('El email es obligatorio para completar la inscripción.');
    }
    if (!data.nombre || !data.apellido) {
        throw new Error('Nombre y Apellido son obligatorios.');
    }

    const shows: Show[] = JSON.parse(localStorage.getItem(SHOWS_KEY) || '[]');
    const showIndex = shows.findIndex((s) => s.id === data.show_id);
    
    if (showIndex === -1) throw new Error('El show seleccionado no existe.');
    
    const show = shows[showIndex];
    if (show.cupo_disponible <= 0) {
      throw new Error('Lo sentimos, el cupo para este show está completo.');
    }

    // Decrement quota
    show.cupo_disponible -= 1;
    show.updated_at = new Date().toISOString();
    shows[showIndex] = show;
    localStorage.setItem(SHOWS_KEY, JSON.stringify(shows));

    // Save registration
    const inscriptos: Inscripto[] = JSON.parse(localStorage.getItem(INSCRIPTOS_KEY) || '[]');
    const newInscripto: Inscripto = {
      id: crypto.randomUUID(),
      ...data,
      telefono: data.telefono || '', // Ensure it's stored as empty string if undefined
      fecha_inscripcion: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };
    inscriptos.push(newInscripto);
    localStorage.setItem(INSCRIPTOS_KEY, JSON.stringify(inscriptos));

    return newInscripto;
  },

  getInscriptos: async (): Promise<Inscripto[]> => {
    await delay(300);
    const inscriptos: Inscripto[] = JSON.parse(localStorage.getItem(INSCRIPTOS_KEY) || '[]');
    const shows: Show[] = JSON.parse(localStorage.getItem(SHOWS_KEY) || '[]');
    
    // Join with show title for display
    return inscriptos.map(i => ({
      ...i,
      show_titulo: shows.find(s => s.id === i.show_id)?.titulo || 'Show Eliminado'
    })).sort((a, b) => new Date(b.fecha_inscripcion).getTime() - new Date(a.fecha_inscripcion).getTime());
  }
};