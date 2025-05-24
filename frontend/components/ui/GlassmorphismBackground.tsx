'use client';

import React from 'react';

type GlassmorphismBackgroundProps = {
  children: React.ReactNode;
  className?: string;
  patternOpacity?: number;
  gradientColors?: {
    from: string;
    to: string;
  };
};

export default function GlassmorphismBackground({
  children,
  className = '',
  patternOpacity = 0.05,
  gradientColors = { from: 'from-violet-500/10', to: 'to-blue-500/10' }
}: GlassmorphismBackgroundProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Pattern de grille */}
      <div 
        className={`absolute inset-0 bg-[url('/assets/grid-pattern.svg')]`}
        style={{ opacity: patternOpacity }}
      ></div>
      
      {/* Gradient d'arrière-plan */}
      <div className={`absolute inset-0 bg-gradient-to-r ${gradientColors.from} ${gradientColors.to}`}></div>
      
      {/* Contenu */}
      <div className="relative z-1">
        {children}
      </div>
    </div>
  );
} 