/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./views/**/*.{html,js,ejs}"],
    theme: {
      extend: {
        colors: {
          'footer-bg': '#323B4B',
          'home-bg': '#E5E1DC',
          'home-bg-light': '#E4E0DD',
          
        },
      },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('daisyui'),
    ],
  }