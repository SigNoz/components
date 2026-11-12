import { afterEach, describe, expect, it, vi } from 'vitest';
import { createActWarningFilter } from '../../vitest.act-warnings.js';

const actWarning =
	'An update to ComboboxPopup inside a test was not wrapped in act(...).\n\nWhen testing, code that causes React state updates should be wrapped into act(...)';

function setup(show = false) {
	const output: string[] = [];
	const filter = createActWarningFilter(show, (text) => output.push(text));
	return {
		filter,
		output,
		endRun: () => filter.reporter.onTestRunEnd?.([], [], 'passed'),
	};
}

describe('act warning filter', () => {
	afterEach(() => {
		vi.unstubAllEnvs();
	});

	it('hides React act warnings by default', () => {
		const { filter } = setup();

		expect(filter.onConsoleLog(actWarning, 'stderr')).toBe(false);
	});

	it('keeps other console errors and stdout', () => {
		const { filter } = setup();

		expect(filter.onConsoleLog('Warning: Each child in a list needs a key', 'stderr')).toBe(
			undefined,
		);
		expect(filter.onConsoleLog(actWarning, 'stdout')).toBe(undefined);
	});

	it('shows act warnings when SHOW_ACT_WARNINGS is 1', () => {
		const { filter, output, endRun } = setup(true);

		expect(filter.onConsoleLog(actWarning, 'stderr')).toBe(undefined);
		endRun();
		expect(output).toEqual([]);
	});

	it('reads only SHOW_ACT_WARNINGS=1 as on', () => {
		vi.stubEnv('SHOW_ACT_WARNINGS', '0');
		expect(createActWarningFilter().onConsoleLog(actWarning, 'stderr')).toBe(false);

		vi.stubEnv('SHOW_ACT_WARNINGS', '1');
		expect(createActWarningFilter().onConsoleLog(actWarning, 'stderr')).toBe(undefined);
	});

	it('reports how many warnings it hid at the end of the run', () => {
		const { filter, output, endRun } = setup();

		filter.onConsoleLog(actWarning, 'stderr');
		filter.onConsoleLog(actWarning, 'stderr');
		endRun();

		expect(output.join('')).toContain(
			'2 React act warnings hidden. Run with SHOW_ACT_WARNINGS=1 to see them.',
		);
	});

	it('prints nothing when no warning was hidden', () => {
		const { endRun, output } = setup();

		endRun();

		expect(output).toEqual([]);
	});

	it('starts counting again on each run', () => {
		const { filter, output, endRun } = setup();

		filter.onConsoleLog(actWarning, 'stderr');
		filter.reporter.onTestRunStart?.([]);
		endRun();

		expect(output).toEqual([]);
	});
});
