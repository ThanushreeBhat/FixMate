/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // FixMate Brand Color System
        regalNavy: {
          DEFAULT: '#134074',
          hover: '#0E325C',
          light: '#1D5392'
        },
        oxfordNavy: {
          DEFAULT: '#13315C',
          hover: '#0D2242'
        },
        prussianBlue: {
          DEFAULT: '#0B2545',
          dark: '#071930'
        },
        powderBlue: {
          DEFAULT: '#8DA9C4',
          light: '#DCE6F1',
          soft: '#EEF4ED'
        },
        mintCream: {
          DEFAULT: '#EEF4ED',
          light: '#F5F9F4'
        },
        // Semantic Colors
        semanticSuccess: '#22C55E',
        semanticWarning: '#F59E0B',
        semanticError: '#EF4444',
        semanticInfo: '#3B82F6',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Manrope', 'sans-serif'],
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(19, 64, 116, 0.05)',
        'card': '0 10px 30px -4px rgba(11, 37, 69, 0.06)',
        'dropdown': '0 20px 40px -8px rgba(11, 37, 69, 0.12)',
      }
    },
  },
  plugins: [],
}
