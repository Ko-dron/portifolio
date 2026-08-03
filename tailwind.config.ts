import type { Config } from 'tailwindcss'

/**
 * Sleek, minimal dark theme.
 * Palette is intentionally near-monochrome with a single restrained accent
 * (a cool electric blue) used only as punctuation for links / hover / focus.
 */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Layered near-blacks (never pure black) for depth. Built around #161616.
        base: '#161616',
        surface: '#1c1c1c',
        'surface-2': '#242424',
        border: '#303030',
        // Text — warm off-white + muted neutrals.
        heading: '#faf9f7',
        body: '#a8a5a0',
        muted: '#6e6a64',
        // Single restrained accent — signal red. soft/dim are on-brand derivations
        // of #df2531; use `accent/45` and `accent/65` opacity utilities for the
        // translucent variants of the palette.
        accent: {
          DEFAULT: '#df2531',
          soft: '#f05159',
          dim: '#7c1c22',
        },
      },
      fontFamily: {
        // Display: Space Grotesk. Body: Inter. Loaded via Google Fonts in index.html.
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"Space Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        // Fluid display sizes for confident headlines.
        'display-xl': ['clamp(2.75rem, 8vw, 7rem)', { lineHeight: '0.95', letterSpacing: '-0.03em' }],
        'display-lg': ['clamp(2.25rem, 6vw, 5rem)', { lineHeight: '1.0', letterSpacing: '-0.025em' }],
        'display-md': ['clamp(1.75rem, 4vw, 3.25rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
      },
      maxWidth: {
        container: '1240px',
      },
      spacing: {
        section: 'clamp(6rem, 14vh, 11rem)',
      },
      transitionTimingFunction: {
        expo: 'cubic-bezier(0.16, 1, 0.3, 1)',
        'in-out-soft': 'cubic-bezier(0.65, 0, 0.35, 1)',
      },
      keyframes: {
        'grain-shift': {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '10%': { transform: 'translate(-5%, -10%)' },
          '30%': { transform: 'translate(3%, -15%)' },
          '50%': { transform: 'translate(-8%, 5%)' },
          '70%': { transform: 'translate(6%, 10%)' },
          '90%': { transform: 'translate(-3%, 6%)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'scroll-cue': {
          '0%': { transform: 'translateY(0)', opacity: '0' },
          '30%': { opacity: '1' },
          '60%': { opacity: '1' },
          '100%': { transform: 'translateY(14px)', opacity: '0' },
        },
      },
      animation: {
        'grain-shift': 'grain-shift 8s steps(6) infinite',
        'fade-in': 'fade-in 0.8s ease forwards',
        'scroll-cue': 'scroll-cue 1.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
} satisfies Config
