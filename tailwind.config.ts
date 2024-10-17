import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primaryDark: "#2C3E50", // Dark Slate Blue
        primaryLight: "#ECF0F1", // Light Gray
        accent: "#3498DB", // Vibrant Blue
        highlight: "#fb923c", // Orange
      },
    },
  },
  plugins: [],
};
export default config;
