'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface BackgroundOrb {
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
}

const orbs: BackgroundOrb[] = [
  { x: 15, y: 10, size: 300, color: 'rgba(123, 58, 183, 0.2)', delay: 0 },
  { x: 85, y: 90, size: 250, color: 'rgba(33, 150, 243, 0.2)', delay: 1 },
  { x: 50, y: 50, size: 180, color: 'rgba(76, 175, 80, 0.15)', delay: 2 },
];

export const FloatingOrbs: React.FC = () => {
  return (
    <div className="wizard-orbs">
      {orbs.map((orb, index) => (
        <motion.div
          key={index}
          className="wizard-orb"
          initial={{ x: `${orb.x}%`, y: `${orb.y}%` }}
          animate={{
            x: [
              `${orb.x}%`,
              `${orb.x + 5}%`,
              `${orb.x - 5}%`,
              `${orb.x}%`,
            ],
            y: [
              `${orb.y}%`,
              `${orb.y - 7}%`,
              `${orb.y + 5}%`,
              `${orb.y}%`,
            ],
          }}
          transition={{
            duration: 15 + orb.delay,
            ease: 'easeInOut',
            repeat: Infinity,
            delay: orb.delay,
          }}
          style={{
            position: 'absolute',
            width: orb.size,
            height: orb.size,
            borderRadius: '50%',
            background: orb.color,
            filter: 'blur(30px)',
            opacity: 0.6,
          }}
        />
      ))}
    </div>
  );
};

export const GlassmorphicBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="wizard-background">
      <FloatingOrbs />
      {children}
    </div>
  );
};

// Effet de grille interactive avec mouvement parallax
export const InteractiveGrid: React.FC = () => {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!gridRef.current) return;
      
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      // Calculer la position relative de la souris (de -1 à 1)
      const xPos = (clientX / innerWidth - 0.5) * 2;
      const yPos = (clientY / innerHeight - 0.5) * 2;
      
      // Appliquer une légère translation à la grille pour un effet parallax
      gridRef.current.style.transform = `translate(${xPos * 10}px, ${yPos * 10}px)`;
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div 
      ref={gridRef}
      className="absolute inset-0 z-[-1] opacity-30"
      style={{
        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        backgroundPosition: 'center center',
        transition: 'transform 0.2s ease-out'
      }}
    />
  );
};

// Carte avec effet 3D tilt suivant la position de la souris
export const TiltCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const { left, top, width, height } = card.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;
      
      const centerX = width / 2;
      const centerY = height / 2;
      
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };
    
    const handleMouseLeave = () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    };
    
    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);
  
  return (
    <div 
      ref={cardRef}
      className={`transition-transform duration-200 ${className}`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
    </div>
  );
}; 