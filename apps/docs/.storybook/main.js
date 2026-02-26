import tailwindConfig from '@signozhq/tailwind-config';
import { mergeConfig } from 'vite';

const config = {
	stories: ['../stories/*.stories.tsx', '../stories/**/*.stories.tsx'],
	addons: [
		'@storybook/addon-docs',
		'@storybook/addon-themes',
		'@storybook/addon-designs',
		'@chromatic-com/storybook',
		'@storybook/addon-vitest',
	],
	framework: {
		name: '@storybook/react-vite',
		options: {},
	},
	core: {
		disableTelemetry: true,
	},
	async viteFinal(config) {
		const { default: tailwindcss } = await import('@tailwindcss/vite');

		return mergeConfig(config, {
			define: { 'process.env': {} },
			resolve: {
				...config.resolve,
				alias: config.resolve?.alias ?? [],
			},
			plugins: [tailwindcss(tailwindConfig)],
		});
	},
	typescript: {
		reactDocgen: 'react-docgen-typescript',
	},
};

export default config;
