/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        "homegrid": "3fr 2fr"
      },
      gridTemplateRows: {
        "homegrid": "1fr 5fr"
      },
    },
  },
  plugins: [],
}

