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
        // PICO-8 inspired retro palette
        pixel: {
          black: '#1a1c2c',
          navy: '#333c57',
          purple: '#5d275d',
          green: '#00e436',
          brown: '#b13e53',
          blue: '#29adff',
          cyan: '#41a6f6',
          gray: '#94b0c2',
          cream: '#f0e6d3',
          yellow: '#ffec27',
          orange: '#ffa300',
          red: '#ff004d',
          pink: '#ff77a8',
          peach: '#ffccaa',
          lime: '#38b764',
          darkgray: '#566c86',
          white: '#f4f4f4',
        },
        // Simplified accent
        accent: {
          DEFAULT: '#29adff',
          dark: '#1b7ecf',
          light: '#7dd3fc',
        },
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'cursive'],
        retro: ['"VT323"', 'monospace'],
        silk: ['"Silkscreen"', 'cursive'],
      },
      animation: {
        'pixel-bounce': 'pixelBounce 0.6s steps(6) infinite',
        'pixel-float': 'pixelFloat 3s steps(8) infinite',
        'pixel-blink': 'pixelBlink 1s steps(2) infinite',
        'pixel-shake': 'pixelShake 0.5s steps(4) infinite',
        'coin-spin': 'coinSpin 0.6s steps(6) infinite',
        'slide-down': 'slideDown 0.3s steps(4) forwards',
        'fade-in': 'fadeIn 0.4s steps(4) forwards',
        'fade-up': 'fadeUp 0.5s steps(6) forwards',
        'power-up': 'powerUp 0.3s steps(3) forwards',
        'tetris-fall': 'tetrisFall 4s linear infinite',
        'star-twinkle': 'starTwinkle 2s steps(4) infinite',
        'walk-right': 'walkRight 1s steps(4) infinite',
        'scanline': 'scanline 8s linear infinite',
        'crt-flicker': 'crtFlicker 0.15s infinite',
      },
      keyframes: {
        pixelBounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pixelFloat: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        pixelBlink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        pixelShake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-2px)' },
          '75%': { transform: 'translateX(2px)' },
        },
        coinSpin: {
          '0%': { transform: 'scaleX(1)' },
          '50%': { transform: 'scaleX(0.1)' },
          '100%': { transform: 'scaleX(1)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        powerUp: {
          '0%': { transform: 'scale(1)', filter: 'brightness(1)' },
          '50%': { transform: 'scale(1.05)', filter: 'brightness(1.5)' },
          '100%': { transform: 'scale(1)', filter: 'brightness(1)' },
        },
        tetrisFall: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        starTwinkle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.3', transform: 'scale(0.8)' },
        },
        walkRight: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(8px)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        crtFlicker: {
          '0%': { opacity: '0.97' },
          '5%': { opacity: '0.95' },
          '10%': { opacity: '0.97' },
          '15%': { opacity: '0.93' },
          '20%': { opacity: '0.97' },
          '100%': { opacity: '0.97' },
        },
      },
      boxShadow: {
        'pixel': '4px 4px 0 0 rgba(0,0,0,0.8)',
        'pixel-sm': '2px 2px 0 0 rgba(0,0,0,0.8)',
        'pixel-lg': '6px 6px 0 0 rgba(0,0,0,0.8)',
        'pixel-accent': '4px 4px 0 0 #29adff',
        'pixel-red': '4px 4px 0 0 #ff004d',
        'pixel-red': '4px 4px 0 0 #ff004d',
        'pixel-yellow': '4px 4px 0 0 #ffec27',
        'pixel-inset': 'inset 2px 2px 0 0 rgba(0,0,0,0.3)',
      },
      backgroundImage: {
        'pixel-grid': 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
      },
      backgroundSize: {
        'pixel-grid': '8px 8px',
      },
    },
  },
  plugins: [],
} satisfies Config
