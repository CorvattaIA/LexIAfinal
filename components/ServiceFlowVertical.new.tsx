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

// Definición de la estructura de datos para las etapas
interface StageData {
  id: string;
  number: number;
  title: string;
  description: string;
  price: string;
  priceDescription: string;
  actionText: string;
  actionLink: string;
  icon: React.ReactNode;
}

// Datos de las etapas del servicio
const stagesData: StageData[] = [
  {
    id: 'diagnostico',
    number: 1,
    title: 'Diagnóstico inicial',
    description: 'Evaluación gratuita de tu caso para determinar el nivel de asistencia legal que necesitas. Responde algunas preguntas y recibe una recomendación personalizada.',
    price: 'Gratis',
    priceDescription: 'Sin compromiso',
    actionText: 'Iniciar Diagnóstico',
    actionLink: '/diagnostico',
    icon: <DiagnosticoIcon />
  },
  {
    id: 'autoasistencia',
    number: 2,
    title: 'Auto-Asistencia',
    description: 'Acceso a herramientas y recursos automatizados para gestionar casos legales simples por tu cuenta, con guías paso a paso y plantillas personalizables.',
    price: '$29.99',
    priceDescription: 'Acceso por 30 días',
    actionText: 'Ver Detalles',
    actionLink: '/servicios/autoasistencia',
    icon: <AutoAsistenciaIcon />
  },
  {
    id: 'reporte',
    number: 3,
    title: 'Reporte Estratégico',
    description: 'Análisis detallado de tu caso por un abogado especializado, con recomendaciones específicas y estrategias a seguir, sin representación directa.',
    price: '$99.99',
    priceDescription: 'Pago único',
    actionText: 'Solicitar Reporte',
    actionLink: '/servicios/reporte',
    icon: <ReporteEstrategicoIcon />
  },
  {
    id: 'intervencion',
    number: 4,
    title: 'Intervención Especializada',
    description: 'Asistencia legal directa para aspectos específicos de tu caso, como revisión de documentos, redacción de escritos o asesoramiento en negociaciones.',
    price: '$199.99',
    priceDescription: 'Desde, según complejidad',
    actionText: 'Consultar',
    actionLink: '/servicios/intervencion',
    icon: <IntervencionEspecializadaIcon />
  },
  {
    id: 'representacion',
    number: 5,
    title: 'Representación Integral',
    description: 'Representación legal completa por un abogado especializado, quien gestionará todos los aspectos de tu caso desde el inicio hasta su resolución.',
    price: 'Personalizado',
    priceDescription: 'Según complejidad y duración',
    actionText: 'Solicitar Presupuesto',
    actionLink: '/servicios/representacion',
    icon: <RepresentacionIntegralIcon />
  }
];

// Componente principal
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
    <div className="w-full py-12 px-4 md:px-8 bg-[#0F172A] relative overflow-hidden">
      <div className="max-w-4xl mx-auto service-flow-container">
        {/* Encabezado con tipografía refinada */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-title mb-8 text-transparent bg-clip-text bg-gradient-to-r from-[#3B82F6] to-[#00c3ff] inline-block title-case-es">
            Nuestro flujo de servicio
          </h2>
          <p className="text-[#94A3B8] max-w-3xl mx-auto text-lg sentence-case leading-relaxed">
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
                        ? 'border-[#3B82F6] shadow-lg shadow-[#3B82F6]/10' 
                        : 'border-[#1E293B] hover:border-[#3B82F6]/40'}
                      ${isExpanded ? 'bg-gradient-to-br from-[#1E293B] to-[#0F172A]' : 'bg-[#1E293B]/20'}
                    `}
                  >
                    {/* Cabecera siempre visible */}
                    <div 
                      className={`p-6 cursor-pointer flex items-center justify-between gap-4 group
                        ${isExpanded ? 'border-b border-[#334155]/50' : ''}`}
                      onClick={() => toggleStage(index)}
                    >
                      {/* Número e icono de etapa */}
                      <div className="flex items-center gap-4">
                        <div 
                          className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg
                            ${isExpanded 
                              ? 'bg-[#3B82F6] shadow-md shadow-[#3B82F6]/20' 
                              : 'bg-[#1E293B] border border-[#334155] group-hover:bg-[#1E293B]/80 group-hover:border-[#3B82F6]/30'}
                            transition-all duration-300
                          `}
                        >
                          <span>{index + 1}</span>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 flex items-center justify-center
                            ${isExpanded ? 'text-[#3B82F6]' : 'text-[#94A3B8] group-hover:text-[#3B82F6]/80'}
                            transition-colors duration-300
                          `}>
                            {stage.icon}
                          </div>
                          
                          <h3 className={`font-semibold title-case transition-all duration-300
                            ${isExpanded ? 'text-[#3B82F6] text-xl' : 'text-white text-lg group-hover:text-[#3B82F6]/80'}`}
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
                          <div className="text-white font-semibold">{stage.price}</div>
                          <div className="text-[#94A3B8] text-xs">Desde</div>
                        </div>
                        
                        <motion.div 
                          className={`w-8 h-8 rounded-full flex items-center justify-center
                            ${isExpanded 
                              ? 'bg-[#3B82F6]/10 text-[#3B82F6]' 
                              : 'bg-[#1E293B] text-[#94A3B8] group-hover:text-[#3B82F6]/80'}
                            transition-all duration-300 border
                            ${isExpanded ? 'border-[#3B82F6]/30' : 'border-[#334155] group-hover:border-[#3B82F6]/20'}
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
                                <p className="text-[#94A3B8] leading-relaxed sentence-case mb-6">
                                  {stage.description}
                                </p>
                                
                                {/* Botón de acción */}
                                <Button 
                                  variant="primary" 
                                  size="md"
                                  className="shadow-lg shadow-[#3B82F6]/10 transition-all duration-300"
                                  onClick={() => {
                                    window.location.href = stage.actionLink;
                                  }}
                                >
                                  {stage.actionText}
                                </Button>
                              </div>
                              
                              {/* Sección de precio detallada */}
                              <div className="p-4 rounded-lg bg-[#1E293B]/50 border border-[#334155] h-fit">
                                <div className="flex items-baseline gap-2 mb-2">
                                  <span className="text-[#94A3B8] text-sm">Desde</span>
                                  <span className="text-2xl font-bold text-white">{stage.price}</span>
                                </div>
                                <p className="text-[#64748B] text-sm sentence-case">{stage.priceDescription}</p>
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

export default ServiceFlowVertical;
