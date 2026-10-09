import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { ToastPositionType } from '../index.js';
import { toast } from '../toast.js';
import { Toaster } from '../toaster.js';
import { findToast, raise, toasts } from './toast.test-utils.js';

function stackOf(element: HTMLElement): string | null | undefined {
	return element.closest('[data-slot="toaster"]')?.getAttribute('data-position');
}

function viewport(position: ToastPositionType): HTMLElement {
	return document.querySelector(
		`[data-slot="toaster"][data-position="${position}"]`,
	) as HTMLElement;
}

describe('toast position', () => {
	it('draws one stack per position, the one of the Toaster first', () => {
		render(<Toaster position="bottom-left" />);

		const stacks = [...document.querySelectorAll('[data-slot="toaster"]')];
		expect(stacks.map((stack) => stack.getAttribute('data-position'))).toEqual([
			'bottom-left',
			'top-left',
			'top-center',
			'top-right',
			'bottom-center',
			'bottom-right',
		]);
	});

	it('puts a toast with no position in the stack of the Toaster', async () => {
		render(<Toaster position="bottom-center" />);
		raise(() => toast.info('Saved'));

		expect(stackOf(await findToast('Saved'))).toBe('bottom-center');
	});

	it.each<ToastPositionType>([
		'top-left',
		'top-center',
		'top-right',
		'bottom-left',
		'bottom-center',
		'bottom-right',
	])('puts a toast raised with %s in that stack', async (position) => {
		render(<Toaster />);
		raise(() => toast.info('Copied', { position }));

		expect(stackOf(await findToast('Copied'))).toBe(position);
	});

	it('keeps a limit per stack', async () => {
		render(<Toaster limit={1} />);
		raise(() => {
			toast.info('Right');
			toast.info('Left', { position: 'bottom-left' });
		});
		await findToast('Left');

		expect(toasts().filter((item) => item.hasAttribute('data-limited'))).toHaveLength(0);
	});

	describe('a toast with the id of a visible one', () => {
		it('updates it where it is when the call names no position', async () => {
			render(<Toaster />);
			raise(() => toast.loading('Saving', { id: 'save', position: 'bottom-left' }));
			await findToast('Saving');

			raise(() => toast.success('Saved', { id: 'save' }));
			const item = await findToast('Saved');

			expect(stackOf(item)).toBe('bottom-left');
			expect(toasts()).toHaveLength(1);
		});

		it('moves it when the call names another position', async () => {
			render(<Toaster />);
			raise(() => toast.info('Copied', { id: 'copy', position: 'bottom-left' }));
			const before = await findToast('Copied');

			raise(() => toast.info('Copied', { id: 'copy', position: 'top-center' }));

			await vi.waitFor(() => expect(before).not.toBeInTheDocument());
			expect(stackOf(await findToast('Copied'))).toBe('top-center');
		});

		it('goes to the stack of the Toaster once the first one is closed', async () => {
			render(<Toaster />);
			raise(() => toast.info('Copied', { id: 'copy', position: 'bottom-left' }));
			await findToast('Copied');
			raise(() => toast.dismiss('copy'));
			await vi.waitFor(() => expect(toasts()).toHaveLength(0));

			raise(() => toast.info('Copied', { id: 'copy' }));

			expect(stackOf(await findToast('Copied'))).toBe('top-right');
		});
	});

	it('follows a promise in the stack it was raised in', async () => {
		render(<Toaster />);
		let resolve!: () => void;
		raise(() =>
			toast.promise(new Promise<void>((done) => (resolve = done)), {
				loading: 'Saving',
				success: 'Saved',
				error: 'Failed',
				errorAction: { label: 'Close' },
				position: 'bottom-right',
			}),
		);
		expect(stackOf(await findToast('Saving'))).toBe('bottom-right');

		raise(() => resolve());

		expect(stackOf(await findToast('Saved'))).toBe('bottom-right');
		expect(toasts()).toHaveLength(1);
	});

	it('dismisses a toast by id in any stack, and every stack with no id', async () => {
		render(<Toaster />);
		raise(() => {
			toast.info('Left', { id: 'left', position: 'bottom-left' });
			toast.info('Right', { id: 'right' });
			toast.info('Centre', { id: 'centre', position: 'top-center' });
		});
		await findToast('Centre');

		raise(() => toast.dismiss('left'));
		await vi.waitFor(() => expect(toasts()).toHaveLength(2));

		raise(() => toast.dismiss());
		await vi.waitFor(() => expect(toasts()).toHaveLength(0));
	});

	it('forgets a toast raised before the Toaster mounted', async () => {
		// Lost: no Toaster is listening.
		raise(() => toast.info('Copied', { id: 'copy', position: 'bottom-left' }));
		render(<Toaster />);

		raise(() => toast.info('Copied', { id: 'copy' }));

		expect(stackOf(await findToast('Copied'))).toBe('top-right');
	});

	describe('landmarks', () => {
		it('lists the stack of the Toaster only while the others are empty', () => {
			render(<Toaster />);

			expect(screen.getAllByRole('region')).toEqual([viewport('top-right')]);
		});

		it('lists another stack while it holds a toast, and keeps it a live region', async () => {
			render(<Toaster />);
			expect(viewport('bottom-left')).toHaveAttribute('aria-live', 'polite');

			raise(() => toast.info('Copied', { position: 'bottom-left' }));
			await findToast('Copied');

			expect(screen.getAllByRole('region', { name: 'Notifications' })).toEqual([
				viewport('top-right'),
				viewport('bottom-left'),
			]);
		});
	});

	describe('test ids', () => {
		it('suffixes the position of the other stacks', () => {
			render(<Toaster testId="toaster" />);

			expect(screen.getByTestId('toaster')).toBe(viewport('top-right'));
			expect(screen.getByTestId('toaster-bottom-left')).toBe(viewport('bottom-left'));
		});

		it('suffixes a raw data-testid the same way', () => {
			render(<Toaster data-testid="raw" />);

			expect(screen.getByTestId('raw')).toBe(viewport('top-right'));
			expect(screen.getByTestId('raw-top-left')).toBe(viewport('top-left'));
		});
	});
});
