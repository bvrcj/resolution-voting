import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#11141a",
        fog: "#eef1f5",
        ocean: "#0f4c5c",
        ember: "#d86b2c",
        moss: "#3a6b35"
      },
      fontFamily: {
        display: ["var(--font-barlow)", "sans-serif"],
        body: ["var(--font-barlow)", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
