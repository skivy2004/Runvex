/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#07071A',
          2: '#0C0C28',
          3: '#111130',
        },
        purple: {
          DEFAULT: '#5B4FE8',
          2: '#7B6FF0',
        },
        text: {
          DEFAULT: '#FFFFFF',
          2: '#8B8FB3',
          3: '#5A5E82',
        },
        border: {
          DEFAULT: 'rgba(255,255,255,0.07)',
          2: 'rgba(255,255,255,0.12)',
        },
      },
      fontFamily: {
        bricolage: ['var(--font-bricolage)', 'sans-serif'],
        'dm-sans': ['var(--font-dm-sans)', 'sans-serif'],
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [],
}
