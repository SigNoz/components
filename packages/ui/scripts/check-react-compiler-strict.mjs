#!/usr/bin/env node

// Runs the same React Compiler pass as the build (see ../react-compiler.config.ts)
// with panicThreshold: 'all_errors' against every source file, so a bailout fails CI
// instead of only showing up as a build log warning.

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { transformSync } from 'oxc-transform-react';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC_DIR = join(__dirname, '../src');
const EXCLUDE = /(^|\/)__(tests|mocks|screenshots)__(\/|$)|\.test(-d)?\.tsx?$|\.d\.ts$/;
const LANG_BY_EXTENSION = { '.ts': 'ts', '.tsx': 'tsx' };

function collectFiles(dir) {
	const files = [];

	for (const entry of readdirSync(dir)) {
		const fullPath = join(dir, entry);

		if (statSync(fullPath).isDirectory()) {
			files.push(...collectFiles(fullPath));
		} else if (extname(entry) in LANG_BY_EXTENSION && !EXCLUDE.test(fullPath)) {
			files.push(fullPath);
		}
	}

	return files;
}

const files = collectFiles(SRC_DIR);
let hasErrors = false;

for (const file of files) {
	const { errors } = transformSync(file, readFileSync(file, 'utf8'), {
		lang: LANG_BY_EXTENSION[extname(file)],
		reactCompiler: { target: '18', panicThreshold: 'all_errors' },
	});

	for (const error of errors) {
		hasErrors = true;
		console.error(error.codeframe ?? `${file}: ${error.message}`);
	}
}

if (hasErrors) {
	console.error('\nReact Compiler bailout in packages/ui/src.');
	process.exit(1);
}

console.log(`React Compiler: no bailouts (${files.length} files checked).`);
