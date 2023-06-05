/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
  theme: {
    extend: {
      fontFamily:{
        'montserrat': ['Montserrat', 'sans-serif']
      },
      colors: {
        or : '#DCA225',
        whitepink : '#F7EDE4',
        darkblue : '#1B4B65',
        lightblue : '#A0C9C3',
        rouge : '#ED7F5C',
      },
      width: {
        '300': '300px',
      }
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    styled: true,
    themes: false,
    base: true,
  },
  
};
