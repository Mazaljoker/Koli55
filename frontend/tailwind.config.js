/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
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