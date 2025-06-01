import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Typography from './Typography';

interface AnimatedInputProps {
  /** ID único del campo */
  id: string;
  /** Nombre del campo para el formulario */
  name: string;
  /** Etiqueta visible para el usuario */
  label: string;
  /** Tipo de input (text, email, password, etc.) */
  type?: string;
  /** Valor actual del campo */
  value: string;
  /** Función para manejar cambios en el campo */
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Función para manejar evento de blur */
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  /** Función para manejar evento de focus */
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  /** Mensaje de error */
  error?: string;
  /** Texto de ayuda adicional */
  helpText?: string;
  /** Si el campo es requerido */
  required?: boolean;
  /** Placeholder del campo */
  placeholder?: string;
  /** Clases CSS adicionales */
  className?: string;
  /** Si el campo está deshabilitado */
  disabled?: boolean;
  /** Icono a mostrar en el campo */
  icon?: React.ReactNode;
  /** Posición del icono */
  iconPosition?: 'left' | 'right';
  /** Si se debe mostrar un botón para limpiar el campo */
  clearable?: boolean;
  /** Callback cuando se limpia el campo */
  onClear?: () => void;
  /** Si se debe mostrar un contador de caracteres */
  showCharCount?: boolean;
  /** Máximo número de caracteres permitidos */
  maxLength?: number;
  /** Si se debe animar la etiqueta */
  animateLabel?: boolean;
  /** Tema de color */
  theme?: 'primary' | 'secondary' | 'accent';
}

/**
 * Componente de entrada de texto con animaciones y microinteracciones
 */
