/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        crown: { black: '#050505', charcoal: '#121214', panel: '#18181b', gold: '#d6a84f', soft: '#f6f1e8' }
      },
      boxShadow: { glow: '0 0 45px rgba(214,168,79,.18)' },
      fontFamily: { sans: ['Inter', 'ui-sans-serif', 'system-ui'] }
    }
  },
  plugins: []
};
