/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        midnight: '#0f172a',
        neon: '#38bdf8',
        aurora: '#8b5cf6',
        flame: '#f97316',
        emerald: '#34d399'
      },
      fontFamily: {
        display: ['"Poppins"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif']
      },
      boxShadow: {
        glow: '0 0 25px rgba(56, 189, 248, 0.35)',
        intense: '0 15px 45px rgba(139, 92, 246, 0.35)'
      }
    }
  },
  plugins: []
};
