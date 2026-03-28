import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ─── Content area (light) ────────────────────────────────────
        dark: {
          bg: "#F1F5F9",        // slate-100  — main page background
          surface: "#18181B",   // DARK — sidebar/header (unchanged)
          card: "#FFFFFF",      // white cards
          border: "#E2E8F0",    // slate-200  — subtle borders
          hover: "#F8FAFC",     // slate-50   — hover state
          elevated: "#FFFFFF",  // white elevated
        },
        // ─── Sidebar/Header (always dark) ────────────────────────────
        sidebar: {
          bg: "#18181B",
          surface: "#141417",
          card: "#1F1F23",
          border: "#2E2E33",
          hover: "#27272B",
          text: "#F5F5F5",
          muted: "#6B6B73",
          secondary: "#A0A0A8",
        },
        // ─── Text (on light background) ──────────────────────────────
        text: {
          primary: "#0F172A",   // slate-900 — main text
          secondary: "#475569", // slate-600 — secondary text
          muted: "#94A3B8",     // slate-400 — placeholder/meta
        },
        // ─── Orange accent ────────────────────────────────────────────
        accent: {
          DEFAULT: "#F97316",
          50: "#FFF7ED",
          100: "#FFEDD5",
          200: "#FED7AA",
          300: "#FDBA74",
          400: "#FB923C",
          500: "#F97316",
          600: "#EA580C",
          700: "#C2410C",
          800: "#9A3412",
          900: "#7C2D12",
        },
        // ─── Status ───────────────────────────────────────────────────
        success: "#16A34A",
        warning: "#D97706",
        danger: "#DC2626",
        info: "#2563EB",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      borderRadius: {
        xl: "12px",
        "2xl": "16px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        "card-hover": "0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)",
      },
    },
  },
  plugins: [],
};
export default config;
