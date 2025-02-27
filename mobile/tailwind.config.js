/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './screens/**/*.{js,ts,jsx,tsx}',
    './screens/**/**/*.{js,ts,jsx,tsx}',
    './screens/pages/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00A362',
        secondary: '#00ff00',
        warning: '#FF9898',
        light: '#8d6e63',
        main: '#795548',
        dark: '#5d4037',
        standard: "#2f313f",
        lightest: "#FAFAFB",
        neutral: "#061a370a",
        body: "#121d2b99"
      },
    },
  },
  plugins: [],
};
