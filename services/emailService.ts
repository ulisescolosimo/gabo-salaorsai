import { Inscripto, Show } from '../types';

// Webhook de n8n para envío de emails
const N8N_WEBHOOK_URL = 'https://orsai.app.n8n.cloud/webhook/2ef6c45f-ef60-456b-b1c5-e8d8a7249193';

// Formatear fecha del evento para n8n
const formatFechaEvento = (show: Show): string => {
  if (!show.fecha_evento) return 'A confirmar';
  
  const fecha = new Date(show.fecha_evento + 'T00:00:00');
  let fechaFormateada = fecha.toLocaleDateString('es-AR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
  
  if (show.hora_evento) {
    fechaFormateada += ` a las ${show.hora_evento} hs`;
  }
  
  return fechaFormateada;
};

export const emailService = {
  sendConfirmation: async (inscripto: Inscripto, show: Show) => {
    try {
      // Enviar todos los datos crudos al webhook de n8n
      // n8n se encargará de crear el template y enviar el email
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Datos del inscripto
          inscripto: {
            nombre: inscripto.nombre,
            apellido: inscripto.apellido,
            email: inscripto.email,
            telefono: inscripto.telefono || '',
            cantidad_entradas: inscripto.cantidad_entradas,
            fecha_inscripcion: inscripto.fecha_inscripcion,
          },
          // Datos del show
          show: {
            titulo: show.titulo,
            descripcion: show.descripcion,
            fecha_evento: show.fecha_evento || null,
            hora_evento: show.hora_evento || null,
            fecha_evento_formateada: formatFechaEvento(show),
            // Enviar el template personalizado si existe
            email_template: show.email_template || null,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Error al enviar al webhook: ${response.status} ${response.statusText}`);
      }

      console.log('✅ Datos enviados a n8n exitosamente');
      return true;
    } catch (error: any) {
      console.error('❌ Error al llamar al webhook n8n:', error.message);
      
      // En desarrollo, no fallar si el webhook no responde
      if (import.meta.env.DEV) {
        console.warn('⚠️  Continuando sin enviar notificación (modo desarrollo)');
        return true;
      }
      
      throw new Error(`Error al enviar confirmación: ${error.message}`);
    }
  },
};
