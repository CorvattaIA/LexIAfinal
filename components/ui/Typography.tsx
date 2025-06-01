import React, { ElementType } from 'react';

type TypographyVariantType = 
  | 'display' 
  | 'heading' 
  | 'subheading' 
  | 'title' 
  | 'subtitle' 
  | 'body' 
  | 'body-large' 
  | 'body-small' 
  | 'caption' 
  | 'h1' 
  | 'h2' 
  | 'h3' 
  | 'h4' 
  | 'h5' 
  | 'h6' 
  | 'p' 
  | 'span' 
  | 'label';

type TypographyCapitalizationType = 'title-case' | 'sentence-case' | 'uppercase' | 'lowercase' | 'none';
type TypographyAlignType = 'left' | 'center' | 'right' | 'justify';
type TypographyWeightType = 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
type TypographyFontFamilyType = 'sans' | 'serif' | 'mono';

interface TypographyProps {
  children: React.ReactNode;
  variant?: TypographyVariantType;
  className?: string;
  capitalization?: TypographyCapitalizationType;
  color?: string;
  align?: TypographyAlignType;
  weight?: TypographyWeightType;
  fontFamily?: TypographyFontFamilyType;
  as?: ElementType; // Permite renderizar como cualquier elemento HTML
  id?: string;
  ariaLabel?: string;
  ariaDescribedby?: string;
  ariaLabelledby?: string;
  ariaHidden?: boolean;
  role?: string;
  tabIndex?: number;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLElement>) => void;
}

/**
 * Componente Typography para estandarizar la tipografía y capitalización en toda la aplicación.
 * Implementa las reglas de capitalización según las normas gramaticales del español y
 * utiliza los tokens de diseño para mantener consistencia visual.
 * 
 * Características:
 * - Sistema tipográfico jerárquico con variantes semánticas (display, heading, body, etc.)
 * - Soporte para capitalización según normas del español
 * - Accesibilidad mejorada con atributos ARIA
 * - Flexibilidad para renderizar como cualquier elemento HTML
 * 
 * @example
 * <Typography variant="heading" capitalization="title-case">Nuestro flujo de servicio</Typography>
 * <Typography variant="body" capitalization="sentence-case">Este es un párrafo con sentence case.</Typography>
 * <Typography variant="caption" capitalization="uppercase" color="var(--text-muted)">INFORMACIÓN IMPORTANTE</Typography>
 * <Typography variant="body" as="div" role="alert" ariaLive="assertive">Mensaje de alerta</Typography>
 */
const Typography: React.FC<TypographyProps> = ({
  children,
  variant = 'body',
  className = '',
  capitalization = 'none',
  color,
  align,
  weight,
  fontFamily,
  as,
  id,
  ariaLabel,
  ariaDescribedby,
  ariaLabelledby,
  ariaHidden,
  role,
  tabIndex,
  onClick,
  onKeyDown,
  onFocus,
  onBlur,
}) => {
  // Mapeo de variantes a clases base usando tokens de diseño
  const variantClasses: Record<TypographyVariantType, string> = {
    // Variantes semánticas
    display: 'text-display font-bold tracking-tight mb-8 leading-tight',
    heading: 'text-heading font-semibold tracking-tight mb-6 leading-tight',
    subheading: 'text-subheading font-medium tracking-tight mb-4 leading-snug',
    title: 'text-title font-semibold tracking-tight mb-3 leading-snug',
    subtitle: 'text-subtitle font-medium mb-2 leading-snug',
    body: 'text-body leading-relaxed mb-4',
    'body-large': 'text-body-large leading-relaxed mb-4',
    'body-small': 'text-body-small leading-relaxed mb-3',
    caption: 'text-caption leading-normal text-[var(--text-muted)]',
    
    // Variantes HTML tradicionales
    h1: 'text-display font-bold tracking-tight mb-8 leading-tight',
    h2: 'text-heading font-semibold tracking-tight mb-6 leading-tight',
    h3: 'text-subheading font-semibold tracking-tight mb-4 leading-snug',
    h4: 'text-title font-semibold tracking-tight mb-3 leading-snug',
    h5: 'text-subtitle font-medium mb-2 leading-snug',
    h6: 'text-body-large font-medium mb-2 leading-snug',
    p: 'text-body leading-relaxed mb-4',
    span: 'inline',
    label: 'text-body-small block mb-2 font-medium',
  };

  // Clases para capitalización según normas del español
  const capitalizationClasses: Record<TypographyCapitalizationType, string> = {
    // En español, title-case solo capitaliza la primera palabra
    'title-case': 'title-case-es',
    // Sentence case mantiene la capitalización original del texto
    'sentence-case': 'sentence-case-es',
    'uppercase': 'uppercase',
    'lowercase': 'lowercase',
    'none': '',
  };

  // Clases para alineación
  const alignClasses: Record<TypographyAlignType, string> = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify',
  };

  // Clases para peso de fuente
  const weightClasses: Record<TypographyWeightType, string> = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
    extrabold: 'font-extrabold',
  };

  // Clases para familia de fuente
  const fontFamilyClasses: Record<TypographyFontFamilyType, string> = {
    sans: 'font-sans',
    serif: 'font-serif',
    mono: 'font-mono',
  };

  // Construir la clase completa
  const combinedClassName = `
    ${variantClasses[variant]}
    ${capitalization ? capitalizationClasses[capitalization] : ''}
    ${align ? alignClasses[align] : ''}
    ${weight ? weightClasses[weight] : ''}
    ${fontFamily ? fontFamilyClasses[fontFamily] : ''}
    ${color ? (color.startsWith('var(--') ? `text-[${color}]` : `text-[${color}]`) : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');
  
  // Preparar atributos de accesibilidad
  const accessibilityProps = {
    id,
    role,
    tabIndex,
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedby,
    'aria-labelledby': ariaLabelledby,
    'aria-hidden': ariaHidden,
    onClick,
    onKeyDown,
    onFocus,
    onBlur,
  };

  // Determinar el elemento HTML a renderizar
  const getElementType = (): ElementType => {
    if (as) return as; // Si se proporciona 'as', tiene prioridad
    
    // Mapeo por defecto de variantes a elementos HTML
    const defaultElementMap: Record<TypographyVariantType, ElementType> = {
      h1: 'h1',
      h2: 'h2',
      h3: 'h3',
      h4: 'h4',
      h5: 'h5',
      h6: 'h6',
      p: 'p',
      span: 'span',
      label: 'label',
      display: 'h1',
      heading: 'h2',
      subheading: 'h3',
      title: 'h4',
      subtitle: 'h5',
      body: 'p',
      'body-large': 'p',
      'body-small': 'p',
      caption: 'span',
    };
    
    return defaultElementMap[variant] || 'p';
  };
  
  // Renderizar el elemento dinámicamente
  const renderComponent = () => {
    const Element = getElementType();
    return <Element className={combinedClassName} {...accessibilityProps}>{children}</Element>;
  };
  
  return renderComponent();
};

export default Typography;

// Exportar tipos para facilitar el uso
export type TypographyVariant = TypographyVariantType;
export type TypographyCapitalization = TypographyCapitalizationType;
export type TypographyWeight = TypographyWeightType;
export type TypographyAlign = TypographyAlignType;
export type TypographyFontFamily = TypographyFontFamilyType;

