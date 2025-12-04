import React, { useEffect, useState } from 'react';
import { db } from '../../services/supabaseDatabase';
import { Show } from '../../types';
import { Button } from '../ui/Button';
import { Input, TextArea } from '../ui/Input';
import { Plus, Edit2, Save, X, Trash2, XCircle, CheckCircle, Mail, Code } from 'lucide-react';

// Template HTML por defecto para nuevos shows
const DEFAULT_EMAIL_TEMPLATE = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Confirmación de inscripción</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>

<body style="margin:0; padding:0; background-color:#f4f4f4; font-family: Arial, Helvetica, sans-serif;">
  <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f4f4f4; padding:20px 0;">
    <tr>
      <td align="center">

        <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="background-color:#ffffff; border-radius:8px; overflow:hidden; border:1px solid #e0e0e0;">

          <tr>
            <td style="padding:20px 30px; background-color:#111111; color:#ffffff; text-align:center;">
              <h1 style="margin:0; font-size:22px; line-height:1.4;">
                Confirmación de inscripción
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding:25px 30px 10px 30px; color:#333333; font-size:15px; line-height:1.6;">
              <p style="margin:0 0 12px 0;">
                Hola <strong>{{NOMBRE_COMPLETO}}</strong>,
              </p>
              <p style="margin:0 0 12px 0;">
                Te confirmamos que tu inscripción para el evento
                <strong>"{{SHOW_TITULO}}"</strong> se registró correctamente.
              </p>
              <p style="margin:0 0 12px 0;">
                A continuación te dejamos los datos del evento y de tu inscripción.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:10px 30px 5px 30px;">
              <h2 style="margin:0 0 8px 0; font-size:18px; color:#111111;">
                Detalles del evento
              </h2>
            </td>
          </tr>

          <tr>
            <td style="padding:0 30px 20px 30px;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="font-size:14px; color:#333333;">
                <tr>
                  <td style="padding:4px 0; width:140px; font-weight:bold;">Título:</td>
                  <td style="padding:4px 0;">{{SHOW_TITULO}}</td>
                </tr>
                <tr>
                  <td style="padding:4px 0; font-weight:bold; vertical-align:top;">Descripción:</td>
                  <td style="padding:4px 0;">{{SHOW_DESCRIPCION}}</td>
                </tr>
                <tr>
                  <td style="padding:4px 0; font-weight:bold;">Fecha y hora:</td>
                  <td style="padding:4px 0;">{{FECHA_EVENTO_FORMATEADA}}</td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:10px 30px 5px 30px;">
              <h2 style="margin:0 0 8px 0; font-size:18px; color:#111111;">
                Tus datos de inscripción
              </h2>
            </td>
          </tr>

          <tr>
            <td style="padding:0 30px 20px 30px;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="font-size:14px; color:#333333;">
                <tr>
                  <td style="padding:4px 0; width:140px; font-weight:bold;">Nombre:</td>
                  <td style="padding:4px 0;">{{NOMBRE_COMPLETO}}</td>
                </tr>
                <tr>
                  <td style="padding:4px 0; font-weight:bold;">Email:</td>
                  <td style="padding:4px 0;">{{EMAIL}}</td>
                </tr>
                <tr>
                  <td style="padding:4px 0; font-weight:bold;">Teléfono:</td>
                  <td style="padding:4px 0;">{{TELEFONO}}</td>
                </tr>
                <tr>
                  <td style="padding:4px 0; font-weight:bold;">Cantidad de entradas:</td>
                  <td style="padding:4px 0;">{{CANTIDAD_ENTRADAS}}</td>
                </tr>
                <tr>
                  <td style="padding:4px 0; font-weight:bold;">Fecha de inscripción:</td>
                  <td style="padding:4px 0;">{{FECHA_INSCRIPCION}}</td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:0 30px 20px 30px; font-size:14px; color:#333333; line-height:1.6;">
              <p style="margin:0 0 12px 0;">
                No es necesario que hagas nada, ni busques las entradas en ningún lado, simplemente vení 15 minutos antes de la función con este mail y presentalo en la puerta.
              </p>
              <p style="margin:0 0 12px 0;">
                Si querés sumar más entradas, todavía quedan algunas disponibles en Plateanet o en la boletería del Paseo La Plaza.
              </p>
              <p style="margin:0 0 12px 0;">
                Ah, y no te olvides: las entradas pagas incluyen consumición de cortesía. 🤓
              </p>
              <p style="margin:0 0 12px 0;">
                Si finalmente no podés venir, avisanos así podemos liberar tu entrada para que alguien más la aproveche.
              </p>
              <p style="margin:0;">
                ¡Nos vemos ahí!<br>
                <strong>Gabo</strong>
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:0 30px 20px 30px; font-size:13px; color:#666666; line-height:1.6;">
              <p style="margin:0 0 10px 0;">
                Si alguno de estos datos no es correcto, por favor respondé a este mail indicando la corrección.
              </p>
              <p style="margin:0;">
                Si no fuiste vos quien realizó esta inscripción, simplemente ignorá este mensaje.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:15px 30px 25px 30px; font-size:13px; color:#999999; text-align:center; border-top:1px solid #eeeeee;">
              <p style="margin:0;">
                ¡Gracias por inscribirte! Nos vemos en "{{SHOW_TITULO}}".
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>`;

export const ShowsManager: React.FC = () => {
  const [shows, setShows] = useState<Show[]>([]);
  const [editingShow, setEditingShow] = useState<Partial<Show> | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);

  useEffect(() => {
    loadShows();
  }, []);

  const loadShows = async () => {
    setLoading(true);
    const data = await db.getShows();
    setShows(data);
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingShow) return;

    try {
      // Asegurar que siempre haya un template antes de guardar
      const showToSave = {
        ...editingShow,
        email_template: editingShow.email_template || DEFAULT_EMAIL_TEMPLATE
      };
      
      await db.saveShow(showToSave);
      setEditingShow(null);
      setShowTemplateEditor(false);
      loadShows();
    } catch (err) {
      alert('Error al guardar');
    }
  };

  const handleCreateNewShow = () => {
    setEditingShow({ email_template: DEFAULT_EMAIL_TEMPLATE });
    setShowTemplateEditor(false);
  };

  const handleEditShow = (show: Show) => {
    // Si el show no tiene template, asignar el por defecto
    const showWithTemplate = {
      ...show,
      email_template: show.email_template || DEFAULT_EMAIL_TEMPLATE
    };
    setEditingShow(showWithTemplate);
    setShowTemplateEditor(false);
  };

  const handleCancelEdit = () => {
    setEditingShow(null);
    setShowTemplateEditor(false);
  };

  const handleDelete = async (id: string, titulo: string) => {
    if (window.confirm(`¿Estás seguro que deseas eliminar el show "${titulo}"?\nEsta acción no se puede deshacer.`)) {
      try {
        await db.deleteShow(id);
        loadShows();
      } catch (err) {
        alert('Error al eliminar el show');
      }
    }
  };

  const handleMarkAsComplete = async (id: string, titulo: string) => {
    if (window.confirm(`¿Marcar "${titulo}" como completo?\nEsto cerrará las inscripciones.`)) {
      try {
        await db.markShowAsComplete(id);
        loadShows();
      } catch (err: any) {
        alert(err.message || 'Error al marcar como completo');
      }
    }
  };

  const handleReopenShow = async (id: string, titulo: string) => {
    if (window.confirm(`¿Reabrir inscripciones para "${titulo}"?`)) {
      try {
        await db.reopenShow(id);
        loadShows();
      } catch (err: any) {
        alert(err.message || 'Error al reabrir el show');
      }
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">Listado de Shows</h3>
        {!editingShow && (
          <Button 
            onClick={handleCreateNewShow} 
            className="flex items-center gap-2"
          >
            <Plus size={16} /> Crear Nuevo Show
          </Button>
        )}
      </div>

      {editingShow ? (
        <form onSubmit={handleSave} className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
          <h4 className="text-md font-bold mb-4">{editingShow.id ? 'Editar Show' : 'Nuevo Show'}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Título"
              value={editingShow.titulo || ''}
              onChange={(e) => setEditingShow({ ...editingShow, titulo: e.target.value })}
              required
            />
            <Input
              label="Cupo Total"
              type="number"
              value={editingShow.cupo_total || ''}
              onChange={(e) => setEditingShow({ ...editingShow, cupo_total: parseInt(e.target.value) || 0 })}
              required
            />
          </div>
          <TextArea
            label="Descripción del evento"
            value={editingShow.descripcion || ''}
            onChange={(e) => setEditingShow({ ...editingShow, descripcion: e.target.value })}
            required
            rows={3}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Input
              label="Fecha del Evento"
              type="date"
              value={editingShow.fecha_evento || ''}
              onChange={(e) => setEditingShow({ ...editingShow, fecha_evento: e.target.value })}
              placeholder="dd/mm/yyyy"
            />
            <Input
              label="Hora del Evento"
              type="time"
              value={editingShow.hora_evento || ''}
              onChange={(e) => setEditingShow({ ...editingShow, hora_evento: e.target.value })}
              placeholder="HH:MM"
            />
          </div>

          {/* Editor de Template de Email */}
          <div className="mt-4 border-t pt-4">
            <div className="flex items-center justify-between mb-3">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Mail size={16} className="mr-2 text-orange-600" />
                Template de Email Personalizado
              </label>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => setShowTemplateEditor(!showTemplateEditor)}
                className="text-sm px-3 py-2"
              >
                <Code size={14} className="mr-1" />
                {showTemplateEditor ? 'Ocultar Editor' : 'Editar Template'}
              </Button>
            </div>

            {showTemplateEditor && (
              <div className="space-y-3">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800">
                  <p className="font-semibold mb-2">Variables disponibles (usar exactamente como se muestra):</p>
                  <div className="grid grid-cols-2 gap-2 font-mono">
                    <div><code className="bg-white px-1 rounded">{'{{NOMBRE_COMPLETO}}'}</code> - Nombre y apellido</div>
                    <div><code className="bg-white px-1 rounded">{'{{EMAIL}}'}</code> - Email del inscripto</div>
                    <div><code className="bg-white px-1 rounded">{'{{TELEFONO}}'}</code> - Teléfono</div>
                    <div><code className="bg-white px-1 rounded">{'{{CANTIDAD_ENTRADAS}}'}</code> - Cantidad de entradas</div>
                    <div><code className="bg-white px-1 rounded">{'{{SHOW_TITULO}}'}</code> - Título del show</div>
                    <div><code className="bg-white px-1 rounded">{'{{SHOW_DESCRIPCION}}'}</code> - Descripción</div>
                    <div><code className="bg-white px-1 rounded">{'{{FECHA_EVENTO_FORMATEADA}}'}</code> - Fecha formateada</div>
                    <div><code className="bg-white px-1 rounded">{'{{FECHA_INSCRIPCION}}'}</code> - Fecha de inscripción</div>
                  </div>
                </div>

                <TextArea
                  label="HTML del Email"
                  value={editingShow.email_template || ''}
                  onChange={(e) => setEditingShow({ ...editingShow, email_template: e.target.value })}
                  rows={12}
                  placeholder="Deja vacío para usar el template por defecto..."
                  className="font-mono text-xs"
                />

                <div className="flex gap-2">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => {
                      if (confirm('¿Deseas restaurar el template por defecto? Esto reemplazará el contenido actual.')) {
                        setEditingShow({ ...editingShow, email_template: DEFAULT_EMAIL_TEMPLATE });
                      }
                    }}
                    className="text-sm px-3 py-2"
                  >
                    Restaurar Template Por Defecto
                  </Button>
                </div>
              </div>
            )}

            {!showTemplateEditor && (
              <p className="text-xs text-gray-500 mt-2">
                {editingShow.email_template === DEFAULT_EMAIL_TEMPLATE
                  ? '📄 Template estándar'
                  : '✓ Template personalizado'}
              </p>
            )}
          </div>
          
          <div className="flex justify-end gap-3 mt-4">
            <Button type="button" variant="secondary" onClick={handleCancelEdit}>
              <X size={16} className="mr-2" /> Cancelar
            </Button>
            <Button type="submit">
              <Save size={16} className="mr-2" /> Guardar Show
            </Button>
          </div>
        </form>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha y Hora</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cupos (Disp / Total)</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {shows.map((show) => (
                <tr key={show.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{show.titulo}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">{show.descripcion}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {show.fecha_evento && show.hora_evento ? (
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">
                          {new Date(show.fecha_evento + 'T00:00:00').toLocaleDateString('es-AR', {
                            weekday: 'short',
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                          })}
                        </div>
                        <div className="text-gray-500">{show.hora_evento} hs</div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400 italic">Sin fecha asignada</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${show.cupo_disponible === 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                      {show.cupo_disponible} / {show.cupo_total}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end items-center gap-2">
                      {show.cupo_disponible > 0 ? (
                        <button 
                          onClick={() => handleMarkAsComplete(show.id, show.titulo)} 
                          className="text-orange-600 hover:text-orange-900 flex items-center px-2 py-1 rounded hover:bg-orange-50 transition-colors"
                          title="Marcar como completo"
                        >
                          <XCircle size={16} className="mr-1" /> Completar
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleReopenShow(show.id, show.titulo)} 
                          className="text-green-600 hover:text-green-900 flex items-center px-2 py-1 rounded hover:bg-green-50 transition-colors"
                          title="Reabrir inscripciones"
                        >
                          <CheckCircle size={16} className="mr-1" /> Reabrir
                        </button>
                      )}
                      <button 
                        onClick={() => handleEditShow(show)} 
                        className="text-indigo-600 hover:text-indigo-900 flex items-center px-2 py-1 rounded hover:bg-indigo-50 transition-colors"
                        title="Editar"
                      >
                        <Edit2 size={16} className="mr-1" /> Editar
                      </button>
                      <button 
                        onClick={() => handleDelete(show.id, show.titulo)} 
                        className="text-red-600 hover:text-red-900 flex items-center px-2 py-1 rounded hover:bg-red-50 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 size={16} className="mr-1" /> Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};