/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          blue: {
            50: '#EFF6FF',
            100: '#DBEAFE',
            500: '#3B82F6',
            600: '#2563EB',
            700: '#1D4ED8',
          },
          purple: {
            50: '#FAF5FF',
            100: '#F3E8FF',
            500: '#8B5CF6',
            600: '#7C3AED',
            700: '#6D28D9',
          },
          pink: {
            50: '#FDF2F8',
            100: '#FCE7F3',
            500: '#EC4899',
            600: '#DB2777',
            700: '#BE185D',
          }
        },
        category: {
          konser: '#8B5CF6',
          spor: '#10B981',
          tiyatro: '#EF4444',
          festival: '#F59E0B',
          meetup: '#3B82F6',
          sergi: '#6366F1'
        }
      },
      borderRadius: {
        '3xl': '32px',
        '4xl': '40px',
      },
      maxWidth: {
        'mobile': '28rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
