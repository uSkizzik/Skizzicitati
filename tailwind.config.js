/** @type {import('tailwindcss').Config} */
module.exports = {
	prefix: "tw-",
	content: ["./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			borderRadius: {
				DEFAULT: "10px"
			},
			colors: {
				"nova-magenta": "#e42aaa",
				"cosmic-shadow": "#772fbe",
				"dark-platinum": "#5800b8",
				background: {
					100: "#3f4347",
					200: "#3a3e42",
					300: "#33363a",
					400: "#2c2f32",
					500: "#272a2d",
					600: "#222528",
					700: "#1b1e21",
					800: "#16181c",
					900: "#111217"
				}
			}
		}
	},
	plugins: []
}
