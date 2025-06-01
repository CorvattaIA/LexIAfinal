import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import Typography from '../../ui/Typography';
import { InfoIcon } from '../../icons/ServiceIcons';
import { ServiceStage, ServiceFlowOptions } from '../../../types/service-flow.types';
import { motion } from 'framer-motion';

interface HorizontalExpandedViewProps {
  stages: ServiceStage[];
  setExpandedView: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  options: ServiceFlowOptions;
  onStageSelect?: (stageId: string) => void;
}

/**
 * Vista expandida horizontal del flujo de servicio
 */
const HorizontalExpandedView: React.FC<HorizontalExpandedViewProps> = ({
  stages,
  setExpandedView,
  title,
  options,
  onStageSelect
}) => {
  // Variantes de animación para los elementos si están habilitadas
  const useAnimations = options.useAdvancedAnimations;
  
  // Variantes de animación para las tarjetas
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    })
  };
  
  return (
    <div className="w-full py-6" role="region" aria-label="Flujo de servicio - Vista detallada">
      {/* Título del componente con Typography */}
      <Typography 
        variant="h2" 
        className="mb-8 text-center title-case"
        color="var(--text-primary)"
      >
        {title}
      </Typography>
      
      {/* Fondo decorativo con gradiente sutil */}
      {options.visualStyle === 'modern' ? (
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--background)] via-[var(--background)] to-[var(--background-subtle)] opacity-50 -z-10"
             aria-hidden="true"></div>
      ) : (
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute top-1/4 right-0 w-80 h-80 bg-[var(--background-accent)]/5 rounded-full blur-3xl animate-breathe"></div>
          <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-[var(--text-warning)]/5 rounded-full blur-3xl animate-float" style={{animationDelay: '1.5s'}}></div>
        </div>
      )}
      
      {/* Grid de tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {stages.map((stage, index) => {
          // Componente a renderizar según si usamos animaciones o no
          const CardComponent = useAnimations ? motion.div : 'div';
          
          // Props de animación si están habilitadas
          const animationProps = useAnimations ? {
            custom: index,
            initial: "hidden",
            animate: "visible",
            variants: cardVariants,
            className: "h-full"
          } : { className: "h-full" };
          
          return (
            <CardComponent 
              key={stage.id}
              {...animationProps}
              onClick={() => onStageSelect && onStageSelect(stage.id)}
            >
              <Card 
                className={`h-full overflow-hidden border-t-4 shadow-lg hover:shadow-xl 
                  transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.01]`}
                style={{ borderTopColor: stage.color }}
              >
                <div className="p-5 bg-[var(--background-subtle)]/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--background-accent)]/10 text-[var(--text-accent)]">
                        <span className="font-bold">{stage.number}</span>
                      </div>
                      <Typography 
                        variant="h4" 
                        className="title-case"
                        color="var(--text-primary)"
                      >
                        {stage.shortTitle}
                      </Typography>
                    </div>
                  </div>
                </div>
                
                <div className="p-5">
                  <Typography 
                    variant="h3" 
                    className="mb-4 title-case"
                    color="var(--text-primary)"
                  >
                    {stage.title}
                  </Typography>
                  
                  <Typography 
                    variant="body" 
                    className="mb-6 sentence-case text-[var(--text-secondary)]"
                  >
                    {stage.description}
                  </Typography>
                </div>
                
                {/* Features */}
                <div className="p-5 border-t border-b border-[var(--border-accent)]/20">
                  <Typography 
                    variant="body-small" 
                    weight="medium" 
                    color="var(--text-accent)" 
                    className="mb-3 title-case"
                  >
                    Características:
                  </Typography>
                  <ul className="space-y-2" role="list">
                    {stage.features?.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[var(--text-accent)] flex-shrink-0 mt-1" aria-hidden="true">✓</span>
                        <Typography 
                          variant="body-small" 
                          className="sentence-case text-[var(--text-primary)]"
                        >
                          {feature}
                        </Typography>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Footer */}
                <div className="p-5 bg-[var(--background-subtle)]/50">
                  <div className="flex justify-between items-center mb-4">
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
                      aria-label={`Solicitar ${stage.shortTitle}`}
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
              </Card>
            </CardComponent>
          );
        })}
      </div>
      
      {/* Toggle compact view button */}
      <div className="flex justify-center mt-6">
        <button 
          onClick={() => setExpandedView(false)}
          className="flex items-center gap-2 text-sm text-[var(--text-primary)] hover:text-[var(--text-warning)] bg-[var(--background-card)] hover:bg-[var(--background-subtle)] px-4 py-2 rounded-full border border-[var(--border-accent)]/30 hover:border-[var(--border-warning)]/50 transition-all duration-300 hover:shadow-md hover:scale-102 transform focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:outline-none"
          aria-label="Ver vista compacta de los servicios"
        >
          <InfoIcon className="w-4 h-4" aria-hidden="true" />
          <Typography 
            variant="body-small" 
            as="span"
            className="sentence-case"
          >
            Ver vista compacta
          </Typography>
        </button>
      </div>
    </div>
  );
};

export default HorizontalExpandedView;
