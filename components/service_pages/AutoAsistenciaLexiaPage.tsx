
import React from 'react';
import { Link, useLocation, useNavigate } // useNavigate for PurchaseButton
from 'react-router-dom';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { SERVICE_OPTIONS, LexiaIcon } from '../../constants'; 
import { LawArea } from '../../types';

// Placeholder icons for document types
const DocumentIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m012H9m0 3H7.5A2.25 2.25 0 015.25 18v-2.25m0-7.5A2.25 2.25 0 017.5 6H10" />
    </svg>
);
const ChatBubbleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3.685-3.091a9.352 9.352 0 00-4.285-.953H8.25c-1.135 0-2.186-.746-2.602-1.796a9.36 9.36 0 00-.385-3.162c.01-.02.015-.04.022-.06C5.073 8.49 5.74 8 6.5 8h9.75M20.25 8.511c-1.112-.363-2.016-.509-2.836-.509C16.25 8 14.92 8.5 13.5 8.5H6.5c-1.38 0-2.5 1.12-2.5 2.5v3.75c0 .976.614 1.805 1.481 2.121" />
    </svg>
);


const AutoAsistenciaLexiaPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { determinedArea } = (location.state as { determinedArea?: LawArea }) || {};

  const serviceInfo = SERVICE_OPTIONS.find(s => s.id === 'auto_asistencia_lexia' || s.title.includes("Auto-Asistencia Legal")) || 
                      SERVICE_OPTIONS.find(s => s.id === 'lexia_premium_chat'); // Fallback to LexIA chat if specific DIY not found

  const handlePurchase = () => {
    // This would typically trigger the PaymentModal for LexIA chat if this service IS LexIA chat
    // or a similar flow for document generation services.
    // For now, if `determinedArea` is present (from diagnostic), we can simulate going to LexIA chat.
    if (determinedArea && serviceInfo && serviceInfo.id === 'lexia_premium_chat') {
        // This assumes 'lexia_premium_chat' is the primary action for LexIA DIY.
        // Need to pass full LexiaContext if available, or at least determinedArea.
        // The actual PaymentModal trigger and context passing happens in AssessmentTest/DiagnosticoInicialPage.
        // This button here acts more like a "Learn More & Start Diagnostic to Access"
        navigate('/diagnostico-inicial'); 
    } else if (serviceInfo) {
         navigate(`/contact?service=${encodeURIComponent(serviceInfo.title)}`); // For document requests or general inquiry
    } else {
        navigate('/diagnostico-inicial'); // Default to diagnostic
    }
  };

  return (
    <div className="py-12 md:py-16">
      <section className="text-center px-4 mb-12 md:mb-16">
        <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-[var(--surface-subtle)] mb-6 border-2 border-[var(--golden-accent)]">
            <LexiaIcon className="w-10 h-10 md:w-12 md:h-12 text-[var(--golden-accent)]" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 font-title text-[var(--sky-blue-light)]">
          Auto-Asistencia Legal con LexIA (DIY)
        </h1>
        <p className="text-lg md:text-xl text-[var(--text-on-dark-soft)]/90 mb-3 max-w-2xl mx-auto">
          Empodérate con herramientas de IA para resolver asuntos legales sencillos y generar documentos básicos.
        </p>
        <span className="inline-block px-5 py-2 bg-[var(--golden-accent)] text-[var(--deep-blue-dark)] font-bold text-md rounded-full uppercase tracking-wider">
          {serviceInfo?.priceCOP ? `${serviceInfo.priceCOP.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits:0 })}` : "Desde 40.000 COP"}
        </span>
      </section>

      <section className="max-w-4xl mx-auto px-4 mb-12 md:mb-16">
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-10 font-title text-[var(--text-on-dark)]">¿Qué Incluye este Servicio?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <Card className="p-6">
            <ChatBubbleIcon className="w-10 h-10 text-[var(--golden-accent)] mb-3"/>
            <h3 className="text-xl font-semibold text-[var(--sky-blue-light)] font-title mb-2">Chat con LexIA Especializado</h3>
            <p className="text-sm text-[var(--text-on-dark-soft)]/85">
              {determinedArea ? `Conversa con nuestra IA legal, LexIA, pre-configurada para tu área de interés: ${determinedArea.name}. ` : "Conversa con nuestra IA legal, LexIA. "}
              Obtén un diagnóstico más detallado, explicaciones de términos legales y orientación sobre tus próximos pasos.
            </p>
          </Card>
          <Card className="p-6">
            <DocumentIcon className="w-10 h-10 text-[var(--golden-accent)] mb-3"/>
            <h3 className="text-xl font-semibold text-[var(--sky-blue-light)] font-title mb-2">Generación de Documentos Básicos</h3>
            <p className="text-sm text-[var(--text-on-dark-soft)]/85">
              LexIA puede ayudarte a redactar borradores de documentos comunes como derechos de petición, reclamaciones de baja complejidad, o cartas formales, personalizándolos según tu información.
            </p>
          </Card>
        </div>
        <p className="text-center text-sm text-[var(--text-on-dark-soft)]/70 mt-8">
            * La generación de documentos y el chat especializado con LexIA suelen estar vinculados tras el <Link to="/diagnostico-inicial" className="text-[var(--golden-accent)] hover:underline">diagnóstico inicial</Link> para un mejor contexto.
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-4 mb-12 md:mb-16">
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-10 font-title text-[var(--text-on-dark)]">Tipos de Documentos que Puedes Explorar (Ejemplos)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {["Derechos de Petición", "Reclamaciones Simples", "Cartas Formales", "Contratos (Simulador Básico)"].map(docType => (
            <Card key={docType} className="p-5 text-center hover:border-[var(--sky-blue-medium)] transition-colors">
              <DocumentIcon className="w-8 h-8 text-[var(--sky-blue-medium)] mx-auto mb-3"/>
              <h4 className="text-md font-semibold text-[var(--text-on-dark-soft)] font-title">{docType}</h4>
              {docType.includes("Simulador") && <p className="text-xs text-[var(--golden-accent)]/80">(Funcionalidad en desarrollo/simplificada)</p>}
            </Card>
          ))}
        </div>
         <p className="text-center text-sm text-[var(--text-on-dark-soft)]/70 mt-8">
            La capacidad de generación de documentos específicos se activa y personaliza a través de la interacción con LexIA.
        </p>
      </section>
      
      <section className="text-center px-4 mb-12 md:mb-16">
        <Card className="max-w-2xl mx-auto p-8 bg-[var(--surface-subtle)]/70 border border-[var(--border-subtle)]/50">
            <h3 className="text-xl md:text-2xl font-semibold text-[var(--sky-blue-light)] font-title mb-3">¿Necesitas un Análisis Más Profundo?</h3>
            <p className="text-[var(--text-on-dark-soft)]/85 mb-6">
                La Auto-Asistencia es ideal para orientarte y resolver asuntos sencillos. Si tu caso requiere un análisis de riesgos, estudio de jurisprudencia validado o una estrategia más compleja, considera nuestro Reporte Estratégico Híbrido.
            </p>
            <Link to="/reporte-estrategico">
                <Button variant="outline">Conocer Reporte Estratégico</Button>
            </Link>
        </Card>
      </section>

      <section className="text-center px-4">
        <h2 className="text-2xl md:text-3xl font-semibold mb-6 font-title text-[var(--text-on-dark)]">Contratar Auto-Asistencia Legal</h2>
        <p className="text-[var(--text-on-dark-soft)]/80 mb-8 max-w-xl mx-auto">
            Para acceder a LexIA y las herramientas de auto-asistencia, te recomendamos primero completar nuestro <Link to="/diagnostico-inicial" className="text-[var(--golden-accent)] hover:underline">diagnóstico gratuito</Link>. Esto nos permite contextualizar mejor tu consulta.
        </p>
        <Button 
            onClick={handlePurchase} 
            variant="primary" 
            size="lg"
            className="text-base md:text-lg shadow-xl transform hover:scale-105"
        >
          {serviceInfo?.id === 'lexia_premium_chat' ? "Acceder a LexIA (vía diagnóstico)" : "Consultar sobre Auto-Asistencia"}
        </Button>
        <p className="text-xs text-[var(--text-on-dark-soft)]/60 mt-3">
            {serviceInfo?.id === 'lexia_premium_chat' ? "Se requiere completar el diagnóstico para activar la sesión de pago." : "Acceso y precios varían según complejidad."}
        </p>
      </section>
    </div>
  );
};

export default AutoAsistenciaLexiaPage;
