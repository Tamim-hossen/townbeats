/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      gridTemplateColumns:{
        'auto': 'repeat(auto-fit, minmax(200px, 1fr))'
      },
      animation: {
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        slideUp: {
          '0%': {
            transform: 'translateY(100px)', 
            opacity: 0, 
          },
          '100%': {
            transform: 'translateY(0)', 
            opacity: 1, 
          },
        },
      },
      animationDelay: {
        500: '5000ms',
        1000: '5000ms',
      },
    },
  },
  plugins: [],
};
