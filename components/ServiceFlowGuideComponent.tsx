
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Card from './ui/Card';
import Button from './ui/Button';
import { 
  DiagnosticoIcon, 
  AutoAsistenciaIcon, 
  ReporteEstrategicoIcon, 
  IntervencionEspecializadaIcon, 
  RepresentacionIntegralIcon,
  InfoIcon,
  ElegantArrowIcon
} from './icons/ServiceIcons';

// Componente de número de etapa moderno
const StageNumber = ({ number, isActive }: { number: number; isActive: boolean }) => (
  <div 
    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg
      ${isActive 
        ? 'bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] text-white shadow-lg' 
        : 'bg-[#1E293B] text-[#94A3B8] border border-[#334155]'}
      transition-all duration-300`}
  >
    {number}
  </div>
);

// Función para obtener el icono correspondiente a cada etapa
const getStageIcon = (stage: number, isActive: boolean) => {
  const baseClass = `w-6 h-6 md:w-8 md:h-8 ${isActive ? 'text-[#06B6D4]' : 'text-[#94A3B8]'} transition-colors duration-300`;
  
  switch(stage) {
    case 1: return <DiagnosticoIcon className={baseClass} />;
    case 2: return <AutoAsistenciaIcon className={baseClass} />;
    case 3: return <ReporteEstrategicoIcon className={baseClass} />;
    case 4: return <IntervencionEspecializadaIcon className={baseClass} />;
    case 5: return <RepresentacionIntegralIcon className={baseClass} />;
    default: return null;
  }
};

interface Stage {
  id: string;
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

const stagesData: Stage[] = [
  { 
    id: 's1', 
    number: 1, 
    title: "Test Diagnóstico Inicial Automático", 
    shortTitle: "Diagnóstico IA",
    description: "Evaluación inicial automatizada de tu caso legal", 
    features: [
      "Análisis preliminar de tu situación legal",
      "Identificación del área legal aplicable",
      "Orientación sobre posibles vías de acción"
    ],
    price: "Gratis con registro", 
    buttonText: "Comenzar diagnóstico", 
    linkTo: "/diagnostico-inicial",
    color: "#3B82F6"
  },
  { 
    id: 's2', 
    number: 2, 
    title: "Auto-Asistencia Legal (LexIA DIY)", 
    shortTitle: "Auto-Asistencia",
    description: "Interacción con nuestra IA legal especializada", 
    features: [
      "Chat ilimitado con LexIA para consultas legales",
      "Generación de documentos legales básicos",
      "Acceso a recursos legales relevantes"
    ],
    price: "Desde 40.000 COP", 
    buttonText: "Explorar opciones", 
    linkTo: "/auto-asistencia-lexia",
    color: "#06B6D4"
  },
  { 
    id: 's3', 
    number: 3, 
    title: "Reporte Estratégico Híbrido", 
    shortTitle: "Reporte Estratégico",
    description: "Análisis detallado validado por expertos legales", 
    features: [
      "Análisis profundo de tu caso por IA avanzada",
      "Revisión y validación por abogados especialistas",
      "Reporte PDF con estrategias y recomendaciones"
    ],
    price: "Desde 120.000 COP", 
    buttonText: "Solicitar reporte", 
    linkTo: "/reporte-estrategico",
    color: "#8B5CF6"
  },
  { 
    id: 's4', 
    number: 4, 
    title: "Intervención Especializada", 
    shortTitle: "Consulta Especializada",
    description: "Asesoramiento directo con abogados expertos", 
    features: [
      "Videoconsulta personalizada con especialista",
      "Revisión de documentos y evidencias",
      "Plan de acción específico para tu caso"
    ],
    price: "Desde 90.000 COP", 
    buttonText: "Ver paquetes", 
    linkTo: "/intervencion-especializada",
    color: "#EC4899"
  },
  { 
    id: 's5', 
    number: 5, 
    title: "Representación Integral", 
    shortTitle: "Representación Legal",
    description: "Gestión completa de tu caso por nuestro equipo legal", 
    features: [
      "Representación legal completa",
      "Gestión de documentación y trámites",
      "Seguimiento y comunicación constante"
    ],
    price: "Presupuesto personalizado", 
    buttonText: "Solicitar información", 
    linkTo: "/representacion-integral",
    color: "#F59E0B"
  },
];

const ServiceFlowGuideComponent: React.FC = () => {
  const [activeStage, setActiveStage] = useState<string | null>(null);
  const [expandedView, setExpandedView] = useState<boolean>(false);

  const toggleExpandedView = () => {
    setExpandedView(!expandedView);
    if (activeStage) setActiveStage(null);
  };

  // Renderiza la vista compacta con tarjetas en línea
  const renderCompactView = () => (
    <div className="w-full overflow-x-auto py-6">
      <div className="flex flex-col md:flex-row gap-6 md:gap-4 justify-between items-stretch min-w-[800px] md:min-w-0">
        {stagesData.map((stage, index) => {
          const isActive = activeStage === stage.id;
          return (
            <div 
              key={stage.id}
              className={`relative flex-1 group cursor-pointer transition-all duration-300 transform ${isActive ? 'scale-105' : 'hover:scale-102'}`}
              onClick={() => setActiveStage(isActive ? null : stage.id)}
            >
              <Card 
                className={`h-full flex flex-col overflow-hidden border ${isActive ? `border-[${stage.color}] shadow-lg` : 'border-[#334155] hover:border-[#94A3B8]'} transition-all duration-300`}
              >
                {/* Header */}
                <div 
                  className={`p-4 flex items-center gap-3 ${isActive ? `bg-gradient-to-r from-[${stage.color}]/10 to-[${stage.color}]/5` : 'bg-[#1E293B]'}`}
                >
                  <StageNumber number={stage.number} isActive={isActive} />
                  <div className="flex-1">
                    <h3 className={`font-semibold text-base ${isActive ? `text-[${stage.color}]` : 'text-white'} transition-colors duration-300`}>
                      {stage.shortTitle}
                    </h3>
                  </div>
                  <div className="flex-shrink-0">
                    {getStageIcon(stage.number, isActive)}
                  </div>
                </div>
                
                {/* Content - visible on hover/active */}
                <div className={`px-4 py-3 flex-1 flex flex-col ${isActive ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'} transition-opacity duration-300`}>
                  <p className="text-sm text-[#E2E8F0] mb-2">{stage.description}</p>
                  <div className="mt-auto flex items-center justify-between text-sm">
                    <span className="text-[#94A3B8]">Precio:</span>
                    <span className="font-medium text-[#F59E0B]">{stage.price}</span>
                  </div>
                </div>
                
                {/* Footer with button - only visible when active */}
                {isActive && (
                  <div className="p-3 bg-[#0F172A] border-t border-[#334155]">
                    <Link to={stage.linkTo} className="block">
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        className={`w-full text-xs font-medium bg-[${stage.color}]/10 hover:bg-[${stage.color}]/20 text-[${stage.color}] transition-colors`}
                      >
                        {stage.buttonText}
                      </Button>
                    </Link>
                  </div>
                )}
              </Card>
              
              {/* Connecting arrows */}
              {index < stagesData.length - 1 && (
                <div className="hidden md:block absolute -right-6 top-1/2 transform -translate-y-1/2 z-10">
                  <ElegantArrowIcon className="w-5 h-5 text-[#64748B]" />
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Toggle expanded view button */}
      <div className="flex justify-center mt-6">
        <button 
          onClick={toggleExpandedView}
          className="flex items-center gap-2 text-sm text-[#94A3B8] hover:text-[#F59E0B] bg-[#1E293B] px-4 py-2 rounded-full border border-[#334155] transition-colors"
        >
          <InfoIcon className="w-4 h-4" />
          Ver detalles completos
        </button>
      </div>
    </div>
  );

  // Renderiza la vista expandida con tarjetas detalladas
  const renderExpandedView = () => (
    <div className="w-full py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stagesData.map((stage) => (
          <Card 
            key={stage.id}
            className={`overflow-hidden border-t-4 border-t-[${stage.color}] shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-102`}
          >
            {/* Header */}
            <div className={`p-5 bg-gradient-to-r from-[${stage.color}]/10 to-transparent`}>
              <div className="flex items-center gap-3 mb-3">
                <StageNumber number={stage.number} isActive={true} />
                <h3 className="font-bold text-lg text-white">{stage.shortTitle}</h3>
                <div className="ml-auto">{getStageIcon(stage.number, true)}</div>
              </div>
              <p className="text-[#E2E8F0]">{stage.description}</p>
            </div>
            
            {/* Features */}
            <div className="p-5 border-t border-b border-[#334155]">
              <h4 className="text-[#94A3B8] text-sm mb-3">Características:</h4>
              <ul className="space-y-2">
                {stage.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[#E2E8F0]">
                    <span className="text-[#06B6D4] flex-shrink-0 mt-1">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Footer */}
            <div className="p-5 bg-[#0F172A]">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[#94A3B8]">Precio:</span>
                <span className="font-bold text-[#F59E0B]">{stage.price}</span>
              </div>
              <Link to={stage.linkTo} className="block">
                <Button 
                  variant="secondary" 
                  className={`w-full bg-[${stage.color}]/10 hover:bg-[${stage.color}]/20 text-[${stage.color}] transition-colors`}
                >
                  {stage.buttonText}
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
      
      {/* Toggle compact view button */}
      <div className="flex justify-center mt-6">
        <button 
          onClick={toggleExpandedView}
          className="flex items-center gap-2 text-sm text-[#94A3B8] hover:text-[#F59E0B] bg-[#1E293B] px-4 py-2 rounded-full border border-[#334155] transition-colors"
        >
          <InfoIcon className="w-4 h-4" />
          Ver vista compacta
        </button>
      </div>
    </div>
  );

  return expandedView ? renderExpandedView() : renderCompactView();
};

export default ServiceFlowGuideComponent;
