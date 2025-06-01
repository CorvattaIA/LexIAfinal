import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import Typography from '../../ui/Typography';
import { StageNumber } from '../StageNumber';
import { getStageIcon } from '../StageIcon';
import { InfoIcon, ElegantArrowIcon } from '../../icons/ServiceIcons';
import { ServiceStage, ServiceFlowOptions } from '../../../types/service-flow.types';

interface HorizontalCompactViewProps {
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
 * Vista compacta horizontal del flujo de servicio
 */
const HorizontalCompactView: React.FC<HorizontalCompactViewProps> = ({
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
  return (
    <div className="w-full py-6" role="region" aria-label="Flujo de servicio - Vista compacta">
      {/* Título del componente con Typography */}
      <Typography 
        variant="h2" 
        className="mb-8 text-center title-case"
        color="var(--text-primary)"
      >
        {title}
      </Typography>
      
      {/* Contenedor principal con efecto de elevación */}
      <div className="relative flex flex-col md:flex-row md:items-stretch gap-6 md:gap-2 overflow-hidden">
        {stages.map((stage, index) => {
          const isActive = activeStage === stage.id;
          const isCurrentCard = activeStageIndex === index;
          
          return (
            <div key={stage.id} className="relative flex-1 group">
              {/* Línea de conexión entre etapas (visible en dispositivos medianos y grandes) */}
              {index < stages.length - 1 && (
                <div className="hidden md:block absolute -right-3 top-1/2 transform -translate-y-1/2 z-10"
                     aria-hidden="true">
                  <div className="relative">
                    <div className="w-6 h-0.5 bg-[var(--border-accent)]/30"></div>
                    <ElegantArrowIcon className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-2 h-2 text-[var(--border-accent)]" />
                  </div>
                </div>
              )}
              
              {/* Tarjeta para cada etapa con efectos mejorados */}
              <div 
                ref={isCurrentCard ? activeCardRef : null}
                className={`h-full transition-all duration-300 backdrop-blur-sm
                  ${isActive 
                    ? 'bg-gradient-to-br from-[var(--background-accent-subtle)] to-transparent border-l-4 border-l-[var(--border-accent)] shadow-lg shadow-[var(--shadow-color)]/10' 
                    : 'bg-[var(--background-card)] hover:bg-[var(--background-subtle)]'}
                  focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]`}
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
                <Card>
                  <div className="flex flex-col h-full relative overflow-hidden p-4">
                    {/* Efecto de brillo en hover (solo visible cuando no está activo) */}
                    {!isActive && (
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[var(--background-accent-subtle)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true"></div>
                    )}
                    
                    {/* Encabezado de la etapa con número e icono */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex flex-col items-center text-center px-4">
                        <StageNumber 
                          number={stage.number} 
                          isActive={isActive} 
                          visualStyle={options.visualStyle}
                          useAnimations={options.useAdvancedAnimations}
                        />
                        <Typography 
                          variant="subtitle" 
                          className="mt-2 sentence-case"
                          color="var(--text-secondary)"
                        >
                          {stage.shortTitle}
                        </Typography>
                      </div>
                      <div className="ml-auto" aria-hidden="true">
                        {getStageIcon(stage.number, isActive, options.visualStyle)}
                      </div>
                    </div>
                    
                    {/* Título y descripción */}
                    <div className="mb-4">
                      <Typography 
                        variant="h4" 
                        className="mb-2 title-case"
                        color="var(--text-primary)"
                      >
                        {stage.title}
                      </Typography>
                      <Typography 
                        variant="body-small" 
                        className="sentence-case text-[var(--text-secondary)]"
                      >
                        {stage.description}
                      </Typography>
                    </div>
                    
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
                    <div className="mt-auto pt-4 flex flex-col gap-3">
                      <div className="flex justify-between items-center">
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
                          className="w-full justify-center bg-[var(--background-accent)] hover:bg-[var(--background-accent-hover)] text-white shadow-md shadow-[var(--shadow-color)]/20 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
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
            </div>
          );
        })}
      </div>
      
      {/* Botón para alternar a la vista expandida con efectos mejorados */}
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

export default HorizontalCompactView;
