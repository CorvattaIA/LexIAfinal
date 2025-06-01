import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useFormValidation, validationRules } from '../hooks/useFormValidation';
import AnimatedInput from './ui/AnimatedInput';
import FormField from './FormField';
import Card from './ui/Card';
import Button from './ui/Button';
import Typography from './ui/Typography';
import ErrorBoundary from './ErrorBoundary';
import ErrorFallback from './ErrorBoundary/ErrorFallback';

// Definir la interfaz para los valores del formulario
interface ContactFormValues {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  acceptTerms: boolean;
}

interface ContactFormProps {
  /** Título del formulario */
  title?: string;
  /** Descripción del formulario */
  description?: string;
  /** Callback cuando se envía el formulario */
  onSubmit?: (values: ContactFormValues) => Promise<void>;
  /** Tema de color */
  theme?: 'primary' | 'secondary' | 'accent';
  /** Clases CSS adicionales */
  className?: string;
  /** Si se debe mostrar el mensaje de éxito */
  showSuccessMessage?: boolean;
  /** Mensaje de éxito personalizado */
  successMessage?: string;
  /** Si se debe usar inputs animados */
  useAnimatedInputs?: boolean;
  /** Reducir animaciones en dispositivos móviles o de bajo rendimiento */
  reduceMotion?: boolean;
  /** Layout adaptado para móvil (una columna) */
  mobileLayout?: boolean;
  /** Tamaño de los inputs en móvil */
  mobileInputSize?: 'default' | 'large';
}

/**
 * Componente de formulario de contacto con validación y animaciones
 */
