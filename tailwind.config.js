/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx}",       // all files in app directory
    './src/components/**/*.{js,ts,jsx,tsx}',
    "./src/data/**/*.html",       // all files in app directory
  ],
  theme: {
    extend: {},
  },
};
