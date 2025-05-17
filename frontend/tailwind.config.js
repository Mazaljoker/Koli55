/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Vous pouvez ajouter des couleurs personnalisées ici
      },
      fontFamily: {
        // Vous pouvez ajouter des polices personnalisées ici
      },
    },
  },
  plugins: [],
} 