import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import ContactForm from './ContactForm';
import Card from './ui/Card';
import Button from './ui/Button';
import Typography from './ui/Typography';
import ErrorBoundary from './ErrorBoundary';
import ErrorFallback from './ErrorBoundary/ErrorFallback';

/**
 * Componente de ejemplo que muestra diferentes configuraciones
 * del formulario de contacto.
 */
const ContactFormExample: React.FC = () => {
  // Estado para controlar el tema y configuración
  const [theme, setTheme] = useState<'primary' | 'secondary' | 'accent'>('primary');
  const [useAnimatedInputs, setUseAnimatedInputs] = useState(true);
  const [showSuccessMessage, setShowSuccessMessage] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [mobileLayout, setMobileLayout] = useState(true);
  const [mobileInputSize, setMobileInputSize] = useState<'default' | 'large'>('large');
  const [isMobile, setIsMobile] = useState(false);
  
  // Detectar preferencia de reducción de movimiento del sistema
  const prefersReducedMotion = useReducedMotion();
  
  // Detectar si el dispositivo es móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Verificar inicialmente
    checkMobile();
    
    // Añadir listener para cambios de tamaño
    window.addEventListener('resize', checkMobile);
    
    // Limpiar listener
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Aplicar automáticamente reducción de movimiento si el sistema lo prefiere
  useEffect(() => {
    if (prefersReducedMotion) {
      setReduceMotion(true);
    }
  }, [prefersReducedMotion]);
  
  // Función de envío simulada
  const handleSubmit = async (values: any) => {
    console.log('Formulario enviado:', values);
    
    // Simulamos un retraso para mostrar el estado de carga
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulamos un error aleatorio (25% de probabilidad)
    if (Math.random() < 0.25) {
      throw new Error('Error simulado: No se pudo procesar la solicitud. Por favor, inténtelo de nuevo.');
    }
    
    return values;
  };
  
  // Animaciones para el contenedor (adaptadas para preferencias de reducción de movimiento)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: reduceMotion ? 0.05 : 0.1,
        delayChildren: reduceMotion ? 0.1 : 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: reduceMotion ? { opacity: 0 } : { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: reduceMotion ? 'tween' : 'spring',
        stiffness: 300,
        damping: 24,
        duration: reduceMotion ? 0.2 : undefined
      }
    }
  };
  
  return (
    <ErrorBoundary
      fallbackComponent={ErrorFallback}
      resetKeys={[theme, useAnimatedInputs, showSuccessMessage, reduceMotion, mobileLayout, mobileInputSize]}
      onResetKeysChange={() => {
        // Lógica para reiniciar el estado del componente
        setTheme('primary');
        setUseAnimatedInputs(true);
        setShowSuccessMessage(true);
        setReduceMotion(false);
        setMobileLayout(false);
        setMobileInputSize('default');
      }}
    >
      <div className="w-full max-w-5xl mx-auto p-3 md:p-6">
        <Typography
          variant={isMobile ? "h3" : "h2"}
          className="mb-6 text-center"
          color="var(--text-primary)"
        >
          Ejemplos de Formulario de Contacto
        </Typography>
        
        <motion.div
          className="mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Card className="p-6">
            <Typography
              variant="h3"
              className="mb-4"
              color="var(--text-primary)"
            >
              Configuración
            </Typography>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {/* Selector de tema */}
              {/* Selector de tema */}
              <motion.div variants={itemVariants}>
                <Typography
                  variant="h4"
                  className="mb-2"
                  color="var(--text-primary)"
                >
                  Tema
                </Typography>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={theme === 'primary' ? 'primary' : 'outline'}
                    onClick={() => setTheme('primary')}
                    size={isMobile ? "md" : "sm"}
                    className={isMobile ? "flex-1" : ""}
                  >
                    Primary
                  </Button>
                  <Button
                    variant={theme === 'secondary' ? 'primary' : 'outline'}
                    onClick={() => setTheme('secondary')}
                    size={isMobile ? "md" : "sm"}
                    className={isMobile ? "flex-1" : ""}
                  >
                    Secondary
                  </Button>
                  <Button
                    variant={theme === 'accent' ? 'primary' : 'outline'}
                    onClick={() => setTheme('accent')}
                    size={isMobile ? "md" : "sm"}
                    className={isMobile ? "flex-1" : ""}
                  >
                    Accent
                  </Button>
                </div>
              </motion.div>
              
              {/* Selector de tipo de input */}
              <motion.div variants={itemVariants}>
                <Typography
                  variant="h4"
                  className="mb-2"
                  color="var(--text-primary)"
                >
                  Tipo de Input
                </Typography>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={useAnimatedInputs ? 'primary' : 'outline'}
                    onClick={() => setUseAnimatedInputs(true)}
                    size={isMobile ? "md" : "sm"}
                    className={isMobile ? "flex-1" : ""}
                  >
                    Animados
                  </Button>
                  <Button
                    variant={!useAnimatedInputs ? 'primary' : 'outline'}
                    onClick={() => setUseAnimatedInputs(false)}
                    size={isMobile ? "md" : "sm"}
                    className={isMobile ? "flex-1" : ""}
                  >
                    Estándar
                  </Button>
                </div>
              </motion.div>
              
              {/* Selector de mensaje de éxito */}
              <motion.div variants={itemVariants}>
                <Typography
                  variant="h4"
                  className="mb-2"
                  color="var(--text-primary)"
                >
                  Mensaje de Éxito
                </Typography>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={showSuccessMessage ? 'primary' : 'outline'}
                    onClick={() => setShowSuccessMessage(true)}
                    size={isMobile ? "md" : "sm"}
                    className={isMobile ? "flex-1" : ""}
                  >
                    Mostrar
                  </Button>
                  <Button
                    variant={!showSuccessMessage ? 'primary' : 'outline'}
                    onClick={() => setShowSuccessMessage(false)}
                    size={isMobile ? "md" : "sm"}
                    className={isMobile ? "flex-1" : ""}
                  >
                    Ocultar
                  </Button>
                </div>
              </motion.div>
              
              {/* Opciones móviles */}
              <motion.div variants={itemVariants} className="md:col-span-3 mt-4 pt-4 border-t border-[var(--border-subtle)]">
                <Typography
                  variant="h4"
                  className="mb-2"
                  color="var(--text-primary)"
                >
                  Opciones para Móvil
                </Typography>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Reducción de movimiento */}
                  <div>
                    <Typography
                      variant="body-small"
                      className="mb-2"
                      color="var(--text-secondary)"
                    >
                      Reducir animaciones
                    </Typography>
                    <div className="flex gap-2">
                      <Button
                        variant={!reduceMotion ? 'primary' : 'outline'}
                        onClick={() => setReduceMotion(false)}
                        size={isMobile ? "md" : "sm"}
                        className={isMobile ? "flex-1" : ""}
                      >
                        Normal
                      </Button>
                      <Button
                        variant={reduceMotion ? 'primary' : 'outline'}
                        onClick={() => setReduceMotion(true)}
                        size={isMobile ? "md" : "sm"}
                        className={isMobile ? "flex-1" : ""}
                      >
                        Reducidas
                      </Button>
                    </div>
                  </div>
                  
                  {/* Layout móvil */}
                  <div>
                    <Typography
                      variant="body-small"
                      className="mb-2"
                      color="var(--text-secondary)"
                    >
                      Layout para móvil
                    </Typography>
                    <div className="flex gap-2">
                      <Button
                        variant={!mobileLayout ? 'primary' : 'outline'}
                        onClick={() => setMobileLayout(false)}
                        size={isMobile ? "md" : "sm"}
                        className={isMobile ? "flex-1" : ""}
                      >
                        2 columnas
                      </Button>
                      <Button
                        variant={mobileLayout ? 'primary' : 'outline'}
                        onClick={() => setMobileLayout(true)}
                        size={isMobile ? "md" : "sm"}
                        className={isMobile ? "flex-1" : ""}
                      >
                        1 columna
                      </Button>
                    </div>
                  </div>
                  
                  {/* Tamaño de inputs */}
                  <div>
                    <Typography
                      variant="body-small"
                      className="mb-2"
                      color="var(--text-secondary)"
                    >
                      Tamaño de inputs
                    </Typography>
                    <div className="flex gap-2">
                      <Button
                        variant={mobileInputSize === 'default' ? 'primary' : 'outline'}
                        onClick={() => setMobileInputSize('default')}
                        size={isMobile ? "md" : "sm"}
                        className={isMobile ? "flex-1" : ""}
                      >
                        Normal
                      </Button>
                      <Button
                        variant={mobileInputSize === 'large' ? 'primary' : 'outline'}
                        onClick={() => setMobileInputSize('large')}
                        size={isMobile ? "md" : "sm"}
                        className={isMobile ? "flex-1" : ""}
                      >
                        Grande
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </Card>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Formulario con configuración personalizada */}
          <div>
            <Typography
              variant="h3"
              className="mb-4"
              color="var(--text-primary)"
            >
              Configuración Actual
            </Typography>
            
            <ContactForm
              title="Contáctanos"
              description="Completa el formulario con la configuración que seleccionaste."
              theme={theme}
              useAnimatedInputs={useAnimatedInputs}
              showSuccessMessage={showSuccessMessage}
              onSubmit={handleSubmit}
              reduceMotion={reduceMotion}
              mobileLayout={mobileLayout}
              mobileInputSize={mobileInputSize}
            />
          </div>
          
          {/* Ejemplos adicionales */}
          <div>
            <Typography
              variant="h3"
              className="mb-4"
              color="var(--text-primary)"
            >
              Ejemplos Adicionales
            </Typography>
            
            <div className="space-y-8">
              {/* Ejemplo minimalista */}
              <Card className="p-6">
                <Typography
                  variant="h4"
                  className="mb-4"
                  color="var(--text-primary)"
                >
                  Versión Minimalista
                </Typography>
                
                <ContactForm
                  title=""
                  description=""
                  theme="secondary"
                  useAnimatedInputs={true}
                  showSuccessMessage={false}
                />
              </Card>
              
              {/* Ejemplo con mensaje personalizado */}
              <Card className="p-6">
                <Typography
                  variant="h4"
                  className="mb-4"
                  color="var(--text-primary)"
                >
                  Mensaje Personalizado
                </Typography>
                
                <ContactForm
                  title="Solicita una consulta"
                  description="Nuestro equipo de abogados te contactará en menos de 24 horas."
                  theme="accent"
                  useAnimatedInputs={true}
                  successMessage="Tu solicitud ha sido recibida. Un abogado especializado te contactará en breve."
                />
              </Card>
            </div>
          </div>
        </div>
        
        {/* Código de ejemplo */}
        <div className="mt-12">
          <Typography
            variant="h3"
            className="mb-4"
            color="var(--text-primary)"
          >
            Código de Ejemplo
          </Typography>
          
          <Card className="p-6">
            <Typography
              variant="body-small"
              className="mb-2"
              color="var(--text-primary)"
            >
              Uso básico del componente ContactForm:
            </Typography>
            
            <pre className="bg-[var(--background-subtle)] p-3 md:p-4 rounded-md overflow-auto text-xs md:text-sm">
{`import ContactForm from './components/ContactForm';

const MyPage = () => {
  const handleSubmit = async (values) => {
    // Enviar datos a un API
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values)
    });
    
    if (!response.ok) {
      throw new Error('Error al enviar el formulario');
    }
    
    return await response.json();
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      <ContactForm 
        title="Contáctanos"
        description="Completa el formulario y nos pondremos en contacto contigo."
        theme="primary"
        useAnimatedInputs={true}
        reduceMotion={false}
        mobileLayout={true}
        mobileInputSize="large"
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default MyPage;`}
            </pre>
          </Card>
        </div>
        
        {/* Tabla de propiedades */}
        <div className="mt-12">
          <Typography
            variant="h3"
            className="mb-4"
            color="var(--text-primary)"
          >
            Propiedades del Componente
          </Typography>
          
          <Card className="p-4 md:p-6 overflow-auto">
            <table className="min-w-full divide-y divide-[var(--border-subtle)]">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[var(--text-primary)] uppercase tracking-wider">
                    Propiedad
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[var(--text-primary)] uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[var(--text-primary)] uppercase tracking-wider">
                    Por defecto
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-[var(--text-primary)] uppercase tracking-wider">
                    Descripción
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                <tr>
                  <td className="px-4 py-3 text-sm text-[var(--text-primary)]">title</td>
                  <td className="px-4 py-3 text-sm text-[var(--text-secondary)]">string</td>
                  <td className="px-4 py-3 text-sm text-[var(--text-secondary)]">'Contáctanos'</td>
                  <td className="px-4 py-3 text-sm text-[var(--text-secondary)]">Título del formulario</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-[var(--text-primary)]">description</td>
                  <td className="px-4 py-3 text-sm text-[var(--text-secondary)]">string</td>
                  <td className="px-4 py-3 text-sm text-[var(--text-secondary)]">'Completa el formulario...'</td>
                  <td className="px-4 py-3 text-sm text-[var(--text-secondary)]">Descripción del formulario</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-[var(--text-primary)]">onSubmit</td>
                  <td className="px-4 py-3 text-sm text-[var(--text-secondary)]">function</td>
                  <td className="px-4 py-3 text-sm text-[var(--text-secondary)]">undefined</td>
                  <td className="px-4 py-3 text-sm text-[var(--text-secondary)]">Función que se ejecuta al enviar el formulario</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-[var(--text-primary)]">theme</td>
                  <td className="px-4 py-3 text-sm text-[var(--text-secondary)]">'primary' | 'secondary' | 'accent'</td>
                  <td className="px-4 py-3 text-sm text-[var(--text-secondary)]">'primary'</td>
                  <td className="px-4 py-3 text-sm text-[var(--text-secondary)]">Tema de color del formulario</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-[var(--text-primary)]">className</td>
                  <td className="px-4 py-3 text-sm text-[var(--text-secondary)]">string</td>
                  <td className="px-4 py-3 text-sm text-[var(--text-secondary)]">''</td>
                  <td className="px-4 py-3 text-sm text-[var(--text-secondary)]">Clases CSS adicionales</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-[var(--text-primary)]">showSuccessMessage</td>
                  <td className="px-4 py-3 text-sm text-[var(--text-secondary)]">boolean</td>
                  <td className="px-4 py-3 text-sm text-[var(--text-secondary)]">true</td>
                  <td className="px-4 py-3 text-sm text-[var(--text-secondary)]">Si se debe mostrar el mensaje de éxito</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-[var(--text-primary)]">successMessage</td>
                  <td className="px-4 py-3 text-sm text-[var(--text-secondary)]">string</td>
                  <td className="px-4 py-3 text-sm text-[var(--text-secondary)]">'¡Mensaje enviado con éxito!...'</td>
                  <td className="px-4 py-3 text-sm text-[var(--text-secondary)]">Mensaje de éxito personalizado</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-[var(--text-primary)]">useAnimatedInputs</td>
                  <td className="px-4 py-3 text-sm text-[var(--text-secondary)]">boolean</td>
                  <td className="px-4 py-3 text-sm text-[var(--text-secondary)]">true</td>
                  <td className="px-4 py-3 text-sm text-[var(--text-secondary)]">Si se deben usar inputs animados</td>
                </tr>
              </tbody>
            </table>
          </Card>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default ContactFormExample;
