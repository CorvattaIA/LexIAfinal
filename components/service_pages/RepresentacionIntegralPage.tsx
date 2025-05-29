import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import Card from '../ui/Card';
// import { SERVICE_OPTIONS } from '../../constants'; // May not be needed directly

// Placeholder Icons
const BriefcaseIcon = (props: React.SVGProps<SVGSVGElement>) => ( // Represents professional management
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.098a2.25 2.25 0 01-2.25 2.25h-12a2.25 2.25 0 01-2.25-2.25v-4.098m16.5 0a2.25 2.25 0 00-2.25-2.25h-12a2.25 2.25 0 00-2.25 2.25m16.5 0v6.75A2.25 2.25 0 0118 23.25h-12A2.25 2.25 0 013.75 21v-6.75m16.5 0V6.75A2.25 2.25 0 0018 4.5h-12A2.25 2.25 0 003.75 6.75v7.5" />
    </svg>
);
const UsersIcon = (props: React.SVGProps<SVGSVGElement>) => ( // Team
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-3.741-5.58M14.25 18.72a3 3 0 01-3.741-5.58 9.094 9.094 0 013.741.479zM9.75 18.72a3 3 0 00-3.741-5.58 9.094 9.094 0 003.741.479zM4.5 18.72a3 3 0 01-3.741-5.58 9.094 9.094 0 013.741.479zM14.25 18.72L12 15.450M9.75 18.72L12 15.450M4.5 18.72L12 15.450m-7.5 0a3 3 0 003.741 2.73M12 3.75a3 3 0 013 3V9.75a3 3 0 01-3 3h-3a3 3 0 01-3-3V6.75a3 3 0 013-3z" />
    </svg>
);
const ChatBubbleLeftRightIcon = (props: React.SVGProps<SVGSVGElement>) => ( // Communication
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3.685-3.091a9.352 9.352 0 00-4.285-.953H8.25c-1.135 0-2.186-.746-2.602-1.796a9.36 9.36 0 00-.385-3.162c.01-.02.015-.04.022-.06C5.073 8.49 5.74 8 6.5 8h9.75M20.25 8.511c-1.112-.363-2.016-.509-2.836-.509C16.25 8 14.92 8.5 13.5 8.5H6.5c-1.38 0-2.5 1.12-2.5 2.5v3.75c0 .976.614 1.805 1.481 2.121" />
    </svg>
);
const ScaleIcon = (props: React.SVGProps<SVGSVGElement>) => ( // Justice/Legal
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.25-1.35L18.75 4.97m-13.5 0l2.25 1.35L6.75 4.97m12 0l3.25-1.95L21 3m-18 0l3.25 1.95L6 3m12 13.5V12m-12 4.5V12" />
    </svg>
);


