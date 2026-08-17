import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica", "Arial", "sans-serif"],
        serif: ["Iowan Old Style", "Palatino Linotype", "Palatino", "Georgia", "Cambria", "serif"],
      },
      colors: {
        paper: "#2a2723", // Seitenhintergrund: warmes Dunkelgrau
        ink: "#e2c98f", // Schrift: warmes Gold (etwas heller = einladender)
        gold: "#f0d69a", // helles Gold für Überschriften
        muted: "#b1a488", // gedämpftes Gold-Grau für Nebentext
        line: "#4a463c", // dezente Linie
      },
      letterSpacing: {
        brand: "0.28em",
      },
    },
  },
  plugins: [],
};

export default config;
