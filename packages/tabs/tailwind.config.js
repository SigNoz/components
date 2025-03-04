import sharedConfig from '@signozhq/tailwind-config/tailwind.config.js';

/** @type {import('tailwindcss').Config} */
export default {
	...sharedConfig,
	content: [...sharedConfig.content, './src/**/*.{js,ts,jsx,tsx}'],
	safelist: [
		{
			pattern:
				/^(bg|text|border)-(robin|sienna|cherry|aqua|sakura|amber|ink|vanilla|slate|forest)-(100|200|300|400|500|600)/,
			variants: ['hover', 'focus', 'before', 'after'],
		},
	],
};
