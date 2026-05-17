import path, { resolve } from 'node:path';

import type { UserConfig } from 'vite';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import dts from 'vite-plugin-dts';

const cwd = process.cwd();

export const externalPatterns = [
	'react',
	'react-dom',
	'react/jsx-runtime',
	'react/jsx-dev-runtime',
	'clsx',
	'cmdk',
	'sonner',
	'next-themes',
	'motion/react',
	'react-day-picker',
	/^lodash-es(\/.*)?$/,
	'react-resizable-panels',
	'nuqs',
	'dayjs',
	/dayjs\/.*$/,
	'@tanstack/react-virtual',
	'@tanstack/react-table',
	/@radix-ui\/.*$/,
	/^@signozhq\/.*$/,
	'@chenglou/pretext',
];

export default function getViteLibConfig(
	entry: string | string[] | Record<string, string>,
	overrides?: Partial<UserConfig>
): UserConfig {
	const entryResolved =
		typeof entry === 'object' && !Array.isArray(entry)
			? Object.fromEntries(Object.entries(entry).map(([k, v]) => [k, resolve(cwd, v)]))
			: Array.isArray(entry)
				? entry.reduce<Record<string, string>>((acc, e, i) => {
						acc[path.basename(e, path.extname(e)) || `entry${i}`] = resolve(cwd, e);
						return acc;
					}, {})
				: resolve(cwd, entry);

	let libEntry: string | Record<string, string>;
	if (typeof entryResolved === 'string') {
		libEntry = entryResolved;
	} else {
		libEntry =
			Object.keys(entryResolved).length === 1 ? Object.values(entryResolved)[0] : entryResolved;
	}

	return {
		...overrides,
		build: {
			emptyOutDir: true,
			minify: false,
			sourcemap: true,
			cssCodeSplit: true,
			target: 'es2018',
			...overrides?.build,
			lib: {
				entry: libEntry,
				formats: ['es', 'cjs'],
				fileName: (format) => (format === 'es' ? '[name].mjs' : '[name].cjs'),
				...overrides?.build?.lib,
			},
			rolldownOptions: {
				platform: 'browser',
				external: externalPatterns,
				output: {
					globals: {},
					dir: 'dist',
					preserveModules: true,
					preserveModulesRoot: 'src',
				},
				...overrides?.build?.rolldownOptions,
			},
		},
		plugins: [
			dts({
				tsconfigPath: resolve(cwd, 'tsconfig.json'),
				entryRoot: 'src',
				// Dual-emit type files for ESM (.d.ts) and CJS (.d.cts) consumers, per
				// https://www.typescriptlang.org/docs/handbook/modules/reference.html#node16-nodenext
				outDirs: [{ dir: 'dist' }, { dir: 'dist', moduleFormat: 'cjs' }],
			}),
			cssInjectedByJsPlugin({
				relativeCSSInjection: true,
			}),
			...(overrides?.plugins ?? []),
		],
	};
}
