import React, { useState, useRef, useEffect, KeyboardEvent, lazy, Suspense } from 'react';
import { ServiceFlowProps, ServiceFlowOptions } from '../../types/service-flow.types';
import { StageNumber } from './StageNumber';
import { getStageIcon } from './StageIcon';
import LoadingIndicator from '../ui/LoadingIndicator';

// Valores por defecto para las opciones
const defaultOptions: ServiceFlowOptions = {
  orientation: 'horizontal',
  defaultExpanded: false,
  showFeaturesInCompactView: false,
  useAdvancedAnimations: true,
  visualStyle: 'modern'
};

// Carga diferida de las vistas para mejor rendimiento
const HorizontalCompactView = lazy(() => import('./views/HorizontalCompactView'));
const HorizontalExpandedView = lazy(() => import('./views/HorizontalExpandedView'));
const VerticalCompactView = lazy(() => import('./views/VerticalCompactView'));
const VerticalExpandedView = lazy(() => import('./views/VerticalExpandedView'));

/**
 * Componente unificado para mostrar el flujo de servicio
 * Soporta orientación horizontal o vertical y vistas compactas o expandidas
 */
const ServiceFlow: React.FC<ServiceFlowProps> = ({ 
  stages, 
  options = {}, 
  title = "Nuestro flujo de servicio",
  onStageSelect 
}) => {
  // Combinar opciones por defecto con las proporcionadas
  const mergedOptions: ServiceFlowOptions = { ...defaultOptions, ...options };
  
  // Estado para alternar entre vista compacta y expandida
  const [expandedView, setExpandedView] = useState(mergedOptions.defaultExpanded || false);
  
  // Estado para la etapa activa
  const [activeStage, setActiveStage] = useState<string | null>(null);
  const [activeStageIndex, setActiveStageIndex] = useState<number | null>(null);
  
  // Referencias para manejo de foco y navegación por teclado
  const containerRef = useRef<HTMLDivElement>(null);
  const activeCardRef = useRef<HTMLDivElement>(null);
  
  // Efecto para manejar el foco cuando cambia el índice activo
  useEffect(() => {
    if (activeStageIndex !== null && activeCardRef.current) {
      activeCardRef.current.focus();
    }
  }, [activeStageIndex]);
  
  // Función para manejar navegación por teclado entre etapas
  const handleKeyNavigation = (e: KeyboardEvent<HTMLDivElement>, index: number) => {
    if (e.key === 'ArrowRight' || (mergedOptions.orientation === 'vertical' && e.key === 'ArrowDown')) {
      e.preventDefault();
      const nextIndex = Math.min(index + 1, stages.length - 1);
      setActiveStageIndex(nextIndex);
      setActiveStage(stages[nextIndex].id);
      if (onStageSelect) onStageSelect(stages[nextIndex].id);
    } else if (e.key === 'ArrowLeft' || (mergedOptions.orientation === 'vertical' && e.key === 'ArrowUp')) {
      e.preventDefault();
      const prevIndex = Math.max(index - 1, 0);
      setActiveStageIndex(prevIndex);
      setActiveStage(stages[prevIndex].id);
      if (onStageSelect) onStageSelect(stages[prevIndex].id);
    }
  };
  
  // Renderizar la vista apropiada según las opciones
  const renderView = () => {
    const viewProps = {
      stages,
      activeStage,
      activeStageIndex,
      setActiveStage,
      setActiveStageIndex,
      setExpandedView,
      handleKeyNavigation,
      activeCardRef,
      containerRef,
      title,
      options: mergedOptions,
      onStageSelect
    };
    
    return (
      <Suspense fallback={<LoadingIndicator />}>
        {expandedView ? (
          mergedOptions.orientation === 'horizontal' ? (
            <HorizontalExpandedView {...viewProps} />
          ) : (
            <VerticalExpandedView {...viewProps} />
          )
        ) : (
          mergedOptions.orientation === 'horizontal' ? (
            <HorizontalCompactView {...viewProps} />
          ) : (
            <VerticalCompactView {...viewProps} />
          )
        )}
      </Suspense>
    );
  };
  
  return (
    <div 
      ref={containerRef}
      className={`service-flow-container ${mergedOptions.className || ''}`}
      data-orientation={mergedOptions.orientation}
      data-view-mode={expandedView ? 'expanded' : 'compact'}
      data-visual-style={mergedOptions.visualStyle}
    >
      {renderView()}
    </div>
  );
};

export default ServiceFlow;
export { StageNumber, getStageIcon };
