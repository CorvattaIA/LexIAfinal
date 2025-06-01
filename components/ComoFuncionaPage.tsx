import React, { useState, useRef, useEffect } from 'react';
import ServiceFlowVertical from './ServiceFlowVertical';
import GuideStepsComponent from './GuideStepsComponent';
import Card from './ui/Card';
import { Link } from 'react-router-dom';
import { InfoIcon } from './icons/ServiceIcons';
import { motion, AnimatePresence } from 'framer-motion';

// Componente de pestañas para la sección de detalles con animaciones sofisticadas y efectos neón
const TabSelector: React.FC<{
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tabs: {id: string; label: string}[];
}> = ({ activeTab, setActiveTab, tabs }) => {
  // Referencia para medir la posición y tamaño del indicador
  const tabsRef = useRef<HTMLButtonElement[]>([]);
  const [indicatorStyle, setIndicatorStyle] = useState({
    left: 0,
    width: 0,
  });

  // Actualizar la posición del indicador cuando cambia la pestaña activa
  useEffect(() => {
    const activeIndex = tabs.findIndex(tab => tab.id === activeTab);
    if (activeIndex >= 0 && tabsRef.current[activeIndex]) {
      const tabElement = tabsRef.current[activeIndex];
      if (tabElement) {
        const parentLeft = tabElement.parentElement?.getBoundingClientRect().left || 0;
        const tabRect = tabElement.getBoundingClientRect();
        setIndicatorStyle({
          left: tabRect.left - parentLeft,
          width: tabRect.width,
        });
      }
    }
  }, [activeTab, tabs]);

  return (
    <div className="flex justify-center mb-10">
      <div className="inline-flex bg-[var(--steel-blue)]/10 rounded-lg p-1 relative shadow-lg hover:shadow-xl transition-all duration-300 border border-[var(--steel-blue)]/30 hover:border-[var(--sunshine)]/50 neon-glow-hover">
        {/* Indicador animado con efecto neón sutil */}
        <motion.div 
          className="absolute h-[calc(100%-8px)] top-1 bg-gradient-to-r from-[var(--steel-blue)] to-[var(--sunshine)] rounded-md z-0 shadow-[0_0_10px_rgba(66,110,134,0.3)]"
          initial={false}
          animate={{
            left: indicatorStyle.left,
            width: indicatorStyle.width,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />

        {/* Efecto de brillo en las esquinas */}
        <div className="absolute -top-1 -left-1 w-10 h-10 bg-[var(--sunshine)]/10 rounded-full blur-lg opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>
        <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-[var(--sunshine)]/10 rounded-full blur-lg opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>

        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={(el) => {
              if (el) tabsRef.current[index] = el;
            }}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 text-sm font-medium rounded-md transition-all duration-300 relative z-10 title-case
              ${activeTab === tab.id 
                ? 'text-[var(--coal)] font-semibold' 
                : 'text-[var(--coal)]/80 hover:text-[var(--steel-blue)]'}
              transform hover:scale-105 transition-bounce`}
          >
            {/* Efecto de brillo sutil en hover */}
            {activeTab !== tab.id && (
              <span className="absolute inset-0 bg-[var(--steel-blue)]/0 hover:bg-[var(--steel-blue)]/5 rounded-md transition-all duration-300"></span>
            )}
            
            <motion.span
              initial={{ y: 0 }}
              whileHover={{ y: -1 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              {tab.label}
            </motion.span>
          </button>
        ))}
      </div>
    </div>
  );
};

const ComoFuncionaPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('proceso');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  
  // Efecto para animación de entrada al cargar la página
  useEffect(() => {
    const timer = setTimeout(() => {
      document.querySelector('.page-content')?.classList.add('loaded');
    }, 100);
    return () => clearTimeout(timer);
  }, []);
  
  // Manejador para expandir/colapsar FAQs con animación
  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
    
    // Agregar un pequeño retraso para permitir que la animación se complete antes de hacer scroll
    if (expandedFaq !== index) {
      setTimeout(() => {
        const element = document.getElementById(`faq-item-${index}`);
        if (element) {
          const yOffset = -100; // Offset para que el elemento no quede justo en el borde superior
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
    }
  };

  // Datos de pestañas
  const tabs = [
    { id: 'proceso', label: 'Proceso' },
    { id: 'preguntas', label: 'Preguntas frecuentes' },
  ];
  
  // Datos de FAQs
  const faqs = [
    {
      q: '¿CÓMO SÉ QUÉ NIVEL DE SERVICIO NECESITO?',
      a: 'Nuestro diagnóstico inicial gratuito te ayudará a determinar el nivel de asistencia legal que mejor se adapta a tu caso. Basado en tus respuestas, te recomendaremos la opción más adecuada, pero siempre tendrás la libertad de elegir el servicio que prefieras.'
    },
    {
      q: '¿PUEDO CAMBIAR DE NIVEL DE SERVICIO DURANTE EL PROCESO?',
      a: 'Sí, nuestro modelo está diseñado para ser flexible. Puedes comenzar con un nivel básico como la auto-asistencia y luego escalar a servicios más completos como la intervención especializada o la representación integral si tu caso lo requiere.'
    },
    {
      q: '¿QUÉ ÁREAS DEL DERECHO CUBREN SUS SERVICIOS?',
      a: 'Cubrimos una amplia gama de áreas legales incluyendo derecho civil, laboral, familiar, contractual, inmobiliario, y protección al consumidor. Durante el diagnóstico inicial podrás especificar tu área de interés para recibir asistencia especializada.'
    },
    {
      q: '¿CÓMO FUNCIONA EL PAGO DE LOS SERVICIOS?',
      a: 'Cada nivel de servicio tiene un precio transparente que se muestra antes de contratar. Ofrecemos opciones de pago seguro mediante tarjeta de crédito, transferencia bancaria o pasarelas de pago online. Para la Representación Integral, se establece un presupuesto personalizado según la complejidad del caso.'
    },
    {
      q: '¿CUÁNTO TIEMPO TOMA RECIBIR RESPUESTA DESPUÉS DE CONTRATAR UN SERVICIO?',
      a: 'Para servicios automatizados como el diagnóstico inicial y la auto-asistencia, el acceso es inmediato. Para el reporte estratégico, recibirás tu análisis en un máximo de 48 horas. La intervención especializada y representación integral se coordinan directamente con el abogado asignado, generalmente con un primer contacto en las primeras 24 horas.'
    }
  ];

  // Variantes de animación
  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const staggerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  return (
    <motion.div 
      className="page-content min-h-screen bg-[var(--bone)] text-[var(--coal)] py-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.section 
        className="container mx-auto px-4 mb-24"
        initial="hidden"
        animate="visible"
        variants={fadeInVariants}
      >
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-title mb-8 text-[var(--coal)] inline-block title-case-es">
            Cómo funciona <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--steel-blue)] to-[var(--steel-blue-light)]">nuestro servicio</span>
          </h2>
          <p className="text-[var(--coal)] max-w-3xl mx-auto text-lg sentence-case leading-relaxed">
            Nuestro modelo de servicio escalonado te permite elegir el nivel de asistencia legal que necesitas,
            desde herramientas de autoservicio hasta representación completa.
          </p>
        </div>
        
        <div className="p-6 md:p-8 bg-[var(--bone)] rounded-xl border border-[var(--steel-blue)]/20 shadow-lg">
          <ServiceFlowVertical />
        </div>
        
        <motion.div 
          className="mt-32"
          variants={fadeInVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[var(--coal)] inline-block title-case-es">
              Detalles del <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--steel-blue)] to-[var(--steel-blue-light)]">servicio</span>
            </h2>
            <p className="text-[var(--coal)] max-w-3xl mx-auto text-base sentence-case">
              Selecciona una sección para ver más información sobre nuestro proceso o respuestas a preguntas frecuentes.
            </p>
          </div>
          
          <TabSelector 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabs={tabs}
          />
          
          <AnimatePresence mode="wait">
            {activeTab === 'proceso' && (
              <motion.div
                key="proceso"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto"
              >
                <GuideStepsComponent />
              </motion.div>
            )}
            
            {activeTab === 'preguntas' && (
              <motion.div
                key="preguntas"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="max-w-3xl mx-auto text-[var(--coal)]"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-10 text-[var(--coal)] inline-block title-case-es">
                  Preguntas frecuentes
                </h2>
                
                <motion.div 
                  className="space-y-6"
                  variants={staggerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {faqs.map((faq, index) => (
                    <motion.div
                      key={`faq-${index}`}
                      variants={fadeInVariants}
                      custom={index * 0.1}
                      className="mb-6"
                      id={`faq-item-${index}`}
                    >
                      <Card 
                        className={`overflow-hidden ${expandedFaq === index 
                          ? 'shadow-xl border-l-4 border-l-[var(--sunshine)]' 
                          : 'shadow-md hover:shadow-lg hover:border-l-4 hover:border-l-[var(--sunshine)]/50'} 
                          transition-all duration-300 group`}
                      >
                        <div 
                          className={`cursor-pointer ${expandedFaq === index ? 'p-6' : 'p-5 hover:p-6'} transition-all duration-300`}
                          onClick={() => toggleFaq(index)}
                        >
                          <div className="flex justify-between items-center">
                            <motion.span 
                              className={`font-medium text-lg title-case ${expandedFaq === index 
                                ? 'text-[var(--steel-blue)] text-xl' 
                                : 'text-[var(--coal)] group-hover:text-[var(--steel-blue)]'}`}
                              animate={{ 
                                color: expandedFaq === index ? 'var(--steel-blue)' : 'var(--coal)'
                              }}
                              transition={{ duration: 0.3 }}
                            >
                              {faq.q}
                            </motion.span>
                            <motion.div 
                              className={`flex items-center justify-center w-10 h-10 rounded-full 
                                ${expandedFaq === index 
                                  ? 'bg-[var(--sunshine)]/10 text-[var(--steel-blue)] shadow-[0_0_10px_rgba(249,186,50,0.2)]' 
                                  : 'bg-[var(--steel-blue)]/10 text-[var(--coal)] group-hover:text-[var(--steel-blue)] group-hover:bg-[var(--steel-blue)]/5'} 
                                transition-all duration-300 border ${expandedFaq === index 
                                  ? 'border-[var(--sunshine)]/30' 
                                  : 'border-[var(--steel-blue)]/20 group-hover:border-[var(--sunshine)]/20'}`}
                              animate={{ 
                                rotate: expandedFaq === index ? 135 : 0,
                                scale: expandedFaq === index ? 1.1 : 1
                              }}
                              transition={{ 
                                type: "spring", 
                                stiffness: 300, 
                                damping: 20 
                              }}
                              whileHover={{
                                scale: expandedFaq === index ? 1.1 : 1.05,
                                transition: { duration: 0.2 }
                              }}
                            >
                              <span className="text-2xl leading-none">{expandedFaq === index ? '×' : '+'}</span>
                            </motion.div>
                          </div>
                          <AnimatePresence>
                            {expandedFaq === index && (
                              <motion.div
                                initial={{ height: 0, opacity: 0, y: -10 }}
                                animate={{ height: "auto", opacity: 1, y: 0 }}
                                exit={{ height: 0, opacity: 0, y: -10 }}
                                transition={{ 
                                  duration: 0.4,
                                  type: "spring",
                                  stiffness: 100,
                                  damping: 20
                                }}
                                className="overflow-hidden"
                              >
                                <div className="mt-6 pt-6 border-t border-[var(--steel-blue)]/20">
                                  <p className="text-[var(--coal)] text-base leading-relaxed sentence-case">{faq.a}</p>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <motion.div 
            className="flex justify-center mt-16"
            variants={fadeInVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            <Link 
              to="/contact" 
              className="inline-flex items-center gap-2 text-[var(--coal)]/80 hover:text-[var(--steel-blue)] transition-all duration-500 
                hover:gap-3 group py-3 px-5 rounded-full border border-transparent hover:border-[var(--sunshine)]/50 
                neon-glow-hover relative overflow-hidden"
            >
              {/* Efecto de brillo en hover */}
              <span className="absolute inset-0 bg-[var(--sunshine)]/0 group-hover:bg-[var(--sunshine)]/10 rounded-full transition-all duration-300"></span>
              
              <motion.div
                className="relative z-10"
                whileHover={{ 
                  rotate: 15, 
                  scale: 1.2,
                  transition: { type: "spring", stiffness: 400, damping: 10 }
                }}
                animate={{ 
                  y: [0, -2, 0],
                  transition: { repeat: Infinity, duration: 1.5, ease: "easeInOut" }
                }}
              >
                <InfoIcon className="w-5 h-5" />
              </motion.div>
              
              <span className="relative z-10 title-case-es font-medium">¿Tienes más preguntas? Contáctanos</span>
              
              <motion.span 
                className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-500 relative z-10"
                initial={{ x: -10 }}
                animate={{ x: 0 }}
                whileHover={{ x: 2 }}
              >
                →
              </motion.span>
            </Link>
          </motion.div>
        </motion.div>
      </motion.section>
    </motion.div>
  );
};

export default ComoFuncionaPage;
