import React, { useState } from 'react';
import Typography from '../ui/Typography';
import Button from '../ui/Button';

interface ErrorFallbackProps {
  /** El error capturado */
  error: Error;
  /** Función para reiniciar el estado de error */
  resetError: () => void;
  /** Texto personalizado para el botón de reintentar */
  resetButtonText?: string;
  /** Si se deben mostrar detalles técnicos del error */
  showDetails?: boolean;
}

/**
 * Componente que muestra una interfaz amigable cuando ocurre un error
 */
const ErrorFallback: React.FC<ErrorFallbackProps> = ({ 
  error, 
  resetError, 
  resetButtonText = "Reintentar", 
  showDetails = false 
}) => {
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  
  return (
    <div 
      className="p-6 rounded-lg bg-[var(--background-card)] border border-[var(--border-danger)]/30 shadow-lg max-w-2xl mx-auto my-8"
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[var(--background-danger)]/10 flex items-center justify-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="w-6 h-6 text-[var(--text-danger)]" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            aria-hidden="true"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
            />
          </svg>
        </div>
        <Typography 
          variant="h3" 
          color="var(--text-danger)" 
          className="title-case"
        >
          Ha ocurrido un error
        </Typography>
      </div>
      
      <div className="mb-6">
        <Typography 
          variant="body" 
          className="mb-4 text-[var(--text-secondary)]"
        >
          Lo sentimos, ha ocurrido un problema al cargar este componente. Nuestro equipo ha sido notificado y estamos trabajando para resolverlo.
        </Typography>
        
        <Typography 
          variant="body-small" 
          className="text-[var(--text-danger)]"
        >
          Error: {error.message}
        </Typography>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <Button 
          variant="primary" 
          onClick={resetError}
          className="bg-[var(--background-accent)] hover:bg-[var(--background-accent-hover)] text-white shadow-md transition-all duration-300"
          aria-label={resetButtonText}
        >
          <Typography 
            variant="body-small" 
            weight="medium" 
            color="white" 
            as="span"
          >
            {resetButtonText}
          </Typography>
        </Button>
        
        {showDetails && (
          <Button 
            variant="secondary" 
            onClick={() => setIsDetailsVisible(!isDetailsVisible)}
            className="border border-[var(--border-accent)]/30 hover:border-[var(--border-accent)] transition-all duration-300"
            aria-expanded={isDetailsVisible}
            aria-controls="error-details"
          >
            <Typography 
              variant="body-small" 
              weight="medium" 
              as="span"
            >
              {isDetailsVisible ? "Ocultar detalles" : "Mostrar detalles"}
            </Typography>
          </Button>
        )}
      </div>
      
      {showDetails && isDetailsVisible && (
        <div 
          id="error-details"
          className="mt-4 p-4 bg-[var(--background-subtle)] rounded border border-[var(--border-accent)]/20 overflow-auto max-h-60"
        >
          <Typography 
            variant="code" 
            className="text-xs whitespace-pre-wrap text-[var(--text-secondary)]"
          >
            {error.stack || error.toString()}
          </Typography>
        </div>
      )}
    </div>
  );
};

export default ErrorFallback;
