/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#faf8f5',
          100: '#f4f0eb',
          200: '#e7ded3',
          300: '#d5c4b1',
          400: '#bfa48c',
          500: '#ab876d',
          600: '#9b7357',
          700: '#815e47',
          800: '#694e3d',
          900: '#564134',
          950: '#2f221a',
        },
        dark: {
          bg: '#09090b',
          card: '#121215',
          border: '#27272a',
          muted: '#71717a',
          light: '#a1a1aa'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif']
      },
      boxShadow: {
        'glow': '0 0 25px -5px rgba(171, 135, 109, 0.3)',
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'modal': '0 20px 40px -15px rgba(0, 0, 0, 0.3)',
      }
    },
  },
  plugins: [],
}
