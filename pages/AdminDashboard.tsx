import React, { useState } from 'react';
import { ShowsManager } from '../components/admin/ShowsManager';
import { RegistrationsManager } from '../components/admin/RegistrationsManager';
import { ConfigEditor } from '../components/admin/ConfigEditor';
import { LayoutList, Users, Settings } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'shows' | 'registrations' | 'config'>('shows');

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Panel de Administración
          </h2>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('shows')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2
              ${activeTab === 'shows'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
          >
            <LayoutList size={18} />
            Gestión de Shows
          </button>
          <button
            onClick={() => setActiveTab('registrations')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2
              ${activeTab === 'registrations'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
          >
            <Users size={18} />
            Inscriptos
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2
              ${activeTab === 'config'
                ? 'border-orange-500 text-orange-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
          >
            <Settings size={18} />
            Configuración
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="bg-white shadow rounded-lg p-6">
        {activeTab === 'shows' && <ShowsManager />}
        {activeTab === 'registrations' && <RegistrationsManager />}
        {activeTab === 'config' && <ConfigEditor />}
      </div>
    </div>
  );
};