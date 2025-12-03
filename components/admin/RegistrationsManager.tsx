
import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { db } from '../../services/supabaseDatabase';
import { Inscripto, Show } from '../../types';
import { Button } from '../ui/Button';
import { Download, Filter } from 'lucide-react';

export const RegistrationsManager: React.FC = () => {
  const [inscriptos, setInscriptos] = useState<Inscripto[]>([]);
  const [shows, setShows] = useState<Show[]>([]);
  const [filteredInscriptos, setFilteredInscriptos] = useState<Inscripto[]>([]);
  const [selectedShowFilter, setSelectedShowFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedShowFilter === 'all') {
      setFilteredInscriptos(inscriptos);
    } else {
      setFilteredInscriptos(inscriptos.filter(i => i.show_id === selectedShowFilter));
    }
  }, [selectedShowFilter, inscriptos]);

  const loadData = async () => {
    setLoading(true);
    const [regsData, showsData] = await Promise.all([
      db.getInscriptos(),
      db.getShows()
    ]);
    setInscriptos(regsData);
    setShows(showsData);
    setLoading(false);
  };

  const exportExcel = () => {
    const data = filteredInscriptos.map(i => ({
      Nombre: i.nombre,
      Apellido: i.apellido,
      Email: i.email || '',
      Teléfono: i.telefono || '',
      'Show Elegido': i.show_titulo || 'N/A',
      'Fecha Inscripción': new Date(i.fecha_inscripcion).toLocaleString()
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inscriptos");
    XLSX.writeFile(workbook, "inscriptos_orsai.xlsx");
  };

  if (loading) return <div>Cargando inscriptos...</div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter size={18} className="text-gray-500"/>
            <select
                className="block w-full sm:w-64 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md border"
                value={selectedShowFilter}
                onChange={(e) => setSelectedShowFilter(e.target.value)}
            >
                <option value="all">Todos los Shows</option>
                {shows.map(s => (
                    <option key={s.id} value={s.id}>{s.titulo}</option>
                ))}
            </select>
        </div>
        
        <Button onClick={exportExcel} variant="outline" className="flex items-center gap-2 text-green-700 border-green-200 bg-green-50 hover:bg-green-100">
            <Download size={16} /> Exportar Excel (.xlsx)
        </Button>
      </div>

      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inscripto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contacto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Show</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredInscriptos.length === 0 ? (
                <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                        No hay inscriptos para mostrar.
                    </td>
                </tr>
            ) : (
                filteredInscriptos.map((insc) => (
                    <tr key={insc.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(insc.fecha_inscripcion).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{insc.apellido}, {insc.nombre}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{insc.email}</div>
                        <div className="text-sm text-gray-500">{insc.telefono || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {insc.show_titulo}
                      </td>
                    </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
