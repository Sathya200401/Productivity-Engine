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
        cyber: {
          bg: '#05060A',
          card: '#0C0E17',
          cardElevated: '#121624',
          border: 'rgba(255, 255, 255, 0.08)',
          cyan: '#00F2FE',
          blue: '#4FACFE',
          flame: '#FF4500',
          orange: '#FF8C00',
          amber: '#FBBF24',
          emerald: '#10B981',
          purple: '#8B5CF6'
        }
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
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
        'neon-cyan': '0 0 30px -5px rgba(0, 242, 254, 0.35)',
        'neon-flame': '0 0 30px -5px rgba(255, 69, 0, 0.35)',
        'neon-purple': '0 0 30px -5px rgba(139, 92, 246, 0.35)',
        'cockpit': '0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 40px -10px rgba(0, 242, 254, 0.15)',
        'card-glow': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.12), 0 10px 30px -10px rgba(0, 0, 0, 0.6)'
      }
    },
  },
  plugins: [],
}
