import React from 'react';
import Typography from '../ui/Typography';
import { FieldValidationState } from '../../hooks/useFormValidation';

interface FormFieldProps {
  /** ID único del campo */
  id: string;
  /** Nombre del campo para el formulario */
  name: string;
  /** Etiqueta visible para el usuario */
  label: string;
  /** Tipo de input (text, email, password, etc.) */
  type?: string;
  /** Valor actual del campo */
  value: any;
  /** Función para manejar cambios en el campo */
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  /** Función para manejar evento de blur */
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  /** Estado de validación del campo */
  validation?: FieldValidationState;
  /** Si se debe mostrar errores solo cuando el campo ha sido tocado */
  showErrorsOnlyWhenTouched?: boolean;
  /** Texto de ayuda adicional */
  helpText?: string;
  /** Si el campo es requerido */
  required?: boolean;
  /** Placeholder del campo */
  placeholder?: string;
  /** Clases CSS adicionales */
  className?: string;
  /** Componente personalizado para renderizar (input, select, textarea) */
  as?: 'input' | 'select' | 'textarea';
  /** Opciones para select */
  options?: Array<{ value: string; label: string }>;
  /** Atributos adicionales para el input */
  inputProps?: React.InputHTMLAttributes<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;
  /** Número de filas para textarea */
  rows?: number;
  /** Si el campo está deshabilitado */
  disabled?: boolean;
  /** Icono a mostrar en el campo */
  icon?: React.ReactNode;
  /** Posición del icono */
  iconPosition?: 'left' | 'right';
}

/**
 * Componente reutilizable para campos de formulario con validación
 */
const FormField: React.FC<FormFieldProps> = ({
  id,
  name,
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  validation,
  showErrorsOnlyWhenTouched = true,
  helpText,
  required = false,
  placeholder,
  className = '',
  as = 'input',
  options = [],
  inputProps = {},
  rows = 3,
  disabled = false,
  icon,
  iconPosition = 'left'
}) => {
  // Determinar si se deben mostrar errores
  const showErrors = validation && 
    (!showErrorsOnlyWhenTouched || (showErrorsOnlyWhenTouched && validation.isTouched)) && 
    !validation.isValid;
  
  // Clases para el contenedor del input
  const inputContainerClasses = `
    relative w-full border rounded-md transition-all duration-300
    ${showErrors 
      ? 'border-[var(--border-danger)] focus-within:ring-2 focus-within:ring-[var(--border-danger)]/30' 
      : 'border-[var(--border-accent)]/30 focus-within:border-[var(--border-accent)] focus-within:ring-2 focus-within:ring-[var(--border-accent)]/30'}
    ${disabled ? 'bg-[var(--background-subtle)]/50 cursor-not-allowed' : 'bg-[var(--background-card)]'}
    ${icon ? (iconPosition === 'left' ? 'pl-10' : 'pr-10') : ''}
  `;
  
  // Renderizar el componente de input adecuado
  const renderInput = () => {
    const commonProps = {
      id,
      name,
      value: value ?? '',
      onChange,
      onBlur,
      disabled,
      placeholder,
      required,
      className: `
        w-full px-4 py-2.5 rounded-md bg-transparent text-[var(--text-primary)]
        disabled:text-[var(--text-secondary)]/70 disabled:cursor-not-allowed
        focus:outline-none
      `,
      'aria-invalid': showErrors ? 'true' : 'false',
      'aria-describedby': showErrors ? `${id}-error` : helpText ? `${id}-help` : undefined,
      ...inputProps
    };
    
    if (as === 'select') {
      return (
        <select {...commonProps}>
          <option value="" disabled>
            {placeholder || 'Seleccione una opción'}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }
    
    if (as === 'textarea') {
      return (
        <textarea 
          {...commonProps} 
          rows={rows}
        />
      );
    }
    
    return (
      <input 
        {...commonProps} 
        type={type}
      />
    );
  };
  
  return (
    <div className={`mb-4 ${className}`}>
      {/* Label del campo */}
      <label 
        htmlFor={id}
        className="block mb-1.5 text-sm font-medium text-[var(--text-primary)]"
      >
        {label}
        {required && (
          <span className="ml-1 text-[var(--text-danger)]" aria-hidden="true">*</span>
        )}
      </label>
      
      {/* Contenedor del input con icono si existe */}
      <div className={inputContainerClasses}>
        {icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[var(--text-secondary)]">
            {icon}
          </div>
        )}
        
        {renderInput()}
        
        {icon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-[var(--text-secondary)]">
            {icon}
          </div>
        )}
      </div>
      
      {/* Mensajes de error */}
      {showErrors && validation?.errors.length > 0 && (
        <div id={`${id}-error`} className="mt-1.5 text-sm text-[var(--text-danger)]" role="alert">
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
            {validation.errors[0]}
          </Typography>
        </div>
      )}
      
      {/* Texto de ayuda */}
      {helpText && !showErrors && (
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

export default FormField;
