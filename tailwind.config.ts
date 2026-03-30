import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#f6f7fb",
        foreground: "#111827",
        muted: "#6b7280",
        card: "#ffffff",
        border: "#e5e7eb",
        primary: "#2563eb",
        success: "#16a34a",
        warning: "#d97706",
        danger: "#dc2626"
      },
      boxShadow: {
        soft: "0 8px 24px rgba(17,24,39,0.08)"
      },
      borderRadius: {
        xl2: "1rem"
      }
    }
  },
  plugins: []
};

export default config;
