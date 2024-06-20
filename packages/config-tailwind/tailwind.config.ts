import type { Config } from "tailwindcss";
import AnimatePlugin from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {},
  plugins: [AnimatePlugin],
} satisfies Config;
