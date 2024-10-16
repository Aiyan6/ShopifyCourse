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
    appearance: false,
  },
  theme: {
    extend: {
      height: {
        '94': '22rem',
      },
      colors: {
        ivory: "#FFFFEF",
        beige: "#F5F4DB",
        white: "#FFF",
        yellow: "#F7F59D",
        gray: "#D6D5D3",
      }
    },
  },
  plugins: [],
};
