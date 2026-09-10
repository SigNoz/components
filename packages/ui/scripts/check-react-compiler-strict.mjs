#!/usr/bin/env node

// Runs the same React Compiler pass as the build (see ../react-compiler.config.ts)
// with panicThreshold: 'all_errors' against a hardened subset of components, so a
// bailout there fails CI instead of only showing up as a build log warning.

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { transformSync } from 'oxc-transform-react';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC_DIR = join(__dirname, '../src');
const STRICT_COMPONENTS_FILE = join(__dirname, '../react-compiler-strict-components.txt');
const STRICT_COMPONENTS = readFileSync(STRICT_COMPONENTS_FILE, 'utf8')
	.split('\n')
	.map((line) => line.trim())
	.filter((line) => line && !line.startsWith('#'));
const EXCLUDE = /(^|\/)__tests__(\/|$)|\.test(-d)?\.tsx?$/;

function collectFiles(dir) {
	const files = [];

	for (const entry of readdirSync(dir)) {
		const fullPath = join(dir, entry);

		if (statSync(fullPath).isDirectory()) {
			files.push(...collectFiles(fullPath));
		} else if (extname(entry) === '.tsx' && !EXCLUDE.test(fullPath)) {
			files.push(fullPath);
		}
	}

	return files;
}

const files = STRICT_COMPONENTS.flatMap((name) => collectFiles(join(SRC_DIR, name)));
let hasErrors = false;

for (const file of files) {
	const { errors } = transformSync(file, readFileSync(file, 'utf8'), {
		lang: 'tsx',
		reactCompiler: { target: '18', panicThreshold: 'all_errors' },
	});

	for (const error of errors) {
		hasErrors = true;
		console.error(error.codeframe ?? `${file}: ${error.message}`);
	}
}

if (hasErrors) {
	console.error(
		`\nReact Compiler bailout in a hardened component (${STRICT_COMPONENTS.join(', ')}).`,
	);
	process.exit(1);
}

console.log(
	`React Compiler: no bailouts in ${STRICT_COMPONENTS.join(', ')} (${files.length} files checked).`,
);
