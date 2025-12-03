import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Ticket, LayoutDashboard } from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
               <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-3">
                 SO
               </div>
               <span className="font-bold text-xl text-gray-900 tracking-tight">Sala Orsai</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link 
              to="/" 
              className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${!isAdmin ? 'text-orange-600 bg-orange-50' : 'text-gray-500 hover:text-gray-900'}`}
            >
              <Ticket size={18} />
              <span className="hidden sm:inline">Inscripciones</span>
            </Link>
            <Link 
              to="/admin" 
              className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${isAdmin ? 'text-orange-600 bg-orange-50' : 'text-gray-500 hover:text-gray-900'}`}
            >
              <LayoutDashboard size={18} />
              <span className="hidden sm:inline">Administración</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};