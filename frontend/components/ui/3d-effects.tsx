"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { Card, Badge } from "antd";
import type { CardProps } from "antd";

// Type pour les propriétés du composant TiltCard
interface TiltCardProps extends CardProps {
  tiltFactor?: number;
  glareEffect?: boolean;
  glareColor?: string;
  perspective?: number;
  className?: string;
}

/**
 * Carte avec effet de tilt 3D suivant la position de la souris
 */
export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  tiltFactor = 15,
  glareEffect = true,
  glareColor = "rgba(255, 255, 255, 0.4)",
  perspective = 1000,
  className = "",
  ...cardProps
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  // Appliquer un ressort pour des transitions plus fluides
  const springConfig = { stiffness: 300, damping: 20 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  // État pour l'effet de lumière
  const [glarePosition, setGlarePosition] = useState({ x: 0, y: 0 });
  const glareOpacity = useMotionValue(0);
  const springGlareOpacity = useSpring(glareOpacity, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();

    // Calculer la position relative de la souris (de -0.5 à 0.5)
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    // Appliquer la rotation
    rotateX.set(-y * tiltFactor); // Inverser l'axe Y pour une rotation naturelle
    rotateY.set(x * tiltFactor);

    // Mettre à jour l'effet de lumière
    if (glareEffect) {
      glareOpacity.set(0.6);
      setGlarePosition({ x: x * 100 + 50, y: y * 100 + 50 });
    }
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    glareOpacity.set(0);
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <motion.div
      ref={cardRef}
      className={`tilt-card-container ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{
        position: "relative",
        transformStyle: "preserve-3d",
        perspective: perspective,
        transformPerspective: perspective,
        cursor: "pointer",
      }}
    >
      <motion.div
        style={{
          rotateX: springRotateX,
          rotateY: springRotateY,
          transformStyle: "preserve-3d",
          transformPerspective: perspective,
          transform: "perspective(1000px)",
        }}
      >
        <Card
          {...cardProps}
          className={`tilt-card ${className || ""}`}
          style={{
            ...cardProps.style,
            boxShadow: isHovered
              ? "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
              : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            transition: "box-shadow 0.2s ease-out",
          }}
        >
          {children}
        </Card>
      </motion.div>

      {/* Effet de lumière */}
      {glareEffect && (
        <motion.div
          className="glare-effect"
          style={{
            position: "absolute",
            width: "200%",
            height: "200%",
            top: `${glarePosition.y - 100}%`,
            left: `${glarePosition.x - 100}%`,
            backgroundImage: `radial-gradient(circle at center, ${glareColor} 0%, transparent 70%)`,
            opacity: springGlareOpacity,
            pointerEvents: "none",
            zIndex: 3,
            mixBlendMode: "overlay",
          }}
        />
      )}
    </motion.div>
  );
};

// Type pour les propriétés du composant FloatingElement
interface FloatingElementProps {
  children: React.ReactNode;
  amplitude?: number;
  duration?: number;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Élément qui flotte doucement en animation continue
 */
export const FloatingElement: React.FC<FloatingElementProps> = ({
  children,
  amplitude = 10,
  duration = 4,
  delay = 0,
  className = "",
  style = {},
}) => {
  return (
    <motion.div
      className={`floating-element ${className}`}
      initial={{ y: 0 }}
      animate={{
        y: [0, -amplitude, 0, amplitude, 0],
      }}
      transition={{
        duration: duration,
        ease: "easeInOut",
        repeat: Infinity,
        delay: delay,
      }}
      style={style}
    >
      {children}
    </motion.div>
  );
};

// Type pour les propriétés du composant ParallaxContainer
interface ParallaxContainerProps {
  children: React.ReactNode;
  sensitivity?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Conteneur avec effet parallax basé sur la position de la souris
 */
export const ParallaxContainer: React.FC<ParallaxContainerProps> = ({
  children,
  sensitivity = 20,
  className = "",
  style = {},
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      // Calculer la position de la souris par rapport au centre de l'écran
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX - innerWidth / 2) / (innerWidth / 2);
      const y = (e.clientY - innerHeight / 2) / (innerHeight / 2);

      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`parallax-container ${className}`}
      style={{
        position: "relative",
        overflow: "hidden",
        ...style,
      }}
    >
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;

        // Calculer un facteur de parallax différent pour chaque enfant
        const depth = (index + 1) / React.Children.count(children);
        const parallaxFactor = sensitivity * depth;

        return (
          <motion.div
            style={{
              position: index === 0 ? "static" : "absolute",
              inset: 0,
              x: mousePosition.x * -parallaxFactor,
              y: mousePosition.y * -parallaxFactor,
              zIndex: index + 1,
            }}
            transition={{ type: "spring", stiffness: 150, damping: 15 }}
          >
            {child}
          </motion.div>
        );
      })}
    </div>
  );
};

// Type pour les propriétés du composant RotatingBadge
interface RotatingBadgeProps {
  count: React.ReactNode;
  children: React.ReactNode;
  duration?: number;
  size?: "default" | "small";
  offset?: [number, number];
  className?: string;
  color?: string;
}

/**
 * Badge qui tourne autour d'un élément
 */
export const RotatingBadge: React.FC<RotatingBadgeProps> = ({
  count,
  children,
  duration = 12,
  size = "default",
  offset = [0, 0],
  className = "",
  color,
}) => {
  const [rotate, setRotate] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setRotate((prev) => (prev + 1) % 360);
    }, (duration * 1000) / 360);

    return () => clearInterval(intervalId);
  }, [duration]);

  return (
    <div
      className={`rotating-badge-container ${className}`}
      style={{ position: "relative" }}
    >
      <div>{children}</div>
      <motion.div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `rotate(${rotate}deg) translate(120%, 0) rotate(-${rotate}deg)`,
          transformOrigin: "center",
          marginTop: offset[1],
          marginLeft: offset[0],
          zIndex: 10,
        }}
      >
        <Badge
          count={count}
          size={size}
          color={color}
          style={{
            boxShadow: "0 0 0 2px white",
          }}
        />
      </motion.div>
    </div>
  );
};

// Type pour les propriétés du composant AnimatedBackground
interface AnimatedBackgroundProps {
  children: React.ReactNode;
  speed?: number;
  color1?: string;
  color2?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Arrière-plan avec animation de gradient
 */
export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  children,
  speed = 6,
  color1 = "rgba(119, 69, 255, 0.05)",
  color2 = "rgba(87, 105, 255, 0.1)",
  className = "",
  style = {},
}) => {
  const gradientX = useMotionValue(0);
  const gradientY = useMotionValue(0);

  useEffect(() => {
    const interval = setInterval(() => {
      gradientX.set(Math.random() * 100);
      gradientY.set(Math.random() * 100);
    }, speed * 1000);

    return () => clearInterval(interval);
  }, [gradientX, gradientY, speed]);

  const x = useSpring(gradientX, { stiffness: 100, damping: 30 });
  const y = useSpring(gradientY, { stiffness: 100, damping: 30 });

  const background = useTransform([x, y], (latest: number[]) => {
    const xValue = latest[0] as number;
    const yValue = latest[1] as number;
    return `linear-gradient(${
      xValue * 3.6
    }deg, ${color1} ${yValue}%, ${color2})`;
  });

  return (
    <motion.div
      className={`animated-background ${className}`}
      style={{
        position: "relative",
        backgroundImage: background,
        transition: "background-image 0.5s ease",
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
};

// Type pour les propriétés du composant AppearingElement
interface AppearingElementProps {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right";
  distance?: number;
  duration?: number;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
  once?: boolean;
  threshold?: number;
}

/**
 * Élément qui apparaît avec une animation lorsqu'il entre dans la vue
 */
export const AppearingElement: React.FC<AppearingElementProps> = ({
  children,
  direction = "up",
  distance = 50,
  duration = 0.5,
  delay = 0,
  className = "",
  style = {},
  once = true,
  threshold = 0.1,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.disconnect();
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [once, threshold]);

  // Déterminer les valeurs initiales selon la direction
  const getInitialPosition = () => {
    switch (direction) {
      case "up":
        return { y: distance, opacity: 0 };
      case "down":
        return { y: -distance, opacity: 0 };
      case "left":
        return { x: distance, opacity: 0 };
      case "right":
        return { x: -distance, opacity: 0 };
      default:
        return { y: distance, opacity: 0 };
    }
  };

  return (
    <div ref={elementRef} className={className} style={style}>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={getInitialPosition()}
            animate={{ x: 0, y: 0, opacity: 1 }}
            exit={getInitialPosition()}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              delay: delay,
              duration: duration,
            }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Exportation des styles CSS nécessaires
export const motionStyles = `
  .tilt-card-container {
    position: relative;
    transform-style: preserve-3d;
  }
  
  .tilt-card-container:hover {
    z-index: 1;
  }
  
  .tilt-card {
    transition: all 0.2s ease-out;
    will-change: transform;
  }
  
  .floating-element {
    will-change: transform;
  }
  
  .parallax-container {
    will-change: transform;
  }
  
  .animated-background {
    will-change: background-image;
  }
`;

export function addMotionStyles() {
  if (typeof document !== "undefined") {
    const styleElement = document.createElement("style");
    styleElement.textContent = motionStyles;
    document.head.appendChild(styleElement);
  }
}
