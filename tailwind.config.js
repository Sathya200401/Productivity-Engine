/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        swiss: {
          void: '#09090B',
          surface: '#111114',
          elevated: '#17181D',
          border: 'rgba(255, 255, 255, 0.08)',
          'border-strong': 'rgba(255, 255, 255, 0.16)',
          blue: '#1D4ED8',
          'blue-light': '#3B82F6',
          signal: '#DC2626',
          amber: '#D97706',
          emerald: '#059669',
          chalk: '#F4F4F5',
          muted: '#71717A',
          dim: '#27272A',
          'light-bg': '#F9FAFB',
          'light-surface': '#FFFFFF',
          'light-elevated': '#F3F4F6',
          'light-border': '#E5E7EB',
          'light-border-strong': '#D1D5DB',
          'light-text': '#0F172A',
          'light-muted': '#64748B'
        },
        cyber: {
          bg: '#09090B',
          card: '#111114',
          cardElevated: '#17181D',
          border: 'rgba(255, 255, 255, 0.08)',
          cyan: '#1D4ED8',
          blue: '#2563EB',
          flame: '#0F172A',
          orange: '#334155',
          amber: '#D97706',
          emerald: '#059669',
          purple: '#1D4ED8'
        }
      },
      fontFamily: {
        display: [
          'Space Grotesk',
          '-apple-system',
          'BlinkMacSystemFont',
          'sans-serif'
        ],
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'sans-serif'
        ],
        mono: [
          'JetBrains Mono',
          'SF Mono',
          'Fira Code',
          'monospace'
        ]
      },
      boxShadow: {
        'swiss-elevation-1': '0 1px 2px 0 rgba(0, 0, 0, 0.4), inset 0 1px 0 0 rgba(255, 255, 255, 0.06)',
        'swiss-elevation-2': '0 4px 12px 0 rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)',
        'swiss-light-elevation': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'neon-cyan': 'none',
        'neon-flame': 'none',
        'neon-purple': 'none',
        'cockpit': '0 20px 40px -15px rgba(0, 0, 0, 0.6), inset 0 1px 0 0 rgba(255, 255, 255, 0.06)',
        'card-glow': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.06)'
      }
    },
  },
  plugins: [],
}
