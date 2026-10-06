import { describe, expect, it } from 'vitest';
import { commandScore } from './command-score.js';

// What `defaultFilter` from cmdk 1.1.1 returned for each case, one per branch of the score.
const CMDK_SCORES: Array<[text: string, query: string, keywords: string[], score: number]> = [
	['Dashboards', 'dash', [], 0.989901],
	['Dashboards', 'dshb', [], 0.16811488683],
	['Go to Dashboards', 'dshb', [], 0.151303398147],
	['Go to Home', 'gth', [], 0.801739628019],
	['Go to Home', 'HOME', [], 0.8997300269991001],
	['Go to Home', 'home', [], 0.89991],
	['Toggle Dark Mode', 'tdm', [], 0.8016594540561981],
	['Logs Explorer', 'logs ex', [], 0.9898020099],
	['Settings / Members', 'sm', [], 0.88993098710109],
	['api-keys', 'api k', [], 0.989901],
	['Shift+H', 'sh', [], 0.989901],
	['Traces_view', 'tv', [], 0.7919208000000001],
	['Dashboards', 'dsahboards', [], 0.09999000000000001],
	['Toggle Dark Mode', 'oo', [], 0.099],
	['Go to Home', 'xyz', [], 0],
	['Go to Home', 'landing', ['landing page'], 0.891],
	['Go to Home', 'nav', ['nav', 'goto'], 0.891],
	['Dashboards', '', [], 0.99],
];

describe('commandScore', () => {
	it.each(CMDK_SCORES)('scores %j against %j like cmdk 1.1.1', (text, query, keywords, score) => {
		expect(commandScore(text, query, keywords)).toBe(score);
	});

	it('lets the query skip letters', () => {
		expect(commandScore('Dashboards', 'dshb')).toBeGreaterThan(0);
	});

	it('ranks a word start above a letter in the middle', () => {
		expect(commandScore('Dashboards', 'dshb')).toBeGreaterThan(
			commandScore('Go to Dashboards', 'dshb'),
		);
	});

	it('returns 0 when a letter is missing', () => {
		expect(commandScore('Go to Home', 'xyz')).toBe(0);
	});

	it('matches the keywords', () => {
		expect(commandScore('Go to Home', 'landing')).toBe(0);
		expect(commandScore('Go to Home', 'landing', ['landing page'])).toBeGreaterThan(0);
	});
});
