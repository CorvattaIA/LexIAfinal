
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  ...props
}) => {
  const baseStyles = 'font-title font-semibold rounded-lg focus:outline-none transition-all duration-200 ease-in-out flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]';

  const variantStyles = {
    primary: 'bg-[var(--golden-accent)] hover:brightness-110 text-[var(--deep-blue-dark)] shadow-md hover:shadow-lg focus:ring-4 focus:ring-[var(--golden-accent)]/50',
    secondary: 'bg-[var(--sky-blue-medium)] hover:bg-[var(--sky-blue-light)] text-[var(--deep-blue-dark)] shadow-sm hover:shadow-md focus:ring-4 focus:ring-[var(--sky-blue-medium)]/50',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-4 focus:ring-red-500/50',
    outline: 'bg-transparent hover:bg-[var(--golden-accent)]/10 text-[var(--golden-accent)] border-2 border-[var(--golden-accent)] hover:text-[var(--golden-accent)] focus:ring-4 focus:ring-[var(--golden-accent)]/40',
    ghost: 'bg-transparent hover:bg-[var(--surface-subtle)] text-[var(--text-on-dark-soft)] hover:text-[var(--golden-accent)] focus:ring-2 focus:ring-[var(--golden-accent)]/40',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3 text-base',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {leftIcon && !isLoading && <span className="mr-2">{leftIcon}</span>}
      {children}
      {rightIcon && !isLoading && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};

export default Button;