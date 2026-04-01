import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#FF6B00",   // primary orange
          light: "#FFD9B5",     // light orange
          dark: "#D95700",
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'Apple Color Emoji','Segoe UI Emoji'],
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,0.08)",
      }
    },
  },
  plugins: [],
};
export default config;
