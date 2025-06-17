/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        'inner-custom-pink':
          'inset 4px 4px 4px 0px rgba(201, 103, 162, 0.25), inset -4px -4px 4px 0px rgba(201, 103, 162, 0.25)', // Custom inset shadow
        'inset-light': 'inset 2px 2px 2px 0px rgba(255,255,255,.5)',
        'lg-light': '7px 7px 20px 0px rgba(0,0,0,.1)',
        'md-light': '4px 4px 5px 0px rgba(0,0,0,.1)',
        active:
          '4px 4px 6px 0 rgba(255,255,255,.3), -4px -4px 6px 0 rgba(116, 125, 136, .2), inset -4px -4px 6px 0 rgba(255,255,255,.2), inset 4px 4px 6px 0 rgba(0, 0, 0, .2)'
      },
      keyframes: {
        // shinyBtn: {
        //   '0%': { transform: 'scale(0) rotate(-45deg)', opacity: '0' },
        //   '80%': { transform: 'scale(0) rotate(-45deg)', opacity: '0.5' },
        //   '81%': { transform: 'scale(1) rotate(-45deg)', opacity: '1' },
        //   '100%': { transform: 'scale(25) rotate(-45deg)', opacity: '0' }
        // },
        ring: {
          '0%': { transform: 'rotate(20deg)' },
          '50%': { transform: 'rotate(0deg)' },
          '75%': { transform: 'rotate(-20deg)' },
          '100%': { transform: 'rotate(0deg)' }
        },
        float: {
          '0%': { opacity: '1', transform: 'translateY(0) scale(1)' },
          '100%': { opacity: '0', transform: 'translateY(30px) scale(0.5)' }
        }
      },
      animation: {
        shinyBtn: 'shinyBtn 3s ease-in-out infinite',
        ringBtn: 'ring 0.5s ease-in-out infinite',
        float: 'float 1.5s ease-out infinite'
      },
      screens: {
        'xl-custom': '1500px', // custom breakpoint at 1500px
      },
    }
  },
  plugins: []
};
