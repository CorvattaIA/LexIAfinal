
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
  variant?: 'default' | 'elevated' | 'outlined' | 'subtle';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  spacing?: 'none' | 'sm' | 'md' | 'lg';
  align?: 'left' | 'center' | 'right';
  withHover?: boolean;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  onClick, 
  style,
  variant = 'default',
  padding = 'md',
  spacing = 'md',
  align = 'left',
  withHover = false
}) => {
  // Base classes for all card variants
  const baseClasses = "rounded-xl transition-all duration-300 ease-out";
  
  // Variant specific styling
  const variantClasses = {
    default: "bg-white shadow-lg border border-[var(--border-subtle)] backdrop-blur-sm",
    elevated: "bg-white shadow-xl border border-[var(--border-subtle)]/50 backdrop-blur-sm",
    outlined: "bg-[var(--bone)] border-2 border-[var(--steel-blue)]/30",
    subtle: "bg-[var(--bone)] shadow-sm border border-[var(--border-subtle)]/30",
  };
  
  // Padding options
  const paddingClasses = {
    none: "p-0",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };
  
  // Spacing between child elements
  const spacingClasses = {
    none: "",
    sm: "space-y-2",
    md: "space-y-4",
    lg: "space-y-6",
  };
  
  // Text alignment
  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };
  
  // Hover effects
  const hoverClasses = withHover || onClick
    ? "transform transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_10px_25px_-5px_rgba(66,110,134,0.2)] hover:border-[var(--sunshine)] hover:border-opacity-70 active:translate-y-0 active:shadow-md cursor-pointer" 
    : '';
  
  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${spacingClasses[spacing]} ${alignClasses[align]} ${hoverClasses} ${className}`} 
      onClick={onClick}
      style={style}
    >
      {children}
    </div>
  );
};

export default Card;