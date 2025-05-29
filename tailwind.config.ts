import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./frontend/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      sans: ["Manrope", "Inter", "system-ui", "sans-serif"],
      heading: ["Sora", "Manrope", "system-ui", "sans-serif"],
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        "allokoli-primary": "#7C3AED",
        "allokoli-secondary": "#3B82F6",
        "allokoli-accent": "#F59E0B",
        "allokoli-background": "#FFFFFF",
        "allokoli-surface": "#F8FAFC",
        "allokoli-text-primary": "#1E293B",
        "allokoli-text-secondary": "#64748B",
        "allokoli-success": "#10B981",
        "allokoli-error": "#EF4444",
        "allokoli-warning": "#F59E0B",
        "allokoli-border": "#E2E8F0",
        "avatar-orange": "#f59e0b",
        "avatar-green": "#10b981",
        "avatar-blue": "#3b82f6",
        "avatar-gray": "#9ca3af",
        "avatar-purple": "#8b5cf6",
      },
      backgroundImage: {
        "gradient-glassmorphism":
          "linear-gradient(to right bottom, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.6))",
        "allokoli-button-gradient":
          "linear-gradient(135deg, #7C3AED 0%, #3B82F6 100%)",
        "allokoli-landing-gradient":
          "linear-gradient(135deg, #EDE9FE 0%, #DBEAFE 100%)",
      },
      boxShadow: {
        glassmorphism: "0 4px 30px rgba(0, 0, 0, 0.1)",
        "subtle-modern":
          "0 2px 4px rgba(0,0,0,0.05), 0 5px 15px rgba(0,0,0,0.05)",
        "md-modern": "0 4px 8px rgba(0,0,0,0.07), 0 10px 20px rgba(0,0,0,0.07)",
        "allokoli-focus-violet": "0 0 0 3px rgba(124, 58, 237, 0.2)",
        "allokoli-glow": "0 0 20px 5px rgba(124, 58, 237, 0.3)",
        "allokoli-subtle":
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        "allokoli-card":
          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        "allokoli-primary": "0 4px 14px 0 rgba(124, 58, 237, 0.25)",
      },
      borderRadius: {
        // ... existing code ...
      },
      animation: {
        // ... existing code ...
      },
    },
  },
  plugins: [],
};

export default config;
