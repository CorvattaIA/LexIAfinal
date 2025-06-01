import { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from './ui/Card';
import Button from './ui/Button';
import { motion } from 'framer-motion';
import { 
  DiagnosticoIcon, 
  AutoAsistenciaIcon, 
  ReporteEstrategicoIcon, 
  IntervencionEspecializadaIcon, 
  RepresentacionIntegralIcon,
  InfoIcon,
  ElegantArrowIcon
} from './icons/ServiceIcons';

// Componente de número de etapa moderno y atractivo con efectos neón sutiles
const StageNumber = ({ number, isActive }: { number: number; isActive: boolean }) => (
  <motion.div 
    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg
      ${isActive 
        ? 'bg-gradient-to-br from-[#3B82F6] to-[#06B6D4] text-white shadow-lg shadow-[#3B82F6]/30 neon-glow-hover' 
        : 'bg-[#1E293B] text-[#94A3B8] border border-[#334155] hover:border-[#00c3ff] hover:text-white'} 
      transition-all duration-300 transform hover:scale-105 transition-bounce`}
    animate={isActive ? {
      scale: [1, 1.05, 1],
      transition: { repeat: Infinity, duration: 2, ease: "easeInOut" }
    } : {}}
  >
    {number}
  </motion.div>
);

// Función para obtener el icono de la etapa según el número con animaciones mejoradas
const getStageIcon = (stageNumber: number, isActive: boolean) => {
  // Clase base para todos los iconos con animaciones sofisticadas
  const iconClass = `w-8 h-8 ${isActive 
    ? 'text-[#F59E0B] animate-float' 
    : 'text-[#64748B] hover:text-[#00c3ff]'} 
    transition-all duration-300 transform hover:scale-110`;
  
  // Clase para el contenedor del icono con efecto neón sutil en hover
  const iconContainerClass = `relative ${isActive ? 'neon-glow-hover' : ''}`;
  
  const renderIcon = (Icon: React.ComponentType<{className: string}>) => (
    <div className={iconContainerClass}>
      <Icon className={iconClass} />
      {isActive && (
        <div className="absolute inset-0 bg-transparent rounded-full animate-pulse-subtle opacity-50"></div>
      )}
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
    color: '#3B82F6'
  },
  {
    id: 'auto-asistencia',
    number: 2,
    shortTitle: 'AUTO-ASISTENCIA LEGAL',
    title: 'AUTO-ASISTENCIA LEGAL',
    description: 'Acceso a herramientas y recursos para gestionar aspectos básicos de tu caso por tu cuenta.',
    price: 'Desde $45.000',
    buttonText: 'Contratar Auto-Asistencia',
    linkTo: '/auto-asistencia',
    color: '#06B6D4'
  },
  {
    id: 'reporte',
    number: 3,
    shortTitle: 'REPORTE ESTRATÉGICO',
    title: 'REPORTE ESTRATÉGICO PERSONALIZADO',
    description: 'Análisis detallado de tu caso con recomendaciones específicas por un abogado especializado.',
    price: 'Desde $99.900',
    buttonText: 'Solicitar Reporte',
    linkTo: '/reporte-estrategico',
    color: '#F59E0B'
  },
  {
    id: 'intervencion',
    number: 4,
    shortTitle: 'INTERVENCIÓN ESPECIALIZADA',
    title: 'INTERVENCIÓN ESPECIALIZADA',
    description: 'Asistencia legal directa para aspectos específicos de tu caso que requieren experiencia profesional.',
    price: 'Desde $199.900',
    buttonText: 'Solicitar Intervención',
    linkTo: '/intervencion-especializada',
    color: '#EC4899'
  },
  {
    id: 'representacion',
    number: 5,
    shortTitle: 'REPRESENTACIÓN INTEGRAL',
    title: 'REPRESENTACIÓN LEGAL INTEGRAL',
    description: 'Gestión completa de tu caso legal por un abogado especializado, desde el inicio hasta su resolución.',
    price: 'Personalizado',
    buttonText: 'Solicitar Representación',
    linkTo: '/representacion-integral',
    color: '#8B5CF6'
  },
];

function ServiceFlow() {
  const [expandedView, setExpandedView] = useState(false);
  const [activeStage, setActiveStage] = useState<number | null>(null);
  
  // Función para alternar entre vista compacta y expandida
  const toggleExpandedView = () => {
    setExpandedView(!expandedView);
    if (activeStage !== null) setActiveStage(null);
  };

  // Renderiza la vista compacta con un diseño de línea de tiempo visual y animaciones sofisticadas
  const renderCompactView = () => {
    return (
    <div className="w-full py-8 relative">
      {/* Fondo decorativo con gradiente sutil y animación */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-0 w-64 h-64 bg-[#3B82F6]/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 left-0 w-72 h-72 bg-[#F59E0B]/5 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] opacity-50 -z-10"></div>
      
      {/* Línea de tiempo vertical que conecta todas las etapas */}
      <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 top-[120px] bottom-[120px] w-1 bg-gradient-to-b from-[#3B82F6] via-[#06B6D4] to-[#8B5CF6] opacity-20 z-0"></div>
      
      {/* Contenedor principal con efecto de elevación y animaciones */}
      <div className="relative flex flex-col gap-8 max-w-3xl mx-auto overflow-hidden">
        {stagesData.map((stage, index) => {
          const isActive = index === activeStage;
          const stageColor = stage.color;
          
          // Clase para animación de aparición escalonada
          const animationDelay = `${index * 0.1}s`;
          
          return (
            <div 
              key={stage.id} 
              className="relative flex-1 group reveal-on-scroll revealed" 
              style={{animationDelay}}
            >
              {/* Línea de conexión entre etapas con animación (visible en dispositivos medianos y grandes) */}
              {index < stagesData.length - 1 && (
                <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 -bottom-6 z-10">
                  <div className="relative animate-pulse-subtle rotate-90">
                    <ElegantArrowIcon className="w-6 h-6 text-[#64748B] group-hover:text-[#00c3ff] transition-all duration-300" />
                  </div>
                </div>
              )}
              
              {/* Tarjeta para cada etapa con efectos mejorados, animaciones y efectos neón sutiles */}
              <Card 
                className={`h-full transition-all duration-500 backdrop-blur-sm transform transition-bounce
                  ${isActive 
                    ? `bg-gradient-to-br from-[${stageColor}]/15 to-transparent border-t-4 border-t-[${stageColor}] shadow-lg shadow-[${stageColor}]/20 neon-glow-hover` 
                    : 'bg-[#0F172A]/70 hover:bg-[#1E293B]/80 hover:border-t-2 hover:border-t-[#00c3ff]'}`}
                onClick={() => setActiveStage(index)}
                withHover
              >
                <div className="flex flex-col h-full relative overflow-hidden">
                  {/* Efecto de brillo en hover (solo visible cuando no está activo) */}
                  {!isActive && (
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-transparent via-white/5 to-transparent bg-[length:200%_100%] animate-shimmer transition-opacity duration-300"></div>
                  )}
                  
                  {/* Encabezado de la etapa con número e icono - con tipografía consistente y animaciones */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <StageNumber number={stage.number} isActive={isActive} />
                      <h3 className={`ml-3 font-bold text-lg title-case ${isActive 
                        ? 'text-white' 
                        : 'text-[#94A3B8] group-hover:text-white'} 
                        transition-all duration-300 transform group-hover:translate-x-1 transition-bounce`}>
                        {stage.shortTitle}
                      </h3>
                    </div>
                    <div className="flex-shrink-0 transform group-hover:scale-110 transition-bounce">
                      {getStageIcon(stage.number, isActive)}
                    </div>
                  </div>
                  
                  {/* Descripción de la etapa con animación de aparición/desaparición mejorada */}
                  <div className={`mt-2 overflow-hidden transition-all duration-500 ease-in-out
                    ${isActive ? 'max-h-28 opacity-100 animate-slideInLeft' : 'max-h-0 md:max-h-12 opacity-0 md:opacity-70'}`}>
                    <p className={`text-sm sentence-case ${isActive ? 'text-[#E2E8F0]' : 'text-[#94A3B8]'} transition-all duration-300 leading-relaxed`}>
                      {stage.description}
                    </p>
                  </div>
                  
                  {/* Precio (siempre visible) con efecto de resaltado y neón sutil */}
                  <div className="mt-auto pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs uppercase tracking-wider text-[#94A3B8]">Precio</span>
                      <span className={`text-sm font-medium ${isActive 
                        ? `text-[${stageColor}] font-bold` 
                        : 'text-[#94A3B8] group-hover:text-[#00c3ff]'} 
                        transition-all duration-300 ${isActive ? 'neon-text-cyan' : ''}`}>
                        {stage.price}
                      </span>
                    </div>
                  </div>
                  
                  {/* Botón de acción con animación de aparición mejorada y efecto neón */}
                  <div className={`mt-4 transition-all duration-500 ease-in-out overflow-hidden ${isActive ? 'max-h-12 opacity-100 animate-slideInLeft' : 'max-h-0 opacity-0'}`}>
                    <Link to={stage.linkTo} className="block">
                      <Button 
                        variant="secondary"
                        className={`w-full font-medium bg-[${stageColor}]/10 hover:bg-[${stageColor}]/20 text-[${stageColor}] 
                          shadow-sm hover:shadow-md shadow-[${stageColor}]/20 hover:shadow-[${stageColor}]/30 
                          transition-all duration-300 transform hover:translate-y-[-2px] neon-glow-hover btn
                          title-case`}
                      >
                        {stage.buttonText}
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </div>
          );
        })}
      </div>
      
      {/* Botón para alternar a la vista expandida con animaciones sofisticadas y efectos neón */}
      <div className="flex justify-center mt-10">
        <button 
          onClick={toggleExpandedView}
          className="flex items-center gap-2 text-sm text-[#94A3B8] hover:text-[#00c3ff] bg-[#1E293B] hover:bg-[#1E293B]/90 
            px-6 py-3 rounded-full border border-[#334155] hover:border-[#00c3ff] transition-all duration-300 
            hover:shadow-[0_0_15px_rgba(0,195,255,0.3)] transform hover:-translate-y-1 active:translate-y-0 
            neon-glow-hover btn transition-bounce title-case"
        >
          <InfoIcon className="w-5 h-5 animate-pulse-subtle" />
          Ver detalles completos
        </button>
      </div>
    </div>
  );
  }

  // Renderiza la vista expandida con tarjetas detalladas, animaciones sofisticadas y efectos neón
  const renderExpandedView = () => {
    return (
      <div className="w-full py-8 relative">
        {/* Fondo decorativo con gradiente y animación */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-0 w-80 h-80 bg-[#3B82F6]/5 rounded-full blur-3xl animate-breathe"></div>
          <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-[#F59E0B]/5 rounded-full blur-3xl animate-float" style={{animationDelay: '1.5s'}}></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stagesData.map((stage, index) => {
            // Animación escalonada para las tarjetas
            const animationDelay = `${index * 0.15}s`;
            
            return (
              <Card 
                key={stage.id}
                className={`overflow-hidden border-t-4 border-t-[${stage.color}] shadow-lg hover:shadow-xl 
                  </div>
                <div className="p-6">
                  <p className="text-[#E2E8F0] mb-6 sentence-case leading-relaxed animate-slideInLeft" style={{animationDelay: `${index * 0.2 + 0.2}s`}}>
                    {stage.description}
                  </p>
                  
                  <div className="flex justify-between items-center mb-6 animate-slideInLeft" style={{animationDelay: `${index * 0.2 + 0.4}s`}}>
                    <span className="text-xs uppercase tracking-wider text-[#94A3B8]">Precio</span>
                    <span className="font-semibold text-[#F59E0B] neon-text-cyan">{stage.price}</span>
                  </div>
                  
                  <div className="animate-slideInLeft" style={{animationDelay: `${index * 0.2 + 0.6}s`}}>
                    <Link to={stage.linkTo} className="block">
                      <Button 
                        variant="secondary" 
                        className={`w-full bg-[${stage.color}]/10 hover:bg-[${stage.color}]/20 text-[${stage.color}] 
                          shadow-sm hover:shadow-md shadow-[${stage.color}]/20 hover:shadow-[${stage.color}]/30 
                          transition-all duration-300 transform hover:-translate-y-1 neon-glow-hover btn title-case`}
                      >
                        {stage.buttonText}
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
        
        {/* Botón para alternar a la vista compacta con animaciones sofisticadas y efectos neón */}
        <div className="flex justify-center mt-10">
          <button 
            onClick={toggleExpandedView}
            className="flex items-center gap-2 text-sm text-[#94A3B8] hover:text-[#00c3ff] bg-[#1E293B] hover:bg-[#1E293B]/90 
              px-6 py-3 rounded-full border border-[#334155] hover:border-[#00c3ff] transition-all duration-300 
              hover:shadow-[0_0_15px_rgba(0,195,255,0.3)] transform hover:-translate-y-1 active:translate-y-0 
              neon-glow-hover btn transition-bounce title-case"
          >
            <InfoIcon className="w-5 h-5 animate-pulse-subtle" />
            Ver vista compacta
          </button>
        </div>
      </div>
    );
  };

  return expandedView ? renderExpandedView() : renderCompactView();
}

export default ServiceFlow;
