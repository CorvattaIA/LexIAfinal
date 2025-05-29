
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick, style }) => {
  const baseClasses = "bg-[var(--surface-subtle)] shadow-lg rounded-xl p-6 transition-all duration-300 ease-out border border-[var(--border-subtle)]/30";
  const clickableClasses = onClick 
    ? `cursor-pointer hover:border-[var(--golden-accent)] hover:shadow-xl hover:transform hover:-translate-y-1` 
    : '';
  
  return (
    <div
      className={`${baseClasses} ${clickableClasses} ${className}`}
      onClick={onClick}
      style={style}
    >
      {children}
    </div>
  );
};

export default Card;