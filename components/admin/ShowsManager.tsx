import React, { useEffect, useState } from 'react';
import { db } from '../../services/supabaseDatabase';
import { Show } from '../../types';
import { Button } from '../ui/Button';
import { Input, TextArea } from '../ui/Input';
import { Plus, Edit2, Save, X, Trash2, XCircle, CheckCircle } from 'lucide-react';

export const ShowsManager: React.FC = () => {
  const [shows, setShows] = useState<Show[]>([]);
  const [editingShow, setEditingShow] = useState<Partial<Show> | null>(null);
  const [loading, setLoading] = useState(true);

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
      await db.saveShow(editingShow);
      setEditingShow(null);
      loadShows();
    } catch (err) {
      alert('Error al guardar');
    }
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
          <Button onClick={() => setEditingShow({})} className="flex items-center gap-2">
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
          
          <div className="flex justify-end gap-3 mt-4">
            <Button type="button" variant="secondary" onClick={() => setEditingShow(null)}>
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
                        onClick={() => setEditingShow(show)} 
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