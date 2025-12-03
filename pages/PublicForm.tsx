import React, { useEffect, useState } from 'react';
import { db } from '../services/supabaseDatabase';
import { emailService } from '../services/emailService';
import { Show } from '../types';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { ToastContainer } from '../components/ui/Toast';
import { useToast } from '../hooks/useToast';
import { CheckCircle, Calendar, Users, Clock } from 'lucide-react';

// Formatear hora para mostrar solo HH:MM (sin segundos)
const formatHora = (hora: string): string => {
  if (!hora) return '';
  // Si tiene formato HH:MM:SS, quitar los segundos
  // Si tiene formato HH:MM, dejarlo como está
  return hora.substring(0, 5);
};

export const PublicForm: React.FC = () => {
  const { toasts, toast, dismiss } = useToast();
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    show_id: '',
    cantidad_entradas: 1,
  });

  useEffect(() => {
    loadShows();
  }, []);

  const loadShows = async () => {
    try {
      const data = await db.getShows();
      setShows(data);
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Error cargando los shows disponibles.',
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.show_id) {
      toast({
        title: 'Selecciona un show',
        description: 'Por favor selecciona un show para continuar con la inscripción.',
        variant: 'warning',
      });
      return;
    }
    setSubmitting(true);

    try {
      // 1. Validate and Register in DB
      const inscripto = await db.registerUser({
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        telefono: formData.telefono,
        show_id: formData.show_id,
        cantidad_entradas: formData.cantidad_entradas,
      });

      // 2. Send Confirmation Email
      const selectedShow = shows.find(s => s.id === formData.show_id);
      if (selectedShow) {
        await emailService.sendConfirmation(inscripto, selectedShow);
      }

      setSuccess(true);
    } catch (err: any) {
      const errorMessage = err.message || 'Ocurrió un error al procesar tu inscripción.';
      
      // Detectar si es el error de email duplicado
      if (errorMessage.includes('ya está inscripto') || errorMessage.includes('ya está registrado')) {
        toast({
          title: 'Ya estás inscripto',
          description: 'Este email ya se encuentra registrado para este show.',
          variant: 'warning',
          duration: 6000,
        });
      } else {
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'error',
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-lg shadow-lg text-center border border-green-100">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">¡Inscripción Exitosa!</h2>
        <p className="text-gray-600 mb-6">
          Tu lugar ha sido reservado. Hemos enviado un correo de confirmación a 
          <span className="font-semibold text-gray-800"> {formData.email}</span>.
        </p>
        <Button onClick={() => window.location.reload()} variant="outline">
          Volver al inicio
        </Button>
      </div>
    );
  }

  return (
    <>
      <ToastContainer toasts={toasts} onClose={dismiss} />
      
      <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-4xl mb-4">
            Reservá tus entradas para la Sala Orsai.
          </h1>
          <div className="text-base text-gray-600 space-y-3 max-w-3xl mx-auto">
            <p className="font-medium">
              Invitaciones exclusivas para miembros de Comunidad Orsai.
            </p>
            <p>
              Simplemente completá el formulario. Si ya lo hiciste, llegá 15 minutos antes de la función a la puerta de la Sala Casals en el Paseo La Plaza. Te resultará más cómodo entrar por Montevideo 310.
            </p>
            <p>
              Por favor, reservá solo si estás seguro de que podés venir. <br /> Así le das la oportunidad a otra persona de disfrutar el evento.
            </p>
          </div>
        </div>

        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
          <div className="p-8 sm:p-10">

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Nombre"
                placeholder="Ej. Juan"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
              />
              <Input
                label="Apellido"
                placeholder="Ej. Pérez"
                value={formData.apellido}
                onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Email"
                type="email"
                placeholder="juan@ejemplo.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <Input
                label="Teléfono (opcional)"
                type="tel"
                placeholder="11 1234-5678"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                // Not required
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-900 mb-3">
                ¿Cuántas entradas necesitas? <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, cantidad_entradas: 1 })}
                  className={`flex-1 py-4 px-6 rounded-lg border-2 transition-all font-medium ${
                    formData.cantidad_entradas === 1
                      ? 'bg-orange-50 border-orange-500 text-orange-700 ring-2 ring-orange-500'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-orange-300'
                  }`}
                >
                  <div className="text-2xl font-bold mb-1">1</div>
                  <div className="text-sm">Entrada individual</div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, cantidad_entradas: 2 })}
                  className={`flex-1 py-4 px-6 rounded-lg border-2 transition-all font-medium ${
                    formData.cantidad_entradas === 2
                      ? 'bg-orange-50 border-orange-500 text-orange-700 ring-2 ring-orange-500'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-orange-300'
                  }`}
                >
                  <div className="text-2xl font-bold mb-1">2</div>
                  <div className="text-sm">Con acompañante</div>
                </button>
              </div>
            </div>

            <div className="mt-8">
              <label className="block text-lg font-medium text-gray-900 mb-4">
                Selecciona un Show <span className="text-red-500">*</span>
              </label>
              
              <div className="grid grid-cols-1 gap-4">
                {shows.map((show) => {
                  const isFull = show.cupo_disponible <= 0;
                  const isSelected = formData.show_id === show.id;
                  
                  return (
                    <div
                      key={show.id}
                      onClick={() => !isFull && setFormData({ ...formData, show_id: show.id })}
                      className={`
                        relative flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer
                        ${isFull 
                          ? 'bg-gray-50 border-gray-200 opacity-70 cursor-not-allowed' 
                          : isSelected 
                            ? 'bg-orange-50 border-orange-500 ring-1 ring-orange-500' 
                            : 'bg-white border-gray-200 hover:border-orange-300 hover:shadow-md'
                        }
                      `}
                    >
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-lg font-bold text-gray-900">{show.titulo}</h3>
                          {isFull && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Completo
                            </span>
                          )}
                        </div>
                        <p className="text-gray-500 text-sm mb-3">{show.descripcion}</p>
                        
                        <div className="flex items-center text-xs font-medium text-gray-600 space-x-4 mb-2">
                          {show.fecha_evento && show.hora_evento ? (
                            <>
                              <span className="flex items-center bg-orange-50 px-2 py-1 rounded">
                                <Calendar size={14} className="mr-1 text-orange-600" />
                                {new Date(show.fecha_evento + 'T00:00:00').toLocaleDateString('es-AR', {
                                  weekday: 'short',
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </span>
                              <span className="flex items-center bg-orange-50 px-2 py-1 rounded">
                                <Clock size={14} className="mr-1 text-orange-600" />
                                {formatHora(show.hora_evento)} hs
                              </span>
                            </>
                          ) : (
                            <span className="flex items-center text-gray-400">
                              <Calendar size={14} className="mr-1" />
                              Fecha a confirmar
                            </span>
                          )}
                        </div>
                        
                        {!isFull && (
                           <div className="flex items-center text-xs font-medium text-gray-500">
                             <span className="flex items-center">
                               <Users size={14} className="mr-1" />
                               {show.cupo_disponible} lugares disponibles
                             </span>
                           </div>
                        )}
                      </div>
                      
                      {!isFull && (
                        <div className="mt-4 sm:mt-0 sm:ml-4 flex items-center">
                          <div className={`h-6 w-6 rounded-full border flex items-center justify-center ${isSelected ? 'border-orange-600 bg-orange-600' : 'border-gray-300'}`}>
                            {isSelected && <div className="h-2.5 w-2.5 bg-white rounded-full" />}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-6">
              <Button 
                type="submit" 
                fullWidth 
                className="text-lg py-4 shadow-lg shadow-orange-500/30"
                isLoading={submitting}
                disabled={!formData.show_id}
              >
                Confirmar Inscripción
              </Button>
              <p className="mt-4 text-center text-xs text-gray-400">
                Al confirmar, recibirás un correo con los detalles del evento.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
    </>
  );
};