import React from 'react';
import Typography from '../ui/Typography';
import { motion } from 'framer-motion';

interface StageNumberProps {
  number: number;
  isActive: boolean;
  visualStyle?: 'modern' | 'classic';
  useAnimations?: boolean;
}

/**
 * Componente para mostrar el número de etapa con estilos y animaciones
 */
export const StageNumber: React.FC<StageNumberProps> = ({ 
  number, 
  isActive, 
  visualStyle = 'modern',
  useAnimations = true
}) => {
  // Clases base para todos los estilos
  const baseClasses = `
    w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg
    transition-all duration-300 transform hover:scale-105
  `;
  
  // Clases específicas según el estilo visual
  const styleClasses = visualStyle === 'modern'
    ? `${isActive 
        ? 'bg-gradient-to-r from-[var(--background-accent)] to-[var(--background-accent-light)] text-white shadow-md ring-2 ring-[var(--border-accent)]/30 ring-offset-2 ring-offset-[var(--background)]' 
        : 'bg-[var(--background-card)] text-[var(--text-primary)] border border-[var(--border-accent)]/30 hover:border-[var(--border-warning)] hover:text-[var(--text-accent)] hover:shadow-md'}`
    : `${isActive 
        ? 'bg-gradient-to-br from-[var(--steel-blue)] to-[var(--steel-blue)]/80 text-white shadow-lg shadow-[var(--steel-blue)]/30 border-2 border-[var(--sunshine)]/30' 
        : 'bg-[var(--bone)] text-[var(--coal)] border-2 border-[var(--steel-blue)]/30 hover:border-[var(--sunshine)] hover:text-[var(--coal)]'}`;
  
  // Combinamos todas las clases
  const combinedClasses = `${baseClasses} ${styleClasses}`;
  
  // Animaciones para el número de etapa
  const animations = useAnimations && isActive
    ? {
        scale: [1, 1.05, 1],
        boxShadow: [
          '0 0 5px rgba(var(--border-accent-rgb), 0.3), 0 0 10px rgba(var(--border-accent-rgb), 0.2)',
          '0 0 10px rgba(var(--border-accent-rgb), 0.5), 0 0 20px rgba(var(--border-accent-rgb), 0.3)',
          '0 0 5px rgba(var(--border-accent-rgb), 0.3), 0 0 10px rgba(var(--border-accent-rgb), 0.2)'
        ],
        transition: { repeat: Infinity, duration: 2.5, ease: "easeInOut" }
      }
    : {};
  
  // Renderizamos con o sin animaciones según la configuración
  return useAnimations ? (
    <motion.div 
      className={combinedClasses}
      animate={animations}
      role="presentation"
      aria-hidden="true"
    >
      <Typography 
        variant="body" 
        weight="bold" 
        color={isActive ? 'white' : 'var(--text-primary)'}
        as="span"
      >
        {number}
      </Typography>
    </motion.div>
  ) : (
    <div 
      className={combinedClasses}
      role="presentation"
      aria-hidden="true"
    >
      <Typography 
        variant="body" 
        weight="bold" 
        color={isActive ? 'white' : 'var(--text-primary)'}
        as="span"
      >
        {number}
      </Typography>
    </div>
  );
};
