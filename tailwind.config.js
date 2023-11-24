/** @type {import('tailwindcss').Config}*/
const config = {
	content: ['./src/**/*.{html,js,svelte,ts}', './src/**/**/*.{html,js,svelte,ts}', './index.html'],

	theme: {
		extend: {
			colors: {
				...{
					french_violet: {
						DEFAULT: '#7400b8',
						100: '#170025',
						200: '#2f0049',
						300: '#46006e',
						400: '#5d0093',
						500: '#7400b8',
						600: '#9e00f9',
						700: '#b73bff',
						800: '#cf7cff',
						900: '#e7beff'
					},
					grape: {
						DEFAULT: '#6930c3',
						100: '#150a27',
						200: '#2a144e',
						300: '#3f1d76',
						400: '#54279d',
						500: '#6930c3',
						600: '#8655d5',
						700: '#a480df',
						800: '#c3aaea',
						900: '#e1d5f4'
					},
					slate_blue: {
						DEFAULT: '#5e60ce',
						100: '#0e0f2e',
						200: '#1c1d5c',
						300: '#2a2c8a',
						400: '#393bb8',
						500: '#5e60ce',
						600: '#7f81d8',
						700: '#9fa0e2',
						800: '#bfc0eb',
						900: '#dfdff5'
					},
					united_nations_blue: {
						DEFAULT: '#5390d9',
						100: '#0b1c31',
						200: '#163863',
						300: '#205494',
						400: '#2b71c5',
						500: '#5390d9',
						600: '#76a6e1',
						700: '#98bce8',
						800: '#bad3f0',
						900: '#dde9f7'
					},
					picton_blue: {
						DEFAULT: '#4ea8de',
						100: '#092333',
						200: '#134666',
						300: '#1c6999',
						400: '#258ccb',
						500: '#4ea8de',
						600: '#72b9e5',
						700: '#95caec',
						800: '#b8dcf2',
						900: '#dcedf9'
					},
					aero: {
						DEFAULT: '#48bfe3',
						100: '#082a34',
						200: '#105468',
						300: '#187d9c',
						400: '#20a7d0',
						500: '#48bfe3',
						600: '#6ecce8',
						700: '#92d9ee',
						800: '#b7e5f4',
						900: '#dbf2f9'
					},
					sky_blue: {
						DEFAULT: '#56cfe1',
						100: '#092f35',
						200: '#135e6a',
						300: '#1c8d9f',
						400: '#25bcd4',
						500: '#56cfe1',
						600: '#78d8e7',
						700: '#9ae2ed',
						800: '#bbecf3',
						900: '#ddf5f9'
					},
					tiffany_blue: {
						DEFAULT: '#64dfdf',
						100: '#0b3535',
						200: '#166b6b',
						300: '#21a0a0',
						400: '#2dd4d4',
						500: '#64dfdf',
						600: '#82e5e5',
						700: '#a1ecec',
						800: '#c0f2f2',
						900: '#e0f9f9'
					},
					turquoise: {
						DEFAULT: '#72efdd',
						100: '#073f37',
						200: '#0e7f6e',
						300: '#15bea5',
						400: '#31e8cd',
						500: '#72efdd',
						600: '#8df2e3',
						700: '#aaf6ea',
						800: '#c6f9f1',
						900: '#e3fcf8'
					},
					aquamarine: {
						DEFAULT: '#80ffdb',
						100: '#004d37',
						200: '#00996e',
						300: '#00e6a4',
						400: '#33ffc5',
						500: '#80ffdb',
						600: '#99ffe2',
						700: '#b3ffe9',
						800: '#ccfff1',
						900: '#e5fff8'
					}
				}
			},
			colors: {
				// 'brand-primary-gradient-start': '#56cfe1',
				'brand-sidebar': '#2D3142',
				'brand-white': '#FFFFFF',
				'brand-black': '#131313',
				'brand-grey-main': '#4f5d75',
				'brand-grey-main-shade': '#2D3142',
				'brand-btn-main': '#ef8354',
				'brand-btn-main-shade': '#EA5C1F',
				'brand-background': '#efefef',
				'brand-orange': '#E73827',
				'brand-red-ground': '#ddf5f9',
			},
			fontFamily: {
				'dm-sans': ['DM Sans']
			}
		}
	},

	plugins: []
};

module.exports = config;
