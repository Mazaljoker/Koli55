"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedCardProps {
  children: React.ReactNode;
  animation?: "fadeIn" | "slideUp" | "scale";
  delay?: number;
  once?: boolean;
  className?: string;
}

const animationVariants = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.5, ease: "easeOut" },
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: "easeOut" },
  },
  scale: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5, ease: "easeOut" },
  },
} as const;

export const AnimatedCard = ({
  children,
  animation = "slideUp",
  delay = 0,
  once = true,
  className,
}: AnimatedCardProps) => {
  const variant = animationVariants[animation];

  return (
    <motion.div
      className={cn(className)}
      initial={variant.initial}
      whileInView={variant.animate}
      transition={{
        ...variant.transition,
        delay,
      }}
      viewport={{ once }}
    >
      {children}
    </motion.div>
  );
};
