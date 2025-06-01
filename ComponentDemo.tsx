import { useState } from 'react';
import UnifiedServiceFlow from './components/UnifiedServiceFlow';
import Typography from './components/ui/Typography';
import Navbar from './components/Navbar';
import Layout from './components/layout/Layout';
import Modal from './components/ui/Modal';

/**
 * Página de demostración de componentes
 * Muestra los componentes refactorizados del sistema UI
 */
const ComponentDemo = () => {
  const [orientation, setOrientation] = useState<'horizontal' | 'vertical'>('horizontal');
  const [activeTab, setActiveTab] = useState<'typography' | 'serviceflow' | 'navbar' | 'modal'>('typography');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Datos de ejemplo para el flujo de servicio
  const serviceStages = [
    { id: 1, title: "Diagnóstico inicial", description: "Evaluación preliminar de tu caso" },
    { id: 2, title: "Análisis detallado", description: "Estudio profundo de la situación legal" },
    { id: 3, title: "Estrategia legal", description: "Desarrollo de un plan de acción personalizado" },
    { id: 4, title: "Implementación", description: "Ejecución de las acciones legales necesarias" },
    { id: 5, title: "Seguimiento", description: "Monitoreo continuo del progreso del caso" },
  ];

  const toggleOrientation = () => {
    setOrientation(prev => prev === 'horizontal' ? 'vertical' : 'horizontal');
  };
  
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <Layout 
      title="Demostración de Componentes" 
      description="Página que muestra los componentes refactorizados del sistema UI"
      className="min-h-screen"
    >
      <div className="container mx-auto px-4 py-8">
        <Typography variant="h1" className="mb-8 text-center">
          Demostración de Componentes
        </Typography>
        
        {/* Tabs de navegación */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {[
            { id: 'typography', label: 'Tipografía' },
            { id: 'serviceflow', label: 'Flujo de Servicio' },
            { id: 'navbar', label: 'Navbar' },
            { id: 'modal', label: 'Modal' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-md transition-colors ${activeTab === tab.id 
                ? 'bg-[var(--steel-blue)] text-white' 
                : 'bg-white hover:bg-[var(--bone-dark)] text-[var(--coal)]'}`}
              aria-pressed={activeTab === tab.id}
            >
              <Typography 
                variant="body-small" 
                color={activeTab === tab.id ? 'white' : undefined}
                weight="medium"
              >
                {tab.label}
              </Typography>
            </button>
          ))}
        </div>
        
        {/* Sistema Tipográfico */}
        {activeTab === 'typography' && (
          <div className="mb-12">
            <Typography variant="h2" className="mb-4">
              Sistema Tipográfico
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-lg shadow-md">
              <div>
                <Typography variant="h1" className="mb-4">
                  Heading 1
                </Typography>
                <Typography variant="h2" className="mb-4">
                  Heading 2
                </Typography>
                <Typography variant="h3" className="mb-4">
                  Heading 3
                </Typography>
                <Typography variant="h4" className="mb-4">
                  Heading 4
                </Typography>
                <Typography variant="h5" className="mb-4">
                  Heading 5
                </Typography>
              </div>
              <div>
                <Typography variant="display" className="mb-4">
                  Display
                </Typography>
                <Typography variant="body" className="mb-4">
                  Body: Texto normal para párrafos y contenido general.
                </Typography>
                <Typography variant="body-small" className="mb-4">
                  Body Small: Texto más pequeño para notas y contenido secundario.
                </Typography>
                <Typography variant="caption" className="mb-4">
                  Caption: Texto muy pequeño para pies de foto y anotaciones.
                </Typography>
                <Typography variant="body" weight="normal" className="mb-2">
                  Peso Normal
                </Typography>
                <Typography variant="body" weight="medium" className="mb-2">
                  Peso Medium
                </Typography>
                <Typography variant="body" weight="semibold" className="mb-2">
                  Peso Semibold
                </Typography>
                <Typography variant="body" weight="bold" className="mb-2">
                  Peso Bold
                </Typography>
              </div>
            </div>
          </div>
        )}
        
        {/* Flujo de Servicio */}
        {activeTab === 'serviceflow' && (
          <div className="mb-12">
            <div className="flex justify-between items-center mb-4">
              <Typography variant="h2">
                Flujo de Servicio Unificado
              </Typography>
              <button
                onClick={toggleOrientation}
                className="px-4 py-2 bg-[var(--steel-blue)] text-white rounded-md hover:bg-[var(--steel-blue-dark)] transition-colors"
                aria-label={`Cambiar a orientación ${orientation === 'horizontal' ? 'vertical' : 'horizontal'}`}
              >
                <Typography variant="body-small" color="white">
                  Cambiar a {orientation === 'horizontal' ? 'Vertical' : 'Horizontal'}
                </Typography>
              </button>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <UnifiedServiceFlow 
                stages={serviceStages} 
                orientation={orientation} 
                activeStage={3}
                onStageClick={(stageId) => console.log(`Clicked stage ${stageId}`)}
              />
            </div>
          </div>
        )}
        
        {/* Navbar */}
        {activeTab === 'navbar' && (
          <div className="mb-12">
            <Typography variant="h2" className="mb-4">
              Navbar Refactorizado
            </Typography>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Typography variant="body" className="mb-4">
                El componente Navbar ha sido refactorizado para usar el componente Typography y mejorar la accesibilidad con atributos ARIA, manejo de foco y navegación por teclado.
              </Typography>
              
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <Navbar />
              </div>
              
              <div className="mt-6">
                <Typography variant="h4" className="mb-2">
                  Mejoras implementadas:
                </Typography>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <Typography variant="body">
                      Uso del componente Typography para todos los textos
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body">
                      Atributos ARIA para mejorar la accesibilidad
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body">
                      Manejo de foco y navegación por teclado
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body">
                      Transiciones suaves para el menú móvil
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body">
                      Roles semánticos para elementos de menú
                    </Typography>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
        
        {/* Modal */}
        {activeTab === 'modal' && (
          <div className="mb-12">
            <Typography variant="h2" className="mb-4">
              Modal Refactorizado
            </Typography>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Typography variant="body" className="mb-4">
                El componente Modal ha sido refactorizado para usar el componente Typography y mejorar la accesibilidad con atributos ARIA, manejo de foco y navegación por teclado.
              </Typography>
              
              <div className="flex justify-center mt-6">
                <button
                  onClick={openModal}
                  className="px-6 py-3 bg-[var(--steel-blue)] text-white rounded-md hover:bg-[var(--steel-blue-dark)] transition-colors"
                  aria-label="Abrir modal de demostración"
                >
                  <Typography variant="body" color="white" weight="medium">
                    Abrir Modal
                  </Typography>
                </button>
              </div>
              
              <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title="Modal de Demostración"
                description="Este es un modal accesible con manejo de foco y navegación por teclado"
                size="md"
                animationVariant="scale"
              >
                <div className="space-y-4">
                  <Typography variant="body">
                    Este modal ha sido refactorizado para mejorar la accesibilidad y usar el componente Typography para todos los textos.
                  </Typography>
                  
                  <Typography variant="body">
                    Características principales:
                  </Typography>
                  
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <Typography variant="body">
                        Manejo de foco: Al abrir el modal, el foco se establece en el botón de cierre
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body">
                        Navegación por teclado: Puedes cerrar el modal con la tecla Escape
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body">
                        Atributos ARIA: El modal tiene roles y atributos ARIA para mejorar la accesibilidad
                      </Typography>
                    </li>
                    <li>
                      <Typography variant="body">
                        Bloqueo de scroll: El scroll del body se bloquea cuando el modal está abierto
                      </Typography>
                    </li>
                  </ul>
                  
                  <div className="flex justify-end mt-6">
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 bg-[var(--steel-blue)] text-white rounded-md hover:bg-[var(--steel-blue-dark)] transition-colors"
                    >
                      <Typography variant="body-small" color="white">
                        Cerrar
                      </Typography>
                    </button>
                  </div>
                </div>
              </Modal>
              
              <div className="mt-6">
                <Typography variant="h4" className="mb-2">
                  Mejoras implementadas:
                </Typography>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <Typography variant="body">
                      Uso del componente Typography para todos los textos
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body">
                      Atributos ARIA para mejorar la accesibilidad
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body">
                      Manejo de foco y navegación por teclado
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body">
                      Bloqueo de scroll cuando el modal está abierto
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body">
                      Animaciones y transiciones suaves
                    </Typography>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ComponentDemo;
