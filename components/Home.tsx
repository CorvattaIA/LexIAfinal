
import React from 'react';
import { Link } from 'react-router-dom';
import Button from './ui/Button';
import Card from './ui/Card'; 


// Simplified Icons for Value Proposition (Noma Bar style - abstract, geometric)
const ControlIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14Z" fill="currentColor"/>
    <path d="M16 12H14M10 12H8M12 16V14M12 10V8" stroke="var(--deep-blue-dark)" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const TechExpertiseIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M9 12L12 9L15 12L12 15L9 12Z" fill="currentColor"/>
    <rect x="4" y="4" width="16" height="16" rx="2" stroke="var(--deep-blue-dark)" strokeWidth="1.5"/>
    <circle cx="7" cy="7" r="1" fill="var(--deep-blue-dark)"/>
    <circle cx="17" cy="7" r="1" fill="var(--deep-blue-dark)"/>
    <circle cx="7" cy="17" r="1" fill="var(--deep-blue-dark)"/>
    <circle cx="17" cy="17" r="1" fill="var(--deep-blue-dark)"/>
  </svg>
);

const TransparencyIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 4.00001L20 8.00001L12 12L4 8.00001L12 4.00001Z" fill="currentColor" opacity="0.5"/>
    <path d="M20 12L12 16L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20 16L12 20L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const Home: React.FC = () => {
  return (
    <div className="space-y-24 md:space-y-36 py-10 md:py-16">
      {/* Hero Section */}
      <section className="text-center px-4">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 font-title text-[var(--text-on-dark)] leading-tight">
          Servicios Legales a tu Medida con Tecnología Inteligente
        </h1>
        <p className="text-lg md:text-xl text-[var(--text-on-dark-soft)]/90 mb-10 max-w-3xl mx-auto">
          Desde asistencia automática hasta representación completa, tú decides hasta dónde llegar. Ciberabogados te guía en cada paso.
        </p>
        <div className="flex justify-center mt-8">
          <Link to="/diagnostico-inicial" className="inline-block">
            <Button size="lg" variant="primary" className="text-base md:text-lg py-4 px-12 shadow-xl transform hover:scale-105 transition-all duration-300 font-semibold border-2 border-[var(--golden-accent)]">
              Iniciar Diagnóstico Gratuito
            </Button>
          </Link>
        </div>

      </section>



      {/* Value Proposition Section */}
      <section className="px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 font-title text-[var(--sky-blue-light)]">¿Por Qué Elegir Ciberabogados?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 max-w-6xl mx-auto">
          <Card className="text-center p-6 md:p-8 border-t-4 border-[var(--golden-accent)]">
            <div className="flex justify-center mb-5">
              <ControlIcon className="w-16 h-16 text-[var(--golden-accent)]" />
            </div>
            <h3 className="text-xl md:text-2xl font-semibold text-[var(--text-on-dark)] mb-3 font-title">Control Total</h3>
            <p className="text-[var(--text-on-dark-soft)]/80 text-sm md:text-base">
              Tú decides en cada etapa si avanzar al siguiente nivel de servicio, manteniendo el control de tu inversión y estrategia.
            </p>
          </Card>
          <Card className="text-center p-6 md:p-8 border-t-4 border-[var(--golden-accent)]">
            <div className="flex justify-center mb-5">
              <TechExpertiseIcon className="w-16 h-16 text-[var(--golden-accent)]" />
            </div>
            <h3 className="text-xl md:text-2xl font-semibold text-[var(--text-on-dark)] mb-3 font-title">Tecnología + Pericia</h3>
            <p className="text-[var(--text-on-dark-soft)]/80 text-sm md:text-base">
              Combinamos la eficiencia de la inteligencia artificial con la supervisión y el conocimiento de abogados especialistas.
            </p>
          </Card>
          <Card className="text-center p-6 md:p-8 border-t-4 border-[var(--golden-accent)]">
            <div className="flex justify-center mb-5">
              <TransparencyIcon className="w-16 h-16 text-[var(--golden-accent)]" />
            </div>
            <h3 className="text-xl md:text-2xl font-semibold text-[var(--text-on-dark)] mb-3 font-title">Transparencia Absoluta</h3>
            <p className="text-[var(--text-on-dark-soft)]/80 text-sm md:text-base">
              Precios claros y alcance definido en cada servicio. Sin sorpresas, solo soluciones efectivas y honestas.
            </p>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Home;
