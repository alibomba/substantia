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
        primaryHover: "#791AD1",
        black: '#1F1726',
        black65: "rgba(31, 23, 38, .65)"
      },
      transitionProperty: {
        primary: 'all 200ms ease'
      },
      screens: {
        mobileNav: '830px'
      }
    },
  },
  plugins: [],
}

