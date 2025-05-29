/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Couleurs AlloKoli mode clair
        "allokoli-primary": "#7C3AED",
        "allokoli-secondary": "#A78BFA",
        "allokoli-accent": "#F59E0B",
        "allokoli-success": "#10B981",
        "allokoli-warning": "#F59E0B",
        "allokoli-error": "#EF4444",
        "allokoli-background": "#FFFFFF",
        "allokoli-surface": "#F8FAFC",
        "allokoli-text-primary": "#1E293B",
        "allokoli-text-secondary": "#64748B",
        "allokoli-text-tertiary": "#94A3B8",
        "allokoli-border": "#E2E8F0",
        "allokoli-body-background": "#FFFFFF",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["Geist Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
