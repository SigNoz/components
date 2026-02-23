import path from 'node:path';
import type { UserConfig } from 'tsdown';
import postcss from 'rollup-plugin-postcss';

const distCss = path.resolve(
	process.cwd(),
	'dist',
	path.basename(process.cwd()) + '.css',
);

const cssFileName = path.basename(process.cwd()) + '.css';

const externalPatterns = [
	'react',
	'tailwindcss',
	'clsx',
	'tailwind-merge',
	'tailwindcss-animate',
	/^@signozhq\/.*$/,
];

function isExternal(id: string): boolean {
	if (externalPatterns.some((p) => (typeof p === 'string' ? id === p || id.startsWith(p + '/') : p.test(id)))) {
		return true;
	}
	return false;
}

function cssSideEffectImport() {
	return {
		name: 'css-side-effect-import',
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		renderChunk(code: string, chunk: any) {
			if (chunk.isEntry && (chunk.fileName.endsWith('.js') || chunk.fileName.endsWith('.cjs'))) {
				const isCjs = chunk.fileName.endsWith('.cjs');
				const importLine = isCjs
					? `require('./${cssFileName}');\n`
					: `import './${cssFileName}';\n`;
				return { code: importLine + code, map: null };
			}
			return null;
		},
	};
}

export default {
	format: ['esm', 'cjs'],
	dts: true,
	minify: false,
	sourcemap: true,
	clean: true,
	treeshake: true,
	unbundle: false,
	external: externalPatterns,
	inputOptions: {
		external: (id: string) => isExternal(id),
	},
	publint: true,
	platform: 'browser',
	target: 'es6',
	plugins: [
		postcss({
			extensions: ['.css'],
			config: true,
			extract: distCss,
			inject: false,
		}),
		cssSideEffectImport(),
	],
} satisfies UserConfig;