const ContactForm: React.FC<ContactFormProps> = ({
  title = 'Contáctanos',
  description = 'Completa el formulario y nos pondremos en contacto contigo lo antes posible.',
  onSubmit,
  theme = 'primary',
  className = '',
  showSuccessMessage = true,
  successMessage = '¡Mensaje enviado con éxito! Gracias por contactarnos.',
  useAnimatedInputs = true,
  reduceMotion = false,
  mobileLayout = true,
  mobileInputSize = 'large'
}) => {
  // Estado para mostrar el mensaje de éxito
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  // Detectar preferencia de reducción de movimiento
  const prefersReducedMotion = useReducedMotion();
  const shouldReduceMotion = prefersReducedMotion || reduceMotion;
  
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
  
  // Configurar el hook de validación
  const {
    values,
    validation,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue
  } = useFormValidation<ContactFormValues>({
    // Valores iniciales del formulario
    initialValues: {
      fullName: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      acceptTerms: false
    },
    // Reglas de validación para cada campo
    validationRules: {
      fullName: [
        validationRules.required('El nombre completo es obligatorio'),
        validationRules.minLength(3, 'El nombre debe tener al menos 3 caracteres')
      ],
      email: [
        validationRules.required('El correo electrónico es obligatorio'),
        validationRules.email('Ingrese un correo electrónico válido')
      ],
      phone: [
        validationRules.pattern(/^\d{9,10}$/, 'Ingrese un número de teléfono válido (9-10 dígitos)')
      ],
      subject: [
        validationRules.required('El asunto es obligatorio'),
        validationRules.minLength(5, 'El asunto debe tener al menos 5 caracteres')
      ],
      message: [
        validationRules.required('El mensaje es obligatorio'),
        validationRules.minLength(20, 'El mensaje debe tener al menos 20 caracteres'),
        validationRules.maxLength(500, 'El mensaje no debe exceder los 500 caracteres')
      ],
      acceptTerms: [
        validationRules.custom<boolean>(
          (value) => value === true,
          'Debe aceptar los términos y condiciones'
        )
      ]
    },
    // Validar al cambiar, al perder el foco y al enviar
    validateOnChange: true,
    validateOnBlur: true,
    validateOnSubmit: true,
    // Función que se ejecuta al enviar el formulario
    onSubmit: async (formValues, isValid) => {
      if (isValid) {
        setIsSubmitting(true);
        setSubmitError(null);
        
        try {
          // Si se proporciona un callback de envío, lo ejecutamos
          if (onSubmit) {
            await onSubmit(formValues);
          } else {
            // Simulamos un envío con un retraso
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
          
          // Mostrar mensaje de éxito
          setFormSubmitted(true);
          
          // Resetear el formulario después de 5 segundos
          setTimeout(() => {
            resetForm();
            setFormSubmitted(false);
          }, 5000);
        } catch (error) {
          // Manejar error de envío
          setSubmitError(error instanceof Error ? error.message : 'Error al enviar el formulario');
        } finally {
          setIsSubmitting(false);
        }
      }
    }
  });
  
  // Limpiar un campo específico
  const handleClearField = (fieldName: keyof ContactFormValues) => {
    setFieldValue(fieldName, '');
  };
  
  // Opciones para el campo de asunto
  const subjectOptions = [
    { value: 'consulta', label: 'Consulta general' },
    { value: 'soporte', label: 'Soporte técnico' },
    { value: 'contratacion', label: 'Contratación de servicios' },
    { value: 'otro', label: 'Otro asunto' }
  ];
  
  // Animaciones para el formulario (adaptadas para preferencias de reducción de movimiento)
  const formVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0.05 : 0.1,
        delayChildren: shouldReduceMotion ? 0.1 : 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: shouldReduceMotion ? { opacity: 0 } : { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: shouldReduceMotion ? 'tween' : 'spring',
        stiffness: 300,
        damping: 24,
        duration: shouldReduceMotion ? 0.2 : undefined
      }
    }
  };
  
  // Animaciones para el mensaje de éxito (adaptadas para preferencias de reducción de movimiento)
  const successVariants = {
    hidden: shouldReduceMotion ? { opacity: 0 } : { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: shouldReduceMotion ? 'tween' : 'spring',
        stiffness: 300,
        damping: 20,
        duration: shouldReduceMotion ? 0.3 : undefined
      }
    },
    exit: {
      scale: shouldReduceMotion ? 1 : 0.8,
      opacity: 0,
      transition: {
        duration: 0.2
      }
    }
  };
  
  // Configuración de gestos táctiles
  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };
  
  // Renderizar el campo según el tipo (AnimatedInput o FormField)
  const renderField = (
    fieldName: keyof ContactFormValues,
    label: string,
    options?: {
      type?: string;
      placeholder?: string;
      required?: boolean;
      helpText?: string;
      icon?: React.ReactNode;
      as?: 'input' | 'select' | 'textarea';
      options?: Array<{ value: string; label: string }>;
      rows?: number;
      maxLength?: number;
      showCharCount?: boolean;
      inputSize?: 'default' | 'large';
      inputMode?: 'text' | 'email' | 'tel' | 'url' | 'numeric' | 'decimal' | 'search';
    }
  ) => {
    const {
      type = 'text',
      placeholder = '',
      required = false,
      helpText = '',
      icon = null,
      as = 'input',
      options: fieldOptions = [],
      rows = 5,
      maxLength,
      showCharCount = false,
      inputSize = 'default',
      inputMode
    } = options || {};
    
    // Determinar si hay error
    const error = validation[fieldName]?.isTouched && !validation[fieldName]?.isValid
      ? validation[fieldName]?.errors[0]
      : undefined;
    
    if (useAnimatedInputs && as === 'input') {
      return (
        <AnimatedInput
          id={fieldName}
          name={fieldName}
          label={label}
          type={type}
          value={values[fieldName] as string}
          onChange={handleChange}
          onBlur={handleBlur}
          error={error}
          required={required}
          placeholder={placeholder}
          helpText={helpText}
          icon={icon}
          clearable={true}
          onClear={() => handleClearField(fieldName)}
          theme={theme}
          maxLength={maxLength}
          showCharCount={showCharCount}
        />
      );
    }
    
    return (
      <FormField
        id={fieldName}
        name={fieldName}
        label={label}
        type={type}
        value={values[fieldName]}
        onChange={handleChange}
        onBlur={handleBlur}
        validation={validation[fieldName]}
        required={required}
        placeholder={placeholder}
        helpText={helpText}
        icon={icon}
        as={as}
        options={fieldOptions}
        rows={rows}
        size={inputSize}
        inputMode={inputMode}
        touchFriendly={isMobile}
      />
    );
  };
  
  return (
    <ErrorBoundary fallbackComponent={ErrorFallback} resetKeys={[formSubmitted]} onResetKeysChange={() => setFormSubmitted(false)}>
      <div className={`w-full ${className}`}>
        <AnimatePresence mode="wait">
          {formSubmitted && showSuccessMessage ? (
            <motion.div
              key="success"
              className="p-6 text-center"
              variants={successVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              drag={isMobile && !shouldReduceMotion ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);
                if (swipe < -swipeConfidenceThreshold) {
                  setFormSubmitted(false);
                }
              }}
            >
              <Card className="p-6 relative">
                {isMobile && (
                  <div className="absolute top-2 right-2 left-2 flex justify-center pointer-events-none">
                    <div className="w-16 h-1 bg-[var(--border-subtle)] rounded-full opacity-50" />
                  </div>
                )}
                <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--background-success)]/20 text-[var(--text-success)]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <Typography
                  variant="h3"
                  className="mb-2"
                  color="var(--text-success)"
                >
                  ¡Mensaje enviado con éxito!
                </Typography>
                <Typography
                  variant="body"
                  className="mb-4"
                  color="var(--text-secondary)"
                >
                  {successMessage}
                </Typography>
                <Button
                  variant="outline"
                  onClick={() => setFormSubmitted(false)}
                  className="mt-4"
                >
                  Volver al formulario
                </Button>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              variants={formVariants}
              initial="hidden"
              animate="visible"
            >
              <Card className="overflow-hidden relative">
                {isMobile && (
                  <div className="absolute top-2 right-2 left-2 flex justify-center pointer-events-none z-10">
                    <div className="w-16 h-1 bg-[var(--border-subtle)] rounded-full opacity-50" />
                  </div>
                )}
                <div className="p-6">
                  {/* Encabezado del formulario */}
                  {(title || description) && (
                    <div className="mb-6 text-center">
                      {title && (
                        <Typography
                          variant="h3"
                          className="mb-2"
                          color="var(--text-primary)"
                        >
                          {title}
                        </Typography>
                      )}
                      {description && (
                        <Typography
                          variant="body"
                          color="var(--text-secondary)"
                        >
                          {description}
                        </Typography>
                      )}
                    </div>
                  )}
                  
                  {/* Mensaje de error de envío */}
                  {submitError && (
                    <motion.div
                      className="mb-6 p-4 bg-[var(--background-danger)]/10 border border-[var(--border-danger)] rounded-md"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <Typography
                        variant="body"
                        color="var(--text-danger)"
                        className="flex items-center gap-2"
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
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                        {submitError}
                      </Typography>
                    </motion.div>
                  )}
                  
                  <form onSubmit={handleSubmit}>
                    <div className={`grid grid-cols-1 ${mobileLayout ? 'md:grid-cols-2' : ''} gap-4`}>
                      {/* Nombre completo */}
                      <motion.div variants={itemVariants}>
                        {renderField('fullName', 'Nombre completo', {
                          type: 'text',
                          required: true,
                          placeholder: 'Ingrese su nombre completo',
                          icon: (
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
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                          ),
                          // Tamaño de input adaptado para móvil
                          inputSize: isMobile ? mobileInputSize : 'default'
                        })}
                      </motion.div>
                      
                      {/* Correo electrónico */}
                      <motion.div variants={itemVariants}>
                        {renderField('email', 'Correo electrónico', {
                          type: 'email',
                          required: true,
                          placeholder: 'correo@ejemplo.com',
                          icon: (
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
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              />
                            </svg>
                          ),
                          // Tamaño de input adaptado para móvil
                          inputSize: isMobile ? mobileInputSize : 'default',
                          // Tipo de teclado para móviles
                          inputMode: 'email'
                        })}
                      </motion.div>
                      
                      {/* Teléfono */}
                      <motion.div variants={itemVariants}>
                        {renderField('phone', 'Teléfono', {
                          type: 'tel',
                          placeholder: 'Ingrese su número de teléfono',
                          helpText: 'Formato: 10 dígitos sin espacios',
                          icon: (
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
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                              />
                            </svg>
                          ),
                          // Tamaño de input adaptado para móvil
                          inputSize: isMobile ? mobileInputSize : 'default',
                          // Tipo de teclado para móviles
                          inputMode: 'tel'
                        })}
                      </motion.div>
                      
                      {/* Asunto */}
                      <motion.div variants={itemVariants}>
                        {renderField('subject', 'Asunto', {
                          as: 'select',
                          required: true,
                          options: subjectOptions,
                          icon: (
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
                                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                              />
                            </svg>
                          ),
                          // Tamaño de input adaptado para móvil
                          inputSize: isMobile ? mobileInputSize : 'default'
                        })}
                      </motion.div>
                    </div>
                    
                    {/* Mensaje */}
                    <motion.div className="mt-4" variants={itemVariants}>
                      {renderField('message', 'Mensaje', {
                        as: 'textarea',
                        rows: isMobile ? 4 : 5, // Reducir tamaño en móvil
                        required: true,
                        placeholder: 'Escriba su mensaje aquí...',
                        maxLength: 500,
                        showCharCount: true,
                        // Tamaño de input adaptado para móvil
                        inputSize: isMobile ? mobileInputSize : 'default'
                      })}
                    </motion.div>
                    
                    {/* Términos y condiciones */}
                    <motion.div className="mt-4" variants={itemVariants}>
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="acceptTerms"
                            name="acceptTerms"
                            type="checkbox"
                            checked={values.acceptTerms}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`w-4 h-4 border rounded focus:ring-2 focus:ring-offset-2 
                              ${theme === 'primary' 
                                ? 'text-[var(--text-primary)] focus:ring-[var(--border-primary)]/30' 
                                : theme === 'secondary'
                                ? 'text-[var(--text-secondary)] focus:ring-[var(--border-secondary)]/30'
                                : 'text-[var(--text-accent)] focus:ring-[var(--border-accent)]/30'
                              }`}
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="acceptTerms" className="text-[var(--text-secondary)]">
                            Acepto los <a href="#" className="text-[var(--text-accent)] hover:underline">términos y condiciones</a>
                          </label>
                          {validation.acceptTerms && !validation.acceptTerms.isValid && validation.acceptTerms.isTouched && (
                            <p className="mt-1 text-sm text-[var(--text-danger)]">
                              {validation.acceptTerms.errors[0]}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                    
                    {/* Botones de acción */}
                    <motion.div className="mt-6 flex flex-wrap gap-4 justify-center md:justify-end" variants={itemVariants}>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={resetForm}
                        className="min-w-[120px]"
                        disabled={isSubmitting}
                      >
                        Limpiar
                      </Button>
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={!validation.isValid || !validation.isDirty || isSubmitting}
                        className="min-w-[120px]"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center gap-2">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Enviando...
                          </span>
                        ) : (
                          'Enviar'
                        )}
                      </Button>
                    </motion.div>
                  </form>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ErrorBoundary>
  );
};

export default ContactForm;
