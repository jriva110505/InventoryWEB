/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',   // blue
        secondary: '#0f172a', // dark navy
        accent: '#22c55e',    // green
        danger: '#ef4444',    // red
        warning: '#facc15',   // yellow
      },
    },
  },
  plugins: [],
}