import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        barlow: ['var(--font-barlow)', 'sans-serif'],
        condensed: ['var(--font-barlow-condensed)', 'sans-serif'],
      },
      colors: {
        orange: {
          DEFAULT: '#FF4500',
          dark: '#CC3700',
        },
        bg: {
          DEFAULT: '#18181b',
          2: '#1f1f23',
          3: '#27272a',
        },
        brand: {
          text: '#f4f4f5',
          muted: '#a1a1aa',
          subtle: '#52525b',
        },
      },
    },
  },
  plugins: [],
}

export default config
