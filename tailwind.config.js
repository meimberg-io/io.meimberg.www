import tailwindcssAnimate from 'tailwindcss-animate'

module.exports = {
	darkMode: ['class'],
	content: [
		'./index.html',
		'./src/**/*.{js,ts,jsx,tsx}',
		'./src/styles/**/*.{css,scss}',
		'./**/*.{css,scss}'
	],
	theme: {
		extend: {
			screens: {
				sm: '480px',
				md: '768px',
				lg: '976px',
				xl: '1200px',
				xxl: '1440px'
			},
			colors: {
				brand: '#233D4D',
				primary: '#5789C7',
				confirm: '#259F5E',
				cancel: '#B60E16',
				warning: 'FDCF4E',
				error: '#B60E16',
				success: '#D28494'
			}
		}
	},
	plugins: [
		tailwindcssAnimate
	]
}

