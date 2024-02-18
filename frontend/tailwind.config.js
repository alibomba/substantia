/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,js,tsx,jsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: "#8A2BE2",
        black: '#1F1726',
        black65: "rgba(31, 23, 38, .65)"
      }
    },
  },
  plugins: [],
}

