'use client';

import React from 'react';

type GlassCardProps = {
  children: React.ReactNode;
  className?: string;
  backgroundOpacity?: number;
  noPadding?: boolean;
};

export default function GlassCard({
  children,
  className = '',
  backgroundOpacity = 0.7,
  noPadding = false,
}: GlassCardProps) {
  return (
    <div
      className={`rounded-xl shadow-md ${noPadding ? '' : 'p-6'} ${className}`}
      style={{
        background: `rgba(255, 255, 255, ${backgroundOpacity})`,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
      }}
    >
      {children}
    </div>
  );
} 