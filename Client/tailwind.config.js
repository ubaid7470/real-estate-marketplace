/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#EFE7E2",
        secondary: "#AF795D",
        dark: "#000000",
        light: "#EEEFEF",
      },
    },
  },
  plugins: [],
};
