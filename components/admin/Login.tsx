import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../services/supabaseDatabase';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Lock } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const admin = await db.loginAdmin(email, password);
      
      // Guardar información del admin en localStorage
      localStorage.setItem('isAdmin', 'true');
      localStorage.setItem('adminEmail', admin.email);
      localStorage.setItem('adminNombre', admin.nombre);
      
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-md border border-gray-100">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
             <Lock className="h-6 w-6 text-orange-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Acceso Administrativo
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sala Orsai
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@ejemplo.com"
              disabled={loading}
            />
            <Input
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Ingrese su contraseña"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded border border-red-200">
              {error}
            </div>
          )}

          <div>
            <Button 
              type="submit" 
              fullWidth 
              className="py-3"
              isLoading={loading}
              disabled={loading}
            >
              Ingresar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};