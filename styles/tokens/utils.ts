/**
 * Utilidades para trabajar con tokens de diseño
 * 
 * Este archivo contiene funciones de ayuda para trabajar con los tokens de diseño
 * y facilitar su uso en componentes y estilos.
 */

import { colors, typography, spacing, borders, shadows } from './index';

/**
 * Convierte un token de color a una variable CSS
 * @param colorToken - Ruta al token de color (ej: 'steelBlue.base')
 * @returns String con el valor de la variable CSS
 */
export const getColorVar = (colorToken: string): string => {
  const [category, shade] = colorToken.split('.');
  
  if (!category || !shade || !colors[category] || !colors[category][shade]) {
    console.warn(`Color token inválido: ${colorToken}`);
    return 'currentColor';
  }
  
  return `var(--${category}-${shade})`;
};

/**
 * Obtiene un valor de espaciado
 * @param size - Clave del token de espaciado o valor numérico
 * @returns Valor de espaciado
 */
export const getSpacing = (size: keyof typeof spacing | number): string => {
  if (typeof size === 'number') {
    return spacing[size] || `${size}px`;
  }
  
  return spacing[size] || '0';
};

/**
 * Obtiene un valor de radio de borde
 * @param size - Clave del token de radio
 * @returns Valor de radio de borde
 */
export const getBorderRadius = (size: keyof typeof borders.radius): string => {
  return borders.radius[size] || borders.radius.base;
};

/**
 * Obtiene un valor de sombra
 * @param size - Clave del token de sombra
 * @returns Valor de sombra
 */
export const getShadow = (size: keyof typeof shadows): string => {
  return shadows[size] || shadows.none;
};

/**
 * Obtiene un valor de tipografía
 * @param category - Categoría de tipografía (fontFamily, fontSize, etc.)
 * @param key - Clave del token
 * @returns Valor de tipografía
 */
export const getTypography = (
  category: keyof typeof typography,
  key: string
): string | number => {
  return typography[category]?.[key] || '';
};

/**
 * Genera clases CSS para texto con gradiente
 * @param fromColor - Color inicial del gradiente
 * @param toColor - Color final del gradiente
 * @returns String con las clases CSS
 */
export const getGradientTextClasses = (
  fromColor: string = 'steelBlue.base',
  toColor: string = 'steelBlue.light'
): string => {
  return `text-transparent bg-clip-text bg-gradient-to-r from-[${getColorVar(fromColor)}] to-[${getColorVar(toColor)}]`;
};

/**
 * Genera una clase de texto con opacidad
 * @param opacity - Valor de opacidad (0-100)
 * @returns String con la clase CSS
 */
export const getTextOpacityClass = (opacity: number = 100): string => {
  if (opacity < 0 || opacity > 100) {
    console.warn(`Valor de opacidad inválido: ${opacity}. Debe estar entre 0 y 100.`);
    opacity = 100;
  }
  
  return `opacity-${opacity}`;
};

/**
 * Genera clases para transiciones
 * @param properties - Propiedades CSS a animar
 * @param duration - Duración de la transición
 * @param timing - Función de temporización
 * @returns String con las clases CSS
 */
export const getTransitionClasses = (
  properties: string[] = ['all'],
  duration: keyof typeof transitions.duration = 300,
  timing: keyof typeof transitions.timing = 'inOut'
): string => {
  const propertiesStr = properties.join(' ');
  return `transition-[${propertiesStr}] duration-${duration} ease-${timing}`;
};

/**
 * Genera clases para hover
 * @param baseClasses - Clases base
 * @param hoverClasses - Clases para hover
 * @returns String con las clases CSS
 */
export const withHoverClasses = (
  baseClasses: string,
  hoverClasses: string
): string => {
  return `${baseClasses} ${hoverClasses.split(' ').map(c => `hover:${c}`).join(' ')}`;
};

/**
 * Genera clases para focus
 * @param baseClasses - Clases base
 * @param focusClasses - Clases para focus
 * @returns String con las clases CSS
 */
export const withFocusClasses = (
  baseClasses: string,
  focusClasses: string
): string => {
  return `${baseClasses} ${focusClasses.split(' ').map(c => `focus:${c}`).join(' ')}`;
};

export default {
  getColorVar,
  getSpacing,
  getBorderRadius,
  getShadow,
  getTypography,
  getGradientTextClasses,
  getTextOpacityClass,
  withHoverClasses,
  withFocusClasses,
};
