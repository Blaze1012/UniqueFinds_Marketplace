/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // primary: "#405138",
        primary: "#7A9D54",
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },

  //coreplugins is used so that tailwind css effects do not disturb other css/ui libraries
};
