import { existsSync } from 'node:fs';
import path from 'node:path';
import type { UserConfig } from 'tsdown';

const cwd = process.cwd();

const externalPatterns = [
	'react',
	'tailwindcss',
	'clsx',
	'tailwind-merge',
	/^@signozhq\/.*$/,
];

function isExternal(id: string): boolean {
	if (
		externalPatterns.some((p) =>
			typeof p === 'string' ? id === p || id.startsWith(p + '/') : p.test(id),
		)
	) {
		return true;
	}
	return false;
}

function cssSideEffectImport() {
	return {
		name: 'css-side-effect-import',
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		renderChunk(code: string, chunk: any) {
			const cssChunkName = chunk.fileName.replace('.js', '.css').replace('.cjs', '.css');
			const cssFileExists = existsSync(path.resolve(cwd, 'dist', cssChunkName))

			if (
				chunk.isEntry &&
				(chunk.fileName.endsWith('.js') || chunk.fileName.endsWith('.cjs')) && cssFileExists
			) {
				const isCjs = chunk.fileName.endsWith('.cjs');
				const importLine = isCjs
					? `require('./${cssChunkName}');\n`
					: `import './${cssChunkName}';\n`;
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
		cssSideEffectImport(),
	],
} satisfies UserConfig;
