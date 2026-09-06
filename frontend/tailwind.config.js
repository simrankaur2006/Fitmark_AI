/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#131A2B',
          800: '#1B2439',
          700: '#243149',
        },
        paper: '#FAF8F3',
        parchment: '#F1ECE0',
        gold: {
          DEFAULT: '#C99A3D',
          light: '#E4C077',
        },
        moss: '#3F7A5B',
        coral: '#D65F4C',
        slate: {
          ink: '#5B6472',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '10px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(19, 26, 43, 0.06), 0 8px 24px -12px rgba(19, 26, 43, 0.18)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        'ring-fill': {
          '0%': { strokeDashoffset: 'var(--ring-full)' },
          '100%': { strokeDashoffset: 'var(--ring-offset)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out',
        'ring-fill': 'ring-fill 1.1s cubic-bezier(0.22, 1, 0.36, 1) forwards',
      },
    },
  },
  plugins: [],
};
