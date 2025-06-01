import React, { useState } from 'react';
import ServiceFlow from './ServiceFlow';
import { ServiceStage } from '../types/service-flow.types';
import Typography from './ui/Typography';

/**
 * Componente de ejemplo que muestra cómo usar el componente ServiceFlow unificado
 * con diferentes configuraciones y orientaciones
 */
const ServiceFlowExample: React.FC = () => {
  // Estado para almacenar la etapa seleccionada
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  
  // Datos de ejemplo para las etapas (igual a los utilizados en los componentes originales)
  const stagesData: ServiceStage[] = [
    {
      id: "diagnostico",
      number: 1,
      title: "Diagnóstico Jurídico Inicial",
      shortTitle: "Diagnóstico",
      description: "Evaluación inicial de tu caso para identificar los aspectos legales clave y determinar las mejores estrategias.",
      price: "Desde $1,500 MXN",
      buttonText: "Solicitar diagnóstico",
      linkTo: "/servicios/diagnostico",
      color: "var(--border-accent)",
      features: [
        "Análisis preliminar de documentos",
        "Identificación de riesgos legales",
        "Evaluación de viabilidad",
        "Recomendaciones iniciales",
        "Sesión de 45 minutos con especialista"
      ]
    },
    {
      id: "autoasistencia",
      number: 2,
      title: "Auto-Asistencia Legal Guiada",
      shortTitle: "Auto-Asistencia",
      description: "Recursos y herramientas para que gestiones aspectos legales por tu cuenta con nuestra orientación experta.",
      price: "Desde $2,500 MXN",
      buttonText: "Obtener guía",
      linkTo: "/servicios/autoasistencia",
      color: "var(--border-warning)",
      features: [
        "Plantillas personalizadas",
        "Guías paso a paso",
        "Verificación de documentos",
        "Asesoría puntual",
        "Soporte por chat durante 30 días"
      ]
    },
    {
      id: "reporte",
      number: 3,
      title: "Reporte Estratégico Legal",
      shortTitle: "Reporte",
      description: "Análisis detallado de tu situación con estrategias específicas y plan de acción recomendado.",
      price: "Desde $5,000 MXN",
      buttonText: "Solicitar reporte",
      linkTo: "/servicios/reporte",
      color: "var(--border-success)",
      features: [
        "Análisis jurídico profundo",
        "Estrategias personalizadas",
        "Plan de acción detallado",
        "Estimación de tiempos y costos",
        "Sesión de revisión con abogado senior"
      ]
    },
    {
      id: "intervencion",
      number: 4,
      title: "Intervención Legal Especializada",
      shortTitle: "Intervención",
      description: "Gestión directa de aspectos específicos de tu caso por parte de nuestros especialistas.",
      price: "Desde $8,000 MXN",
      buttonText: "Contratar intervención",
      linkTo: "/servicios/intervencion",
      color: "var(--border-info)",
      features: [
        "Representación en procedimientos específicos",
        "Redacción de documentos legales",
        "Negociación con terceros",
        "Gestión de trámites",
        "Informes periódicos de avance"
      ]
    },
    {
      id: "representacion",
      number: 5,
      title: "Representación Legal Integral",
      shortTitle: "Representación",
      description: "Manejo completo de tu caso por nuestro equipo de abogados desde el inicio hasta su resolución.",
      price: "Desde $15,000 MXN",
      buttonText: "Contratar representación",
      linkTo: "/servicios/representacion",
      color: "var(--border-danger)",
      features: [
        "Representación legal completa",
        "Equipo multidisciplinario",
        "Estrategia integral",
        "Gestión de todos los aspectos del caso",
        "Comunicación constante y reportes semanales"
      ]
    }
  ];
  
  // Función para manejar la selección de etapa
  const handleStageSelect = (stageId: string) => {
    setSelectedStage(stageId);
    console.log(`Etapa seleccionada: ${stageId}`);
  };
  
  return (
    <div className="p-6 space-y-16">
      <Typography variant="h1" className="text-center mb-8">
        Ejemplos de ServiceFlow Unificado
      </Typography>
      
      {/* Mostrar la etapa seleccionada si existe */}
      {selectedStage && (
        <div className="p-4 bg-[var(--background-card)] rounded-lg border border-[var(--border-accent)]/30 mb-8">
          <Typography variant="body">
            Etapa seleccionada: <strong>{selectedStage}</strong>
          </Typography>
        </div>
      )}
      
      {/* Ejemplo 1: ServiceFlow Horizontal Compacto (por defecto) */}
      <section className="mb-16">
        <Typography variant="h3" className="mb-4">
          1. ServiceFlow Horizontal Compacto (por defecto)
        </Typography>
        <div className="p-4 bg-[var(--background-card)] rounded-lg border border-[var(--border-accent)]/30">
          <ServiceFlow 
            stages={stagesData} 
            onStageSelect={handleStageSelect}
            title="Nuestro proceso de servicio"
          />
        </div>
      </section>
      
      {/* Ejemplo 2: ServiceFlow Vertical Compacto */}
      <section className="mb-16">
        <Typography variant="h3" className="mb-4">
          2. ServiceFlow Vertical Compacto
        </Typography>
        <div className="p-4 bg-[var(--background-card)] rounded-lg border border-[var(--border-accent)]/30">
          <ServiceFlow 
            stages={stagesData} 
            options={{
              orientation: 'vertical',
              showFeaturesInCompactView: true
            }}
            onStageSelect={handleStageSelect}
            title="Proceso vertical con características"
          />
        </div>
      </section>
      
      {/* Ejemplo 3: ServiceFlow Horizontal Expandido */}
      <section className="mb-16">
        <Typography variant="h3" className="mb-4">
          3. ServiceFlow Horizontal Expandido
        </Typography>
        <div className="p-4 bg-[var(--background-card)] rounded-lg border border-[var(--border-accent)]/30">
          <ServiceFlow 
            stages={stagesData} 
            options={{
              orientation: 'horizontal',
              defaultExpanded: true,
              visualStyle: 'classic'
            }}
            onStageSelect={handleStageSelect}
            title="Vista expandida con estilo clásico"
          />
        </div>
      </section>
      
      {/* Ejemplo 4: ServiceFlow Vertical Expandido */}
      <section className="mb-16">
        <Typography variant="h3" className="mb-4">
          4. ServiceFlow Vertical Expandido
        </Typography>
        <div className="p-4 bg-[var(--background-card)] rounded-lg border border-[var(--border-accent)]/30">
          <ServiceFlow 
            stages={stagesData} 
            options={{
              orientation: 'vertical',
              defaultExpanded: true,
              useAdvancedAnimations: false
            }}
            onStageSelect={handleStageSelect}
            title="Vista vertical expandida sin animaciones"
          />
        </div>
      </section>
      
      {/* Ejemplo 5: ServiceFlow con opciones personalizadas */}
      <section className="mb-16">
        <Typography variant="h3" className="mb-4">
          5. ServiceFlow con opciones personalizadas
        </Typography>
        <div className="p-4 bg-[var(--background-card)] rounded-lg border border-[var(--border-accent)]/30">
          <ServiceFlow 
            stages={stagesData.slice(0, 3)} // Solo mostrar las primeras 3 etapas
            options={{
              orientation: 'horizontal',
              showFeaturesInCompactView: true,
              className: 'custom-service-flow',
              visualStyle: 'modern'
            }}
            onStageSelect={handleStageSelect}
            title="Proceso simplificado (3 etapas)"
          />
        </div>
      </section>
    </div>
  );
};

export default ServiceFlowExample;
