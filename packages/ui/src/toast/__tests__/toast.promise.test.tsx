import { act, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { toast } from '../toast.js';
import { Toaster } from '../toaster.js';
import { advance, raise, slot, titles, toasts } from './toast.test-utils.js';

function deferred<Value>() {
	let resolve!: (value: Value) => void;
	let reject!: (reason: unknown) => void;
	const promise = new Promise<Value>((res, rej) => {
		resolve = res;
		reject = rej;
	});

	return { promise, resolve, reject };
}

const OPTIONS = {
	loading: 'Saving',
	success: 'Saved',
	error: 'Could not save',
	errorAction: { label: 'Dismiss' },
};

async function title(text: string) {
	await vi.waitFor(() => expect(slot('toast-title')).toHaveTextContent(text));
}

describe('toast.promise', () => {
	it('shows a loading toast, then turns it into a success toast', async () => {
		render(<Toaster />);
		const { promise, resolve } = deferred<void>();
		raise(() => toast.promise(promise, OPTIONS));

		await title('Saving');
		expect(toasts()[0]).toHaveAttribute('data-type', 'loading');

		await act(async () => resolve());

		await title('Saved');
		expect(toasts()).toHaveLength(1);
		expect(toasts()[0]).toHaveAttribute('data-type', 'success');
		expect(slot('toast-action')).toBeNull();
	});

	it('turns it into a danger toast with the errorAction button when the promise rejects', async () => {
		render(<Toaster />);
		const { promise, reject } = deferred<void>();
		raise(() => toast.promise(promise, OPTIONS));

		await act(async () => reject(new Error('nope')));

		await title('Could not save');
		expect(toasts()).toHaveLength(1);
		expect(toasts()[0]).toHaveAttribute('data-type', 'danger');
		expect(slot('toast-action')).toHaveTextContent('Dismiss');
	});

	it('passes the result and the reason to the title functions', async () => {
		render(<Toaster />);
		const ok = deferred<number>();
		raise(() =>
			toast.promise(ok.promise, {
				loading: 'Saving',
				success: (rows) => `Saved ${rows} rows`,
				error: 'x',
				errorAction: { label: 'Close' },
			}),
		);
		await act(async () => ok.resolve(3));
		await title('Saved 3 rows');

		raise(() => toast.dismiss());
		const bad = deferred<number>();
		raise(() =>
			toast.promise(bad.promise, {
				loading: 'Saving',
				success: 'x',
				error: (reason) => `Failed: ${(reason as Error).message}`,
				errorAction: { label: 'Close' },
			}),
		);
		await act(async () => bad.reject(new Error('disk full')));
		await title('Failed: disk full');
	});

	it('returns the promise it was given', async () => {
		render(<Toaster />);
		const { promise, resolve } = deferred<string>();
		const returned = raise(() => toast.promise(promise, OPTIONS));

		expect(returned).toBe(promise);
		await act(async () => resolve('done'));
		await expect(returned).resolves.toBe('done');
	});

	it('still rejects for a caller that awaits it', async () => {
		render(<Toaster />);
		const { promise, reject } = deferred<void>();
		const returned = raise(() => toast.promise(promise, OPTIONS));
		const outcome = expect(returned).rejects.toThrow('nope');

		await act(async () => reject(new Error('nope')));

		await outcome;
	});

	it('does not report a rejection nobody awaits as unhandled', async () => {
		render(<Toaster />);
		const reasons: unknown[] = [];
		const onUnhandled = (event: PromiseRejectionEvent) => {
			reasons.push(event.reason);
			event.preventDefault();
		};
		window.addEventListener('unhandledrejection', onUnhandled);
		try {
			const { promise, reject } = deferred<void>();
			raise(() => toast.promise(promise, OPTIONS));
			await act(async () => reject(new Error('nope')));
			// Unhandled rejections are reported after the microtask queue drains.
			await new Promise((resolve) => setTimeout(resolve, 50));
		} finally {
			window.removeEventListener('unhandledrejection', onUnhandled);
		}

		expect(reasons).toEqual([]);
	});

	it('closes the toast and reports the error when a title function throws', async () => {
		render(<Toaster />);
		const reasons: unknown[] = [];
		const onUnhandled = (event: PromiseRejectionEvent) => {
			reasons.push(event.reason);
			event.preventDefault();
		};
		window.addEventListener('unhandledrejection', onUnhandled);
		const thrown = new TypeError('no profile');
		try {
			const { promise, resolve } = deferred<void>();
			const returned = raise(() =>
				toast.promise(promise, {
					...OPTIONS,
					success: () => {
						throw thrown;
					},
				}),
			);
			await title('Saving');

			await act(async () => resolve());

			await vi.waitFor(() => expect(toasts()).toHaveLength(0));
			await expect(returned).resolves.toBeUndefined();
			await vi.waitFor(() => expect(reasons).toEqual([thrown]));
		} finally {
			window.removeEventListener('unhandledrejection', onUnhandled);
		}
	});

	it('closes the toast when the error title function throws', async () => {
		render(<Toaster />);
		const reasons: unknown[] = [];
		const onUnhandled = (event: PromiseRejectionEvent) => {
			reasons.push(event.reason);
			event.preventDefault();
		};
		window.addEventListener('unhandledrejection', onUnhandled);
		try {
			const { promise, reject } = deferred<void>();
			raise(() =>
				toast.promise(promise, {
					...OPTIONS,
					error: () => {
						throw new TypeError('no message');
					},
				}),
			);
			await title('Saving');

			await act(async () => reject(new Error('nope')));

			await vi.waitFor(() => expect(toasts()).toHaveLength(0));
			await vi.waitFor(() => expect(reasons).toHaveLength(1));
		} finally {
			window.removeEventListener('unhandledrejection', onUnhandled);
		}
	});

	it('keeps two promises with the same loading title as two toasts', async () => {
		render(<Toaster />);
		const first = deferred<void>();
		const second = deferred<void>();
		raise(() => {
			toast.promise(first.promise, { ...OPTIONS, success: 'First saved' });
			toast.promise(second.promise, { ...OPTIONS, success: 'Second saved' });
		});

		await vi.waitFor(() => expect(toasts()).toHaveLength(2));
		await act(async () => second.resolve());

		await vi.waitFor(() => expect(titles()).toEqual(['Second saved', 'Saving']));
	});

	it('does not bring back a toast dismissed while the promise is pending', async () => {
		render(<Toaster />);
		const { promise, resolve } = deferred<void>();
		raise(() => toast.promise(promise, OPTIONS));
		await title('Saving');

		raise(() => toast.dismiss());
		await vi.waitFor(() => expect(toasts()).toHaveLength(0));
		await act(async () => resolve());
		await new Promise((done) => setTimeout(done, 50));

		expect(toasts()).toHaveLength(0);
	});

	it('shows nothing once it settles on an empty title', async () => {
		render(<Toaster />);
		const { promise, resolve } = deferred<void>();
		raise(() => toast.promise(promise, { ...OPTIONS, success: '' }));
		await title('Saving');

		await act(async () => resolve());

		await vi.waitFor(() => expect(toasts()).toHaveLength(0));
	});

	// An empty toast left in the stack takes the front place, so the toast behind it would draw
	// as an empty box.
	it('leaves the toast before it in front once it settles on an empty title', async () => {
		render(<Toaster />);
		raise(() => toast.success('Copied'));
		const { promise, reject } = deferred<void>();
		raise(() => toast.promise(promise, { ...OPTIONS, error: () => '' }));
		await vi.waitFor(() => expect(titles()).toEqual(['Saving', 'Copied']));

		await act(async () => reject(new Error('')));

		await vi.waitFor(() => expect(titles()).toEqual(['Copied']));
		const copied = toasts()[0] as HTMLElement;
		await vi.waitFor(() => expect(copied.style.getPropertyValue('--toast-index')).toBe('0'));
		expect(slot('toast-content', copied)).not.toHaveAttribute('data-behind');
	});

	it('shows no loading toast for an empty loading title, then the result', async () => {
		render(<Toaster />);
		const { promise, resolve } = deferred<void>();
		raise(() => toast.promise(promise, { ...OPTIONS, loading: '' }));
		await new Promise((done) => setTimeout(done, 50));
		expect(toasts()).toHaveLength(0);

		await act(async () => resolve());

		await title('Saved');
		expect(toasts()[0]).toHaveAttribute('data-type', 'success');
	});

	it('turns the visible toast with its id into the loading toast', async () => {
		render(<Toaster />);
		raise(() => toast.info('Queued', { id: 'save' }));
		await title('Queued');
		const { promise, resolve } = deferred<void>();

		const returned = raise(() => toast.promise(promise, { ...OPTIONS, id: 'save' }));
		await title('Saving');
		expect(toasts()).toHaveLength(1);

		await act(async () => resolve());
		await title('Saved');
		expect(toasts()).toHaveLength(1);
		expect(returned).toBe(promise);
	});

	it('keeps its testId in every state', async () => {
		render(<Toaster testId="toaster" />);
		const { promise, reject } = deferred<void>();
		raise(() => toast.promise(promise, { ...OPTIONS, testId: 'save-toast' }));
		await title('Saving');
		expect(toasts()[0]).toHaveAttribute('data-testid', 'save-toast');

		await act(async () => reject(new Error('nope')));

		await title('Could not save');
		expect(toasts()[0]).toHaveAttribute('data-testid', 'save-toast');
		expect(slot('toast-action')).toHaveAttribute('data-testid', 'save-toast-action');
	});

	describe('timeout', () => {
		beforeEach(() => {
			vi.useFakeTimers({ shouldAdvanceTime: true });
		});

		afterEach(() => {
			vi.useRealTimers();
		});

		it('keeps the loading toast while the promise is pending', async () => {
			render(<Toaster timeout={1000} />);
			raise(() => toast.promise(deferred<void>().promise, OPTIONS));
			await title('Saving');

			await advance(20_000);

			expect(toasts()).toHaveLength(1);
		});

		it('closes the success toast after the timeout of the Toaster', async () => {
			render(<Toaster timeout={1000} />);
			const { promise, resolve } = deferred<void>();
			raise(() => toast.promise(promise, OPTIONS));
			await act(async () => resolve());
			await title('Saved');

			await advance(900);
			expect(toasts()).toHaveLength(1);

			await advance(200);
			await vi.waitFor(() => expect(toasts()).toHaveLength(0));
		});

		it('keeps the danger toast once the promise rejects', async () => {
			render(<Toaster timeout={1000} />);
			const { promise, reject } = deferred<void>();
			raise(() => toast.promise(promise, OPTIONS));
			await act(async () => reject(new Error('nope')));
			await title('Could not save');

			await advance(20_000);

			expect(toasts()).toHaveLength(1);
		});
	});
});
