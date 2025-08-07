import { dirname, join } from 'path';
import { createRequire } from 'module';

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
		return {
			...config,
			define: { 'process.env': {} },
			resolve: {
				alias: [],
			},
		};
	},

	typescript: {
		reactDocgen: 'react-docgen-typescript',
	},
};

export default config;
