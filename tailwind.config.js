/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        navy: {
          DEFAULT: 'var(--navy)',
          soft: 'var(--navy-soft)',
        },
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
        sm: 'calc(var(--radius) - 4px)',
        lg: 'calc(var(--radius) + 4px)',
        xl: 'calc(var(--radius) + 8px)',
      },
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'DM Sans', 'sans-serif'],
        mono: ['var(--font-dm-mono)', 'DM Mono', 'monospace'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'shimmer': 'shimmer 1.5s infinite',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.2s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #1D4ED8 0%, #2F6FEB 100%)',
        'card-gradient': 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFD 100%)',
        'hero-gradient': 'linear-gradient(180deg, #F3F6FB 0%, #FFFFFF 100%)',
      },
      boxShadow: {
        'gold': '0 4px 16px rgba(11, 31, 75, 0.10)',
        'gold-sm': '0 1px 2px rgba(11, 31, 75, 0.06)',
        'gold-lg': '0 12px 32px rgba(11, 31, 75, 0.14)',
        'card': '0 4px 16px rgba(11, 31, 75, 0.08)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};