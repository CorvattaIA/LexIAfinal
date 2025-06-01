import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Card from './ui/Card';
import Button from './ui/Button';
import Typography from './ui/Typography';
import { 
  DiagnosticoIcon, 
  AutoAsistenciaIcon, 
  ReporteEstrategicoIcon, 
  IntervencionEspecializadaIcon, 
  RepresentacionIntegralIcon,
  InfoIcon,
  ElegantArrowIcon
} from './icons/ServiceIcons';

// Definición de la estructura de datos para las etapas
interface ServiceStage {
  id: string;
  number: number;
  shortTitle: string;
  title: string;
  description: string;
  features: string[];
  price: string;
  priceDescription?: string;
  buttonText: string;
  linkTo: string;
  color: string;
}

// Datos de las etapas del servicio
const stagesData: ServiceStage[] = [
  {
    id: 'diagnostico',
    number: 1,
    shortTitle: 'Diagnóstico inicial',
    title: 'Diagnóstico inicial gratuito',
    description: 'Evaluación preliminar de tu caso legal mediante un test automatizado.',
    features: [
      'Análisis básico de tu situación legal',
      'Recomendación de servicios adecuados',
      'Tiempo estimado: 5-10 minutos',
      'Resultados inmediatos'
    ],
    price: 'Gratuito',
    priceDescription: 'Sin compromiso',
    buttonText: 'Iniciar diagnóstico',
    linkTo: '/diagnostico-inicial',
    color: 'var(--steel-blue)'
  },
  {
    id: 'auto-asistencia',
    number: 2,
    shortTitle: 'Auto-asistencia legal',
    title: 'Auto-asistencia legal',
    description: 'Acceso a herramientas y recursos para gestionar aspectos básicos de tu caso por tu cuenta.',
    features: [
      'Plantillas de documentos personalizables',
      'Guías paso a paso para procedimientos comunes',
      'Acceso a recursos legales básicos',
      'Soporte por chat para dudas puntuales'
    ],
    price: 'Desde $45.000',
    priceDescription: 'Acceso por 30 días',
    buttonText: 'Contratar auto-asistencia',
    linkTo: '/auto-asistencia',
    color: 'var(--steel-blue)'
  },
  {
    id: 'reporte',
    number: 3,
    shortTitle: 'Reporte estratégico',
    title: 'Reporte estratégico personalizado',
    description: 'Análisis detallado de tu caso con recomendaciones específicas por un abogado especializado.',
    features: [
      'Evaluación completa de tu situación legal',
      'Análisis de riesgos y oportunidades',
      'Estrategias recomendadas y pasos a seguir',
      'Elaborado por un abogado especialista'
    ],
    price: 'Desde $99.900',
    priceDescription: 'Pago único',
    buttonText: 'Solicitar reporte',
    linkTo: '/reporte-estrategico',
    color: 'var(--sunshine)'
  },
  {
    id: 'intervencion',
    number: 4,
    shortTitle: 'Intervención especializada',
    title: 'Intervención especializada',
    description: 'Asistencia legal directa para aspectos específicos de tu caso que requieren experiencia profesional.',
    features: [
      'Revisión y redacción de documentos legales',
      'Asesoramiento en negociaciones',
      'Representación en trámites específicos',
      'Comunicación directa con un abogado asignado'
    ],
    price: 'Desde $199.900',
    priceDescription: 'Según complejidad',
    buttonText: 'Consultar',
    linkTo: '/intervencion-especializada',
    color: 'var(--steel-blue)'
  },
  {
    id: 'representacion',
    number: 5,
    shortTitle: 'Representación integral',
    title: 'Representación legal integral',
    description: 'Gestión completa de tu caso por parte de nuestro equipo de abogados expertos.',
    features: [
      'Representación legal completa',
      'Gestión de todos los aspectos de tu caso',
      'Equipo de abogados especializados',
      'Seguimiento y comunicación constante'
    ],
    price: 'Personalizado',
    priceDescription: 'Según complejidad y duración',
    buttonText: 'Solicitar representación',
    linkTo: '/representacion-integral',
    color: 'var(--steel-blue)'
  }
];

// Componente para mostrar el número de etapa
const StageNumber = ({ number, isActive }: { number: number; isActive: boolean }) => {
  return (
    <div 
      className={`
        w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center
        ${isActive 
          ? 'bg-[var(--steel-blue)] text-white shadow-md' 
          : 'bg-white text-[var(--coal)] border-2 border-[var(--steel-blue)]/30 group-hover:border-[var(--steel-blue)]'}
        transition-all duration-300
      `}
      aria-label={`Etapa ${number}`}
    >
      <Typography 
        variant="body" 
        weight="bold" 
        color={isActive ? 'white' : 'var(--coal)'}
        as="span"
      >
        {number}
      </Typography>
    </div>
  );
};

