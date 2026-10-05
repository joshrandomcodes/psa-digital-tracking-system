// tailwind.config.js
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        psa: {
          blue: '#1b4a93',    // Official deep blue
          gold: '#f0a81d',    // Official yellow/gold accent
          light: '#f1f5f9',   // Slate-50 for high-contrast backgrounds
          dark: '#0f172a',    // Slate-900 for primary text
        }
      },
      fontFamily: {
        sans: ['"Public Sans"', 'system-ui', 'sans-serif'],
        mono: ['"Roboto Mono"', 'monospace'],
      },
      boxShadow: {
        'solid': '0 0 0 2px var(--tw-shadow-color)', // High contrast focus states
      }
    },
  },
  plugins: [],
}