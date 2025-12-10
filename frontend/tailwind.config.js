import { COLORS } from '@/constants/theme';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,ts,tsx}',
    './src/**/*.{js,ts,tsx,jsx}',
    './src/**/*.{js,ts,tsx,jsx}'
  ],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      boxShadow: {
        card: '0px 4px 6px rgba(0,0,0,0.2)',
      },
      colors: {
        themeColor: '#6C63FF',
        // lightTheme: "#C4C0FF",
        lightTheme: "#b3adff",
        darkGrey: '#454545',
        lightGrey: '#9CA3AF',
        successColor: '#10B981',
      },
      fontFamily: {
        Inter: ["Inter-Regular"],
        InterMedium: ["Inter-Medium"],
        InterSemibold: ["Inter-Semibold"],
        InterBold: ["Inter-Bold"],
      }
      
    },
  },
  plugins: [],
};
