import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { toast } from '../toast.js';
import { Toaster } from '../toaster.js';
import { findToast, raise, toasts } from './toast.test-utils.js';

describe('toast deduplication', () => {
	it('merges calls with the same variant and title into one toast', async () => {
		render(<Toaster />);
		raise(() => {
			toast.info('Copied to clipboard');
			toast.info('Copied to clipboard');
			toast.info('Copied to clipboard');
		});

		await findToast('Copied to clipboard');
		expect(toasts()).toHaveLength(1);
	});

	it('keeps two toasts apart when the variant or the title differs', async () => {
		render(<Toaster />);
		raise(() => {
			toast.info('Same');
			toast.success('Same');
			toast.info('Other');
		});

		await findToast('Other');
		expect(toasts()).toHaveLength(3);
	});

	it('keeps ReactNode titles apart, since there is no string to derive an id from', async () => {
		render(<Toaster />);
		raise(() => {
			toast.info(<span>Node</span>);
			toast.info(<span>Node</span>);
		});

		await vi.waitFor(() => expect(toasts()).toHaveLength(2));
	});

	it('keeps two toasts with the same title apart when their ids differ', async () => {
		render(<Toaster />);
		raise(() => {
			toast.info('Same', { id: 'a' });
			toast.info('Same', { id: 'b' });
		});

		await vi.waitFor(() => expect(toasts()).toHaveLength(2));
	});

	it('updates a visible toast in place when the id repeats, even across variants', async () => {
		render(<Toaster />);
		raise(() => toast.loading('Saving', { id: 'save' }));
		await findToast('Saving');

		raise(() => toast.success('Saved', { id: 'save', description: 'Done' }));

		const item = await findToast('Saved');
		expect(toasts()).toHaveLength(1);
		expect(item).toHaveAttribute('data-type', 'success');
		expect(item).toHaveTextContent('Done');
	});

	it('returns the id it used', () => {
		render(<Toaster />);

		expect(raise(() => toast.info('Hello'))).toBe('info:Hello');
		expect(raise(() => toast.info('Hello again', { id: 'mine' }))).toBe('mine');
		expect(raise(() => toast.info(<span>Node</span>))).not.toBe('');
	});
});
