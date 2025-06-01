
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { SERVICE_OPTIONS } from '../../constants';

// Placeholder Icons
const DocumentMagnifyingGlassIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5 4.5V18m0 3h3m-3 0h-3m-2.25-4.501l.008.007c.076.061.16.115.25.161C7.86 16.704 9.801 18 12 18c2.198 0 4.14-.296 5.991-.735l.008-.007m-11.982 0A2.25 2.25 0 006.75 15h10.5a2.25 2.25 0 002.25-2.25m-15 0V13.5c0-.935.606-1.734 1.482-2.026M9 11.25a3 3 0 100-6 3 3 0 000 6z" />
    </svg>
);
const UserCheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
    </svg>
);
const ClockIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const StepProcessIcon = ({ number }: { number: number }) => (
    <div className="w-10 h-10 rounded-full bg-[var(--sky-blue-medium)] text-[var(--deep-blue-dark)] flex items-center justify-center font-bold text-xl font-title mr-4 flex-shrink-0">
        {number}
    </div>
);


const ReporteEstrategicoPage: React.FC = () => {
  const serviceInfo = SERVICE_OPTIONS.find(s => s.id === 'automated_procedural_strategy_ai' || s.title.includes("Reporte Estratégico Híbrido"));

  return (
    <div className="py-12 md:py-16">
      <section className="text-center px-4 mb-12 md:mb-16">
        <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-[var(--surface-subtle)] mb-6 border-2 border-[var(--golden-accent)]">
            <DocumentMagnifyingGlassIcon className="w-10 h-10 md:w-12 md:h-12 text-[var(--golden-accent)]" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 font-title text-[var(--coal)]">
          Reporte Estratégico Híbrido
        </h1>
        <p className="text-lg md:text-xl text-[var(--coal)] mb-3 max-w-2xl mx-auto">
          Análisis predictivo de tu caso, combinando la potencia de la IA con la validación de un abogado experto.
        </p>
        <span className="inline-block px-5 py-2 bg-[var(--golden-accent)] text-[var(--deep-blue-dark)] font-bold text-md rounded-full uppercase tracking-wider">
           {serviceInfo?.priceCOP ? `${serviceInfo.priceCOP.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits:0 })}` : "Desde 120.000 COP"}
        </span>
      </section>

      <section className="max-w-3xl mx-auto px-4 mb-12 md:mb-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 font-title text-[var(--coal)]">Proceso del Servicio</h2>
        <div className="space-y-8">
            <div className="flex items-start"><StepProcessIcon number={1} /><p className="text-[var(--coal)] pt-1">Compila y envíanos toda la información detallada y documentos relevantes de tu caso a través de un formulario seguro.</p></div>
            <div className="flex items-start"><StepProcessIcon number={2} /><p className="text-[var(--coal)] pt-1">Nuestra IA especializada analiza los datos, contrastándolos con jurisprudencia, legislación vigente y casos similares.</p></div>
            <div className="flex items-start"><StepProcessIcon number={3} /><p className="text-[var(--coal)] pt-1">Un abogado especialista de Ciberabogados revisa, valida y enriquece el análisis de la IA con su criterio experto.</p></div>
            <div className="flex items-start"><StepProcessIcon number={4} /><p className="text-[var(--coal)] pt-1">Recibes un informe completo en PDF con el análisis de hechos, escenarios posibles, riesgos, fortalezas y recomendaciones estratégicas.</p></div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 mb-12 md:mb-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 font-title text-[var(--coal)]">Visualiza tu Reporte (Ejemplo)</h2>
        <Card className="p-6 bg-[var(--surface-subtle)]/50 border-2 border-[var(--border-subtle)]/30">
            <h3 className="text-xl font-bold text-[var(--steel-blue)] font-title mb-3">Secciones Clave del Informe:</h3>
            <ul className="list-disc list-inside text-[var(--coal)] space-y-2 pl-4 text-sm">
                <li>Análisis Detallado de Hechos y Pruebas.</li>
                <li>Identificación de Normativa y Jurisprudencia Aplicable.</li>
                <li>Escenarios Legales Posibles (Pros y Contras).</li>
                <li>Evaluación de Riesgos y Probabilidades (Estimación IA).</li>
                <li>Recomendaciones Estratégicas Claras y Accionables.</li>
                <li>Conclusiones y Validación del Abogado Experto.</li>
            </ul>
            <p className="text-xs text-center mt-4 text-[var(--coal)]">(Este es un ejemplo de la estructura. El contenido real será específico a tu caso.)</p>
        </Card>
      </section>

      <section className="max-w-3xl mx-auto px-4 mb-12 md:mb-16 text-center">
        <UserCheckIcon className="w-16 h-16 text-[var(--golden-accent)] mx-auto mb-4"/>
        <h2 className="text-2xl md:text-3xl font-bold mb-4 font-title text-[var(--coal)]">¿Por Qué la Validación de un Experto?</h2>
        <p className="text-[var(--coal)] leading-relaxed mb-6">
            La inteligencia artificial es una herramienta poderosa para procesar grandes volúmenes de información y detectar patrones. Sin embargo, el derecho es complejo y contextual. La validación de un abogado especialista asegura que el análisis tecnológico se traduzca en una estrategia legal sólida, considerando matices que solo la experiencia humana puede aportar. Nuestros abogados validadores son profesionales con trayectoria en sus respectivas áreas.
        </p>
      </section>

      <section className="max-w-3xl mx-auto px-4 mb-12 md:mb-16">
         <Card className="p-6 md:p-8 text-center bg-gradient-to-r from-[var(--surface-subtle)] to-[var(--deep-blue-dark)] border border-[var(--border-subtle)]/50">
            <ClockIcon className="w-12 h-12 text-[var(--sky-blue-light)] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[var(--steel-blue)] font-title mb-2">Tiempo de Entrega Estándar</h3>
            <p className="text-2xl font-bold text-[var(--coal)] mb-3">48 Horas Hábiles</p>
            <p className="text-sm text-[var(--coal)]">
                Opción Premium: <strong className="text-[var(--golden-accent)]">+30.000 COP</strong> para entrega prioritaria en <strong className="text-[var(--golden-accent)]">24 horas hábiles</strong> (sujeto a disponibilidad y complejidad del caso).
            </p>
            <p className="text-xs text-[var(--coal)] mt-3">
                Teléfono de atención prioritaria para estos casos: (Número Próximamente)
            </p>
        </Card>
      </section>
      
      <section className="text-center px-4 mb-12 md:mb-16">
        <Card className="max-w-2xl mx-auto p-8">
            <h3 className="text-xl md:text-2xl font-bold text-[var(--steel-blue)] font-title mb-3">¿Necesitas Ayuda para Implementar las Recomendaciones?</h3>
            <p className="text-[var(--coal)] mb-6">
                Nuestro Reporte Estratégico te da claridad. Si decides que necesitas asistencia profesional para llevar a cabo las acciones recomendadas, podemos conectarte con nuestro servicio de Intervención Especializada.
            </p>
            <p className="text-md font-semibold text-[var(--golden-accent)] mb-4">
                Oferta Especial: Paquete Reporte + Consulta de 45 min con especialista por <strong className="text-2xl">300.000 COP</strong>
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/intervencion-especializada">
                    <Button variant="secondary">Ver Intervención Especializada</Button>
                </Link>
                 <Link to={`/contact?service=${encodeURIComponent("Solicitar Reporte Estratégico o Paquete")}`}>
                    <Button variant="primary">Solicitar Reporte Ahora</Button>
                </Link>
            </div>
        </Card>
      </section>
    </div>
  );
};

export default ReporteEstrategicoPage;
