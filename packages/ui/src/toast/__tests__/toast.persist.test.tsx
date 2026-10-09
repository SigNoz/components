import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { CSSProperties } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PersistToastsProvider } from '../../testing/index.js';
import { toast } from '../toast.js';
import { Toaster } from '../toaster.js';
import {
	actionButton,
	advance,
	findToast,
	raise,
	slot,
	titles,
	toasts,
} from './toast.test-utils.js';

// A closing toast stays in the DOM while it fades out, so a count alone would miss a timer that
// fired. Base UI marks it with `data-ending-style` from the moment it starts to close.
function open(): HTMLElement[] {
	return toasts().filter((item) => !item.hasAttribute('data-ending-style'));
}

describe('Toaster under PersistToastsProvider', () => {
	describe('timeout', () => {
		beforeEach(() => {
			vi.useFakeTimers({ shouldAdvanceTime: true });
		});

		afterEach(() => {
			vi.useRealTimers();
		});

		it.each([['success'], ['info'], ['warning']] as const)(
			'keeps %s on screen past the timeout',
			async (variant) => {
				render(<Toaster timeout={1000} />, { wrapper: PersistToastsProvider });
				raise(() => toast[variant]('Stays'));
				await findToast('Stays');

				await advance(20_000);

				expect(open()).toHaveLength(1);
			},
		);

		// Base UI prefers the `timeout` of a toast to the one of its `Provider`.
		it('keeps a toast raised with a timeout of its own on screen, in any position', async () => {
			render(<Toaster />, { wrapper: PersistToastsProvider });
			raise(() => {
				toast.success('Stays', { timeout: 1000 });
				toast.info('Stays too', { timeout: 1000, position: 'bottom-left' });
			});
			await findToast('Stays too');

			await advance(20_000);

			expect(open()).toHaveLength(2);
		});

		it('keeps the result of a promise on screen', async () => {
			render(<Toaster />, { wrapper: PersistToastsProvider });
			let resolve!: () => void;
			const promise = new Promise<void>((res) => {
				resolve = res;
			});
			raise(() =>
				toast.promise(promise, {
					loading: 'Saving',
					success: 'Saved',
					error: 'Could not save',
					errorAction: { label: 'Close' },
				}),
			);
			await findToast('Saving');

			await act(async () => resolve());
			await findToast('Saved');
			await advance(20_000);

			expect(titles()).toEqual(['Saved']);
			expect(open()).toHaveLength(1);
		});

		it('leaves a Toaster outside it as it is', async () => {
			render(
				<>
					<PersistToastsProvider>
						<Toaster aria-label="Kept" timeout={1000} />
					</PersistToastsProvider>
					<Toaster aria-label="Plain" timeout={1000} />
				</>,
			);
			raise(() => toast.success('Brief'));
			await vi.waitFor(() => expect(toasts()).toHaveLength(2));

			await advance(1100);

			expect(open()).toHaveLength(1);
			const kept = screen.getByRole('region', { name: 'Kept' });
			expect(kept).toContainElement(open()[0] as HTMLElement);
		});
	});

	it('shows every toast, whatever the limit', async () => {
		render(<Toaster limit={1} />, { wrapper: PersistToastsProvider });
		raise(() => {
			for (const n of [1, 2, 3, 4, 5]) toast.info(`Toast ${n}`);
		});
		await findToast('Toast 5');

		expect(toasts()).toHaveLength(5);
		expect(toasts().filter((item) => item.hasAttribute('data-limited'))).toHaveLength(0);
	});

	// The stack gap is a design token, which the tests do not load, so the test sets its own.
	it('spreads the stack without a hover', async () => {
		render(<Toaster style={{ '--toast-stack-gap': '8px' } as CSSProperties} />, {
			wrapper: PersistToastsProvider,
		});
		raise(() => {
			toast.info('Old', {
				description: 'Two lines, so it is taller than the newest toast.',
				action: { label: 'Undo' },
			});
			toast.info('New');
		});
		const old = await findToast('Old');
		const newest = await findToast('New');

		await vi.waitFor(() => {
			expect(old.getBoundingClientRect().top).toBeGreaterThanOrEqual(
				newest.getBoundingClientRect().bottom,
			);
			expect(getComputedStyle(slot('toast-content', old) as HTMLElement).opacity).toBe('1');
			expect(getComputedStyle(slot('toast-action', old) as HTMLElement).opacity).toBe('1');
		});
		expect(slot('toast-description', old)).toBeVisible();
	});

	it('exposes the button of each toast to assistive technology', async () => {
		render(<Toaster />, { wrapper: PersistToastsProvider });
		raise(() => toast.success('Saved', { action: { label: 'Undo' } }));
		await findToast('Saved');

		expect(screen.getByRole('button', { name: 'Undo' })).toBe(actionButton('Undo'));
	});

	it('still closes a toast from its button and from toast.dismiss', async () => {
		const user = userEvent.setup();
		render(<Toaster />, { wrapper: PersistToastsProvider });
		raise(() => {
			toast.success('Saved', { action: { label: 'Undo' } });
			toast.info('Copied');
		});
		await findToast('Copied');

		await user.click(screen.getByRole('button', { name: 'Undo' }));
		await vi.waitFor(() => expect(titles()).toEqual(['Copied']));

		raise(() => toast.dismiss());
		await vi.waitFor(() => expect(toasts()).toHaveLength(0));
	});
});
