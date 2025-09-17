module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: { ashy: "#fdfbfb", fwhite: "#F3F2F1", blue: "#560e73" },
      fontFamily: { absans: ["absans"], stevie: ["stevie-sans", "Inter"] }
    }
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio")
  ]
};
