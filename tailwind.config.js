/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */
/** @type {import('tailwindcss').Config} */

const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{js,jsx}", "./public/index.html"],
  darkMode: "class",
  mode: "jit",
  important: true,
  theme: {
    extend: {
      screens: {
        xs: { max: "320px" },
        sm: { max: "540px" },
        md: { max: "768px" },
        lg: { max: "1024px" },
        xl: { max: "1280px" },
        "2xl": { max: "1536px" },
      },
      colors: {
        primary: "#1A4CFF",
        secondary: "#051B6C",
        dark: "#2E3033",
      },
    },
    variants: {
      backgroundColor: ["active"],
      textColor: ["active"],
    },
  },
  plugins: [],
};
