import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: "rgb(var(--color-parchment) / <alpha-value>)",
        cream: "rgb(var(--color-cream) / <alpha-value>)",
        sand: "rgb(var(--color-sand) / <alpha-value>)",
        mist: "rgb(var(--color-mist) / <alpha-value>)",
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        charcoal: "rgb(var(--color-charcoal) / <alpha-value>)",
        terracotta: "rgb(var(--color-terracotta) / <alpha-value>)",
        ember: "rgb(var(--color-ember) / <alpha-value>)",
        sage: "rgb(var(--color-sage) / <alpha-value>)",
      },
      borderRadius: {
        glass: "28px",
      },
      boxShadow: {
        glass: "0 24px 90px rgba(90, 59, 44, 0.18)",
      },
      fontFamily: {
        sans: ["var(--font-body)", "sans-serif"],
        heading: ["var(--font-heading)", "serif"],
        accent: ["var(--font-accent)", "cursive"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "paper-wash":
          "radial-gradient(circle at top, rgba(255,255,255,0.65), transparent 40%), linear-gradient(135deg, rgba(217, 155, 121, 0.10), rgba(128, 154, 123, 0.08))",
      },
    },
  },
  plugins: [],
};

export default config;
