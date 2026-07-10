/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display:  ['Playfair Display', 'Georgia', 'serif'],
        heading:  ['Poppins', 'system-ui', 'sans-serif'],
        body:     ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          red:     '#C8102E',
          'red-dark': '#A00D24',
          'red-light':'#FF4060',
          black:   '#080810',
          surface: '#111120',
        },
      },
      borderRadius: {
        sm: '8px',
        md: '14px',
        lg: '20px',
        xl: '28px',
      },
      boxShadow: {
        red:  '0 8px 32px rgba(200,16,46,0.35)',
        card: '0 4px 20px rgba(0,0,0,0.12)',
        lg:   '0 20px 60px rgba(0,0,0,0.2)',
      },
      animation: {
        'fade-up':   'fadeUp 0.7s ease both',
        'fade-in':   'fadeIn 0.5s ease both',
        'pulse-dot': 'pulseDot 2.5s ease infinite',
        shimmer:     'shimmer 1.6s ease infinite',
        float:       'float 5s ease-in-out infinite',
      },
      keyframes: {
        fadeUp:   { from: { opacity:'0', transform:'translateY(24px)' }, to: { opacity:'1', transform:'translateY(0)' } },
        fadeIn:   { from: { opacity:'0' }, to: { opacity:'1' } },
        pulseDot: { '0%,100%': { opacity:'1', transform:'scale(1)' }, '50%': { opacity:'0.5', transform:'scale(1.6)' } },
        shimmer:  { '0%':{ backgroundPosition:'200% 0' }, '100%':{ backgroundPosition:'-200% 0' } },
        float:    { '0%,100%':{ transform:'translateY(0)' }, '50%':{ transform:'translateY(-10px)' } },
      },
    },
  },
  plugins: [],
}