// Función para obtener el icono de la etapa según el número
const getStageIcon = (stage: number, isActive: boolean) => {
  const baseClass = `w-8 h-8 md:w-10 md:h-10 ${isActive 
    ? 'text-[var(--steel-blue)] filter drop-shadow-sm' 
    : 'text-[var(--coal)] hover:text-[var(--steel-blue)] hover:filter hover:drop-shadow-sm'} 
    transition-all duration-300 transform hover:scale-110`;
  
  switch(stage) {
    case 1:
      return <DiagnosticoIcon className={baseClass} />;
    case 2:
      return <AutoAsistenciaIcon className={baseClass} />;
    case 3:
      return <ReporteEstrategicoIcon className={baseClass} />;
    case 4:
      return <IntervencionEspecializadaIcon className={baseClass} />;
    case 5:
      return <RepresentacionIntegralIcon className={baseClass} />;
    default:
      return null;
  }
};

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

// Propiedades del componente
interface UnifiedServiceFlowProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  showTitle?: boolean;
  titleText?: string;
}

/**
 * Componente unificado para mostrar el flujo de servicios
 * Soporta orientación horizontal o vertical
 */
const UnifiedServiceFlow: React.FC<UnifiedServiceFlowProps> = ({ 
  orientation = 'horizontal',
  className = '',
  showTitle = true,
  titleText = 'Nuestro flujo de servicio'
}) => {
  const [expandedView, setExpandedView] = useState(false);
  const [activeStage, setActiveStage] = useState<number | null>(null);
  
  // Función para alternar entre vista compacta y expandida
  const toggleExpandedView = () => {
    setExpandedView(!expandedView);
    if (activeStage !== null) setActiveStage(null);
  };

  // Efecto para animaciones al cargar
  useEffect(() => {
    const timer = setTimeout(() => {
      document.querySelector('.service-flow-container')?.classList.add('loaded');
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Renderiza la vista según la orientación seleccionada
  return (
    <div className={`w-full py-6 ${className}`}>
      {showTitle && (
        <Typography 
          variant="heading" 
          capitalization="sentence-case" 
          align="center" 
          className="mb-8"
        >
          {titleText}
        </Typography>
      )}
      
      {orientation === 'horizontal' ? (
        expandedView ? renderExpandedHorizontal() : renderCompactHorizontal()
      ) : (
        renderVertical()
      )}
      
      {/* Botón para cambiar entre vistas (solo en orientación horizontal) */}
      {orientation === 'horizontal' && (
        <div className="flex justify-center mt-8">
          <button 
            onClick={toggleExpandedView}
            className="flex items-center gap-2 text-sm text-[var(--coal)] hover:text-[var(--sunshine)] bg-white hover:bg-[var(--bone)] px-5 py-2.5 rounded-full border border-[var(--steel-blue)]/30 hover:border-[var(--sunshine)]/50 transition-all duration-300 hover:shadow-md transform hover:-translate-y-0.5 active:translate-y-0 hover:scale-102"
            aria-label={expandedView ? "Ver vista compacta de los servicios" : "Ver detalles completos de todos los servicios"}
          >
            <InfoIcon className="w-5 h-5" />
            <Typography 
              variant="body-small" 
              as="span"
              capitalization="sentence-case"
            >
              {expandedView ? "Ver vista compacta" : "Ver detalles completos"}
            </Typography>
          </button>
        </div>
      )}
    </div>
  );
  
  // Función para renderizar la vista compacta horizontal
  function renderCompactHorizontal() {
    return (
      <div className="relative flex flex-col md:flex-row md:items-stretch gap-6 md:gap-2 overflow-hidden service-flow-container">
        {stagesData.map((stage, index) => {
          const isActive = index === activeStage;
          const stageColor = stage.color;
          
          return (
            <div key={stage.id} className="relative flex-1 group">
              {/* Línea de conexión entre etapas (visible en dispositivos medianos y grandes) */}
              {index < stagesData.length - 1 && (
                <div className="hidden md:block absolute -right-3 top-1/2 transform -translate-y-1/2 z-10">
                  <ElegantArrowIcon className={`w-6 h-6 text-[#64748B] group-hover:text-[${stageColor}] transition-colors duration-300`} />
                </div>
              )}
              
              {/* Tarjeta para cada etapa */}
              <Card 
                className={`h-full transition-all duration-300 backdrop-blur-sm
                  ${isActive 
                    ? `bg-gradient-to-br from-[${stageColor}]/10 to-transparent border-l-4 border-l-[${stageColor}] shadow-lg shadow-[${stageColor}]/10` 
                    : 'bg-white/90 hover:bg-[var(--bone)]/90'}`}
                onClick={() => setActiveStage(isActive ? null : index)}
                withHover
              >
                <div className="flex flex-col h-full relative overflow-hidden p-4">
                  {/* Encabezado de la etapa con número e icono */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <StageNumber number={stage.number} isActive={isActive} />
                      <Typography 
                        variant="subtitle" 
                        capitalization="sentence-case" 
                        className="mt-0"
                      >
                        {stage.shortTitle}
                      </Typography>
                    </div>
                    <div className="flex-shrink-0">
                      {getStageIcon(stage.number, isActive)}
                    </div>
                  </div>
                  
                  {/* Descripción de la etapa con animación de aparición/desaparición */}
                  <div className={`mt-2 overflow-hidden transition-all duration-300 ease-in-out
                    ${isActive ? 'max-h-24 opacity-100' : 'max-h-0 md:max-h-12 opacity-0 md:opacity-70'}`}>
                    <Typography 
                      variant="body-small" 
                      capitalization="sentence-case" 
                      className="text-[var(--coal)]"
                    >
                      {stage.description}
                    </Typography>
                  </div>
                  
                  {/* Precio (siempre visible) */}
                  <div className="mt-auto pt-4">
                    <div className="flex justify-between items-center">
                      <Typography 
                        variant="caption" 
                        capitalization="sentence-case"
                      >
                        Precio:
                      </Typography>
                      <Typography 
                        variant="body-small" 
                        weight="semibold" 
                        color={isActive ? stageColor : 'var(--coal)'} 
                        className="transition-all duration-300"
                      >
                        {stage.price}
                      </Typography>
                    </div>
                  </div>
                  
                  {/* Botón de acción con animación de aparición */}
                  <div className={`mt-4 transition-all duration-300 ease-in-out overflow-hidden ${isActive ? 'max-h-12 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <Link to={stage.linkTo}>
                      <Button 
                        variant="secondary"
                        className={`w-full font-medium bg-[${stageColor}]/10 hover:bg-[${stageColor}]/20 text-[${stageColor}] shadow-sm shadow-[${stageColor}]/20 transition-all duration-300`}
                        aria-label={stage.buttonText}
                      >
                        <Typography 
                          variant="body-small" 
                          weight="medium" 
                          color={stageColor} 
                          as="span"
                          capitalization="sentence-case"
                        >
                          {stage.buttonText}
                        </Typography>
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </div>
          );
        })}
      </div>
    );
  }
  
  // Función para renderizar la vista expandida horizontal
  function renderExpandedHorizontal() {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stagesData.map((stage) => (
          <Card 
            key={stage.id}
            className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col"
          >
            <div className="p-5 bg-gradient-to-r from-[var(--bone)] to-transparent">
              <div className="flex items-center gap-3 mb-3">
                <StageNumber number={stage.number} isActive={true} />
                <Typography 
                  variant="title" 
                  weight="bold" 
                  className="bg-gradient-to-r from-[var(--steel-blue)] to-[var(--steel-blue-light)] text-transparent bg-clip-text"
                >
                  {stage.shortTitle}
                </Typography>
                <div className="ml-auto">{getStageIcon(stage.number, true)}</div>
              </div>
              <Typography 
                variant="body" 
                capitalization="sentence-case"
              >
                {stage.description}
              </Typography>
            </div>
            
            {/* Features */}
            <div className="p-5 flex-grow">
              <Typography 
                variant="body-small" 
                weight="medium" 
                color="var(--steel-blue)" 
                className="mb-3"
              >
                Características:
              </Typography>
              <ul className="space-y-2">
                {stage.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-[var(--steel-blue)] flex-shrink-0 mt-1">✓</span>
                    <Typography 
                      variant="body-small" 
                      capitalization="sentence-case"
                    >
                      {feature}
                    </Typography>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Footer */}
            <div className="p-5 bg-[var(--bone)]/50 mt-auto">
              <div className="flex justify-between items-center mb-4">
                <Typography 
                  variant="body-small" 
                  capitalization="sentence-case"
                >
                  Precio:
                </Typography>
                <Typography 
                  variant="body" 
                  weight="bold" 
                  color="var(--sunshine)" 
                  className="drop-shadow-sm"
                >
                  {stage.price}
                </Typography>
              </div>
              <Link to={stage.linkTo} className="block">
                <Button 
                  variant="primary" 
                  className="w-full justify-center"
                  aria-label={`Solicitar ${stage.shortTitle}`}
                >
                  <Typography 
                    variant="body-small" 
                    weight="medium" 
                    color="white" 
                    as="span"
                    capitalization="sentence-case"
                  >
                    {stage.buttonText}
                  </Typography>
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    );
  }
  
  // Función para renderizar la vista vertical
  function renderVertical() {
    return (
      <motion.div 
        className="max-w-4xl mx-auto service-flow-container"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <div className="relative">
          {/* Línea vertical de tiempo */}
          <div className="absolute left-[22px] md:left-[28px] top-0 bottom-0 w-1 bg-[var(--steel-blue)]/20 timeline-line"></div>
          
          {/* Etapas */}
          <div className="space-y-6">
            {stagesData.map((stage, index) => {
              const isExpanded = activeStage === index;
              
              return (
                <motion.div 
                  key={stage.id}
                  className="timeline-card"
                  variants={fadeInUp}
                  style={{"--stage-index": index} as React.CSSProperties}
                >
                  <Card 
                    className={`
                      border-l-4 transition-all duration-300
                      ${isExpanded 
                        ? `border-l-[${stage.color}] shadow-lg shadow-[${stage.color}]/10` 
                        : 'border-l-[var(--steel-blue)]/30 hover:border-l-[var(--steel-blue)]'}
                    `}
                    onClick={() => setActiveStage(isExpanded ? null : index)}
                  >
                    {/* Cabecera de la etapa */}
                    <div className="p-4 flex items-center gap-4">
                      <StageNumber number={stage.number} isActive={isExpanded} />
                      
                      <div className="flex-1">
                        <Typography 
                          variant="title" 
                          capitalization="sentence-case" 
                          className="mb-1"
                        >
                          {stage.shortTitle}
                        </Typography>
                        
                        <div className="flex items-center justify-between">
                          <Typography 
                            variant="caption" 
                            capitalization="sentence-case"
                            className="text-[var(--coal)]/70"
                          >
                            {stage.priceDescription}
                          </Typography>
                          
                          <Typography 
                            variant="body-small" 
                            weight="semibold" 
                            color={isExpanded ? stage.color : 'var(--coal)'} 
                            className="transition-all duration-300"
                          >
                            {stage.price}
                          </Typography>
                        </div>
                      </div>
                      
                      <div className="flex-shrink-0">
                        {getStageIcon(stage.number, isExpanded)}
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
                          <div className="p-5 pt-0 border-t border-[var(--steel-blue)]/10">
                            <Typography 
                              variant="body" 
                              capitalization="sentence-case"
                              className="mb-4"
                            >
                              {stage.description}
                            </Typography>
                            
                            <div className="mb-4">
                              <Typography 
                                variant="body-small" 
                                weight="medium" 
                                color="var(--steel-blue)" 
                                className="mb-2"
                              >
                                Características:
                              </Typography>
                              <ul className="space-y-2">
                                {stage.features.map((feature, i) => (
                                  <li key={i} className="flex items-start gap-2">
                                    <span className="text-[var(--steel-blue)] flex-shrink-0 mt-1">✓</span>
                                    <Typography 
                                      variant="body-small" 
                                      capitalization="sentence-case"
                                    >
                                      {feature}
                                    </Typography>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <Link to={stage.linkTo} className="block">
                              <Button 
                                variant="primary" 
                                className="w-full justify-center"
                                aria-label={`Solicitar ${stage.shortTitle}`}
                              >
                                <Typography 
                                  variant="body-small" 
                                  weight="medium" 
                                  color="white" 
                                  as="span"
                                  capitalization="sentence-case"
                                >
                                  {stage.buttonText}
                                </Typography>
                              </Button>
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    );
  }
};

// Estilos CSS para animaciones de la línea de tiempo vertical
const TimelineStyles = () => {
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
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
      
      .service-flow-container.loaded .timeline-line {
        animation: drawLine 1.5s ease-out forwards;
      }
    `;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  
  return null;
};

// Componente final que incluye los estilos
const UnifiedServiceFlowWithStyles: React.FC<UnifiedServiceFlowProps> = (props) => {
  return (
    <>
      <TimelineStyles />
      <UnifiedServiceFlow {...props} />
    </>
  );
};

export default UnifiedServiceFlowWithStyles;
