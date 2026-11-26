import { expect, it } from 'vitest';
import { answerPress } from '../utils.js';

it.each([
	{ catches: true, reports: 0 },
	{ catches: false, reports: 1 },
])(
	'reports $reports uncaught errors when the caller catches the close: $catches',
	async ({ catches, reports }) => {
		const failure = new Error('Close failed');
		const marker = new Error('End of rejection turn');
		const events: unknown[] = [];
		const { promise: settled, resolve } = Promise.withResolvers<void>();
		const observe = (event: PromiseRejectionEvent): void => {
			if (event.reason !== failure && event.reason !== marker) return;
			event.preventDefault();
			event.stopImmediatePropagation();
			if (event.reason === marker) resolve();
			else events.push(event.reason);
		};
		window.addEventListener('unhandledrejection', observe, true);
		try {
			const asked = new Set<() => boolean>();
			const resumed = Promise.resolve(true).then(() => {
				throw failure;
			});
			const answer = answerPress(asked, answerPress(asked, resumed));
			if (catches) {
				await expect(answer).rejects.toBe(failure);
			}

			// A marker in the next task arrives after the traversal's rejection events.
			await new Promise((done) => {
				setTimeout(done, 0);
			});
			void Promise.reject(marker);
			await settled;
			expect(events).toEqual(reports === 0 ? [] : [failure]);
		} finally {
			window.removeEventListener('unhandledrejection', observe, true);
		}
	},
);
