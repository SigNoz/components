import type { UserConfig } from 'tsdown';

export default {
	format: ['esm', 'cjs'],
	dts: true,
	minify: false,
	sourcemap: true,
	clean: true,
	treeshake: true,
	unbundle: false,
	external: [
		'react',
		'tailwindcss',
		'clsx',
		'tailwind-merge',
		/^@signozhq\/.*$/,
	],
	publint: true,
	platform: 'browser',
	target: 'es6',
} satisfies UserConfig;
