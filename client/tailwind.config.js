/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./views/**/*.{html,js,ejs}"],
    theme: {
      extend: {
        colors: {
          'footer-bg': '#323B4B',
        },
      },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('daisyui'),
    ],
  }