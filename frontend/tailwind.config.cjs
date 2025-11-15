module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        accent: {
          light: '#BDE0FE',
          main: '#A2D2FF',
          dark: '#88C0FF',
        },
        pastel: {
          blue: '#BDE0FE',
          sky: '#A2D2FF',
          light: '#E8F4FF',
        }
      },
      backgroundImage: {
        'gradient-blue': 'linear-gradient(135deg, #BDE0FE 0%, #A2D2FF 100%)',
        'gradient-soft': 'linear-gradient(135deg, #E8F4FF 0%, #BDE0FE 50%, #A2D2FF 100%)',
        'gradient-accent': 'linear-gradient(135deg, #A2D2FF 0%, #88C0FF 100%)',
      },
      boxShadow: {
        'blue-soft': '0 0 20px rgba(162,210,255,0.4), 0 0 40px rgba(189,224,254,0.2)',
        'blue-glow': '0 8px 32px rgba(162,210,255,0.3), 0 4px 16px rgba(189,224,254,0.2)',
        'colorful': '0 10px 40px rgba(162,210,255,0.25), 0 5px 15px rgba(189,224,254,0.2)',
        'glow': '0 8px 32px rgba(162,210,255,0.2), 0 4px 16px rgba(189,224,254,0.15)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { filter: 'brightness(1) drop-shadow(0 0 10px rgba(255,0,128,0.5))' },
          '50%': { filter: 'brightness(1.2) drop-shadow(0 0 20px rgba(0,217,255,0.8))' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-1deg)' },
          '50%': { transform: 'rotate(1deg)' },
        },
      },
    }
  },
  plugins: [],
}
