/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA', // Primary Deep Indigo
          800: '#3730A3',
          900: '#312E81',
        },
        violet: {
          primary: '#7C3AED',
          light: '#8B5CF6',
          dark: '#6D28D9',
        },
        teal: {
          primary: '#14B8A6',
          light: '#2DD4BF',
          dark: '#0D9488',
        },
        slate: {
          bg: '#F8FAFC',
          text: '#172033',
        },
        status: {
          success: '#16A34A',
          warning: '#F59E0B',
          error: '#DC2626',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'premium': '0 10px 25px -5px rgba(67, 56, 202, 0.08), 0 8px 10px -6px rgba(67, 56, 202, 0.04)',
      }
    },
  },
  plugins: [],
}
