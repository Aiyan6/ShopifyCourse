/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./layout/*.liquid",
    "./sections/*.liquid",
    "./snippets/*.liquid",
    "./templates/customers/*.liquid",
    "./templates/*.liquid",
  ],
  corePlugins: {
    appearance: false,  // Disable appearance related styling (e.g., background-color: transparent)
  },
  theme: {
    extend: {
      height: {
        '94': '22rem',
      },
    },
  },
  plugins: [],
};