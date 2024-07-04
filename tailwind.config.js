/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*{html,js,css}"],
  theme: {
    extend: {
      colors: {
        primary: "#0C359E",
        body: "#F0F8FF",
        input_bg: "#ced0ca",
        card: "#C0D6E8",
        headingbg: "#D1D8C5"
      },
    },
  },
  plugins: [],
}