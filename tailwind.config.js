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
    preflight: false,  // Disable Tailwind's preflight (reset styles)
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