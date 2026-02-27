import tailwindConfig from '@signozhq/tailwind-config';
import remarkGfm from 'remark-gfm';
import { mergeConfig } from 'vite';

const config = {
	stories: [
		'../stories/intro.mdx',
		'../stories/design-system.mdx',
		'../stories/*.stories.tsx',
		'../stories/**/*.stories.tsx',
		'../stories/*.mdx',
		'../stories/**/*.mdx',
	],
	addons: [
		{
			name: '@storybook/addon-docs',
			options: {
				mdxPluginOptions: {
					mdxCompileOptions: {
						remarkPlugins: [remarkGfm],
					},
				},
			},
		},
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
