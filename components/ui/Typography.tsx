import React from 'react';

interface TypographyProps {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'label';
  className?: string;
  capitalization?: 'title-case' | 'sentence-case' | 'uppercase' | 'none';
  color?: string;
  align?: 'left' | 'center' | 'right' | 'justify';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  fontFamily?: 'sans' | 'serif' | 'mono';
}

/**
 * Componente Typography para estandarizar la tipografía y capitalización en toda la aplicación.
 * Implementa las reglas de capitalización según las normas gramaticales del español.
 * 
 * @example
 * <Typography variant="h1" capitalization="title-case">Título principal</Typography>
 * <Typography variant="p" capitalization="sentence-case">Este es un párrafo con sentence case.</Typography>
 * <Typography variant="span" capitalization="uppercase">ETIQUETA IMPORTANTE</Typography>
 */
const Typography: React.FC<TypographyProps> = ({
  children,
  variant = 'p',
  className = '',
  capitalization = 'none',
  color,
  align,
  weight,
  fontFamily,
}) => {
  // Mapeo de variantes a clases base
  const variantClasses = {
    h1: 'text-4xl md:text-5xl mb-6 font-semibold tracking-tight',
    h2: 'text-3xl md:text-4xl mb-5 font-semibold tracking-tight',
    h3: 'text-2xl md:text-3xl mb-4 font-semibold tracking-tight',
    h4: 'text-xl md:text-2xl mb-3 font-semibold tracking-tight',
    h5: 'text-lg md:text-xl mb-2 font-semibold tracking-tight',
    h6: 'text-base md:text-lg mb-2 font-semibold tracking-tight',
    p: 'mb-4 leading-relaxed',
    span: '',
    label: 'block mb-2 text-sm font-medium',
  };

  // Clases para capitalización según normas del español
  const capitalizationClasses = {
    // En español, title-case solo capitaliza la primera palabra
    'title-case': 'title-case-es',
    // Sentence case mantiene la capitalización original del texto
    'sentence-case': 'sentence-case-es',
    'uppercase': 'uppercase',
    'none': '',
  };

  // Clases para alineación
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify',
  };

  // Clases para peso de fuente
  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
    extrabold: 'font-extrabold',
  };

  // Clases para familia de fuente
  const fontFamilyClasses = {
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
    ${color ? `text-[${color}]` : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  // Renderizar el elemento según la variante
  const renderComponent = () => {
    switch (variant) {
      case 'h1': return <h1 className={combinedClassName}>{children}</h1>;
      case 'h2': return <h2 className={combinedClassName}>{children}</h2>;
      case 'h3': return <h3 className={combinedClassName}>{children}</h3>;
      case 'h4': return <h4 className={combinedClassName}>{children}</h4>;
      case 'h5': return <h5 className={combinedClassName}>{children}</h5>;
      case 'h6': return <h6 className={combinedClassName}>{children}</h6>;
      case 'label': return <label className={combinedClassName}>{children}</label>;
      case 'span': return <span className={combinedClassName}>{children}</span>;
      default: return <p className={combinedClassName}>{children}</p>;
    }
  };
  
  return renderComponent();
};

export default Typography;
