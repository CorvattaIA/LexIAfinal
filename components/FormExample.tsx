import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useFormValidation, validationRules } from '../hooks/useFormValidation';
import FormField from './FormField';
import Card from './ui/Card';
import Button from './ui/Button';
import Typography from './ui/Typography';
import { ErrorBoundary } from './ErrorBoundary';
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

/**
 * Componente de ejemplo que muestra el uso del hook useFormValidation
 * y el componente FormField para crear un formulario con validación.
 */
const FormExample: React.FC = () => {
  // Estado para mostrar el mensaje de éxito
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  // Configurar el hook de validación
  const {
    values,
    validation,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm
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
        validationRules.minLength(20, 'El mensaje debe tener al menos 20 caracteres')
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
    onSubmit: (formValues, isValid) => {
      if (isValid) {
        // Simulamos el envío del formulario
        console.log('Formulario enviado:', formValues);
        // Mostrar mensaje de éxito
        setFormSubmitted(true);
        // Resetear el formulario después de 3 segundos
        setTimeout(() => {
          resetForm();
          setFormSubmitted(false);
        }, 3000);
      }
    }
  });
  
  // Opciones para el campo de asunto
  const subjectOptions = [
    { value: 'consulta', label: 'Consulta general' },
    { value: 'soporte', label: 'Soporte técnico' },
    { value: 'contratacion', label: 'Contratación de servicios' },
    { value: 'otro', label: 'Otro asunto' }
  ];
  
  // Animaciones para el formulario
  const formVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24
      }
    }
  };
  
  // Animaciones para el mensaje de éxito
  const successVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20
      }
    },
    exit: {
      scale: 0.8,
      opacity: 0,
      transition: {
        duration: 0.3
      }
    }
  };
  
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => resetForm()}
    >
      <div className="max-w-3xl mx-auto p-4 md:p-6">
        <Typography
          variant="h2"
          className="mb-6 text-center"
          color="var(--text-primary)"
        >
          Formulario de Contacto
        </Typography>
        
        <Card className="overflow-hidden">
          {formSubmitted ? (
            <motion.div
              className="p-6 text-center"
              variants={successVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
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
                Gracias por contactarnos. Nos pondremos en contacto contigo lo antes posible.
              </Typography>
            </motion.div>
          ) : (
            <motion.form
              onSubmit={handleSubmit}
              className="p-6"
              variants={formVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nombre completo */}
                <motion.div variants={itemVariants}>
                  <FormField
                    id="fullName"
                    name="fullName"
                    label="Nombre completo"
                    type="text"
                    value={values.fullName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    validation={validation.fullName}
                    required
                    placeholder="Ingrese su nombre completo"
                    icon={
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
                    }
                  />
                </motion.div>
                
                {/* Correo electrónico */}
                <motion.div variants={itemVariants}>
                  <FormField
                    id="email"
                    name="email"
                    label="Correo electrónico"
                    type="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    validation={validation.email}
                    required
                    placeholder="correo@ejemplo.com"
                    icon={
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
                    }
                  />
                </motion.div>
                
                {/* Teléfono */}
                <motion.div variants={itemVariants}>
                  <FormField
                    id="phone"
                    name="phone"
                    label="Teléfono"
                    type="tel"
                    value={values.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    validation={validation.phone}
                    placeholder="Ingrese su número de teléfono"
                    helpText="Formato: 10 dígitos sin espacios"
                    icon={
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
                    }
                  />
                </motion.div>
                
                {/* Asunto */}
                <motion.div variants={itemVariants}>
                  <FormField
                    id="subject"
                    name="subject"
                    label="Asunto"
                    as="select"
                    value={values.subject}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    validation={validation.subject}
                    required
                    options={subjectOptions}
                    icon={
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
                    }
                  />
                </motion.div>
              </div>
              
              {/* Mensaje */}
              <motion.div className="mt-4" variants={itemVariants}>
                <FormField
                  id="message"
                  name="message"
                  label="Mensaje"
                  as="textarea"
                  rows={5}
                  value={values.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  validation={validation.message}
                  required
                  placeholder="Escriba su mensaje aquí..."
                />
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
                      className="w-4 h-4 text-[var(--text-accent)] border-[var(--border-accent)]/30 rounded focus:ring-[var(--border-accent)]/30"
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
              <motion.div className="mt-6 flex flex-wrap gap-4 justify-end" variants={itemVariants}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  className="min-w-[120px]"
                >
                  Limpiar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={!validation.isValid || !validation.isDirty}
                  className="min-w-[120px]"
                >
                  Enviar
                </Button>
              </motion.div>
            </motion.form>
          )}
        </Card>
        
        {/* Información de depuración (solo en desarrollo) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-[var(--background-subtle)] rounded-md">
            <Typography variant="h4" className="mb-2" color="var(--text-primary)">
              Estado del formulario (Debug)
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Typography variant="body-small" className="mb-1 font-medium" color="var(--text-primary)">
                  Valores:
                </Typography>
                <pre className="bg-[var(--background-card)] p-2 rounded text-xs overflow-auto">
                  {JSON.stringify(values, null, 2)}
                </pre>
              </div>
              <div>
                <Typography variant="body-small" className="mb-1 font-medium" color="var(--text-primary)">
                  Validación:
                </Typography>
                <pre className="bg-[var(--background-card)] p-2 rounded text-xs overflow-auto">
                  {JSON.stringify(validation, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default FormExample;
