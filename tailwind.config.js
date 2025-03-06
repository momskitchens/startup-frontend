/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
      fraunces: ['Fraunces', 'serif'], // Custom font family for 'Fraunces'
      passero: ['Passero One', 'cursive'], // Custom font family for 'Passero One'
    },
    colors: {
      customOrange: 'rgba(255, 116, 0, 1)', // Define your custom color here
    },
  },
  },
  plugins: [],
}