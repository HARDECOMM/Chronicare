// tailwind.config.js
module.exports = {
  content: [
    "./index.html",              // include your main HTML
    "./src/**/*.{js,jsx}",       // scan all JS and JSX files inside src
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#6b21a8",   // purple
          light: "#a855f7",     // lighter purple
          dark: "#4c1d95",      // darker purple
        },
        background: {
          DEFAULT: "#ffffff",   // white
          muted: "#f9fafb",     // subtle gray for cards
        },
      },
    },
  },
  plugins: [],
};
