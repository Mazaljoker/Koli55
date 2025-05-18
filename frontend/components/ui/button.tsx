'use client';

import { Button as AntButton, ButtonProps as AntButtonProps } from 'antd';
import { PropsWithChildren } from 'react';

type ButtonProps = AntButtonProps & PropsWithChildren & {
  fullWidth?: boolean;
};

export function Button({ 
  children, 
  fullWidth, 
  className,
  ...props 
}: ButtonProps) {
  return (
    <AntButton
      className={`${fullWidth ? 'w-full' : ''} ${className || ''}`}
      {...props}
    >
      {children}
    </AntButton>
  );
} 