const RepresentacionIntegralPage: React.FC = () => {
  const consultationSteps = [
    "Evaluación preliminar detallada de tu caso y documentos.",
    "Presentación de una propuesta personalizada de representación, incluyendo alcance y honorarios.",
    "Acuerdo formal de términos, condiciones y plan de trabajo.",
    "Asignación de un abogado principal y el equipo de apoyo necesario."
  ];

  const serviceIncludes = [
    "Asignación de abogado principal y equipo de apoyo.",
    "Preparación y gestión completa de la documentación legal.",
    "Representación profesional ante tribunales, entidades y contrapartes.",
    "Desarrollo e implementación de una estrategia legal personalizada y dinámica.",
    "Seguimiento constante del caso y reportes periódicos de avance."
  ];

  return (
    <div className="py-12 md:py-16">
      <section className="text-center px-4 mb-12 md:mb-16">
        <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-[var(--surface-subtle)] mb-6 border-2 border-[var(--golden-accent)]">
            <BriefcaseIcon className="w-10 h-10 md:w-12 md:h-12 text-[var(--golden-accent)]" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 font-title text-[var(--sky-blue-light)]">
          Representación Legal Integral
        </h1>
        <p className="text-lg md:text-xl text-[var(--text-on-dark-soft)]/90 mb-3 max-w-2xl mx-auto">
          Gestión completa de tu caso por nuestro equipo de abogados expertos, desde la estrategia inicial hasta la resolución.
        </p>
        <span className="inline-block px-5 py-2 bg-[var(--golden-accent)] text-[var(--deep-blue-dark)] font-bold text-md rounded-full uppercase tracking-wider">
          Servicio Premium - Presupuesto Personalizado
        </span>
      </section>

      <section className="max-w-4xl mx-auto px-4 mb-12 md:mb-16">
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-10 font-title text-[var(--text-on-dark)]">Servicio Comprensivo y Dedicado</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {serviceIncludes.map((item, index) => (
            <Card key={index} className="p-5 flex items-start bg-[var(--surface-subtle)]/40">
              <ScaleIcon className="w-7 h-7 text-[var(--sky-blue-medium)] mr-4 mt-1 flex-shrink-0"/>
              <p className="text-sm text-[var(--text-on-dark-soft)]/85">{item}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 mb-12 md:mb-16">
        <Card className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start">
                <UsersIcon className="w-16 h-16 text-[var(--golden-accent)] mb-4 md:mb-0 md:mr-6 flex-shrink-0"/>
                <div>
                    <h2 className="text-2xl md:text-3xl font-semibold mb-4 font-title text-[var(--text-on-dark)]">Opciones de Personalización</h2>
                    <ul className="list-disc list-inside text-[var(--text-on-dark-soft)]/85 space-y-2 pl-2 text-sm leading-relaxed">
                        <li>Planes de honorarios mensuales o por etapas del proceso, adaptados a la naturaleza del caso.</li>
                        <li>Definición del alcance del servicio según la complejidad y tus objetivos específicos.</li>
                        <li>Opciones de pago flexibles y transparentes discutidas desde el inicio.</li>
                        <li>Comunicación constante y adaptada a tus preferencias (reportes, reuniones).</li>
                    </ul>
                </div>
            </div>
        </Card>
      </section>
      
      <section className="max-w-3xl mx-auto px-4 mb-12 md:mb-16">
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-10 font-title text-[var(--text-on-dark)]">¿Cómo Iniciamos la Representación?</h2>
        <div className="space-y-6">
          {consultationSteps.map((step, index) => (
            <div key={index} className="flex items-start p-4 bg-[var(--surface-subtle)]/30 rounded-lg border-l-4 border-[var(--golden-accent)]">
                <div className="w-8 h-8 rounded-full bg-[var(--golden-accent)] text-[var(--deep-blue-dark)] flex items-center justify-center font-bold text-lg font-title mr-4 flex-shrink-0">
                    {index + 1}
                </div>
                <p className="text-[var(--text-on-dark-soft)]/90 pt-0.5">{step}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="text-center px-4">
        <Card className="max-w-2xl mx-auto p-8 bg-gradient-to-br from-[var(--surface-subtle)] to-[var(--deep-blue-dark)] border border-[var(--border-subtle)]/50">
            <ChatBubbleLeftRightIcon className="w-12 h-12 text-[var(--sky-blue-light)] mx-auto mb-4"/>
            <h2 className="text-xl md:text-2xl font-semibold text-[var(--sky-blue-light)] font-title mb-4">Agenda una Evaluación de tu Caso</h2>
            <p className="text-[var(--text-on-dark-soft)]/85 mb-6">
                Si consideras que tu situación requiere nuestra representación legal integral, el primer paso es una evaluación detallada. Contáctanos para discutir tu caso de forma confidencial.
            </p>
            <Link to="/contact?service=Representacion Legal Integral">
                <Button variant="primary" size="lg" className="text-base md:text-lg shadow-xl transform hover:scale-105">
                    Contactar para Evaluación
                </Button>
            </Link>
            <p className="text-xs text-[var(--text-on-dark-soft)]/60 mt-3">
                Teléfono de atención prioritaria para estos casos: (Número Próximamente)
            </p>
        </Card>
      </section>
    </div>
  );
};

export default RepresentacionIntegralPage;