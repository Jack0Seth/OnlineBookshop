/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        vintage: {
          brown: '#8B4513',
          light: '#D2B48C',
          dark: '#5C4033',
          parchment: '#F5F5DC',
          green: '#6B8E30', // OliveDrab - vintage green
          gold: '#DAA520',  // GoldenRod - vintage gold
          red: '#B22222',  // Vintage Red
        },
      },
      boxShadow: {
        'glow': '0 0 8px rgba(210, 180, 140, 0.8)',
      },
      fontFamily: {
        'serif': ['"Cormorant Garamond"', 'serif'],
      },
    },
  },
  plugins: [],
}

