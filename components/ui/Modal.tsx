import React, { useEffect, useRef, useState } from 'react';
import Icon from './Icon';
import { AnimatePresence, motion } from 'framer-motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnClickOutside?: boolean;
  showCloseButton?: boolean;
  contentPadding?: 'none' | 'sm' | 'md' | 'lg';
  headerBorder?: boolean;
  footerBorder?: boolean;
  footer?: React.ReactNode;
  className?: string;
  animationVariant?: 'fade' | 'scale' | 'slide';
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnClickOutside = true,
  showCloseButton = true,
  contentPadding = 'md',
  headerBorder = true,
  footerBorder = true,
  footer,
  className = '',
  animationVariant = 'scale',
}) => {
  const [isClosing, setIsClosing] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);
  
  // Smooth close function with animation
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 200); // Match this with the animation duration
  };

  // Handle click outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnClickOutside && modalRef.current && !modalRef.current.contains(e.target as Node)) {
      handleClose();
    }
  };

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  };

  const modalVariants = {
    fade: {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.3 } },
      exit: { opacity: 0, transition: { duration: 0.2 } }
    },
    scale: {
      hidden: { opacity: 0, scale: 0.9 },
      visible: { 
        opacity: 1, 
        scale: 1, 
        transition: { 
          type: 'spring', 
          damping: 25, 
          stiffness: 300 
        } 
      },
      exit: { 
        opacity: 0, 
        scale: 0.95, 
        transition: { duration: 0.2 } 
      }
    },
    slide: {
      hidden: { opacity: 0, y: 20 },
      visible: { 
        opacity: 1, 
        y: 0, 
        transition: { 
          type: 'spring', 
          damping: 25, 
          stiffness: 300 
        } 
      },
      exit: { 
        opacity: 0, 
        y: 10, 
        transition: { duration: 0.2 } 
      }
    }
  };
  
  if (!isOpen && !isClosing) return null;

  // Size classes for the modal
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4',
  };

  // Padding classes for the content
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-7',
  };

  // Border classes
  const headerBorderClass = headerBorder ? 'border-b border-[var(--border-subtle)]' : '';
  const footerBorderClass = footerBorder ? 'border-t border-[var(--border-subtle)]' : '';

  return (
    <AnimatePresence>
      {(isOpen || isClosing) && (
        <motion.div
          className="fixed inset-0 flex justify-center items-center z-[100] p-4 overflow-y-auto"
          onClick={handleBackdropClick}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={backdropVariants}
        >
          {/* Backdrop with blur effect */}
          <motion.div 
            className="absolute inset-0 bg-[var(--coal)]/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
          
          {/* Modal content with animation */}
          <motion.div
            ref={modalRef}
            className={`bg-white rounded-xl shadow-2xl w-full ${sizeClasses[size]} ${className} relative z-10`}
            variants={modalVariants[animationVariant]}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Efecto de borde con gradiente mejorado y efecto sutil */}
            <div className="absolute inset-0 rounded-xl p-[1px] -z-10 bg-gradient-to-br from-[var(--sunshine)]/30 via-[var(--steel-blue)]/20 to-[var(--steel-blue)]/30 opacity-70 hover:opacity-100 transition-all duration-500 animate-pulse-subtle border-glow"></div>
            
            {/* Efecto de brillo en las esquinas */}
            <div className="absolute -top-1 -left-1 w-16 h-16 bg-[var(--steel-blue)]/10 rounded-full blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>
            <div className="absolute -bottom-1 -right-1 w-16 h-16 bg-[var(--sunshine)]/10 rounded-full blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>
            
            {title && (
              <div className={`flex justify-between items-center p-5 ${headerBorderClass}`}>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] title-case-es">{title}</h3>
                {showCloseButton && (
                  <button
                    onClick={handleClose}
                    className="text-[var(--coal)] hover:text-[var(--steel-blue)] transition-all duration-300 p-2 rounded-full 
                      hover:bg-[var(--bone)] hover:scale-110 active:scale-95 
                      focus:outline-none focus:ring-2 focus:ring-[var(--steel-blue)]/50 
                      relative overflow-hidden group"
                    aria-label="Close"
                  >
                    {/* Efecto de brillo en hover */}
                    <span className="absolute inset-0 bg-[var(--steel-blue)]/0 group-hover:bg-[var(--steel-blue)]/10 rounded-full transition-all duration-300"></span>
                    
                    <motion.div
                      whileHover={{ 
                        rotate: 90,
                        scale: 1.1,
                        transition: { type: 'spring', stiffness: 300, damping: 10 }
                      }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      className="relative z-10"
                    >
                      <Icon name="x-mark" size="md" />
                    </motion.div>
                  </button>
                )}
              </div>
            )}

            <motion.div 
              className={paddingClasses[contentPadding]}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: 0.15,
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1]
              }}
            >
              {/* Contenedor con animación escalonada para elementos hijos */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: 0.07
                    }
                  }
                }}
              >
                {children}
              </motion.div>
            </motion.div>

            {footer && (
              <div className={`p-5 ${footerBorderClass}`}>
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
