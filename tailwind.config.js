/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    // Include the teuteuf component library
    './node_modules/@pla324/**/*.{jsx,js}',
  ],
  theme: {
    extend: {
      colors: {},
    },
  },
  plugins: [],
};
