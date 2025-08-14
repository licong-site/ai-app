import React from 'react';
import { 
  ButtonProps, 
  ButtonSize,
  ButtonVariant
} from '../types';

const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  disabled = false, 
  size = 'default', 
  variant = 'default', 
  className = '', 
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background';
  
  const sizeStyles: Record<ButtonSize, string> = {
    default: 'h-10 py-2 px-4',
    sm: 'h-9 px-3',
    lg: 'h-11 px-8',
    icon: 'h-10 w-10'
  };
  
  const variantStyles: Record<ButtonVariant, string> = {
    default: 'bg-rose-500 text-white hover:bg-rose-600',
    ghost: 'hover:bg-rose-50 hover:text-rose-700',
    outline: 'border border-rose-200 hover:bg-rose-50 hover:text-rose-700'
  };
  
  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
