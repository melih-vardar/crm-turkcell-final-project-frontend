/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0056b3',
          light: '#3379c6',
          dark: '#003f80',
        },
        secondary: {
          DEFAULT: '#6c757d',
          light: '#868e96',
          dark: '#495057',
        },
        success: '#28a745',
        info: '#17a2b8',
        warning: '#ffc107',
        danger: '#dc3545',
      },
    },
  },
  plugins: [],
} 