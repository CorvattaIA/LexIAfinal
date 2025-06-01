import { useState, useCallback, useEffect } from 'react';

// Tipos para las reglas de validación
export type ValidationRule<T> = {
  validate: (value: T, formValues?: Record<string, any>) => boolean;
  message: string;
};

// Tipo para el estado de validación de un campo
export type FieldValidationState = {
  isValid: boolean;
  errors: string[];
  isDirty: boolean;
  isTouched: boolean;
};

// Tipo para el estado de validación de todo el formulario
export type FormValidationState<T extends Record<string, any>> = {
  [K in keyof T]: FieldValidationState;
} & {
  isValid: boolean;
  isDirty: boolean;
};

// Tipo para las reglas de validación de todos los campos
export type ValidationRules<T extends Record<string, any>> = {
  [K in keyof T]?: ValidationRule<T[K]>[];
};

// Opciones para el hook
export interface UseFormValidationOptions<T extends Record<string, any>> {
  initialValues: T;
  validationRules: ValidationRules<T>;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  validateOnSubmit?: boolean;
  onSubmit?: (values: T, isValid: boolean) => void;
}

/**
 * Hook personalizado para manejar la validación de formularios
 * @param options Opciones de configuración para el hook
 */
export function useFormValidation<T extends Record<string, any>>({
  initialValues,
  validationRules,
  validateOnChange = true,
  validateOnBlur = true,
  validateOnSubmit = true,
  onSubmit
}: UseFormValidationOptions<T>) {
  // Estado para los valores del formulario
  const [values, setValues] = useState<T>(initialValues);
  
  // Inicializar el estado de validación para cada campo
  const initValidationState = useCallback(() => {
    const validationState: Partial<FormValidationState<T>> = {};
    
    // Inicializar cada campo con valores por defecto
    Object.keys(initialValues).forEach(key => {
      const fieldKey = key as keyof T;
      validationState[fieldKey] = {
        isValid: true,
        errors: [],
        isDirty: false,
        isTouched: false
      };
    });
    
    // Añadir propiedades globales
    validationState.isValid = true;
    validationState.isDirty = false;
    
    return validationState as FormValidationState<T>;
  }, [initialValues]);
  
  // Estado para la validación
  const [validation, setValidation] = useState<FormValidationState<T>>(initValidationState);
  
  // Función para validar un campo específico
  const validateField = useCallback((name: keyof T, value: any, allValues: T = values): FieldValidationState => {
    const fieldRules = validationRules[name] || [];
    const errors: string[] = [];
    
    // Aplicar cada regla de validación
    fieldRules.forEach(rule => {
      if (!rule.validate(value, allValues)) {
        errors.push(rule.message);
      }
    });
    
    return {
      isValid: errors.length === 0,
      errors,
      isDirty: validation[name]?.isDirty || false,
      isTouched: validation[name]?.isTouched || false
    };
  }, [validationRules, validation, values]);
  
  // Función para validar todo el formulario
  const validateForm = useCallback((formValues: T = values): FormValidationState<T> => {
    const newValidation: Partial<FormValidationState<T>> = {};
    let isFormValid = true;
    let isFormDirty = false;
    
    // Validar cada campo
    Object.keys(formValues).forEach(key => {
      const fieldKey = key as keyof T;
      const fieldValue = formValues[fieldKey];
      const fieldValidation = validateField(fieldKey, fieldValue, formValues);
      
      newValidation[fieldKey] = fieldValidation;
      
      // Actualizar estado global del formulario
      if (!fieldValidation.isValid) {
        isFormValid = false;
      }
      
      if (fieldValidation.isDirty) {
        isFormDirty = true;
      }
    });
    
    // Añadir propiedades globales
    newValidation.isValid = isFormValid;
    newValidation.isDirty = isFormDirty;
    
    return newValidation as FormValidationState<T>;
  }, [validateField, values]);
  
  // Manejar cambios en los campos
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const fieldName = name as keyof T;
    
    // Determinar el valor según el tipo de campo
    let fieldValue: any = value;
    if (type === 'checkbox') {
      fieldValue = (e.target as HTMLInputElement).checked;
    } else if (type === 'number') {
      fieldValue = value === '' ? '' : Number(value);
    }
    
    // Actualizar valores
    setValues(prev => ({
      ...prev,
      [fieldName]: fieldValue
    }));
    
    // Marcar el campo como modificado
    setValidation(prev => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        isDirty: true
      }
    }));
    
    // Validar si es necesario
    if (validateOnChange) {
      const newValues = { ...values, [fieldName]: fieldValue };
      const fieldValidation = validateField(fieldName, fieldValue, newValues);
      
      setValidation(prev => {
        const newValidation = {
          ...prev,
          [fieldName]: {
            ...fieldValidation,
            isDirty: true
          }
        };
        
        // Actualizar validez global
        let isFormValid = true;
        Object.keys(newValidation).forEach(key => {
          if (key !== 'isValid' && key !== 'isDirty') {
            const fieldKey = key as keyof T;
            if (newValidation[fieldKey] && !newValidation[fieldKey].isValid) {
              isFormValid = false;
            }
          }
        });
        
        return {
          ...newValidation,
          isValid: isFormValid,
          isDirty: true
        };
      });
    }
  }, [validateOnChange, validateField, values]);
  
  // Manejar evento de blur (cuando el campo pierde el foco)
  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    const fieldName = name as keyof T;
    
    // Marcar el campo como tocado
    setValidation(prev => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        isTouched: true
      }
    }));
    
    // Validar si es necesario
    if (validateOnBlur) {
      const fieldValue = values[fieldName];
      const fieldValidation = validateField(fieldName, fieldValue);
      
      setValidation(prev => {
        const newValidation = {
          ...prev,
          [fieldName]: {
            ...fieldValidation,
            isTouched: true
          }
        };
        
        // Actualizar validez global
        let isFormValid = true;
        Object.keys(newValidation).forEach(key => {
          if (key !== 'isValid' && key !== 'isDirty') {
            const fieldKey = key as keyof T;
            if (newValidation[fieldKey] && !newValidation[fieldKey].isValid) {
              isFormValid = false;
            }
          }
        });
        
        return {
          ...newValidation,
          isValid: isFormValid
        };
      });
    }
  }, [validateOnBlur, validateField, values]);
  
  // Manejar envío del formulario
  const handleSubmit = useCallback((e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    // Validar todo el formulario si es necesario
    if (validateOnSubmit) {
      const formValidation = validateForm();
      setValidation(formValidation);
      
      // Llamar al callback de envío si el formulario es válido
      if (onSubmit) {
        onSubmit(values, formValidation.isValid);
      }
      
      return formValidation.isValid;
    } else if (onSubmit) {
      onSubmit(values, validation.isValid);
      return validation.isValid;
    }
    
    return validation.isValid;
  }, [validateOnSubmit, validateForm, onSubmit, values, validation.isValid]);
  
  // Restablecer el formulario a sus valores iniciales
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setValidation(initValidationState());
  }, [initialValues, initValidationState]);
  
  // Establecer valores programáticamente
  const setFieldValue = useCallback((name: keyof T, value: any, shouldValidate = true) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Validar si es necesario
    if (shouldValidate) {
      const newValues = { ...values, [name]: value };
      const fieldValidation = validateField(name, value, newValues);
      
      setValidation(prev => {
        const newValidation = {
          ...prev,
          [name]: {
            ...fieldValidation,
            isDirty: true
          }
        };
        
        // Actualizar validez global
        let isFormValid = true;
        Object.keys(newValidation).forEach(key => {
          if (key !== 'isValid' && key !== 'isDirty') {
            const fieldKey = key as keyof T;
            if (newValidation[fieldKey] && !newValidation[fieldKey].isValid) {
              isFormValid = false;
            }
          }
        });
        
        return {
          ...newValidation,
          isValid: isFormValid,
          isDirty: true
        };
      });
    }
  }, [validateField, values]);
  
  // Validar el formulario cuando cambian las reglas de validación
  useEffect(() => {
    if (Object.keys(validationRules).length > 0) {
      const formValidation = validateForm();
      setValidation(formValidation);
    }
  }, [validationRules, validateForm]);
  
  return {
    values,
    validation,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    validateField,
    validateForm
  };
}