const AnimatedInput: React.FC<AnimatedInputProps> = ({
  id,
  name,
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  onFocus,
  error,
  helpText,
  required = false,
  placeholder = '',
  className = '',
  disabled = false,
  icon,
  iconPosition = 'left',
  clearable = false,
  onClear,
  showCharCount = false,
  maxLength,
  animateLabel = true,
  theme = 'primary'
}) => {
  // Estados para manejar el foco y la animación
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Determinar si el input tiene contenido
  const hasContent = value !== '';
  
  // Manejar el foco
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };
  
  // Manejar la pérdida de foco
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };
  
  // Limpiar el campo
  const handleClear = () => {
    if (onClear) {
      onClear();
    } else {
      // Si no se proporciona un callback onClear, simular un cambio con valor vacío
      const event = {
        target: {
          name,
          value: ''
        }
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(event);
    }
    
    // Enfocar el input después de limpiar
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  // Colores según el tema
  const getThemeColors = () => {
    switch (theme) {
      case 'primary':
        return {
          border: 'var(--border-primary)',
          focus: 'var(--border-primary)',
          text: 'var(--text-primary)',
          background: 'var(--background-card)'
        };
      case 'secondary':
        return {
          border: 'var(--border-secondary)',
          focus: 'var(--border-secondary)',
          text: 'var(--text-secondary)',
          background: 'var(--background-card)'
        };
      case 'accent':
        return {
          border: 'var(--border-accent)',
          focus: 'var(--border-accent)',
          text: 'var(--text-accent)',
          background: 'var(--background-card)'
        };
      default:
        return {
          border: 'var(--border-primary)',
          focus: 'var(--border-primary)',
          text: 'var(--text-primary)',
          background: 'var(--background-card)'
        };
    }
  };
  
  const themeColors = getThemeColors();
  
  // Clases para el contenedor del input
  const inputContainerClasses = `
    relative w-full transition-all duration-300 rounded-md
    ${error 
      ? 'border border-[var(--border-danger)] focus-within:ring-2 focus-within:ring-[var(--border-danger)]/30' 
      : `border border-[${themeColors.border}]/30 focus-within:border-[${themeColors.focus}] focus-within:ring-2 focus-within:ring-[${themeColors.focus}]/30 hover:border-[${themeColors.focus}]/70`}
    ${disabled ? 'bg-[var(--background-subtle)]/50 cursor-not-allowed' : `bg-[${themeColors.background}]`}
    ${icon ? (iconPosition === 'left' ? 'pl-10' : 'pr-10') : ''}
    ${clearable && hasContent ? 'pr-10' : ''}
    ${className}
  `;
  
  // Animaciones para la etiqueta flotante
  const labelVariants = {
    default: {
      y: 0,
      scale: 1,
      color: `${themeColors.text}`,
      transition: { duration: 0.2, ease: 'easeInOut' }
    },
    focused: {
      y: -28,
      scale: 0.85,
      color: isFocused ? `${themeColors.focus}` : `${themeColors.text}`,
      transition: { duration: 0.2, ease: 'easeInOut' }
    }
  };
  
  // Animaciones para el icono de limpiar
  const clearIconVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } }
  };
  
  // Animaciones para el mensaje de error
  const errorVariants = {
    hidden: { opacity: 0, y: -10, height: 0 },
    visible: { 
      opacity: 1, 
      y: 0, 
      height: 'auto',
      transition: { duration: 0.3, ease: 'easeOut' }
    }
  };
  
  // Calcular el porcentaje de caracteres utilizados
  const charPercentage = maxLength ? (value.length / maxLength) * 100 : 0;
  const isNearLimit = maxLength && value.length > maxLength * 0.8;
  
  // Efecto para manejar el clic fuera del componente
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <div className="mb-6 relative">
      {/* Label del campo */}
      {animateLabel ? (
        <motion.label
          htmlFor={id}
          className="absolute z-10 px-1 ml-3 bg-[var(--background-card)] pointer-events-none"
          variants={labelVariants}
          initial={hasContent || isFocused ? 'focused' : 'default'}
          animate={hasContent || isFocused ? 'focused' : 'default'}
        >
          {label}
          {required && (
            <span className="ml-1 text-[var(--text-danger)]" aria-hidden="true">*</span>
          )}
        </motion.label>
      ) : (
        <label 
          htmlFor={id}
          className="block mb-1.5 text-sm font-medium text-[var(--text-primary)]"
        >
          {label}
          {required && (
            <span className="ml-1 text-[var(--text-danger)]" aria-hidden="true">*</span>
          )}
        </label>
      )}
      
      {/* Contenedor del input con icono si existe */}
      <div 
        className={inputContainerClasses}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Icono izquierdo */}
        {icon && iconPosition === 'left' && (
          <motion.div 
            className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[var(--text-secondary)]"
            animate={{ 
              scale: isFocused ? 1.1 : 1,
              color: isFocused ? themeColors.focus : 'var(--text-secondary)'
            }}
            transition={{ duration: 0.2 }}
          >
            {icon}
          </motion.div>
        )}
        
        {/* Input */}
        <input
          ref={inputRef}
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder={placeholder}
          required={required}
          maxLength={maxLength}
          className={`
            w-full px-4 py-3 rounded-md bg-transparent text-[var(--text-primary)]
            disabled:text-[var(--text-secondary)]/70 disabled:cursor-not-allowed
            focus:outline-none
            ${icon && iconPosition === 'left' ? 'pl-10' : ''}
            ${(clearable && hasContent) || (icon && iconPosition === 'right') ? 'pr-10' : ''}
          `}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${id}-error` : helpText ? `${id}-help` : undefined}
        />
        
        {/* Icono derecho o botón de limpiar */}
        {((clearable && hasContent) || (icon && iconPosition === 'right')) && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {clearable && hasContent ? (
              <AnimatePresence>
                <motion.button
                  type="button"
                  className="text-[var(--text-secondary)] hover:text-[var(--text-danger)] focus:outline-none"
                  onClick={handleClear}
                  variants={clearIconVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Limpiar campo"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </motion.button>
              </AnimatePresence>
            ) : icon && iconPosition === 'right' ? (
              <motion.div 
                className="pointer-events-none text-[var(--text-secondary)]"
                animate={{ 
                  scale: isFocused ? 1.1 : 1,
                  color: isFocused ? themeColors.focus : 'var(--text-secondary)'
                }}
                transition={{ duration: 0.2 }}
              >
                {icon}
              </motion.div>
            ) : null}
          </div>
        )}
      </div>
      
      {/* Contador de caracteres */}
      {showCharCount && maxLength && (
        <div className="mt-1 flex justify-end items-center">
          <div className="w-full max-w-[200px] bg-[var(--background-subtle)] rounded-full h-1.5 mr-2 overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${
                isNearLimit
                  ? value.length > maxLength
                    ? 'bg-[var(--text-danger)]'
                    : 'bg-[var(--text-warning)]'
                  : `bg-[${themeColors.focus}]`
              }`}
              initial={{ width: '0%' }}
              animate={{ width: `${Math.min(charPercentage, 100)}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <Typography
            variant="caption"
            color={
              value.length > maxLength
                ? 'var(--text-danger)'
                : isNearLimit
                ? 'var(--text-warning)'
                : 'var(--text-secondary)'
            }
          >
            {value.length}/{maxLength}
          </Typography>
        </div>
      )}
      
      {/* Mensajes de error */}
      <AnimatePresence>
        {error && (
          <motion.div
            id={`${id}-error`}
            className="mt-1.5 text-sm text-[var(--text-danger)]"
            role="alert"
            variants={errorVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <Typography 
              variant="body-small" 
              color="var(--text-danger)" 
              className="flex items-center gap-1"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 inline" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                />
              </svg>
              {error}
            </Typography>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Texto de ayuda */}
      {helpText && !error && (
        <div id={`${id}-help`} className="mt-1.5 text-sm text-[var(--text-secondary)]">
          <Typography 
            variant="body-small" 
            color="var(--text-secondary)" 
            className="flex items-center gap-1"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 inline" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            {helpText}
          </Typography>
        </div>
      )}
    </div>
  );
};

export default AnimatedInput;
