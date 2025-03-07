/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      "lofi", "black"
    ],
  },
  darkMode: "class",
  plugins: [require('daisyui'),],
}

