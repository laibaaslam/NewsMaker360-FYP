/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [ "./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    extend: {
      backgroundColor: {
        'custom-bg': '#E0F6FF', // You can use any color code here
      },
      fontFamily: {
        sans: ['Times New Roman', 'Helvetica', 'sans-serif'],
        sans2: ['Arial', 'Helvetica', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif'],
        'open-sans': ['Open Sans', 'sans-serif']
        // Add more font families as needed
      },
      colors: {
        'darkblue': '#063b6c',
      },
    },
  },
  plugins: [],
}

