import React, { Component, ErrorInfo, ReactNode } from 'react';
import ErrorFallback from './ErrorFallback';

interface ErrorBoundaryProps {
  /** Componente hijo que será protegido por el ErrorBoundary */
  children: ReactNode;
  /** Componente personalizado a mostrar cuando ocurre un error */
  FallbackComponent?: React.ComponentType<{ error: Error; resetError: () => void }>;
  /** Función a ejecutar cuando ocurre un error */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /** Texto del botón para reintentar */
  resetButtonText?: string;
  /** Si se debe mostrar detalles técnicos del error */
  showDetails?: boolean;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Componente que captura errores en sus componentes hijos
 * y muestra una interfaz de recuperación amigable
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Actualizar el estado para mostrar la UI de fallback
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Registrar el error para análisis
    console.error('Error capturado por ErrorBoundary:', error, errorInfo);
    
    // Ejecutar callback de error si existe
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    
    // Aquí se podría enviar el error a un servicio de monitoreo
    // como Sentry, LogRocket, etc.
  }

  resetError = (): void => {
    this.setState({
      hasError: false,
      error: null
    });
  }

  render(): ReactNode {
    const { hasError, error } = this.state;
    const { children, FallbackComponent, resetButtonText, showDetails } = this.props;

    if (hasError && error) {
      // Usar el componente de fallback personalizado si se proporciona
      if (FallbackComponent) {
        return <FallbackComponent error={error} resetError={this.resetError} />;
      }
      
      // De lo contrario, usar el componente de fallback predeterminado
      return (
        <ErrorFallback 
          error={error} 
          resetError={this.resetError} 
          resetButtonText={resetButtonText}
          showDetails={showDetails}
        />
      );
    }

    // Si no hay error, renderizar los hijos normalmente
    return children;
  }
}

export default ErrorBoundary;
