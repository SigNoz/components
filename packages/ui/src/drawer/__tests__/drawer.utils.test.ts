import { describe, expect, it } from 'vitest';
import { toDrawerCloseReason } from '../utils.js';

describe('toDrawerCloseReason', () => {
	it.each(['escape-key', 'outside-press', 'close-press', 'swipe'] as const)(
		'reports %s as it is',
		(reason) => {
			expect(toDrawerCloseReason(reason)).toBe(reason);
		},
	);

	// The Android back gesture: dropped, the drawer would stay open and the next press would leave
	// the page.
	it('reports the close watcher of the platform as escape-key', () => {
		expect(toDrawerCloseReason('close-watcher')).toBe('escape-key');
	});

	it.each(['trigger-press', 'focus-out', 'imperative-action', 'none'])(
		'reports nothing for %s, which no drawer without a trigger closes for',
		(reason) => {
			expect(toDrawerCloseReason(reason)).toBeUndefined();
		},
	);
});