// Reglas de validación predefinidas
export const validationRules = {
  required: (message = 'Este campo es obligatorio'): ValidationRule<any> => ({
    validate: (value) => {
      if (value === undefined || value === null) return false;
      if (typeof value === 'string') return value.trim() !== '';
      if (Array.isArray(value)) return value.length > 0;
      return true;
    },
    message
  }),
  
  email: (message = 'Ingrese un correo electrónico válido'): ValidationRule<string> => ({
    validate: (value) => {
      if (!value) return true; // Si está vacío, la validación required se encargará
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailRegex.test(value);
    },
    message
  }),
  
  minLength: (min: number, message = `Debe tener al menos ${min} caracteres`): ValidationRule<string> => ({
    validate: (value) => {
      if (!value) return true; // Si está vacío, la validación required se encargará
      return value.length >= min;
    },
    message
  }),
  
  maxLength: (max: number, message = `Debe tener como máximo ${max} caracteres`): ValidationRule<string> => ({
    validate: (value) => {
      if (!value) return true;
      return value.length <= max;
    },
    message
  }),
  
  pattern: (regex: RegExp, message = 'El formato no es válido'): ValidationRule<string> => ({
    validate: (value) => {
      if (!value) return true;
      return regex.test(value);
    },
    message
  }),
  
  numeric: (message = 'Debe ser un número'): ValidationRule<string> => ({
    validate: (value) => {
      if (!value) return true;
      return !isNaN(Number(value));
    },
    message
  }),
  
  min: (min: number, message = `Debe ser mayor o igual a ${min}`): ValidationRule<number> => ({
    validate: (value) => {
      if (value === undefined || value === null) return true;
      return value >= min;
    },
    message
  }),
  
  max: (max: number, message = `Debe ser menor o igual a ${max}`): ValidationRule<number> => ({
    validate: (value) => {
      if (value === undefined || value === null) return true;
      return value <= max;
    },
    message
  }),
  
  match: (fieldName: string, message = 'Los campos no coinciden'): ValidationRule<any> => ({
    validate: (value, formValues) => {
      if (!formValues) return true;
      return value === formValues[fieldName];
    },
    message
  }),
  
  custom: <T>(validateFn: (value: T, formValues?: Record<string, any>) => boolean, message: string): ValidationRule<T> => ({
    validate: validateFn,
    message
  })
};
