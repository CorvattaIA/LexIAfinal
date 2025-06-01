import { ReactNode } from 'react';

/**
 * Interfaz base para los datos de una etapa en el flujo de servicio
 */
export interface ServiceStage {
  id: string;
  number: number;
  title: string;
  shortTitle: string;
  description: string;
  price: string;
  buttonText: string;
  linkTo: string;
  color: string;
  features?: string[];
}

/**
 * Opciones de visualización para el componente ServiceFlow
 */
export interface ServiceFlowOptions {
  /** Orientación del flujo: horizontal o vertical */
  orientation: 'horizontal' | 'vertical';
  /** Si se debe mostrar la vista expandida por defecto */
  defaultExpanded?: boolean;
  /** Si se deben mostrar las características en la vista compacta */
  showFeaturesInCompactView?: boolean;
  /** Si se debe usar animaciones avanzadas (puede afectar el rendimiento) */
  useAdvancedAnimations?: boolean;
  /** Clase CSS personalizada para el contenedor principal */
  className?: string;
  /** Estilo visual: moderno o clásico */
  visualStyle?: 'modern' | 'classic';
}

/**
 * Props para el componente ServiceFlow
 */
export interface ServiceFlowProps {
  /** Datos de las etapas a mostrar */
  stages: ServiceStage[];
  /** Opciones de visualización */
  options?: Partial<ServiceFlowOptions>;
  /** Título del componente */
  title?: string;
  /** Función a ejecutar cuando se selecciona una etapa */
  onStageSelect?: (stageId: string) => void;
}
