import React, { useState, useEffect } from 'react';
import Card from './ui/Card';
import Button from './ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DiagnosticoIcon, 
  AutoAsistenciaIcon, 
  ReporteEstrategicoIcon, 
  IntervencionEspecializadaIcon, 
  RepresentacionIntegralIcon
} from './icons/ServiceIcons';

// Componente de número de etapa moderno y atractivo con efectos neón sutiles
const StageNumber = ({ number, isActive }: { number: number; isActive: boolean }) => (
  <motion.div 
    className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl
      ${isActive 
        ? 'bg-gradient-to-br from-[var(--steel-blue)] to-[var(--steel-blue)]/80 text-white shadow-lg shadow-[var(--steel-blue)]/30 neon-glow-hover border-2 border-[var(--sunshine)]/30' 
        : 'bg-[var(--bone)] text-[var(--coal)] border-2 border-[var(--steel-blue)]/30 hover:border-[var(--sunshine)] hover:text-[var(--coal)]'} 
      transition-all duration-300 transform hover:scale-105 transition-bounce`}
    animate={isActive ? {
      scale: [1, 1.05, 1],
      boxShadow: [
        '0 0 5px rgba(249, 186, 50, 0.3), 0 0 10px rgba(249, 186, 50, 0.2)',
        '0 0 10px rgba(249, 186, 50, 0.5), 0 0 20px rgba(249, 186, 50, 0.3)',
        '0 0 5px rgba(249, 186, 50, 0.3), 0 0 10px rgba(249, 186, 50, 0.2)'
      ],
      transition: { repeat: Infinity, duration: 2.5, ease: "easeInOut" }
    } : {}}
  >
    {number}
  </motion.div>
);

// Función para obtener el icono de la etapa según el número con animaciones mejoradas
const getStageIcon = (stageNumber: number, isActive: boolean) => {
  // Clase base para todos los iconos con animaciones sofisticadas
  const iconClass = `w-10 h-10 ${isActive 
    ? 'text-[var(--steel-blue)] animate-float' 
    : 'text-[var(--coal)] hover:text-[var(--steel-blue)]'} 
    transition-all duration-300 transform hover:scale-110`;
  
  // Clase para el contenedor del icono con efecto neón sutil en hover
  const iconContainerClass = `relative p-2 ${isActive ? 'neon-glow-hover' : ''}`;
  
  const renderIcon = (Icon: React.ComponentType<{className: string}>) => (
    <div className={iconContainerClass}>
      <Icon className={iconClass} />
      {isActive && (
        <div className="absolute inset-0 bg-[var(--sunshine)]/10 rounded-full animate-pulse-subtle opacity-50"></div>
      )}
      {/* Círculo de fondo sutil para el icono */}
      <div className={`absolute inset-0 rounded-full ${isActive ? 'bg-[var(--sunshine)]/10' : 'bg-[var(--steel-blue)]/5'} -z-10`}></div>
    </div>
  );
  
  switch(stageNumber) {
    case 1:
      return renderIcon(DiagnosticoIcon);
    case 2:
      return renderIcon(AutoAsistenciaIcon);
    case 3:
      return renderIcon(ReporteEstrategicoIcon);
    case 4:
      return renderIcon(IntervencionEspecializadaIcon);
    case 5:
      return renderIcon(RepresentacionIntegralIcon);
    default:
      return null;
  }
};

// Datos de las etapas del servicio
const stagesData = [
  {
    id: 'diagnostico',
    number: 1,
    shortTitle: 'DIAGNÓSTICO INICIAL',
    title: 'DIAGNÓSTICO INICIAL GRATUITO',
    description: 'Evaluación preliminar de tu caso legal mediante un test automatizado.',
    price: 'Gratuito',
    buttonText: 'Iniciar diagnóstico',
    linkTo: '/diagnostico-inicial',
    color: 'var(--steel-blue)'
  },
  {
    id: 'auto-asistencia',
    number: 2,
    shortTitle: 'AUTO-ASISTENCIA LEGAL',
    title: 'AUTO-ASISTENCIA LEGAL',
    description: 'Acceso a herramientas y recursos para gestionar aspectos básicos de tu caso por tu cuenta.',
    price: 'Desde $45.000',
    buttonText: 'Contratar auto-asistencia',
    linkTo: '/auto-asistencia',
    color: 'var(--steel-blue)'
  },
  {
    id: 'reporte',
    number: 3,
    shortTitle: 'REPORTE ESTRATÉGICO',
    title: 'REPORTE ESTRATÉGICO PERSONALIZADO',
    description: 'Análisis detallado de tu caso con recomendaciones específicas por un abogado especializado.',
    price: 'Desde $99.900',
    buttonText: 'Solicitar reporte',
    linkTo: '/reporte-estrategico',
    color: 'var(--sunshine)'
  },
  {
    id: 'intervencion',
    number: 4,
    shortTitle: 'INTERVENCIÓN ESPECIALIZADA',
    title: 'INTERVENCIÓN ESPECIALIZADA',
    description: 'Asistencia legal directa para aspectos específicos de tu caso que requieren experiencia profesional.',
    price: 'Desde $149.900',
    buttonText: 'Agendar intervención',
    linkTo: '/intervencion-especializada',
    color: 'var(--steel-blue)'
  },
  {
    id: 'representacion',
    number: 5,
    shortTitle: 'REPRESENTACIÓN INTEGRAL',
    title: 'REPRESENTACIÓN LEGAL INTEGRAL',
    description: 'Gestión completa de tu caso por parte de nuestro equipo de abogados expertos.',
    price: 'Personalizado',
    buttonText: 'Solicitar representación',
    linkTo: '/representacion-integral',
    color: 'var(--steel-blue)'
  },
];

// Variantes de animación para los elementos
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

function ServiceFlowVertical() {
  const [expandedStage, setExpandedStage] = useState<number | null>(null);
  
  // Manejar la expansión/colapso de una etapa
  const toggleStage = (index: number) => {
    setExpandedStage(expandedStage === index ? null : index);
  };
  
  // Efecto para animaciones sutiles al cargar
  useEffect(() => {
    const timer = setTimeout(() => {
      document.querySelector('.service-flow-container')?.classList.add('loaded');
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="w-full py-16 px-4 md:px-8 bg-[var(--bone)] relative overflow-hidden">
      <div className="max-w-4xl mx-auto service-flow-container">
        {/* Encabezado con tipografía refinada */}
        <motion.div 
          className="text-center mb-16 text-[var(--coal)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-title mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[var(--steel-blue)] to-[var(--sunshine)] inline-block title-case">
            Nuestro flujo de servicio
          </h2>
          <p className="text-[var(--coal)] max-w-2xl mx-auto text-lg sentence-case leading-relaxed">
            Explora nuestro proceso de servicio en 5 etapas. Selecciona cada etapa para ver más detalles.
          </p>
        </motion.div>
        
        {/* Contenedor de las etapas en formato minimalista */}
        <div className="space-y-4 md:space-y-6">
          {/* Etapas del servicio en formato minimalista y desplegable */}
          <motion.div 
            className="relative z-10 flex flex-col gap-4"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.15
                }
              }
            }}
          >
            {stagesData.map((stage, index) => {
              const isExpanded = index === expandedStage;
              
              return (
                <motion.div 
                  key={`stage-${index}`}
                  className="w-full"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { 
                      opacity: 1, 
                      y: 0,
                      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
                    }
                  }}
                >
                  {/* Cabecera minimalista desplegable */}
                  <Card 
                    className={`transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] overflow-hidden
                      ${isExpanded 
                        ? 'border-[var(--sunshine)] shadow-lg shadow-[var(--steel-blue)]/10' 
                        : 'border-[var(--steel-blue)]/30 hover:border-[var(--sunshine)]/40'}
                      ${isExpanded ? 'bg-[var(--bone)]' : 'bg-[var(--bone)]'}
                    `}
                  >
                    {/* Cabecera siempre visible */}
                    <div 
                      className={`p-6 cursor-pointer flex items-center justify-between gap-4 group
                        ${isExpanded ? 'border-b border-[var(--steel-blue)]/20' : ''}`}
                      onClick={() => toggleStage(index)}
                    >
                      {/* Número e icono de etapa */}
                      <div className="flex items-center gap-4">
                        <div 
                          className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg
                            ${isExpanded 
                              ? 'bg-[var(--sunshine)] text-[var(--coal)] shadow-md shadow-[var(--sunshine)]/20' 
                              : 'bg-[var(--steel-blue)]/20 text-[var(--coal)] border border-[var(--steel-blue)]/30 group-hover:bg-[var(--steel-blue)]/30 group-hover:border-[var(--sunshine)]/50'}
                            transition-all duration-300
                          `}
                        >
                          <span>{index + 1}</span>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 flex items-center justify-center
                            ${isExpanded ? 'text-[var(--steel-blue)]' : 'text-[var(--coal)]/70 group-hover:text-[var(--steel-blue)]'}
                            transition-colors duration-300
                          `}>
                            {stage.icon}
                          </div>
                          
                          <h3 className={`font-semibold title-case transition-all duration-300
                            ${isExpanded ? 'text-[var(--steel-blue)] text-xl' : 'text-[var(--coal)] text-lg group-hover:text-[var(--steel-blue)]'}`}
                          >
                            {stage.title}
                          </h3>
                        </div>
                      </div>
                      
                      {/* Precio compacto e indicador de expansión */}
                      <div className="flex items-center gap-4">
                        <div className={`hidden md:block text-right transition-opacity duration-300 
                          ${isExpanded ? 'opacity-0' : 'opacity-100'}`}
                        >
                          <div className="text-[var(--coal)] font-semibold">{stage.price}</div>
                          <div className="text-[var(--coal)]/70 text-xs">Desde</div>
                        </div>
                        
                        <motion.div 
                          className={`flex items-center justify-center w-8 h-8 rounded-full 
                            ${isExpanded 
                              ? 'bg-[var(--sunshine)]/10 text-[var(--steel-blue)]' 
                              : 'bg-[var(--steel-blue)]/10 text-[var(--coal)]/70 group-hover:text-[var(--steel-blue)]'}
                            transition-all duration-300 border
                            ${isExpanded ? 'border-[var(--sunshine)]/30' : 'border-[var(--steel-blue)]/20 group-hover:border-[var(--sunshine)]/20'}
                          `}
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </motion.div>
                      </div>
                    </div>
                    
                    {/* Contenido expandible */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="p-6 pt-4">
                            <div className="grid md:grid-cols-3 gap-6">
                              <div className="md:col-span-2">
                                {/* Descripción */}
                                <p className="text-[var(--coal)]/80 leading-relaxed sentence-case mb-6">
                                  {stage.description}
                                </p>
                                
                                {/* Botón de acción */}
                                <Button 
                                  variant="primary" 
                                  size="md"
                                  className="shadow-lg shadow-[var(--steel-blue)]/10 transition-all duration-300"
                                  onClick={() => {
                                    window.location.href = stage.linkTo;
                                  }}
                                >
                                  {stage.buttonText}
                                </Button>
                              </div>
                              
                              {/* Sección de precio detallada */}
                              <div className="p-4 rounded-lg bg-[var(--steel-blue)]/10 border border-[var(--steel-blue)]/20 h-fit">
                                <div className="flex items-baseline gap-2 mb-2">
                                  <span className="text-[var(--coal)] text-sm">Desde</span>
                                  <span className="text-2xl font-bold text-[var(--coal)]">{stage.price}</span>
                                </div>
                                <p className="text-[var(--coal)] text-sm sentence-case">Consulta los detalles completos en la sección de servicios</p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Agregar estilos CSS para la animación de la línea de tiempo
const styles = `
  @keyframes drawLine {
    from { height: 0; opacity: 0.2; }
    to { height: 100%; opacity: 0.7; }
  }
  
  @keyframes fadeInScale {
    from { opacity: 0; transform: scale(0.8); }
    to { opacity: 1; transform: scale(1); }
  }
  
  @keyframes slideInRight {
    from { opacity: 0; transform: translateX(-20px); }
    to { opacity: 1; transform: translateX(0); }
  }
  
  @keyframes slideInLeft {
    from { opacity: 0; transform: translateX(20px); }
    to { opacity: 1; transform: translateX(0); }
  }
  
  .animate-timeline .timeline-line {
    animation: drawLine 1.5s ease-out forwards;
  }
  
  .animate-timeline .timeline-number {
    animation: fadeInScale 0.5s ease-out forwards;
    animation-delay: calc(var(--stage-index) * 0.3s + 0.5s);
  }
  
  .animate-timeline .timeline-connector {
    animation: fadeInScale 0.5s ease-out forwards;
    animation-delay: calc(var(--stage-index) * 0.3s + 0.7s);
  }
  
  .animate-timeline .timeline-card {
    animation: slideInRight 0.7s ease-out forwards;
    animation-delay: calc(var(--stage-index) * 0.3s + 0.9s);
  }
  
  .animate-timeline .timeline-arrow {
    animation: fadeInScale 0.5s ease-out forwards;
    animation-delay: calc(var(--stage-index) * 0.3s + 1.2s);
  }
  
  @media (min-width: 768px) {
    .animate-timeline .timeline-card:nth-child(even) {
      animation: slideInRight 0.7s ease-out forwards;
      animation-delay: calc(var(--stage-index) * 0.3s + 0.9s);
    }
    
    .animate-timeline .timeline-card:nth-child(odd) {
      animation: slideInLeft 0.7s ease-out forwards;
      animation-delay: calc(var(--stage-index) * 0.3s + 0.9s);
    }
  }
`;

// Agregar los estilos al DOM cuando el componente se monte
const StyleInjector = () => {
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = styles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  
  return null;
};

// Modificar el componente para incluir el inyector de estilos
const ServiceFlowVerticalWithStyles = () => {
  return (
    <>
      <StyleInjector />
      <ServiceFlowVertical />
    </>
  );
};

export default ServiceFlowVerticalWithStyles;
