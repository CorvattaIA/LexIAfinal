
import React, { useState } from 'react';
import ServiceFlowGuideComponent from './ServiceFlowGuideComponent';
import GuideStepsComponent from './GuideStepsComponent';
import Card from './ui/Card';
import Button from './ui/Button';
import { Link } from 'react-router-dom';
import { InfoIcon } from './icons/ServiceIcons';



// Componente de pestañas para la sección de detalles
const TabSelector: React.FC<{
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tabs: {id: string; label: string}[];
}> = ({ activeTab, setActiveTab, tabs }) => {
  return (
    <div className="flex justify-center mb-8">
      <div className="inline-flex bg-[#1E293B] rounded-lg p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === tab.id 
              ? 'bg-[#3B82F6] text-white shadow-md' 
              : 'text-[#94A3B8] hover:text-white'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

const ComoFuncionaPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('proceso');
  
  const faqs = [
    { q: "¿El test diagnóstico inicial tiene algún costo?", a: "No, nuestro test diagnóstico inicial es completamente gratuito una vez que te registras. Te ayuda a obtener una orientación preliminar sobre tu caso." },
    { q: "¿Qué pasa si mi área legal no está listada?", a: "Nuestro test cubre las áreas más comunes. Si tu caso es muy específico o no encaja, te recomendamos contactarnos directamente para una evaluación personalizada." },
    { q: "¿Puedo saltar etapas del servicio?", a: "Sí, aunque nuestro modelo es progresivo, puedes acceder a servicios de niveles superiores si ya tienes claridad sobre lo que necesitas, previa evaluación de nuestro equipo en algunos casos." },
    { q: "¿Cómo se maneja la confidencialidad de mi información?", a: "La confidencialidad es primordial. Todos tus datos son tratados según nuestra Política de Tratamiento de Datos. Las interacciones con IA y abogados son seguras." },
  ];

  return (
    <div className="py-12 md:py-16 space-y-16 md:space-y-24">
      <section className="text-center px-4">
        {/* Decorative elements */}
        <div className="relative inline-block">
          <div className="absolute -top-6 -left-6 w-12 h-12 rounded-full bg-[#3B82F6]/20 blur-xl"></div>
          <div className="absolute -bottom-6 -right-6 w-12 h-12 rounded-full bg-[#F59E0B]/20 blur-xl"></div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold mb-8 font-title bg-clip-text text-transparent bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] inline-block">
            Cómo Funciona Ciberabogados
          </h1>
        </div>
        
        <p className="text-lg md:text-xl text-[#E2E8F0] max-w-3xl mx-auto leading-relaxed">
          Nuestro modelo progresivo te ofrece control total sobre tu caso legal, desde orientación automática hasta representación completa.
        </p>
      </section>

      <section className="px-2 md:px-4 relative">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#3B82F6]/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#F59E0B]/5 rounded-full blur-3xl -z-10"></div>
        
        <div className="text-center mb-8">
          <h2 className="inline-block text-3xl md:text-5xl font-bold font-title text-transparent bg-clip-text bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] pb-2">
            Nuestro Flujo de Servicio en 5 Etapas
          </h2>
          <p className="text-base md:text-lg text-[#94A3B8] max-w-2xl mx-auto mt-4 leading-relaxed">
            Selecciona el nivel de servicio que mejor se adapte a tus necesidades. Puedes avanzar progresivamente o elegir directamente el que necesites.
          </p>
        </div>
        
        <div className="p-6 md:p-8 bg-[#0F172A] rounded-xl border border-[#1E293B] shadow-lg">
          <ServiceFlowGuideComponent />
        </div>
        
        <div className="flex justify-center mt-10">
          <Link to="/diagnostico-inicial" className="inline-block">
            <Button 
              size="lg" 
              variant="primary" 
              className="text-base md:text-lg py-4 px-10 shadow-xl transform hover:scale-105 transition-all duration-300 font-semibold bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] border-none rounded-lg text-white"
            >
              Iniciar Diagnóstico Gratuito
            </Button>
          </Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 mt-16">
        <div className="text-center mb-8">
          <h2 className="inline-block text-3xl md:text-4xl font-bold font-title text-transparent bg-clip-text bg-gradient-to-r from-[#F59E0B] to-[#EC4899] pb-2">
            Información Detallada
          </h2>
        </div>
        
        <TabSelector 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabs={[
            {id: 'proceso', label: 'Detalles del Proceso'},
            {id: 'faq', label: 'Preguntas Frecuentes'}
          ]}
        />
        
        {activeTab === 'proceso' ? (
          <div className="bg-[#0F172A] rounded-xl border border-[#1E293B] shadow-lg p-6 md:p-8">
            <GuideStepsComponent />
          </div>
        ) : (
          <div className="bg-[#0F172A] rounded-xl border border-[#1E293B] shadow-lg p-6 md:p-8">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <Card key={index} className="p-4 md:p-5 border border-[#334155] hover:border-[#F59E0B] transition-colors bg-[#1E293B]">
                  <details className="group">
                    <summary className="flex justify-between items-center font-semibold text-white cursor-pointer font-title text-lg hover:text-[#F59E0B] transition-colors">
                      {faq.q}
                      <span className="transform transition-transform duration-200 group-open:rotate-45 text-[#F59E0B] text-2xl">+</span>
                    </summary>
                    <p className="text-[#E2E8F0] mt-3 text-sm leading-relaxed">{faq.a}</p>
                  </details>
                </Card>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex justify-center mt-10">
          <Link to="/contact" className="inline-flex items-center gap-2 text-[#94A3B8] hover:text-[#3B82F6] transition-colors">
            <InfoIcon className="w-5 h-5" />
            <span>¿Tienes más preguntas? Contáctanos</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ComoFuncionaPage;
