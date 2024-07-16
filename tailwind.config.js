/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    // Include the teuteuf component library
    './node_modules/@pla324/**/*.{jsx,js}',
  ],
  theme: {
    extend: {
      keyframes: {
        slideInUp: {
          '0%': { transform: 'translateY(100%)', opacity: 0 },
          '50%': { transform: 'translateY(100%)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        scaleInOut: {
          '0%': { transform: 'scale(1.1)' },
          '50%': { transform: 'scale(1.25)' },
          '100%': { transform: 'scale(1.1)' },
        },
      },
      animation: {
        slideInUp: 'slideInUp 2s ease-out forwards',
        scaleInOut: 'scaleInOut 2.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
