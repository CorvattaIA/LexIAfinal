import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import Card from '../ui/Card';
// import { SERVICE_OPTIONS } from '../../constants'; // May not be needed directly

// Placeholder Icons (can be replaced with more specific ones)
const VideoCameraIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9A2.25 2.25 0 004.5 18.75z" />
    </svg>
);
const DocumentTextCheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H7.5m0 0l-2.25 2.25M8.25 3H7.5m0 0l2.25 2.25m0 0l2.25 2.25m0 0l2.25 2.25M12 18.75l-2.25-2.25m2.25 2.25l2.25-2.25m-2.25 2.25V15m0 3.75l-2.25-2.25m2.25 2.25l2.25-2.25" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75l2.25 2.25 4.5-4.5m-6.75 4.5h6.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125h-6.75A1.125 1.125 0 006.75 9.375v2.25c0 .621.504 1.125 1.125 1.125z" />
    </svg>
);

const IntervencionEspecializadaPage: React.FC = () => {
  // Data for service packages (could be moved to constants.ts if preferred)
  const servicePackages = [
    {
      title: "Revisión de Documentos por Experto",
      price: "90.000 COP",
      priceNote: "por documento (<10 páginas)",
      description: "Análisis legal detallado de tus documentos, con correcciones, identificación de riesgos y recomendaciones accionables por un abogado especialista.",
      time: "Entrega en 48h hábiles",
      icon: DocumentTextCheckIcon,
      features: [
        "Análisis exhaustivo por especialista.",
        "Corrección de errores y omisiones.",
        "Sugerencias para fortalecer tu posición.",
        "Claridad sobre implicaciones legales."
      ],
      ctaLink: "/contact?service=Revisión Documentos",
      ctaText: "Solicitar Revisión"
    },
    {
      title: "Consulta de 45 Minutos con Especialista",
      price: "200.000 COP",
      priceNote: "",
      description: "Videollamada privada y confidencial con un abogado especialista en tu área. Incluye preparación previa del caso y un plan de acción posterior.",
      time: "Según agenda",
      icon: VideoCameraIcon,
      features: [
        "Asesoría directa y personalizada.",
        "Resolución de dudas complejas.",
        "Estrategia legal adaptada a tu caso.",
        "Acta de reunión con puntos clave."
      ],
      ctaLink: "/contact?service=Consulta 45min",
      ctaText: "Agendar Consulta"
    }
  ];

  return (
    <div className="py-12 md:py-16">
      <section className="text-center px-4 mb-12 md:mb-16">
        <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-[var(--surface-subtle)] mb-6 border-2 border-[var(--golden-accent)]">
            <VideoCameraIcon className="w-10 h-10 md:w-12 md:h-12 text-[var(--golden-accent)]" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 font-title text-[var(--coal)]">
          Intervención Especializada
        </h1>
        <p className="text-lg md:text-xl text-[var(--coal)] mb-3 max-w-2xl mx-auto">
          Conecta directamente con nuestros abogados expertos para obtener asesoría personalizada y soluciones legales a tu medida.
        </p>
        <span className="inline-block px-5 py-2 bg-[var(--golden-accent)] text-[var(--deep-blue-dark)] font-bold text-md rounded-full uppercase tracking-wider">
          Desde 90.000 COP
        </span>
      </section>

      <section className="max-w-5xl mx-auto px-4 mb-12 md:mb-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 font-title text-[var(--coal)]">Paquetes de Servicio</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {servicePackages.map((pkg) => (
            <Card key={pkg.title} className="p-6 flex flex-col border-t-4 border-[var(--golden-accent)] hover:shadow-xl">
              <div className="flex-shrink-0 mb-4">
                <pkg.icon className="w-12 h-12 text-[var(--golden-accent)]" />
              </div>
              <h3 className="text-xl md:text-2xl font-semibold text-[var(--text-on-dark)] font-title mb-2">{pkg.title}</h3>
              <p className="text-2xl font-bold text-[var(--golden-accent)] mb-1">{pkg.price}</p>
              {pkg.priceNote && <p className="text-xs text-[var(--text-on-dark-soft)]/70 mb-3">{pkg.priceNote}</p>}
              <p className="text-sm text-[var(--coal)] mb-4 flex-grow">{pkg.description}</p>
              <ul className="text-xs text-[var(--text-on-dark-soft)]/80 space-y-1.5 mb-5">
                  {pkg.features?.map(feature => (
                      <li key={feature} className="flex items-center">
                          <svg className="w-3 h-3 mr-2 text-[var(--golden-accent)]/80 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                          {feature}
                      </li>
                  ))}
              </ul>
              <p className="text-sm font-medium text-[var(--sky-blue-medium)] mb-5">Tiempo estimado: {pkg.time}</p>
              <div className="mt-auto">
                <Link to={pkg.ctaLink}>
                  <Button variant="secondary" className="w-full">{pkg.ctaText}</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 mb-12 md:mb-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 font-title text-[var(--coal)]">Proceso de Consulta y Asesoría</h2>
        <Card className="p-6 md:p-8 bg-[var(--surface-subtle)]/50">
            <ul className="space-y-4 text-sm text-[var(--coal)]">
                <li className="flex items-start"><strong className="text-[var(--golden-accent)] mr-2 w-6 text-center">1.</strong><span><strong className="text-[var(--text-on-dark)]">Agendamiento:</strong> Contáctanos para programar tu consulta o revisión. Te asignaremos el especialista más adecuado.</span></li>
                <li className="flex items-start"><strong className="text-[var(--golden-accent)] mr-2 w-6 text-center">2.</strong><span><strong className="text-[var(--text-on-dark)]">Preparación:</strong> Envía la documentación relevante (si aplica) con antelación para que el abogado pueda prepararse.</span></li>
                <li className="flex items-start"><strong className="text-[var(--golden-accent)] mr-2 w-6 text-center">3.</strong><span><strong className="text-[var(--text-on-dark)]">Sesión:</strong> Conéctate a la videollamada (o recibe tu documento revisado) en la fecha y hora acordadas.</span></li>
                <li className="flex items-start"><strong className="text-[var(--golden-accent)] mr-2 w-6 text-center">4.</strong><span><strong className="text-[var(--text-on-dark)]">Seguimiento:</strong> Recibe un acta de la reunión o informe con los puntos clave, recomendaciones y próximos pasos.</span></li>
            </ul>
            <p className="text-xs text-[var(--text-on-dark-soft)]/70 mt-6">
                Utilizamos tecnología segura para videollamadas. Política de cancelación/reprogramación: por favor, avisa con al menos 24 horas de antelación.
            </p>
        </Card>
      </section>
      
      <section className="text-center px-4">
        <Card className="max-w-2xl mx-auto p-8 border-t-2 border-b-2 border-[var(--golden-accent)]">
            <h3 className="text-xl md:text-2xl font-bold text-[var(--steel-blue)] font-title mb-3">¿Tu Caso Requiere Representación Completa?</h3>
            <p className="text-[var(--coal)] mb-6">
                Si después de la consulta especializada se determina que tu situación necesita una gestión legal integral, te orientaremos sobre nuestro servicio de Representación Legal Completa.
            </p>
            <Link to="/representacion-integral">
                <Button variant="outline" size="lg">Conocer Representación Integral</Button>
            </Link>
        </Card>
      </section>
    </div>
  );
};

export default IntervencionEspecializadaPage;
