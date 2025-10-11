/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(220 13% 20%)",
        input: "hsl(220 13% 15%)",
        ring: "hsl(210 100% 60%)",
        background: "hsl(220 13% 5%)",
        foreground: "hsl(210 40% 98%)",
        primary: {
          DEFAULT: "hsl(210 100% 60%)",
          foreground: "hsl(210 40% 98%)",
        },
        secondary: {
          DEFAULT: "hsl(220 13% 8%)",
          foreground: "hsl(210 40% 98%)",
        },
        destructive: {
          DEFAULT: "hsl(0 100% 60%)",
          foreground: "hsl(210 40% 98%)",
        },
        muted: {
          DEFAULT: "hsl(220 13% 8%)",
          foreground: "hsl(220 13% 60%)",
        },
        accent: {
          DEFAULT: "hsl(0 100% 60%)",
          foreground: "hsl(210 40% 98%)",
        },
        popover: {
          DEFAULT: "hsl(220 13% 10%)",
          foreground: "hsl(210 40% 98%)",
        },
        card: {
          DEFAULT: "hsl(220 13% 10%)",
          foreground: "hsl(210 40% 98%)",
        },

        // Neon color palette
        neon: {
          red: "hsl(0 100% 60%)",
          green: "hsl(120 100% 50%)",
          blue: "hsl(210 100% 60%)",
          yellow: "hsl(60 100% 50%)",
          orange: "hsl(30 100% 60%)",
          white: "hsl(0 0% 100%)",
          cyan: "hsl(180 100% 50%)",
          purple: "hsl(280 100% 60%)",
        },

        // Cube themes
        cube: {
          "cube-2x2": "hsl(210 100% 60%)",
          "cube-3x3": "hsl(120 100% 50%)",
          "cube-4x4": "hsl(0 100% 60%)",
        },

        // Glow variations
        glow: {
          primary: "hsl(210 100% 60%)",
          secondary: "hsl(120 100% 50%)",
          accent: "hsl(0 100% 60%)",
          warning: "hsl(60 100% 50%)",
          success: "hsl(120 100% 50%)",
        },
      },
      fontFamily: {
        arcade: ["Orbitron", "monospace"],
        digital: ["Space Mono", "monospace"],
        mono: ["Space Mono", "monospace"],
      },
      backgroundImage: {
        "gradient-neon": "linear-gradient(45deg, hsl(0 100% 60%), hsl(120 100% 50%), hsl(0 100% 60%), hsl(60 100% 50%))",
        "gradient-bg": "linear-gradient(135deg, hsl(220 13% 5%), hsl(220 13% 8%))",
        "gradient-card": "linear-gradient(135deg, hsl(220 13% 10%), hsl(220 13% 8%))",
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
        "glow-rainbow": {
          "0%": { filter: "hue-rotate(0deg)" },
          "16%": { filter: "hue-rotate(60deg)" },
          "33%": { filter: "hue-rotate(120deg)" },
          "50%": { filter: "hue-rotate(180deg)" },
          "66%": { filter: "hue-rotate(240deg)" },
          "83%": { filter: "hue-rotate(300deg)" },
          "100%": { filter: "hue-rotate(360deg)" },
        },
        "particle-float": {
          "0%": { backgroundPosition: "0% 0%" },
          "100%": { backgroundPosition: "100% 100%" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.02)" },
        },
        "spark-burst": {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "50%": { transform: "scale(1.2)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "slide-up": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "slide-in": {
          "0%": { transform: "translateX(-100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "glow-rainbow": "glow-rainbow 3s ease-in-out infinite",
        "particle-float": "particle-float 20s linear infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "spark-burst": "spark-burst 0.6s ease-out",
        "slide-up": "slide-up 0.5s ease-out",
        "slide-in": "slide-in 0.5s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
