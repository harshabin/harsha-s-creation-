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
        reson: {
          bg: '#08090C',
          card: '#11141B',
          surface: '#161B24',
          border: '#232A38',
          borderLight: 'rgba(255, 255, 255, 0.1)',
          cyan: '#99EEFF',
          cyanHover: '#B8F4FF',
          cyanGlow: 'rgba(153, 238, 255, 0.25)',
          muted: '#8B95A5',
          light: '#E1E7F0'
        },
        dark: {
          bg: '#08090C',
          card: '#11141B',
          border: '#232A38',
          muted: '#8B95A5',
          light: '#E1E7F0'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'system-ui', 'sans-serif'],
        display: ['Syne', 'Outfit', 'Inter', 'sans-serif'],
        syne: ['Syne', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
        space: ['Space Grotesk', 'sans-serif']
      },
      boxShadow: {
        'glow': '0 0 25px -5px rgba(171, 135, 109, 0.3)',
        'cyan-glow': '0 0 30px -5px rgba(153, 238, 255, 0.35)',
        'cyan-subtle': '0 0 15px 0 rgba(153, 238, 255, 0.2)',
        'card': '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
        'modal': '0 20px 40px -15px rgba(0, 0, 0, 0.7)',
      }
    },
  },
  plugins: [],
}
