import React from 'react';
import { cn } from '../../lib/theme';

export const Input = React.forwardRef<any, any>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn('input', className)}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = 'Input';
