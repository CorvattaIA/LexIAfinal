
import React, { useState } from 'react';
import Card from './ui/Card';

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClick: () => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, children, isOpen, onClick }) => {
  return (
    <Card className="mb-4 p-0 overflow-hidden border border-[var(--steel-blue)]/20">
      <button
        onClick={onClick}
        className="w-full flex justify-between items-center text-left p-4 md:p-5 bg-[var(--bone)] hover:bg-[var(--steel-blue)]/5 transition-colors"
        aria-expanded={isOpen}
      >
        <span className="text-lg font-bold text-[var(--coal)] font-title">{title}</span>
        <span className={`transform transition-transform duration-300 text-2xl text-[var(--sunshine)] ${isOpen ? 'rotate-45' : 'rotate-0'}`}>
          +
        </span>
      </button>
      <div 
        className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="p-4 md:p-6 text-sm text-[var(--coal)] border-t border-[var(--steel-blue)]/20 space-y-2 leading-relaxed">
          {children}
        </div>
      </div>
    </Card>
  );
};

const guideStepsData = [
  {
    title: "1. Comenzando con el diagnóstico",
    content: [
      "Regístrate en nuestra plataforma de forma rápida y segura.",
      "Selecciona el área legal general que se ajusta a tu consulta.",
      "Completa el test inteligente respondiendo a una serie de preguntas específicas sobre tu caso.",
      "Al finalizar, recibirás un resultado preliminar que te orientará sobre la naturaleza de tu situación y posibles vías de acción.",
    ]
  },
  {
    title: "2. Utilizando LexIA  (auto-asistencia)",
    content: [
      "Si tu caso es apto para auto-gestión, puedes acceder a LexIA, nuestro chat con IA especializada (costo aplicable).",
      "Interactúa con LexIA para profundizar en tu diagnóstico, hacer preguntas y recibir explicaciones claras sobre términos legales.",
      "LexIA puede ayudarte a generar borradores de documentos básicos (ej. derechos de petición, reclamaciones simples) adaptados a tu situación.",
      "Recuerda que LexIA ofrece orientación y herramientas; para casos complejos, siempre es recomendable avanzar a un servicio con supervisión humana.",
    ]
  },
  {
    title: "3. Maximizando el reporte estratégico híbrido",
    content: [
      "Para un análisis más profundo, solicita un reporte estratégico (costo aplicable).",
      "Proporciona toda la información relevante de tu caso. Cuantos más detalles, más preciso será el análisis de la IA.",
      "Nuestra IA procesará la información, cruzándola con legislación y jurisprudencia actualizada.",
      "Un abogado especialista revisará y validará el reporte generado por la IA, añadiendo su pericia y criterio profesional.",
      "Recibirás un informe PDF con el análisis de hechos, escenarios posibles y recomendaciones estratégicas claras.",
    ]
  },
  {
    title: "4. Preparándote para la consulta con abogado",
    content: [
      "Si necesitas intervención directa, agenda una consulta con uno de nuestros abogados especialistas (costo aplicable).",
      "Elige el paquete que mejor se adapte (ej. revisión de documentos, consulta de 45 minutos).",
      "Prepara tus documentos y preguntas clave con antelación para aprovechar al máximo el tiempo de la consulta.",
      "Durante la videollamada, expón tu caso y recibe asesoramiento directo. Se te entregará un acta de la reunión y un plan de acción.",
    ]
  },
  {
    title: "5. Gestionando tu representación integral",
    content: [
      "Para casos que requieren gestión completa, ofrecemos representación legal integral (presupuesto personalizado).",
      "Tras una evaluación detallada, te presentaremos una propuesta de representación y asignaremos un equipo legal.",
      "Mantendremos una comunicación fluida y te proporcionaremos reportes mensuales sobre el avance de tu caso.",
      "Nuestro equipo se encargará de toda la documentación, estrategia y representación ante las instancias necesarias.",
    ]
  }
];

const GuideStepsComponent: React.FC = () => {
  const [openAccordion, setOpenAccordion] = useState<string | null>(guideStepsData[0].title); // Open first by default

  const handleAccordionClick = (title: string) => {
    setOpenAccordion(openAccordion === title ? null : title);
  };

  return (
    <div className="w-full">
      {guideStepsData.map((item, index) => (
        <AccordionItem
          key={index}
          title={item.title}
          isOpen={openAccordion === item.title}
          onClick={() => handleAccordionClick(item.title)}
        >
          {item.content.map((paragraph, pIndex) => (
            <p key={pIndex} className={pIndex > 0 ? "mt-2" : ""}>{paragraph}</p>
          ))}
        </AccordionItem>
      ))}
    </div>
  );
};

export default GuideStepsComponent;
