import path, { resolve } from 'node:path';
import fs from 'fs-extra';
import { glob } from 'glob';
import type { UserConfig } from 'vite';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import dts from 'vite-plugin-dts';

const cwd = process.cwd();

export const externalPatterns = [
	'react',
	'react-dom',
	'react/jsx-runtime',
	'react/jsx-dev-runtime',
	'tailwindcss',
	'clsx',
	'tailwind-merge',
	'class-variance-authority',
	'lucide-react',
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
			// Reference: https://github.com/qmhc/unplugin-dts/issues/267#issuecomment-2142950802
			dts({
				tsconfigPath: resolve(cwd, 'tsconfig.json'),
				entryRoot: 'src',
				// create two type folders, one for esm and cjs
				outDir: 'dist',
				// modify type files after they have been written
				afterBuild: async () => {
					// Fetch all .d.ts files recursively from the dist/types/cjs directory
					const files = glob.sync('dist/**/*.d.{ts,ts.map}', { nodir: true });
					// Since TypeScript 5.0, it has emphasized that type files (*.d.ts) are also affected by its ESM and CJS context.
					// This means that you can't share a single type file for both ESM and CJS exports of your library.
					// You need to have two type files when dual-publishing your library.
					// see https://www.typescriptlang.org/docs/handbook/modules/reference.html#node16-nodenext and
					// https://publint.dev/rules#export_types_invalid_format
					await Promise.all(
						// Ideally, this plugin will support different types in the future
						// See https://github.com/qmhc/vite-plugin-dts/issues/267
						files.map(async (file: string): Promise<void> => {
							// Generate the new files with the new .c.ts/.c.ts.map naming
							const newFilePath = file.replace(/\.d\.ts(\.map)?$/, '.d.cts$1');

							// Update sourceMappingURL references
							if (newFilePath.endsWith('.d.cts')) {
								const content = (await fs.readFile(file, 'utf-8'))?.toString();
								let updatedContent = content.replace(
									/\/\/# sourceMappingURL=.*\.d\.ts\.map/g,
									(match) => match.replace('.d.ts.map', '.d.cts.map')
								);
								// Update .js references to .cjs
								updatedContent = updatedContent.replace(/(from\s+['"].*?)\.jsx(['"])/g, '$1.cjs$2');
								updatedContent = updatedContent.replace(/(from\s+['"].*?)\.js(['"])/g, '$1.cjs$2');
								await fs.writeFile(newFilePath, updatedContent, 'utf-8');
							}

							// Update source map file references
							if (newFilePath.endsWith('.d.cts.map')) {
								const content = await fs.readJson(newFilePath);
								content.file = content.file.replace('.d.ts', '.d.cts');
								await fs.writeJson(newFilePath, content);
							}
						})
					);
				},
			}),
			cssInjectedByJsPlugin({
				relativeCSSInjection: true,
			}),
			...(overrides?.plugins ?? []),
		],
	};
}
