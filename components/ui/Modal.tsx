
import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <div 
      className="fixed inset-0 bg-[var(--negro-espacial)] bg-opacity-80 backdrop-blur-sm flex justify-center items-center z-[100]"
      onClick={onClose} // Close on overlay click
    >
      <div 
        className={`bg-[var(--gris-oscuro-surf)] p-6 rounded-xl shadow-2xl border border-[var(--purpura-profundo)]/30 text-[var(--gris-plata)] ${sizeClasses[size]} w-full mx-4`}
        onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside modal
      >
        {title && (
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold text-[var(--turquesa-neon)] font-lexend">{title}</h3>
            <button 
              onClick={onClose} 
              className="text-[var(--gris-plata)] hover:text-[var(--blanco-puro)] transition-colors p-1 rounded-full hover:bg-[var(--negro-espacial)]"
              aria-label="Cerrar modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
