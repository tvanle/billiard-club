import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                // Dark theme colors
                background: '#0a0a0f',
                surface: '#12121a',
                'surface-light': '#1a1a24',
                border: '#2a2a38',
                primary: {
                    DEFAULT: '#6366f1',
                    light: '#818cf8',
                    dark: '#4f46e5',
                },
                accent: {
                    green: '#10b981',
                    red: '#ef4444',
                    yellow: '#f59e0b',
                    blue: '#3b82f6',
                },
                text: {
                    primary: '#f8fafc',
                    secondary: '#94a3b8',
                    muted: '#64748b',
                },
                // Table status colors
                table: {
                    available: '#10b981',
                    occupied: '#ef4444',
                    reserved: '#f59e0b',
                    maintenance: '#6b7280',
                },
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
            },
            boxShadow: {
                glow: '0 0 20px rgba(99, 102, 241, 0.3)',
                'glow-green': '0 0 20px rgba(16, 185, 129, 0.3)',
                'glow-red': '0 0 20px rgba(239, 68, 68, 0.3)',
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'slide-up': 'slideUp 0.3s ease-out',
                'slide-down': 'slideDown 0.3s ease-out',
                'fade-in': 'fadeIn 0.2s ease-out',
            },
            keyframes: {
                slideUp: {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideDown: {
                    '0%': { transform: 'translateY(-10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
            },
        },
    },
    plugins: [],
};

export default config;
