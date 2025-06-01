import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { initScrollAnimations, applyNeonPulseEffect } from '../../utils/animationUtils';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  pageTransition?: boolean;
  id?: string;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  className = '',
  pageTransition = true,
  id = 'main-layout'
}) => {
  // Efecto para scroll suave al inicio y activación de animaciones sofisticadas
  useEffect(() => {
    // Scroll suave al inicio cuando se carga la página
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // Añadir clase para habilitar transiciones después de la carga inicial
    const transitionTimer = setTimeout(() => {
      document.body.classList.add('transitions-enabled');
    }, 300);
    
    // Inicializar animaciones basadas en scroll después de un breve retraso
    // para asegurar que todos los elementos estén renderizados
    const animationTimer = setTimeout(() => {
      // Inicializar animaciones de scroll para elementos con la clase 'reveal-on-scroll'
      initScrollAnimations();
      
      // Aplicar efectos neón sutiles a elementos específicos
      applyNeonPulseEffect('.neon-pulse', '#00c3ff', 0.4);
      
      // Re-inicializar las animaciones de scroll cuando se hace scroll
      // para capturar nuevos elementos que puedan haberse añadido dinámicamente
      const scrollHandler = () => {
        initScrollAnimations();
      };
      
      window.addEventListener('scroll', scrollHandler, { passive: true });
      
      return () => {
        window.removeEventListener('scroll', scrollHandler);
      };
    }, 500);
    
    return () => {
      clearTimeout(transitionTimer);
      clearTimeout(animationTimer);
    };
  }, []);
  
  // Variantes de animación para transiciones de página
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 10
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.05
      }
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <div className={`min-h-screen flex flex-col bg-[var(--bone)] text-[var(--coal)] ${className}`} id={id}>
      <AnimatePresence mode="wait">
        <motion.main 
          className="flex-grow relative"
          initial={pageTransition ? "initial" : undefined}
          animate={pageTransition ? "animate" : undefined}
          exit={pageTransition ? "exit" : undefined}
          variants={pageVariants}
          key={id}
        >
          {/* Overlay de gradiente sutil para transiciones */}
          <div className="pointer-events-none fixed inset-0 z-[-1] bg-gradient-to-b from-[var(--bone-dark)]/30 to-transparent opacity-0 transition-opacity duration-700 ease-in-out" />
          
          {/* Contenido principal con animaciones escalonadas */}
          <motion.div className="h-full w-full">
            {children}
          </motion.div>
        </motion.main>
      </AnimatePresence>
    </div>
  );
};

export default Layout;
