/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./views/**/*.{html,js,ejs}"],
    theme: {
<<<<<<< Updated upstream
      extend: {},
=======
      extend: {
        colors: {
          'footer-bg': '#323B4B',
          'home-bg': '#E5E1DC',
          'home-bg-light': '#E4E0DD',
          
        },
      },
>>>>>>> Stashed changes
    },
    plugins: [
        require('@tailwindcss/forms'),
    ],
  }