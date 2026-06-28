import React from 'react';
import { cn } from '../../lib/theme';

export const Button = React.forwardRef<any, any>(({ 
  className, 
  variant = 'primary', 
  size = 'default', 
  isLoading, 
  children, 
  ...props 
}, ref) => {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
    danger: 'btn-danger',
  };

  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-[10px] px-3',
    lg: 'h-11 rounded-[14px] px-8',
    icon: 'h-10 w-10',
  };

  return (
    <button
      ref={ref}
      className={cn('btn', variants[variant], sizes[size], className)}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : null}
      {children}
    </button>
  );
});

Button.displayName = 'Button';
