import { type ClassValue, clsx } from "clsx";

/**
 * Utility function to merge class names with clsx
 * Compatible with Tailwind CSS and conditional classes
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
