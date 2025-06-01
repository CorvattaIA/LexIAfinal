import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion, PanInfo } from 'framer-motion';
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

// Componente de número de etapa con mejoras de accesibilidad
const StageNumber = ({ number, isActive, reduceMotion }: { number: number; isActive: boolean; reduceMotion: boolean }) => (
  <div 
    className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold text-lg
      ${isActive 
        ? 'bg-gradient-to-r from-[#426E86] to-[#426E86]/80 text-white shadow-md ring-2 ring-[#426E86]/30 ring-offset-2 ring-offset-[#F8F1E5]' 
        : 'bg-[#F8F1E5] text-[#2F3131] border border-[#426E86]/30 hover:border-[#F9BA32] hover:text-[#426E86] hover:shadow-md'}
      ${reduceMotion ? 'transition-colors' : 'transition-all duration-300 transform hover:scale-105'}`}
    role="presentation"
    aria-hidden="true"
  >
    <Typography 
      variant="body" 
      weight="bold" 
      color={isActive ? 'white' : '#2F3131'}
      as="span"
    >
      {number}
    </Typography>
  </div>
);

// Función para obtener el icono correspondiente a cada etapa
const getStageIcon = (stage: number, isActive: boolean, reduceMotion: boolean) => {
  // Clases base con efectos de hover y transiciones
  const baseClass = `w-8 h-8 md:w-10 md:h-10 ${isActive 
    ? 'text-[#426E86] filter drop-shadow-sm' 
    : 'text-[#2F3131] hover:text-[#426E86] hover:filter hover:drop-shadow-sm'} 
    ${reduceMotion ? 'transition-colors' : 'transition-all duration-300 transform hover:scale-110'}`;
  
  // Colores específicos para cada etapa
  const stageColors = {
    1: isActive ? 'text-[#426E86]' : 'hover:text-[#426E86]',
    2: isActive ? 'text-[#426E86]' : 'hover:text-[#426E86]',
    3: isActive ? 'text-[#426E86]' : 'hover:text-[#426E86]',
    4: isActive ? 'text-[#426E86]' : 'hover:text-[#426E86]',
    5: isActive ? 'text-[#F9BA32]' : 'hover:text-[#F9BA32]',
  };
  
  // Clase combinada con color específico de la etapa
  const combinedClass = `${baseClass} ${stageColors[stage as keyof typeof stageColors]}`;
  
  // Nombres descriptivos para cada icono para accesibilidad
  const iconLabels = {
    1: "Diagnóstico",
    2: "Auto-Asistencia",
    3: "Reporte Estratégico",
    4: "Intervención Especializada",
    5: "Representación Integral"
  };
  
  // Atributos ARIA para accesibilidad
  const ariaProps = {
    role: "img",
    "aria-label": iconLabels[stage as keyof typeof iconLabels],
  };
  
  switch(stage) {
    case 1: return <DiagnosticoIcon className={combinedClass} {...ariaProps} />;
    case 2: return <AutoAsistenciaIcon className={combinedClass} {...ariaProps} />;
    case 3: return <ReporteEstrategicoIcon className={combinedClass} {...ariaProps} />;
    case 4: return <IntervencionEspecializadaIcon className={combinedClass} {...ariaProps} />;
    case 5: return <RepresentacionIntegralIcon className={combinedClass} {...ariaProps} />;
    default: return null;
  }
};

// Interfaz para los datos de cada etapa
interface Stage {
  id: number;
  number: number;
  title: string;
  shortTitle: string;
  description: string;
  features: string[];
  price: string;
  buttonText: string;
  linkTo: string;
  color: string;
}

// Datos de las etapas de servicio
const stagesData: Stage[] = [
  {
    id: 1,
    number: 1,
    title: "Diagnóstico Inicial",
    shortTitle: "Diagnóstico",
    description: "Evaluación preliminar de tu caso para determinar la mejor estrategia legal. Incluye análisis de documentación y consulta virtual con un abogado especializado.",
    features: [
      "Evaluación de documentos legales",
      "Consulta virtual de 30 minutos",
      "Identificación de riesgos legales",
      "Recomendaciones iniciales"
    ],
    price: "Desde $99",
    buttonText: "Solicitar Diagnóstico",
    linkTo: "/diagnostico-inicial",
    color: "#426E86" // Steel Blue (color primario)
  },
  {
    id: 2,
    number: 2,
    title: "Auto-Asistencia Guiada",
    shortTitle: "Auto-Asistencia",
    description: "Acceso a herramientas y recursos para gestionar aspectos legales básicos por tu cuenta, con soporte de IA y supervisión legal cuando lo necesites.",
    features: [
      "Plantillas personalizables",
      "Asistente IA para documentos",
      "Revisión legal básica",
      "Recursos educativos"
    ],
    price: "Desde $149",
    buttonText: "Acceder a Herramientas",
    linkTo: "/auto-asistencia",
    color: "#426E86" // Steel Blue (color primario)
  },
  {
    id: 3,
    number: 3,
    title: "Reporte Estratégico",
    shortTitle: "Reporte",
    description: "Análisis detallado de tu situación legal con estrategias recomendadas, riesgos identificados y plan de acción personalizado.",
    features: [
      "Análisis legal exhaustivo",
      "Estrategias recomendadas",
      "Evaluación de riesgos",
      "Plan de acción detallado"
    ],
    price: "Desde $299",
    buttonText: "Solicitar Reporte",
    linkTo: "/reporte-estrategico",
    color: "#426E86" // Steel Blue (color primario)
  },
  {
    id: 4,
    number: 4,
    title: "Intervención Especializada",
    shortTitle: "Intervención",
    description: "Asistencia legal directa para situaciones complejas que requieren la intervención de un abogado especializado, sin necesidad de representación completa.",
    features: [
      "Representación en gestiones específicas",
      "Negociación con terceros",
      "Redacción de documentos complejos",
      "Asesoría legal continua"
    ],
    price: "Desde $499",
    buttonText: "Consultar Intervención",
    linkTo: "/intervencion-especializada",
    color: "#426E86" // Steel Blue (color primario)
  },
  {
    id: 5,
    number: 5,
    title: "Representación Integral",
    shortTitle: "Representación",
    description: "Servicio legal completo con representación total en procedimientos judiciales y extrajudiciales, incluyendo litigación si es necesario.",
    features: [
      "Representación legal completa",
      "Gestión de procedimientos",
      "Defensa en litigios",
      "Comunicación constante"
    ],
    price: "Presupuesto personalizado",
    buttonText: "Solicitar Representación",
    linkTo: "/representacion-integral",
    color: "#F9BA32" // Sunshine (color de acento)
  }
];

// Componente principal ServiceFlowGuide
const ServiceFlowGuideComponent = () => {
  // Estado para controlar la etapa activa
  const [activeStage, setActiveStage] = useState<number>(1);
  const [isCompactView, setIsCompactView] = useState<boolean>(window.innerWidth < 768);
  
  // Referencias para elementos del DOM
  const stageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const stageContainerRef = useRef<HTMLDivElement>(null);
  const stageButtonsRef = useRef<(HTMLButtonElement | null)[]>([]);
  
  // Detección de dispositivo móvil
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);
  
  // Detección de preferencia de reducción de movimiento
  const prefersReducedMotion = useReducedMotion();
  
  // Estado para manejar gestos táctiles
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  
  // Inicializar referencias de etapas
  useEffect(() => {
    stageRefs.current = stageRefs.current.slice(0, stagesData.length);
    stageButtonsRef.current = stageButtonsRef.current.slice(0, stagesData.length);
    
    // Detección de dispositivo móvil
    const checkIfMobile = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);
      setIsCompactView(isMobileView); // En móvil, iniciar con vista compacta
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);
  
  // Función para manejar inicio de toque
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };
  
  // Función para manejar fin de toque
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    
    const endX = e.changedTouches[0].clientX;
    const diff = touchStartX - endX;
    
    // Umbral mínimo para considerar un swipe válido
    const minSwipeDistance = 50;
    
    if (Math.abs(diff) > minSwipeDistance) {
      if (diff > 0) {
        // Swipe hacia la izquierda (siguiente etapa)
        setActiveStage(prev => Math.min(prev + 1, stagesData.length));
      } else {
        // Swipe hacia la derecha (etapa anterior)
        setActiveStage(prev => Math.max(prev - 1, 1));
      }
    }
    
    // Resetear estados de toque
    setTouchStartX(null);
  };
  
  // Función para manejar arrastre con Framer Motion
  const handleDrag = (_: any, info: PanInfo) => {
    const { offset, velocity } = info;
    
    // Umbrales para considerar un swipe válido
    const minVelocity = 100;
    const minDistance = 30;
    
    if (Math.abs(offset.x) > minDistance || Math.abs(velocity.x) > minVelocity) {
      if (offset.x < 0 || velocity.x < -minVelocity) {
        // Arrastre hacia la izquierda (siguiente etapa)
        setActiveStage(prev => Math.min(prev + 1, stagesData.length));
      } else if (offset.x > 0 || velocity.x > minVelocity) {
        // Arrastre hacia la derecha (etapa anterior)
        setActiveStage(prev => Math.max(prev - 1, 1));
      }
    }
    
    setIsDragging(false);
  };
  
  // Función para manejar navegación por teclado
  const handleKeyNavigation = (e: KeyboardEvent<HTMLDivElement>, index: number) => {
    // Navegación con flechas izquierda/derecha
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      setActiveStage(Math.min(index + 2, stagesData.length));
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setActiveStage(Math.max(index, 1));
    }
    
    // Activar con Enter o Space
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const targetElement = stageRefs.current[index];
      targetElement?.focus();
      targetElement?.setAttribute('aria-expanded', 'true');
      setActiveStage(index + 1);
    }
  };
  
  // Efecto para hacer scroll a la etapa activa cuando cambia
  useEffect(() => {
    if (activeStage && stageRefs.current[activeStage - 1]) {
      const activeElement = stageRefs.current[activeStage - 1];
      
      if (activeElement && stageContainerRef.current) {
        // Scroll suave o inmediato según preferencia de reducción de movimiento
        if (prefersReducedMotion) {
          // Scroll inmediato para usuarios que prefieren menos animaciones
          stageContainerRef.current.scrollLeft = activeElement.offsetLeft - (stageContainerRef.current.offsetWidth / 2) + (activeElement.offsetWidth / 2);
        } else {
          // Scroll suave con animación
          activeElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'nearest', 
            inline: 'center' 
          });
        }
      }
      
      // Actualizar foco para accesibilidad
      stageButtonsRef.current[activeStage - 1]?.focus();
    }
  }, [activeStage, prefersReducedMotion]);
  
  // Título del componente
  const componentTitle = "Nuestro flujo de servicio";

  // Variantes de animación para Framer Motion
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  // Renderiza la vista compacta (móvil)
  const renderCompactView = () => {
    return (
      <div className="w-full py-8" ref={stageContainerRef} role="region" aria-label="Flujo de servicio - Vista compacta">
        {/* Título del componente */}
        <Typography 
          variant="h2" 
          weight="bold"
          className="text-center mb-8"
          color="#2F3131"
        >
          {componentTitle}
        </Typography>
        
        {/* Indicador visual de progreso */}
        <div className="relative w-full h-2 bg-[#F8F1E5]/50 rounded-full mb-8 overflow-hidden"
             aria-hidden="true">
          <div 
            className="absolute h-full bg-gradient-to-r from-[#426E86] to-[#426E86]/80 rounded-full transition-all duration-500 ease-in-out" 
            style={{ 
              width: `${(activeStage / stagesData.length) * 100}%`,
              transition: prefersReducedMotion ? 'none' : 'width 0.5s ease-in-out'
            }}
          ></div>
        </div>
      
        {/* Contenedor principal */}
        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={`stage-${activeStage}`}
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: 50 }}
              animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: prefersReducedMotion ? 0.1 : 0.3 }}
              className="w-full"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              drag={!prefersReducedMotion && isMobile ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={handleDrag}
            >
              {stagesData.filter(stage => stage.id === activeStage).map((stage) => (
                <Card 
                  key={stage.id}
                  className="w-full p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <div 
                    ref={el => { stageRefs.current[stage.id - 1] = el; }}
                    onKeyDown={(e) => handleKeyNavigation(e, stage.id - 1)}
                    tabIndex={0}
                    role="region"
                    aria-label={`Etapa ${stage.number}: ${stage.title}`}
                  >
                    <div className="flex items-center mb-4">
                      <div className="mr-4">
                        {getStageIcon(stage.number, true, prefersReducedMotion || false)}
                      </div>
                      <div>
                        <Typography variant="h3" weight="bold" className="mb-1">
                          {stage.title}
                        </Typography>
                        <Typography variant="body" className="text-[#2F3131]/80 text-sm">
                          Etapa {stage.number} de {stagesData.length}
                        </Typography>
                      </div>
                    </div>
                    
                    <Typography variant="body" className="mb-4">
                      {stage.description}
                    </Typography>
                    
                    <div className="mb-4">
                      <Typography variant="body" weight="medium" className="mb-2">
                        Características:
                      </Typography>
                      <ul className="list-disc pl-5 space-y-1">
                        {stage.features.map((feature, idx) => (
                          <li key={idx}>
                            <Typography variant="body" className="text-sm">
                              {feature}
                            </Typography>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row justify-between items-center mt-6">
                      <Typography 
                        variant="body" 
                        weight="bold" 
                        className="mb-3 sm:mb-0 text-[#426E86]"
                      >
                        {stage.price}
                      </Typography>
                      
                      <Link to={stage.linkTo}>
                        <Button 
                          variant="primary"
                          className="bg-[#426E86] hover:bg-[#426E86]/90 text-white"
                        >
                          {stage.buttonText.toUpperCase()}
                        </Button>
                      </Link>
                    </div>
                    
                    {/* Botones de navegación para móvil */}
                    <div className="flex justify-between mt-6 pt-4 border-t border-[#F8F1E5]/30">
                      <Button
                        variant="text"
                        onClick={() => setActiveStage(Math.max(activeStage - 1, 1))}
                        disabled={activeStage <= 1}
                        className={activeStage <= 1 ? 'invisible' : 'text-[#426E86]'}
                        aria-label="Etapa anterior"
                      >
                        <span className="flex items-center">
                          <ElegantArrowIcon className="w-4 h-4 mr-1 transform rotate-180" />
                          ANTERIOR
                        </span>
                      </Button>
                      
                      <Button
                        variant="text"
                        onClick={() => setActiveStage(Math.min(activeStage + 1, stagesData.length))}
                        disabled={activeStage >= stagesData.length}
                        className={activeStage >= stagesData.length ? 'invisible' : 'text-[#426E86]'}
                        aria-label="Siguiente etapa"
                      >
                        <span className="flex items-center">
                          SIGUIENTE
                          <ElegantArrowIcon className="w-4 h-4 ml-1" />
                        </span>
                      </Button>
                    </div>
                    
                    {/* Botón para expandir vista en dispositivos grandes */}
                    {!isMobile && (
                      <div className="text-center mt-6">
                        <Button
                          variant="text"
                          onClick={() => setIsCompactView(false)}
                          className="text-[#426E86] hover:text-[#426E86]/80"
                          aria-label="Ver todas las etapas"
                        >
                          <span className="flex items-center justify-center">
                            <InfoIcon className="w-4 h-4 mr-1" />
                            VER TODAS LAS ETAPAS
                          </span>
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </motion.div>
          </AnimatePresence>
          
          {/* Indicadores de navegación para desktop */}
          <div className="flex justify-center mt-8 space-x-1">
            {stagesData.map((stage) => (
              <button
                key={`indicator-${stage.id}`}
                onClick={() => setActiveStage(stage.id)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${activeStage === stage.id 
                  ? 'bg-[#426E86] w-4' 
                  : 'bg-[#426E86]/50 opacity-50 hover:opacity-75'}`}
                aria-label={`Ir a etapa ${stage.number}`}
                aria-current={activeStage === stage.id ? 'step' : undefined}
                ref={el => { stageButtonsRef.current[stage.id - 1] = el; }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Renderizar vista expandida (desktop)
  const renderExpandedView = () => {
    return (
      <div className="w-full py-8" role="region" aria-label="Flujo de servicio - Vista expandida">
        <div className="flex justify-between items-center mb-8">
          <Typography 
            variant="h2" 
            weight="bold"
            color="#2F3131"
          >
            {componentTitle}
          </Typography>
          
          <Button
            variant="text"
            onClick={() => setIsCompactView(true)}
            className="text-[#426E86] hover:text-[#426E86]/80"
            aria-label="Volver a vista compacta"
          >
            <span className="flex items-center">
              <ElegantArrowIcon className="w-4 h-4 mr-1 transform rotate-180" />
              VOLVER
            </span>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stagesData.map((stage, index) => (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: prefersReducedMotion ? 0.1 : 0.3,
                delay: prefersReducedMotion ? 0 : index * 0.1 // Efecto escalonado
              }}
            >
              <Card 
                className={`w-full h-full p-6 shadow-md hover:shadow-lg transition-shadow duration-300 ${activeStage === stage.id ? 'ring-2 ring-[#426E86]' : ''}`}
              >
                <div
                  ref={el => { stageRefs.current[stage.id - 1] = el; }}
                  tabIndex={0}
                  role="region"
                  aria-label={`Etapa ${stage.number}: ${stage.title}`}
                >
                  <div className="flex items-center mb-4">
                    <div className="mr-4">
                      {getStageIcon(stage.number, activeStage === stage.id, prefersReducedMotion || false)}
                    </div>
                    <div>
                      <Typography variant="h4" weight="bold" className="mb-1">
                        {stage.title}
                      </Typography>
                      <Typography variant="body" className="text-[#2F3131] text-xs">
                        Etapa {stage.number}
                      </Typography>
                    </div>
                  </div>
                  
                  <Typography variant="body" className="mb-4 text-sm">
                    {stage.description}
                  </Typography>
                  
                  <div className="mb-4">
                    <Typography variant="body" weight="medium" className="mb-2 text-sm">
                      Características:
                    </Typography>
                    <ul className="list-disc pl-5 space-y-1">
                      {stage.features.map((feature, idx) => (
                        <li key={idx}>
                          <Typography variant="body" className="text-xs">
                            {feature}
                          </Typography>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Footer */}
                  <div className="p-5 bg-[#F8F1E5]/50">
                    <div className="flex justify-between items-center mb-4">
                      <Typography 
                        variant="body" 
                        className="text-[#2F3131]/80"
                      >
                        Precio:
                      </Typography>
                      <Typography 
                        variant="body" 
                        weight="bold" 
                        className="text-[#F9BA32]"
                      >
                        {stage.price}
                      </Typography>
                    </div>
                    <Link to={stage.linkTo} className="block">
                      <Button 
                        variant="primary" 
                        className="w-full justify-center bg-[#426E86] hover:bg-[#426E86]/90 text-white shadow-md transition-all duration-300"
                        aria-label={`Solicitar ${stage.shortTitle}`}
                      >
                        <Typography 
                          variant="body" 
                          weight="medium" 
                          color="white" 
                          as="span"
                        >
                          SOLICITAR AHORA
                        </Typography>
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
        
        {/* Toggle compact view button */}
        <div className="flex justify-center mt-6">
          <Button 
            variant="text"
            onClick={() => setIsCompactView(true)}
            className="flex items-center gap-2 text-sm text-[#2F3131] hover:text-[#F9BA32] bg-[#F8F1E5] hover:bg-[#F8F1E5]/80 px-4 py-2 rounded-full border border-[#426E86]/30 hover:border-[#F9BA32]/50 transition-all duration-300 hover:shadow-md"
            aria-label="Ver vista compacta de los servicios"
          >
            <InfoIcon className="w-4 h-4" aria-hidden="true" />
            <Typography 
              variant="body" 
              as="span"
            >
              VER VISTA COMPACTA
            </Typography>
          </Button>
        </div>
      </div>
    );
  };

  return isCompactView ? renderCompactView() : renderExpandedView();
};

export default ServiceFlowGuideComponent;
