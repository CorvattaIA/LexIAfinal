import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AnimatedInput from './ui/AnimatedInput';
import Card from './ui/Card';
import Button from './ui/Button';
import Typography from './ui/Typography';
import { useFormValidation, validationRules } from '../hooks/useFormValidation';
import { ErrorBoundary } from './ErrorBoundary';
import ErrorFallback from './ErrorBoundary/ErrorFallback';

// Definir la interfaz para los valores del formulario
interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

/**
 * Componente de ejemplo que muestra el uso del componente AnimatedInput
 * con diferentes configuraciones y temas.
 */
const AnimatedInputExample: React.FC = () => {
  // Estado para controlar el tema de los inputs
  const [theme, setTheme] = useState<'primary' | 'secondary' | 'accent'>('primary');
  
  // Configurar el hook de validación
  const {
    values,
    validation,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue
  } = useFormValidation<LoginFormValues>({
    // Valores iniciales del formulario
    initialValues: {
      email: '',
      password: '',
      rememberMe: false
    },
    // Reglas de validación para cada campo
    validationRules: {
      email: [
        validationRules.required('El correo electrónico es obligatorio'),
        validationRules.email('Ingrese un correo electrónico válido')
      ],
      password: [
        validationRules.required('La contraseña es obligatoria'),
        validationRules.minLength(8, 'La contraseña debe tener al menos 8 caracteres')
      ]
    },
    // Validar al cambiar, al perder el foco y al enviar
    validateOnChange: true,
    validateOnBlur: true,
    validateOnSubmit: true,
    // Función que se ejecuta al enviar el formulario
    onSubmit: (formValues, isValid) => {
      if (isValid) {
        console.log('Formulario enviado:', formValues);
        // Aquí iría la lógica de autenticación
        alert('Inicio de sesión exitoso (simulado)');
      }
    }
  });
  
  // Limpiar un campo específico
  const handleClearField = (fieldName: keyof LoginFormValues) => {
    setFieldValue(fieldName, '');
  };
  
  // Cambiar el tema de los inputs
  const handleThemeChange = (newTheme: 'primary' | 'secondary' | 'accent') => {
    setTheme(newTheme);
  };
  
  // Animaciones para el contenedor
  const containerVariants = {
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
  
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => resetForm()}
    >
      <div className="max-w-2xl mx-auto p-4 md:p-6">
        <Typography
          variant="h2"
          className="mb-6 text-center"
          color="var(--text-primary)"
        >
          Componentes de Entrada Animados
        </Typography>
        
        {/* Selector de tema */}
        <div className="mb-8 flex justify-center gap-4">
          <Button
            variant={theme === 'primary' ? 'primary' : 'outline'}
            onClick={() => handleThemeChange('primary')}
            className="min-w-[100px]"
          >
            Primary
          </Button>
          <Button
            variant={theme === 'secondary' ? 'primary' : 'outline'}
            onClick={() => handleThemeChange('secondary')}
            className="min-w-[100px]"
          >
            Secondary
          </Button>
          <Button
            variant={theme === 'accent' ? 'primary' : 'outline'}
            onClick={() => handleThemeChange('accent')}
            className="min-w-[100px]"
          >
            Accent
          </Button>
        </div>
        
        <Card className="overflow-hidden">
          <motion.form
            onSubmit={handleSubmit}
            className="p-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Typography
              variant="h3"
              className="mb-6 text-center"
              color="var(--text-primary)"
            >
              Iniciar Sesión
            </Typography>
            
            {/* Correo electrónico */}
            <motion.div variants={itemVariants}>
              <AnimatedInput
                id="email"
                name="email"
                label="Correo electrónico"
                type="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={validation.email?.isTouched && !validation.email?.isValid ? validation.email?.errors[0] : undefined}
                required
                placeholder="correo@ejemplo.com"
                clearable
                onClear={() => handleClearField('email')}
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
                theme={theme}
              />
            </motion.div>
            
            {/* Contraseña */}
            <motion.div variants={itemVariants}>
              <AnimatedInput
                id="password"
                name="password"
                label="Contraseña"
                type="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={validation.password?.isTouched && !validation.password?.isValid ? validation.password?.errors[0] : undefined}
                required
                clearable
                onClear={() => handleClearField('password')}
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
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                }
                theme={theme}
              />
            </motion.div>
            
            {/* Recordarme */}
            <motion.div className="mt-4 flex items-center" variants={itemVariants}>
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                checked={values.rememberMe}
                onChange={handleChange}
                className={`w-4 h-4 rounded focus:ring-2 focus:ring-offset-2 
                  ${theme === 'primary' 
                    ? 'text-[var(--text-primary)] focus:ring-[var(--border-primary)]/30' 
                    : theme === 'secondary'
                    ? 'text-[var(--text-secondary)] focus:ring-[var(--border-secondary)]/30'
                    : 'text-[var(--text-accent)] focus:ring-[var(--border-accent)]/30'
                  }`}
              />
              <label
                htmlFor="rememberMe"
                className="ml-2 block text-sm text-[var(--text-secondary)]"
              >
                Recordarme
              </label>
            </motion.div>
            
            {/* Botones de acción */}
            <motion.div className="mt-8 flex flex-wrap gap-4 justify-center" variants={itemVariants}>
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
                Iniciar Sesión
              </Button>
            </motion.div>
          </motion.form>
        </Card>
        
        {/* Ejemplos adicionales */}
        <div className="mt-12">
          <Typography
            variant="h3"
            className="mb-6"
            color="var(--text-primary)"
          >
            Otros ejemplos
          </Typography>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Ejemplo con contador de caracteres */}
            <Card className="p-6">
              <Typography
                variant="h4"
                className="mb-4"
                color="var(--text-primary)"
              >
                Con contador de caracteres
              </Typography>
              
              <AnimatedInput
                id="message"
                name="message"
                label="Mensaje"
                value={values.email} // Reutilizamos el valor del email solo para el ejemplo
                onChange={handleChange}
                placeholder="Escribe un mensaje..."
                showCharCount
                maxLength={100}
                helpText="Máximo 100 caracteres"
                theme={theme}
              />
            </Card>
            
            {/* Ejemplo deshabilitado */}
            <Card className="p-6">
              <Typography
                variant="h4"
                className="mb-4"
                color="var(--text-primary)"
              >
                Campo deshabilitado
              </Typography>
              
              <AnimatedInput
                id="disabled"
                name="disabled"
                label="Campo deshabilitado"
                value="Este campo está deshabilitado"
                onChange={() => {}}
                disabled
                theme={theme}
              />
            </Card>
            
            {/* Ejemplo con icono a la derecha */}
            <Card className="p-6">
              <Typography
                variant="h4"
                className="mb-4"
                color="var(--text-primary)"
              >
                Icono a la derecha
              </Typography>
              
              <AnimatedInput
                id="search"
                name="search"
                label="Buscar"
                value={values.password} // Reutilizamos el valor de password solo para el ejemplo
                onChange={handleChange}
                placeholder="Buscar..."
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
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                }
                iconPosition="right"
                theme={theme}
              />
            </Card>
            
            {/* Ejemplo con etiqueta no animada */}
            <Card className="p-6">
              <Typography
                variant="h4"
                className="mb-4"
                color="var(--text-primary)"
              >
                Etiqueta no animada
              </Typography>
              
              <AnimatedInput
                id="standard"
                name="standard"
                label="Campo estándar"
                value={values.email} // Reutilizamos el valor del email solo para el ejemplo
                onChange={handleChange}
                placeholder="Sin animación de etiqueta"
                animateLabel={false}
                theme={theme}
              />
            </Card>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default AnimatedInputExample;
