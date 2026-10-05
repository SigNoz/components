import remarkGfm from 'remark-gfm';

const config = {
	stories: [
		'../stories/intro.mdx',
		'../stories/design-system.mdx',
		'../stories/*.mdx',
		'../stories/**/*.mdx',
		'../stories/*.stories.tsx',
		'../stories/**/*.stories.tsx',
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
		'storybook-addon-pseudo-states',
	],
	framework: {
		name: '@storybook/react-vite',
		options: {},
	},
	core: {
		disableTelemetry: true,
	},
	typescript: {
		reactDocgen: 'react-docgen-typescript',
		// `storybook dev` reads `packages/ui` source (see `vite.config.ts`), which sits outside this
		// TypeScript project, so docgen would only log a skip warning for each file.
		reactDocgenTypescriptOptions: { exclude: ['**/*.stories.tsx', '**/packages/ui/src/**'] },
	},
};

export default config;
