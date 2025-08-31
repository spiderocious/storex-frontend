/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand colors
        primary: '#FFFFFF',
        secondary: '#000000',
        accent: '#1F2937',
        
        // Interactive states
        hover: '#F3F4F6',
        active: '#6B7280',
        focus: '#3B82F6',
        
        // Status colors
        error: '#EF4444',
        success: '#10B981',
        warning: '#F59E0B',
        
        // Text colors
        text: {
          primary: '#000000',
          secondary: '#1F2937',
          tertiary: '#6B7280',
          disabled: '#9CA3AF'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      fontSize: {
        'xs': '12px',
        'sm': '14px',
        'base': '16px',
        'lg': '18px',
        'xl': '20px',
        '2xl': '24px',
        '3xl': '32px'
      }
    }
  },
  plugins: []
};