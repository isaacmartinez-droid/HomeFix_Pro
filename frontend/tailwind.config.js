/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#003366',
        'primary-variant': '#002244',
        secondary: '#E6F0FA',
        background: '#f9f9fe',
        surface: '#ffffff',
        'surface-variant': '#e1e2ec',
        'on-primary': '#ffffff',
        'on-secondary': '#003366',
        'on-background': '#1a1b22',
        'on-surface': '#1a1b22',
        'on-surface-variant': '#44474f',
        'outline': '#74777f',
        'outline-variant': '#c4c6d0',
        'surface-container': '#f0f0f7',
        'surface-container-high': '#ebeaf1',
        'surface-container-highest': '#e4e2e9',
        'surface-container-low': '#f6f5fc',
        'surface-container-lowest': '#ffffff',
        'primary-container': '#d8e2ff',
        'on-primary-container': '#001a41',
        'secondary-container': '#dbe4e9',
        'on-secondary-container': '#141c2b',
        'error': '#ba1a1a',
        'on-error': '#ffffff',
        'error-container': '#ffdad6',
        'on-error-container': '#410002',
        'success': '#006d3a',
        'success-container': '#95f8b4',
        'warning': '#f09800',
        'warning-container': '#ffdf9c',
        'info': '#0061a4',
        'info-container': '#d1e4ff'
      },
      fontFamily: {
        'display-lg': ['Inter', 'sans-serif'],
        'headline-lg': ['Inter', 'sans-serif'],
        'headline-md': ['Inter', 'sans-serif'],
        'headline-sm': ['Inter', 'sans-serif'],
        'body-lg': ['Inter', 'sans-serif'],
        'body-md': ['Inter', 'sans-serif'],
        'body-sm': ['Inter', 'sans-serif'],
        'label-md': ['Inter', 'sans-serif'],
        'label-sm': ['Inter', 'sans-serif'],
        'mono-sm': ['Courier Prime', 'monospace']
      },
      fontSize: {
        'display-lg': ['48px', { lineHeight: '56px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'headline-lg': ['32px', { lineHeight: '40px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'headline-md': ['24px', { lineHeight: '32px', fontWeight: '600' }],
        'headline-sm': ['20px', { lineHeight: '28px', fontWeight: '600' }],
        'body-lg': ['18px', { lineHeight: '28px', fontWeight: '400' }],
        'body-md': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'label-md': ['14px', { lineHeight: '16px', letterSpacing: '0.01em', fontWeight: '600' }],
        'label-sm': ['12px', { lineHeight: '14px', fontWeight: '600' }],
        'mono-sm': ['14px', { lineHeight: '20px', fontWeight: '400' }]
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '48px',
        '3xl': '64px',
        'container-max': '1200px'
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '16px',
        'xl': '24px',
        'full': '9999px'
      },
      boxShadow: {
        'soft': '0 4px 12px rgba(0,51,102,0.08)'
      }
    },
  },
  plugins: [],
}
