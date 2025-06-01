import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import Typography from '../../ui/Typography';
import { StageNumber } from '../StageNumber';
import { getStageIcon } from '../StageIcon';
import { InfoIcon } from '../../icons/ServiceIcons';
import { ServiceStage, ServiceFlowOptions } from '../../../types/service-flow.types';
import { motion } from 'framer-motion';

interface VerticalCompactViewProps {
  stages: ServiceStage[];
  activeStage: string | null;
  activeStageIndex: number | null;
  setActiveStage: React.Dispatch<React.SetStateAction<string | null>>;
  setActiveStageIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setExpandedView: React.Dispatch<React.SetStateAction<boolean>>;
  handleKeyNavigation: (e: React.KeyboardEvent<HTMLDivElement>, index: number) => void;
  activeCardRef: React.RefObject<HTMLDivElement>;
  containerRef: React.RefObject<HTMLDivElement>;
  title: string;
  options: ServiceFlowOptions;
  onStageSelect?: (stageId: string) => void;
}

/**
 * Vista compacta vertical del flujo de servicio
 */
const VerticalCompactView: React.FC<VerticalCompactViewProps> = ({
  stages,
  activeStage,
  activeStageIndex,
  setActiveStage,
  setActiveStageIndex,
  setExpandedView,
  handleKeyNavigation,
  activeCardRef,
  title,
  options,
  onStageSelect
}) => {
  // Determinar si usar animaciones
  const useAnimations = options.useAdvancedAnimations;
  
  // Variantes de animación para las líneas de conexión
  const lineVariants = {
    hidden: { height: 0 },
    visible: { 
      height: '100%', 
      transition: { 
        duration: 0.8, 
        ease: [0.22, 1, 0.36, 1] 
      } 
    }
  };
  
  return (
    <div className="w-full py-6" role="region" aria-label="Flujo de servicio vertical - Vista compacta">
      {/* Título del componente con Typography */}
      <Typography 
        variant="h2" 
        className="mb-8 text-center title-case"
        color="var(--text-primary)"
      >
        {title}
      </Typography>
      
      {/* Contenedor principal con línea de tiempo vertical */}
      <div className="relative max-w-3xl mx-auto">
        {/* Línea central de la línea de tiempo */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-[var(--border-accent)]/30 z-0" aria-hidden="true">
          {useAnimations && (
            <motion.div 
              className="absolute inset-0 bg-gradient-to-b from-[var(--border-accent)]/50 to-[var(--border-accent)]"
              initial="hidden"
              animate="visible"
              variants={lineVariants}
            />
          )}
        </div>
        
        {/* Etapas del servicio */}
        <div className="relative space-y-8">
          {stages.map((stage, index) => {
            const isActive = activeStage === stage.id;
            const isCurrentCard = activeStageIndex === index;
            
            // Componente a renderizar según si usamos animaciones o no
            const CardComponent = useAnimations ? motion.div : 'div';
            
            // Props de animación si están habilitadas
            const animationProps = useAnimations ? {
              initial: { opacity: 0, x: -20 },
              animate: { 
                opacity: 1, 
                x: 0,
                transition: { 
                  delay: index * 0.1,
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1]
                }
              }
            } : {};
            
            return (
              <CardComponent 
                key={stage.id}
                className="relative flex items-start gap-4"
                {...animationProps}
              >
                {/* Número de etapa */}
                <div className="flex-shrink-0 z-10">
                  <StageNumber 
                    number={stage.number} 
                    isActive={isActive} 
                    visualStyle={options.visualStyle}
                    useAnimations={options.useAdvancedAnimations}
                  />
                </div>
                
                {/* Tarjeta de la etapa */}
                <div 
                  ref={isCurrentCard ? activeCardRef : null}
                  className={`flex-grow transition-all duration-300 transform
                    ${isActive 
                      ? 'scale-[1.02] -translate-y-1 shadow-lg' 
                      : 'hover:scale-[1.01] hover:-translate-y-0.5 hover:shadow-md'}
                    focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:outline-none`}
                  onClick={() => {
                    setActiveStage(isActive ? null : stage.id);
                    setActiveStageIndex(isActive ? null : index);
                    if (onStageSelect && !isActive) onStageSelect(stage.id);
                  }}
                  onKeyDown={(e) => handleKeyNavigation(e, index)}
                  tabIndex={0}
                  role="button"
                  aria-pressed={isActive}
                  aria-label={`Etapa ${stage.number}: ${stage.title}`}
                >
                  <Card 
                    className={`overflow-hidden ${isActive 
                      ? 'border-l-4 border-l-[var(--border-accent)] bg-gradient-to-br from-[var(--background-accent-subtle)]/20 to-transparent' 
                      : 'hover:border-l-4 hover:border-l-[var(--border-accent)]/50'}`}
                  >
                    <div className="p-4">
                      {/* Encabezado con icono */}
                      <div className="flex items-center justify-between mb-3">
                        <Typography 
                          variant="h4" 
                          className="title-case"
                          color="var(--text-primary)"
                        >
                          {stage.shortTitle}
                        </Typography>
                        <div className="ml-auto" aria-hidden="true">
                          {getStageIcon(stage.number, isActive, options.visualStyle)}
                        </div>
                      </div>
                      
                      {/* Descripción */}
                      <Typography 
                        variant="body-small" 
                        className="mb-4 sentence-case text-[var(--text-secondary)]"
                      >
                        {stage.description}
                      </Typography>
                      
                      {/* Características (opcional según configuración) */}
                      {options.showFeaturesInCompactView && stage.features && stage.features.length > 0 && (
                        <div className="mb-4">
                          <Typography 
                            variant="body-small" 
                            weight="medium" 
                            color="var(--text-accent)" 
                            className="mb-2 title-case"
                          >
                            Características:
                          </Typography>
                          <ul className="space-y-1" role="list">
                            {stage.features.slice(0, 2).map((feature, i) => (
                              <li key={i} className="flex items-start gap-1">
                                <span className="text-[var(--text-accent)] flex-shrink-0 mt-1" aria-hidden="true">✓</span>
                                <Typography 
                                  variant="body-small" 
                                  className="sentence-case text-[var(--text-secondary)]"
                                >
                                  {feature}
                                </Typography>
                              </li>
                            ))}
                            {stage.features.length > 2 && (
                              <li>
                                <Typography 
                                  variant="body-small" 
                                  className="text-[var(--text-accent)] italic"
                                >
                                  ...y más
                                </Typography>
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                      
                      {/* Precio y botón de acción */}
                      <div className="mt-auto pt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <Typography 
                            variant="body-small" 
                            className="sentence-case text-[var(--text-secondary)]"
                          >
                            Precio:
                          </Typography>
                          <Typography 
                            variant="body" 
                            weight="bold" 
                            color="var(--text-warning)" 
                            className="drop-shadow-sm"
                          >
                            {stage.price}
                          </Typography>
                        </div>
                        <Link to={stage.linkTo} className="block">
                          <Button 
                            variant="primary" 
                            className="w-full sm:w-auto justify-center bg-[var(--background-accent)] hover:bg-[var(--background-accent-hover)] text-white shadow-md shadow-[var(--shadow-color)]/20 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
                            aria-label={`${stage.buttonText} para ${stage.shortTitle}`}
                          >
                            <Typography 
                              variant="body-small" 
                              weight="medium" 
                              color="white" 
                              as="span"
                              className="sentence-case"
                            >
                              {stage.buttonText}
                            </Typography>
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                </div>
              </CardComponent>
            );
          })}
        </div>
      </div>
      
      {/* Botón para alternar a la vista expandida */}
      <div className="flex justify-center mt-8">
        <button 
          onClick={() => setExpandedView(true)}
          className="flex items-center gap-2 text-sm text-[var(--text-primary)] hover:text-[var(--text-warning)] bg-[var(--background-card)] hover:bg-[var(--background-subtle)] px-5 py-2.5 rounded-full border border-[var(--border-accent)]/30 hover:border-[var(--border-warning)]/50 transition-all duration-300 hover:shadow-md transform hover:-translate-y-0.5 active:translate-y-0 hover:scale-102 focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:outline-none"
          aria-label="Ver detalles completos de todos los servicios"
        >
          <InfoIcon className="w-5 h-5" aria-hidden="true" />
          <Typography 
            variant="body-small" 
            as="span"
            className="sentence-case"
          >
            Ver detalles completos
          </Typography>
        </button>
      </div>
    </div>
  );
};

export default VerticalCompactView;
