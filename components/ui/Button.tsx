import React from 'react';
import Icon from './Icon';

type IconName = React.ComponentProps<typeof Icon>['name'];

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'text' | 'success' | 'warning' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  iconName?: IconName;
  iconPosition?: 'left' | 'right';
  iconOnly?: boolean;
  rounded?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  iconName,
  iconPosition = 'left',
  iconOnly = false,
  rounded = false,
  className = '',
  disabled,
  ...props
}) => {
  // Base styles for all buttons
  const baseStyles = 'font-medium focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-300 ease-out flex items-center justify-center transform title-case-es';
  
  // Variant specific styling
  const variantStyles = {
    primary: 'bg-[var(--sunshine)] text-[var(--coal)] hover:bg-[var(--sunshine-light)] hover:-translate-y-0.5 hover:shadow-md focus:ring-[var(--sunshine)] active:bg-[var(--sunshine-dark)] active:translate-y-0 shadow-sm',
    secondary: 'bg-[var(--steel-blue)] text-white hover:bg-[var(--steel-blue-light)] hover:-translate-y-0.5 hover:shadow-md focus:ring-[var(--steel-blue)] active:bg-[var(--steel-blue-dark)] active:translate-y-0 shadow-sm',
    outline: 'border-2 border-[var(--steel-blue)] text-[var(--steel-blue)] hover:bg-[var(--surface-hover)] hover:border-[var(--sunshine)] hover:shadow-[0_0_10px_rgba(249,186,50,0.15)] focus:ring-[var(--sunshine)] active:bg-[var(--surface-active)] active:translate-y-0',
    text: 'text-[var(--steel-blue)] hover:bg-[var(--surface-hover)] hover:shadow-sm focus:ring-[var(--steel-blue)] active:bg-[var(--surface-active)]',
    success: 'bg-[var(--success)] text-white hover:bg-[var(--success)]/90 hover:-translate-y-0.5 hover:shadow-md focus:ring-[var(--success)] active:bg-[var(--success)]/80 active:translate-y-0 shadow-sm',
    warning: 'bg-[var(--warning)] text-white hover:bg-[var(--warning)]/90 hover:-translate-y-0.5 hover:shadow-md focus:ring-[var(--warning)] active:bg-[var(--warning)]/80 active:translate-y-0 shadow-sm',
    danger: 'bg-[var(--error)] text-white hover:bg-[var(--error)]/90 hover:-translate-y-0.5 hover:shadow-md focus:ring-[var(--error)] active:bg-[var(--error)]/80 active:translate-y-0 shadow-sm'
  };
  
  // Size specific styling
  const sizeStyles = {
    xs: iconOnly ? 'p-1.5' : 'text-xs px-2.5 py-1 gap-1.5',
    sm: iconOnly ? 'p-2' : 'text-sm px-3 py-1.5 gap-1.5',
    md: iconOnly ? 'p-2.5' : 'text-base px-4 py-2 gap-2',
    lg: iconOnly ? 'p-3' : 'text-lg px-6 py-3 gap-3'
  };
  
  // Icon sizes based on button size
  const iconSizes = {
    xs: 'xs',
    sm: 'sm',
    md: 'md',
    lg: 'lg'
  } as const;
  
  // Border radius styles
  const radiusStyles = rounded 
    ? 'rounded-full' 
    : iconOnly 
      ? 'rounded-lg' 
      : 'rounded-lg';
  
  // Width styles
  const widthStyles = fullWidth ? 'w-full' : '';
  
  // Disabled and loading styles
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  const loadingStyles = isLoading ? 'opacity-90 cursor-wait' : '';
  
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${radiusStyles} ${widthStyles} ${disabledStyles} ${loadingStyles} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      
      {/* Left positioned icon */}
      {iconName && iconPosition === 'left' && !isLoading && !iconOnly && (
        <Icon name={iconName} size={iconSizes[size]} color="inherit" />
      )}
      
      {/* Icon only button */}
      {iconName && iconOnly && !isLoading && (
        <Icon name={iconName} size={iconSizes[size]} color="inherit" />
      )}
      
      {/* Button text (not shown for icon-only buttons) */}
      {!iconOnly && children}
      
      {/* Right positioned icon */}
      {iconName && iconPosition === 'right' && !isLoading && !iconOnly && (
        <Icon name={iconName} size={iconSizes[size]} color="inherit" />
      )}
    </button>
  );
};

export default Button;