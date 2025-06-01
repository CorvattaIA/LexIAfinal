
import React from 'react';
import { Link } from 'react-router-dom';
import Button from './ui/Button';
import Card from './ui/Card';
// Placeholder icons (replace with actual specific icons if available)
import { AIEthicsIcon, LexiaIcon, CivilIcon, LaboralIcon, PenalIcon } from '../constants'; 

interface ServiceStage {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  linkTo: string;
  ctaText: string;
}

const serviceStagesData: ServiceStage[] = [
  {
    id: 'diagnostico',
    title: "1. Diagnóstico inicial automático",
    description: "Comienza con nuestro test inteligente gratuito. Responde preguntas sobre tu caso y recibe una orientación preliminar y las áreas legales involucradas.",
    icon: AIEthicsIcon, // Placeholder
    linkTo: "/diagnostico-inicial",
    ctaText: "Iniciar diagnóstico gratuito"
  },
  {
    id: 'autoasistencia',
    title: "2. Auto-asistencia legal (LexIA )",
    description: "Accede a nuestro chat con IA especializada, LexIA, para profundizar en tu caso y generar documentos legales básicos de forma guiada.",
    icon: LexiaIcon,
    linkTo: "/auto-asistencia-lexia",
    ctaText: "Explorar auto-asistencia"
  },
  {
    id: 'reporte',
    title: "3. Reporte estratégico híbrido",
    description: "Obtén un análisis predictivo detallado de tu caso, generado por IA y validado por un abogado experto, con escenarios y recomendaciones.",
    icon: CivilIcon, // Placeholder
    linkTo: "/reporte-estrategico",
    ctaText: "Conocer reporte estratégico"
  },
  {
    id: 'intervencion',
    title: "4. Intervención especializada",
    description: "Conéctate directamente con nuestros abogados especialistas para consultas personalizadas, revisión de documentos o asesoría estratégica.",
    icon: LaboralIcon, // Placeholder
    linkTo: "/intervencion-especializada",
    ctaText: "Ver servicios especializados"
  },
  {
    id: 'representacion',
    title: "5. Representación integral",
    description: "Para casos complejos, te ofrecemos la gestión completa y representación legal por parte de nuestro equipo de expertos.",
    icon: PenalIcon, // Placeholder
    linkTo: "/representacion-integral",
    ctaText: "Solicitar representación"
  }
];

const ServicesPage: React.FC = () => {
  return (
    <div className="py-12 md:py-16">
      <div className="text-center mb-16 md:mb-20 px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 font-title text-[var(--coal)] title-case-es">
          Nuestros servicios legales <span className="text-[var(--steel-blue)]">progresivos</span>
        </h1>
        <p className="text-lg md:text-xl text-[var(--coal)] max-w-3xl mx-auto">
          En Ciberabogados, te ofrecemos un camino claro y adaptable para resolver tus necesidades legales. Avanza a través de nuestras etapas de servicio según la complejidad y los requisitos de tu caso, siempre con control y transparencia.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 space-y-10">
        {serviceStagesData.map((stage, index) => (
          <Card key={stage.id} className="p-6 md:p-8 shadow-xl border-l-4 border-[var(--golden-accent)] hover:shadow-2xl transition-shadow duration-300">
            <div className="flex flex-col md:flex-row items-start md:items-center">
              <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                <stage.icon className="w-16 h-16 text-[var(--golden-accent)]" />
              </div>
              <div className="flex-grow">
                <h2 className="text-2xl md:text-3xl font-bold text-[var(--coal)] mb-3 font-title">{stage.title}</h2>
                <p className="text-[var(--coal)] mb-6 leading-relaxed">{stage.description}</p>
                <Link to={stage.linkTo}>
                  <Button variant={index === 0 ? "primary" : "secondary"} size="md">
                    {stage.ctaText}
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-16 md:mt-20 text-center px-4">
        <p className="text-lg text-[var(--coal)] mb-4">¿Tienes dudas sobre qué servicio es el adecuado para ti?</p>
        <Link to="/como-funciona">
            <Button variant="outline" size="lg">Ver guía "Cómo funciona"</Button>
        </Link>
         <span className="mx-2 text-[var(--coal)]">o</span>
        <Link to="/contact">
            <Button variant="outline" size="lg">Contáctanos</Button>
        </Link>
      </div>
    </div>
  );
};

export default ServicesPage;
