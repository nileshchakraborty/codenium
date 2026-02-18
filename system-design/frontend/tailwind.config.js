/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../shared/**/*.{js,ts,jsx,tsx}",
    "../../frontend/src/**/*.{js,ts,jsx,tsx}" // Some components might be from main frontend
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
}
