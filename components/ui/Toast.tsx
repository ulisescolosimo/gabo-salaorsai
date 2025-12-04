import React, { useEffect, useState } from 'react';
import { X, AlertCircle, CheckCircle, Info } from 'lucide-react';

export interface ToastProps {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'success' | 'error' | 'warning';
  duration?: number;
  onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({
  id,
  title,
  description,
  variant = 'default',
  duration = 5000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animación de entrada
    setTimeout(() => setIsVisible(true), 10);

    // Auto-cerrar después de la duración
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(id), 300); // Esperar a que termine la animación
  };

  const variants = {
    default: {
      container: 'bg-white border-gray-200',
      icon: <Info className="h-5 w-5 text-blue-600" />,
      title: 'text-gray-900',
      description: 'text-gray-600',
    },
    success: {
      container: 'bg-white border-green-200',
      icon: <CheckCircle className="h-5 w-5 text-green-600" />,
      title: 'text-gray-900',
      description: 'text-gray-600',
    },
    error: {
      container: 'bg-white border-red-200',
      icon: <AlertCircle className="h-5 w-5 text-red-600" />,
      title: 'text-gray-900',
      description: 'text-gray-600',
    },
    warning: {
      container: 'bg-white border-orange-200',
      icon: <AlertCircle className="h-5 w-5 text-orange-600" />,
      title: 'text-gray-900',
      description: 'text-gray-600',
    },
  };

  const style = variants[variant];

  return (
    <div
      className={`
        pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg border shadow-lg
        transition-all duration-300 ease-in-out
        ${style.container}
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">{style.icon}</div>
          <div className="ml-3 w-0 flex-1">
            {title && (
              <p className={`text-sm font-semibold ${style.title}`}>
                {title}
              </p>
            )}
            {description && (
              <p className={`mt-1 text-sm ${style.description}`}>
                {description}
              </p>
            )}
          </div>
          <div className="ml-4 flex flex-shrink-0">
            <button
              onClick={handleClose}
              className="inline-flex rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              <span className="sr-only">Cerrar</span>
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ToastContainerProps {
  toasts: Omit<ToastProps, 'onClose'>[];
  onClose: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
  return (
    <div
      aria-live="assertive"
      className="pointer-events-none fixed inset-0 z-50 flex flex-col items-end justify-end px-4 py-6 sm:items-end sm:justify-start sm:p-6"
    >
      <div className="flex w-full flex-col items-end space-y-4">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onClose={onClose} />
        ))}
      </div>
    </div>
  );
};



