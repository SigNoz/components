/**
 * Message assertions for the type tests in `button.types.test-d.tsx`.
 *
 * `@ts-expect-error` only asserts that *an* error happens on the next line. It says nothing about
 * which constraint fired or what the compiler printed, so a case can keep passing for entirely the
 * wrong reason, and a rewrite of the prop types can quietly turn a readable message into an
 * unreadable one.
 *
 * This test closes that gap. It compiles the same fixture with the `@ts-expect-error` directives
 * blanked out, then snapshots the diagnostic each case actually produces, keyed by
 * `describe > test > reason`. Blanking (rather than deleting) keeps every line number intact, so a
 * diagnostic on the line below a directive belongs to that directive.
 *
 * Two failure modes are covered beyond the snapshot itself: a case that stops erroring, and an error
 * on a line no directive covers, meaning a combination we accept has started to fail.
 */
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import { describe, expect, it } from 'vitest';

const currentDir = dirname(fileURLToPath(import.meta.url));
const fixturePath = resolve(currentDir, 'button.types.test-d.tsx');
const tsconfigPath = resolve(currentDir, '../../../tsconfig.json');

const DESCRIBE = /^\s*describe\('([^']+)'/;
const TEST = /^\s*test\('([^']+)'/;
const EXPECT_ERROR = /^\s*\/\/\s*@ts-expect-error\s*-?\s*(.*)$/;

interface ExpectedError {
	/** 1-based line the directive suppresses, i.e. the line holding the opening `<Button` tag. */
	line: number;
	label: string;
}

/**
 * Blanks out every `@ts-expect-error` line and records which case each one belongs to.
 */
function readFixture(): { source: string; expected: ExpectedError[] } {
	const lines = readFileSync(fixturePath, 'utf8').split('\n');
	const expected: ExpectedError[] = [];

	let describeName = '';
	let testName = '';

	lines.forEach((line, index) => {
		const describeMatch = DESCRIBE.exec(line);
		if (describeMatch?.[1] !== undefined) {
			describeName = describeMatch[1];
			return;
		}

		const testMatch = TEST.exec(line);
		if (testMatch?.[1] !== undefined) {
			testName = testMatch[1];
			return;
		}

		const expectErrorMatch = EXPECT_ERROR.exec(line);
		if (expectErrorMatch?.[1] === undefined) {
			return;
		}

		expected.push({
			line: index + 2,
			label: `${describeName} > ${testName} > ${expectErrorMatch[1].trim()}`,
		});
		lines[index] = '';
	});

	return { source: lines.join('\n'), expected };
}

/**
 * Compiles the package exactly as `tsc` would, with the fixture's contents swapped for `source`.
 */
function compileFixture(source: string): ts.Diagnostic[] {
	const configFile = ts.readConfigFile(tsconfigPath, ts.sys.readFile);
	const config = ts.parseJsonConfigFileContent(configFile.config, ts.sys, dirname(tsconfigPath));

	const host = ts.createCompilerHost(config.options, true);
	const getSourceFile = host.getSourceFile.bind(host);
	const readFile = host.readFile.bind(host);

	host.getSourceFile = (fileName, languageVersion, onError, shouldCreate) => {
		if (resolve(fileName) !== fixturePath) {
			return getSourceFile(fileName, languageVersion, onError, shouldCreate);
		}

		return ts.createSourceFile(fileName, source, languageVersion, true, ts.ScriptKind.TSX);
	};
	host.readFile = (fileName) => (resolve(fileName) === fixturePath ? source : readFile(fileName));

	const program = ts.createProgram(config.fileNames, config.options, host);
	const fixture = program.getSourceFile(fixturePath);

	return [...program.getSyntacticDiagnostics(fixture), ...program.getSemanticDiagnostics(fixture)];
}

const { source, expected } = readFixture();
const diagnostics = compileFixture(source);

/** Diagnostics grouped by the 1-based line they were reported on. */
const byLine = new Map<number, string[]>();
for (const diagnostic of diagnostics) {
	if (diagnostic.file === undefined || diagnostic.start === undefined) {
		continue;
	}

	const { line } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
	const message = `TS${diagnostic.code}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n  ')}`;

	byLine.set(line + 1, [...(byLine.get(line + 1) ?? []), message]);
}

describe('Button type error messages', () => {
	it('reports an error for every rejected combination', () => {
		const silent = expected.filter(({ line }) => !byLine.has(line)).map(({ label }) => label);

		expect(silent).toEqual([]);
	});

	it('reports nothing for the accepted combinations', () => {
		const covered = new Set(expected.map(({ line }) => line));
		const unexpected = [...byLine.entries()]
			.filter(([line]) => !covered.has(line))
			.map(([line, messages]) => `${line}: ${messages[0]}`);

		expect(unexpected).toEqual([]);
	});

	it('prints a message that names the constraint that failed', () => {
		const messages = Object.fromEntries(
			expected.map(({ line, label }) => [label, byLine.get(line)?.join('\n') ?? null]),
		);

		expect(messages).toMatchSnapshot();
	});
});
