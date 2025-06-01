
import { useState } from 'react';
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

// Componente de número de etapa moderno y atractivo
const StageNumber = ({ number, isActive }: { number: number; isActive: boolean }) => (
  <div 
    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg
      ${isActive 
        ? 'bg-gradient-to-r from-[var(--steel-blue)] to-[var(--steel-blue-light)] text-white shadow-md ring-2 ring-[var(--steel-blue)]/30 ring-offset-2 ring-offset-[var(--bone)]' 
        : 'bg-white text-[var(--coal)] border border-[var(--steel-blue)]/30 hover:border-[var(--sunshine)] hover:text-[var(--steel-blue)] hover:shadow-md'}
      transition-all duration-300 transform hover:scale-105`}
  >
    {number}
  </div>
);

// Función para obtener el icono correspondiente a cada etapa con efectos mejorados
const getStageIcon = (stage: number, isActive: boolean) => {
  // Clases base mejoradas con efectos de hover y transiciones
  const baseClass = `w-8 h-8 md:w-10 md:h-10 ${isActive 
    ? 'text-[var(--steel-blue)] filter drop-shadow-sm' 
    : 'text-[var(--coal)] hover:text-[var(--steel-blue)] hover:filter hover:drop-shadow-sm'} 
    transition-all duration-300 transform hover:scale-110`;
  
  // Colores específicos para cada etapa para mayor distinción visual
  const stageColors = {
    1: isActive ? 'text-[var(--steel-blue)]' : 'hover:text-[var(--steel-blue)]',
    2: isActive ? 'text-[var(--steel-blue)]' : 'hover:text-[var(--steel-blue)]',
    3: isActive ? 'text-[var(--steel-blue)]' : 'hover:text-[var(--steel-blue)]',
    4: isActive ? 'text-[var(--steel-blue)]' : 'hover:text-[var(--steel-blue)]',
    5: isActive ? 'text-[var(--sunshine)]' : 'hover:text-[var(--sunshine)]',
  };
  
  // Clase combinada con color específico de la etapa
  const combinedClass = `${baseClass} ${stageColors[stage as keyof typeof stageColors]}`;
  
  switch(stage) {
    case 1: return <DiagnosticoIcon className={combinedClass} />;
    case 2: return <AutoAsistenciaIcon className={combinedClass} />;
    case 3: return <ReporteEstrategicoIcon className={combinedClass} />;
    case 4: return <IntervencionEspecializadaIcon className={combinedClass} />;
    case 5: return <RepresentacionIntegralIcon className={combinedClass} />;
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
    title: "Test diagnóstico inicial automático", 
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
    color: "var(--steel-blue)"
  },
  { 
    id: 's2', 
    number: 2, 
    title: "Auto-Asistencia Legal (LexIA )", 
    shortTitle: "Auto-Asistencia",
    description: "Interacción con nuestra IA legal especializada", 
    features: [
      "Chat ilimitado con LexIA para consultas legales",
      "Generación de documentos legales básicos",
      "Acceso a recursos legales relevantes"
    ],
    price: "Desde 45.000 COP", 
    buttonText: "Explorar opciones", 
    linkTo: "/auto-asistencia-lexia",
    color: "var(--steel-blue)"
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
    color: "var(--steel-blue)"
  },
  { 
    id: 's4', 
    number: 4, 
    title: "Intervención especializada", 
    shortTitle: "Consulta specializada",
    description: "Asesoramiento directo con abogados expertos", 
    features: [
      "Videoconsulta personalizada con especialista",
      "Revisión de documentos y evidencias",
      "Plan de acción específico para tu caso"
    ],
    price: "Desde 90.000 COP", 
    buttonText: "Ver paquetes", 
    linkTo: "/Intervencion-especializada",
    color: "var(--steel-blue)"
  },
  { 
    id: 's5', 
    number: 5, 
    title: "Representación integral", 
    shortTitle: "Representación legal",
    description: "Gestión completa de tu caso por nuestro equipo legal", 
    features: [
      "Representación legal completa",
      "Gestión de documentación y trámites",
      "Seguimiento y comunicación constante"
    ],
    price: "Presupuesto personalizado", 
    buttonText: "Solicitar información", 
    linkTo: "/representacion-integral",
    color: "var(--sunshine)"
  },
];

const ServiceFlowGuideComponent = () => {
  const [expandedView, setExpandedView] = useState<boolean>(false);
  const [activeStage, setActiveStage] = useState<number | null>(null);
  
  // Función para alternar entre vista compacta y expandida
  const toggleExpandedView = () => {
    setExpandedView(!expandedView);
    if (activeStage !== null) setActiveStage(null);
  };

  // Renderiza la vista compacta con tarjetas en línea pero con diseño mejorado
  const renderCompactView = (): React.ReactNode => {
    return (
      <div className="w-full py-8">
        {/* Fondo decorativo con gradiente sutil */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--bone)] via-[var(--bone)] to-[var(--bone)] opacity-50 -z-10"></div>
      
        {/* Contenedor principal con efecto de elevación */}
        <div className="relative flex flex-col md:flex-row md:items-stretch gap-6 md:gap-2 overflow-hidden">
        {stagesData.map((stage, index) => {
          const isActive = index === activeStage;
          const stageColor = stage.color;
          
          return (
            <div key={stage.id} className="relative flex-1 group">
              {/* Línea de conexión entre etapas (visible en dispositivos medianos y grandes) */}
              {index < stagesData.length - 1 && (
                <div className="hidden md:block absolute -right-3 top-1/2 transform -translate-y-1/2 z-10">
                  <div className="relative">
                    <div className="absolute inset-0 animate-pulse-subtle opacity-70 blur-sm" style={{ color: stageColor }}>
                      <ElegantArrowIcon className="w-6 h-6" />
                    </div>
                    <ElegantArrowIcon className={`w-6 h-6 text-[#64748B] group-hover:text-[${stageColor}] transition-colors duration-300`} />
                  </div>
                </div>
              )}
              
              {/* Tarjeta para cada etapa con efectos mejorados */}
              <Card 
                className={`h-full transition-all duration-300 backdrop-blur-sm
                  ${isActive 
                    ? `bg-gradient-to-br from-[${stageColor}]/10 to-transparent border-l-4 border-l-[${stageColor}] shadow-lg shadow-[${stageColor}]/10` 
                    : 'bg-white/90 hover:bg-[var(--bone)]/90'}`}
                onClick={() => setActiveStage(index)}
                withHover
              >
                <div className="flex flex-col h-full relative overflow-hidden">
                  {/* Efecto de brillo en hover (solo visible cuando no está activo) */}
                  {!isActive && (
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-transparent via-white/5 to-transparent bg-[length:200%_100%] animate-shimmer transition-opacity duration-300"></div>
                  )}
                  
                  {/* Encabezado de la etapa con número e icono */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <StageNumber number={stage.number} isActive={isActive} />
                      <h3 className={`ml-3 font-bold text-lg ${isActive ? 'text-[var(--coal)]' : 'text-[var(--coal)] group-hover:text-[var(--coal)]'} transition-all duration-300`}>
                        {stage.shortTitle}
                      </h3>
                    </div>
                    <div className="flex-shrink-0">
                      {getStageIcon(stage.number, isActive)}
                    </div>
                  </div>
                  
                  {/* Descripción de la etapa con animación de aparición/desaparición */}
                  <div className={`mt-2 overflow-hidden transition-all duration-300 ease-in-out
                    ${isActive ? 'max-h-24 opacity-100' : 'max-h-0 md:max-h-12 opacity-0 md:opacity-70'}`}>
                    <p className={`text-sm ${isActive ? 'text-[var(--coal)]' : 'text-[var(--coal)]'} transition-colors duration-300`}>
                      {stage.description}
                    </p>
                  </div>
                  
                  {/* Precio (siempre visible) con efecto de resaltado */}
                  <div className="mt-auto pt-4">
                      <div className="flex justify-between items-center">
                      <span className={`text-sm font-medium ${isActive ? `text-[${stageColor}]` : 'text-[var(--coal)] group-hover:text-[var(--sunshine)]'} transition-all duration-300`}>
                        {stage.price}
                      </span>
                    </div>
                  </div>
                  
                  {/* Botón de acción con animación de aparición */}
                  <div className={`mt-4 transition-all duration-300 ease-in-out overflow-hidden ${isActive ? 'max-h-12 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <Link to={stage.linkTo} className="block">
                      <Button 
                        variant="secondary"
                        className={`w-full font-medium bg-[${stageColor}]/10 hover:bg-[${stageColor}]/20 text-[${stageColor}] shadow-sm shadow-[${stageColor}]/20 transition-all duration-300`}
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
      
        {/* Botón para alternar a la vista expandida con efectos mejorados */}
        <div className="flex justify-center mt-8">
          <button 
            onClick={toggleExpandedView}
            className="flex items-center gap-2 text-sm text-[var(--coal)] hover:text-[var(--sunshine)] bg-white hover:bg-[var(--bone)] px-5 py-2.5 rounded-full border border-[var(--steel-blue)]/30 hover:border-[var(--sunshine)]/50 transition-all duration-300 hover:shadow-md transform hover:-translate-y-0.5 active:translate-y-0 hover:scale-102"
          >
            <InfoIcon className="w-5 h-5" />
            Ver detalles completos
          </button>
        </div>
      </div>
    );
  }

  // Renderiza la vista expandida con tarjetas detalladas
  const renderExpandedView = (): React.ReactNode => {
    return (
      <div className="w-full py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stagesData.map((stage) => (
            <Card 
              key={stage.id}
              className={`overflow-hidden border-t-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
              style={{borderTopColor: stage.color}}
            >
              {/* Header */}
              <div className="p-5 bg-gradient-to-r from-[var(--bone)] to-transparent">
                <div className="flex items-center gap-3 mb-3">
                  <StageNumber number={stage.number} isActive={true} />
                  <h3 className="font-bold text-lg bg-gradient-to-r from-[var(--steel-blue)] to-[var(--steel-blue-light)] text-transparent bg-clip-text">{stage.shortTitle}</h3>
                  <div className="ml-auto">{getStageIcon(stage.number, true)}</div>
                </div>
                <p className="text-[var(--coal)]">{stage.description}</p>
              </div>
              
              {/* Features */}
              <div className="p-5 border-t border-b border-[var(--steel-blue)]/20">
                <h4 className="text-[var(--steel-blue)] font-medium text-sm mb-3">Características:</h4>
                <ul className="space-y-2">
                  {stage.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[var(--coal)]">
                      <span className="text-[var(--steel-blue)] flex-shrink-0 mt-1">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Footer */}
              <div className="p-5 bg-[var(--bone)]/50">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[var(--coal)]">Precio:</span>
                  <span className="font-bold text-[var(--sunshine)] drop-shadow-sm">{stage.price}</span>
                </div>
                <Link to={stage.linkTo} className="block">
                  <Button 
                    variant="secondary" 
                    className="w-full bg-[var(--steel-blue)]/10 hover:bg-[var(--steel-blue)]/20 text-[var(--steel-blue)] shadow-sm transition-all duration-300"
                    style={{backgroundColor: `${stage.color}10`, color: stage.color}}
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
            className="flex items-center gap-2 text-sm text-[var(--coal)] hover:text-[var(--sunshine)] bg-white hover:bg-[var(--bone)] px-4 py-2 rounded-full border border-[var(--steel-blue)]/30 hover:border-[var(--sunshine)]/50 transition-all duration-300 hover:shadow-md hover:scale-102 transform"
          >
            <InfoIcon className="w-4 h-4" />
            Ver vista compacta
          </button>
        </div>
      </div>
    );
  };

  return expandedView ? renderExpandedView() : renderCompactView();
}

// Solo exportamos el componente como default
export default ServiceFlowGuideComponent;
