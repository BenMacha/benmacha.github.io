import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './composables/**/*.{js,ts}',
    './plugins/**/*.{js,ts}',
    './app.vue',
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#00FF41',
          dark: '#00CC33',
          light: '#33FF66',
        },
        matrix: {
          DEFAULT: '#00FF41',
          dim: '#003B00',
          glow: '#00FF41',
          bg: '#0D0208',
        },
        dark: {
          DEFAULT: '#0D0208',
          50: '#0a0a0a',
          100: '#111111',
          200: '#161616',
          300: '#1a1a1a',
          400: '#222222',
        },
      },
      fontFamily: {
        mono: ['"Fira Code"', '"JetBrains Mono"', 'Consolas', 'monospace'],
        heading: ['"Fira Code"', 'monospace'],
        sans: ['"Fira Code"', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'slide-left': 'slideLeft 0.6s ease-out forwards',
        'slide-right': 'slideRight 0.6s ease-out forwards',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'gradient': 'gradient 8s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'glitch': 'glitch 0.3s ease infinite',
        'glitch-2': 'glitch2 0.3s ease infinite',
        'scanline': 'scanline 8s linear infinite',
        'blink': 'blink 1s step-end infinite',
        'typing': 'typing 3.5s steps(30, end)',
        'flicker': 'flicker 0.15s infinite',
        'claw-slash': 'clawSlash 0.5s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideLeft: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideRight: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0, 255, 65, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 255, 65, 0.6), 0 0 40px rgba(0, 255, 65, 0.3)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glitch: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' },
        },
        glitch2: {
          '0%': { transform: 'translate(0)', opacity: '0.8' },
          '20%': { transform: 'translate(3px, -1px)', opacity: '0.6' },
          '40%': { transform: 'translate(-3px, 1px)', opacity: '0.8' },
          '60%': { transform: 'translate(1px, 3px)', opacity: '0.6' },
          '80%': { transform: 'translate(-1px, -3px)', opacity: '0.8' },
          '100%': { transform: 'translate(0)', opacity: '0.8' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        typing: {
          '0%': { width: '0' },
          '100%': { width: '100%' },
        },
        flicker: {
          '0%': { opacity: '0.97' },
          '5%': { opacity: '0.95' },
          '10%': { opacity: '0.97' },
          '15%': { opacity: '0.93' },
          '20%': { opacity: '0.97' },
          '100%': { opacity: '0.97' },
        },
        clawSlash: {
          '0%': { transform: 'scaleX(0)', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { transform: 'scaleX(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
