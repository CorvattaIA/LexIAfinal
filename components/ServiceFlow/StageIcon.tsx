import React from 'react';
import { 
  DiagnosticoIcon, 
  AutoAsistenciaIcon, 
  ReporteEstrategicoIcon, 
  IntervencionEspecializadaIcon, 
  RepresentacionIntegralIcon
} from '../icons/ServiceIcons';

interface StageIconProps {
  stageNumber: number;
  isActive: boolean;
  visualStyle?: 'modern' | 'classic';
}

/**
 * Función para obtener el icono correspondiente a cada etapa con efectos mejorados
 */
export const getStageIcon = (stageNumber: number, isActive: boolean, visualStyle: 'modern' | 'classic' = 'modern') => {
  // Clases base para todos los iconos con estilos según el tema visual
  const baseClass = visualStyle === 'modern'
    ? `w-8 h-8 md:w-10 md:h-10 ${isActive 
        ? 'text-[var(--text-accent)] filter drop-shadow-sm' 
        : 'text-[var(--text-primary)] hover:text-[var(--text-accent)] hover:filter hover:drop-shadow-sm'} 
        transition-all duration-300 transform hover:scale-110`
    : `w-10 h-10 ${isActive 
        ? 'text-[var(--steel-blue)] animate-float' 
        : 'text-[var(--coal)] hover:text-[var(--steel-blue)]'} 
        transition-all duration-300 transform hover:scale-110`;
  
  // Colores específicos para cada etapa para mayor distinción visual
  const stageColors = {
    1: isActive ? 'text-[var(--text-accent)]' : 'hover:text-[var(--text-accent)]',
    2: isActive ? 'text-[var(--text-accent)]' : 'hover:text-[var(--text-accent)]',
    3: isActive ? 'text-[var(--text-accent)]' : 'hover:text-[var(--text-accent)]',
    4: isActive ? 'text-[var(--text-accent)]' : 'hover:text-[var(--text-accent)]',
    5: isActive ? 'text-[var(--text-warning)]' : 'hover:text-[var(--text-warning)]',
  };
  
  // Clase combinada con color específico de la etapa
  const combinedClass = `${baseClass} ${stageColors[stageNumber as keyof typeof stageColors] || ''}`;
  
  // Nombres descriptivos para cada icono para mejorar la accesibilidad
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
    "aria-label": iconLabels[stageNumber as keyof typeof iconLabels] || "Etapa",
  };
  
  // Contenedor para efectos visuales adicionales
  const containerClass = visualStyle === 'modern'
    ? `relative ${isActive ? 'filter drop-shadow-md' : ''}`
    : `relative p-2 ${isActive ? 'neon-glow-hover' : ''}`;
  
  // Renderizar el icono con efectos según el estilo visual
  const renderIcon = (Icon: React.ComponentType<{className: string}>) => (
    <div className={containerClass}>
      <Icon className={combinedClass} {...ariaProps} />
      {isActive && visualStyle === 'classic' && (
        <div className="absolute inset-0 bg-[var(--sunshine)]/10 rounded-full animate-pulse-subtle opacity-50"></div>
      )}
      {visualStyle === 'classic' && (
        <div className={`absolute inset-0 rounded-full ${isActive ? 'bg-[var(--sunshine)]/10' : 'bg-[var(--steel-blue)]/5'} -z-10`}></div>
      )}
    </div>
  );
  
  // Seleccionar el icono según el número de etapa
  switch(stageNumber) {
    case 1: return renderIcon(DiagnosticoIcon);
    case 2: return renderIcon(AutoAsistenciaIcon);
    case 3: return renderIcon(ReporteEstrategicoIcon);
    case 4: return renderIcon(IntervencionEspecializadaIcon);
    case 5: return renderIcon(RepresentacionIntegralIcon);
    default: return null;
  }
};
