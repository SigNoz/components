import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import tailwindConfig from '@signozhq/tailwind-config';
import { mergeConfig } from 'vite';

const require = createRequire(import.meta.url);

function getAbsolutePath(value) {
	return dirname(require.resolve(join(value, 'package.json')));
}

const config = {
	stories: ['../stories/*.stories.tsx', '../stories/**/*.stories.tsx'],
	addons: [
		getAbsolutePath('@storybook/addon-essentials'),
		getAbsolutePath('@storybook/addon-links'),
		getAbsolutePath('@chromatic-com/storybook'),
		getAbsolutePath('@storybook/addon-designs'),
		getAbsolutePath('@storybook/addon-docs'),
	],
	framework: {
		name: getAbsolutePath('@storybook/react-vite'),
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
