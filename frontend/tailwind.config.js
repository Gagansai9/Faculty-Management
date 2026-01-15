/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'neon-blue': '#00f3ff',
                'neon-purple': '#bc13fe',
                glassBg: 'rgba(255, 255, 255, 0.1)',
                darkBg: '#0a0a0a',
            },
            backdropBlur: {
                xs: '2px',
            },
            animation: {
                'spin-slow': 'spin 3s linear infinite',
            },
        },
    },
    plugins: [],
}
