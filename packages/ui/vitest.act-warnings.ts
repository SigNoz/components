import type { Reporter } from 'vitest/node';

const ACT_WARNING = 'not wrapped in act(';

export type ActWarningFilter = {
	onConsoleLog: (log: string, type: 'stdout' | 'stderr') => false | undefined;
	reporter: Reporter;
};

export function createActWarningFilter(
	show = process.env.SHOW_ACT_WARNINGS === '1',
	write: (text: string) => void = (text) => process.stderr.write(text),
): ActWarningFilter {
	let hidden = 0;

	return {
		onConsoleLog(log, type) {
			if (show || type !== 'stderr' || !log.includes(ACT_WARNING)) {
				return undefined;
			}
			hidden += 1;
			return false;
		},
		reporter: {
			onTestRunStart() {
				hidden = 0;
			},
			onTestRunEnd() {
				if (hidden === 0) {
					return;
				}
				const noun = hidden === 1 ? 'warning' : 'warnings';
				write(`${hidden} React act ${noun} hidden. Run with SHOW_ACT_WARNINGS=1 to see them.\n`);
			},
		},
	};
}
