import sharedConfig from '@signozhq/tailwind-config/tailwind.config.js';

/** @type {import('tailwindcss').Config} */
export default {
	...sharedConfig,
	content: [...sharedConfig.content, './src/**/*.{js,ts,jsx,tsx}'],
};
