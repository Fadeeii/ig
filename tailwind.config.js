/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          950: '#070a14',
          900: '#0c1021',
          850: '#11172e',
          800: '#161e38',
          750: '#1c2647',
          700: '#233059',
          border: 'rgba(148, 163, 184, 0.12)',
          highlight: 'rgba(255, 255, 255, 0.05)',
        },
        astro: {
          accent: '#818cf8',
          pink: '#f472b6',
          lavender: '#c084fc',
          cyan: '#38bdf8',
          emerald: '#34d399',
          amber: '#fbbf24',
          rose: '#f43f5e'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      animation: {
        'pulse-subtle': 'pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'orbit': 'orbit 20s linear infinite'
      },
      keyframes: {
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
