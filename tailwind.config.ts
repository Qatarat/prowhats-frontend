/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    screens: {
      xsm: "320px",
      // => @media (min-width: 375px) { ... }

      xs: "375px",
      // => @media (min-width: 375px) { ... }

      xsx: "390px",
      // => @media (min-width: 375px) { ... }

      xssl: "400px",
      // => @media (min-width: 425px) { ... }

      xss: "480px",
      // => @media (min-width: 425px) { ... }

      xssp: "520px",
      // => @media (min-width: 425px) { ... }

      sm: "640px",
      // => @media (min-width: 640px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      mdp: "850px",
      // => @media (min-width: 850px) { ... }

      lg: "1024px",
      // => @media (min-width: 1024px) { ... }

      xl: "1280px",
      // => @media (min-width: 1280px) { ... }

      xl2: "1366px",
      // => @media (min-width: 1366px) { ... }

      "2xl": "1536px",
      // => @media (min-width: 1536px) { ... }
    },
    extend: {
      fontFamily: {
        fontFamily: {
          en: ["var(--font-open-sauce)"],
        },
      },
      colors: {
        primary: "#65358A", // example primary
        secondary: "#4A3B4E", // 🟣 your secondary color (Amber)
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    [require("@tailwindcss/typography")], // enables `prose` classes
  ],
};
