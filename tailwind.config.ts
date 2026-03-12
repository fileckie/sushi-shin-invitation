import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'serif-jp': ['Noto Serif JP', 'Yu Mincho', 'Hiragino Mincho ProN', 'serif'],
        'display-jp': ['Noto Serif JP', 'Yu Mincho', 'serif'],
      },
      colors: {
        'washi': '#F7F5F0',
        'washi-cream': '#EDE9E0',
        'charcoal': '#1A1A1A',
        'graphite': '#4A4A4A',
        'mist': '#8A8680',
        'border-jp': '#D8D4CC',
        'vermillion': '#C73E3A',
        'gold-leaf': '#C9A962',
      },
    },
  },
  plugins: [],
}

export default config
