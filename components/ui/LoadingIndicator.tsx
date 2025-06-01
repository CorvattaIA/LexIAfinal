import React from 'react';

interface LoadingIndicatorProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  text?: string;
}

/**
 * Componente para mostrar un indicador de carga
 */
const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ 
  size = 'medium', 
  color = 'var(--text-accent)', 
  text = 'Cargando...' 
}) => {
  // Tamaños para el spinner
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };
  
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-t-transparent`} style={{ borderColor: `${color} transparent transparent transparent` }}></div>
      {text && (
        <p className="mt-2 text-sm text-[var(--text-secondary)]">{text}</p>
      )}
    </div>
  );
};

export default LoadingIndicator;
