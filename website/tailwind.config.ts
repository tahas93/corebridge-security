import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
      },
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        ink: {
          950: "#000F1F",
          900: "#001F3F",
          800: "#002A5C",
          700: "#004B87",
        },
        surface: {
          50: "#FFFFFF",
          100: "#F6FBFA",
          200: "#ECF4F1",
          300: "#DDEAEE",
          400: "#C4D9E2",
        },
        brand: {
          blue: "#004B87",
          purple: "#0079B5",
          cyan: "#0096D6",
          mist: "#F1FAEE",
        },
        muted: {
          DEFAULT: "#4C6479",
          soft: "#6E89A1",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        display: [
          "var(--font-space-grotesk)",
          "var(--font-inter)",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
      },
      fontSize: {
        "display-2xl": ["clamp(2.75rem, 5vw + 1rem, 5rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "display-xl": ["clamp(2.25rem, 4vw + 1rem, 3.75rem)", { lineHeight: "1.08", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(1.875rem, 3vw + 1rem, 3rem)", { lineHeight: "1.1", letterSpacing: "-0.01em" }],
      },
      backgroundImage: {
        "grid-cyber":
          "linear-gradient(to right, rgba(0,150,214,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,150,214,0.12) 1px, transparent 1px)",
        "radial-fade":
          "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(0,121,181,0.4), transparent 60%)",
        "brand-gradient":
          "linear-gradient(135deg, #004B87 0%, #0079B5 50%, #0096D6 100%)",
        "brand-gradient-soft":
          "linear-gradient(135deg, rgba(0,75,135,0.12) 0%, rgba(0,121,181,0.12) 50%, rgba(0,150,214,0.12) 100%)",
      },
      boxShadow: {
        glow: "0 10px 40px -10px rgba(0, 121, 181, 0.35), 0 24px 80px -20px rgba(0, 150, 214, 0.25)",
        "glow-blue": "0 8px 30px -5px rgba(0, 75, 135, 0.35)",
        "glow-cyan": "0 8px 30px -5px rgba(0, 150, 214, 0.4)",
        card: "0 10px 30px -12px rgba(0, 31, 63, 0.18)",
      },
      animation: {
        "fade-in": "fadeIn 0.7s ease-out both",
        "fade-up": "fadeUp 0.8s ease-out both",
        "fade-down": "fadeDown 0.8s ease-out both",
        "scale-in": "scaleIn 0.6s ease-out both",
        float: "float 6s ease-in-out infinite",
        "float-slow": "float 10s ease-in-out infinite",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
        "spin-slow": "spin 16s linear infinite",
        marquee: "marquee 28s linear infinite",
        "grid-pan": "gridPan 20s linear infinite",
        shimmer: "shimmer 2.4s linear infinite",
        ring: "ring 2.4s ease-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeDown: {
          "0%": { opacity: "0", transform: "translateY(-24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        pulseGlow: {
          "0%,100%": {
            boxShadow:
              "0 0 0 0 rgba(0,121,181,0.35), 0 0 0 0 rgba(0,150,214,0.25)",
          },
          "50%": {
            boxShadow:
              "0 0 40px 6px rgba(0,121,181,0.35), 0 0 60px 8px rgba(0,150,214,0.18)",
          },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        gridPan: {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "60px 60px" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        ring: {
          "0%": { transform: "scale(0.8)", opacity: "0.6" },
          "100%": { transform: "scale(2.4)", opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
