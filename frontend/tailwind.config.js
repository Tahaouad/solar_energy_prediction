module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}","./components/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark", "cupcake"], // Choisissez un thème
  },
};