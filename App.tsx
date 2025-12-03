import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { PublicForm } from './pages/PublicForm';
import { AdminDashboard } from './pages/AdminDashboard';
import { Login } from './components/admin/Login';

// Helper component for route protection
const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('isAdmin') === 'true';

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  return isAuthenticated ? <>{children}</> : null;
};

// Layout component to control Navbar visibility if needed, 
// though requirements didn't specify hiding it, usually login page doesn't have nav.
// For simplicity, we keep the main layout structure.
const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Navbar />
            <main className="flex-grow">
                {children}
            </main>
            <footer className="bg-white border-t border-gray-200 mt-auto">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-sm text-gray-500">
                        &copy; {new Date().getFullYear()} Sala Orsai. Todos los derechos reservados.
                    </p>
                </div>
            </footer>
        </div>
    );
};

function App() {
  return (
    <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<PublicForm />} />
            <Route path="/login" element={<Login />} />
            <Route 
                path="/admin" 
                element={
                    <RequireAuth>
                        <AdminDashboard />
                    </RequireAuth>
                } 
            />
          </Routes>
        </MainLayout>
    </Router>
  );
}

export default App;