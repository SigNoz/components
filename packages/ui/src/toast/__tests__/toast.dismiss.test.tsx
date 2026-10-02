import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { toast } from '../toast.js';
import { Toaster } from '../toaster.js';
import { advance, findToast, raise, slot, toasts } from './toast.test-utils.js';

describe('toast dismissing', () => {
	describe('toast.dismiss', () => {
		it('closes one toast by id and every toast without one', async () => {
			render(<Toaster />);
			raise(() => {
				toast.info('One', { id: 'one' });
				toast.info('Two', { id: 'two' });
				toast.info('Three', { id: 'three' });
			});
			await findToast('Three');

			raise(() => toast.dismiss('one'));
			await vi.waitFor(() => expect(toasts()).toHaveLength(2));
			expect(slot('toast-title')).toHaveTextContent('Three');

			raise(() => toast.dismiss());
			await vi.waitFor(() => expect(toasts()).toHaveLength(0));
		});

		it('does nothing for an id no toast has', async () => {
			render(<Toaster />);
			raise(() => toast.info('Stays', { id: 'stays' }));
			await findToast('Stays');

			raise(() => toast.dismiss('missing'));

			expect(toasts()).toHaveLength(1);
		});
	});

	describe('timeout', () => {
		beforeEach(() => {
			vi.useFakeTimers({ shouldAdvanceTime: true });
		});

		afterEach(() => {
			vi.useRealTimers();
		});

		it.each([['success'], ['info'], ['warning']] as const)(
			'closes %s on its own after five seconds',
			async (variant) => {
				render(<Toaster />);
				raise(() => toast[variant]('Brief'));
				await findToast('Brief');

				await advance(4900);
				expect(toasts()).toHaveLength(1);

				await advance(200);
				await vi.waitFor(() => expect(toasts()).toHaveLength(0));
			},
		);

		it.each([
			['danger', () => toast.danger('Stays', { action: { label: 'Close' } })],
			['loading', () => toast.loading('Stays')],
			['a toast with an action', () => toast.success('Stays', { action: { label: 'Undo' } })],
		])('keeps %s until it is dismissed', async (_name, call) => {
			render(<Toaster />);
			raise(call);
			await findToast('Stays');

			await advance(20_000);

			expect(toasts()).toHaveLength(1);
		});

		it('takes the timeout of the Toaster', async () => {
			render(<Toaster timeout={1000} />);
			raise(() => toast.success('Brief'));
			await findToast('Brief');

			await advance(900);
			expect(toasts()).toHaveLength(1);

			await advance(200);
			await vi.waitFor(() => expect(toasts()).toHaveLength(0));
		});

		it('keeps every toast with a timeout of 0', async () => {
			render(<Toaster timeout={0} />);
			raise(() => toast.success('Stays'));
			await findToast('Stays');

			await advance(20_000);

			expect(toasts()).toHaveLength(1);
		});

		it('keeps a danger toast whatever the timeout of the Toaster', async () => {
			render(<Toaster timeout={1000} />);
			raise(() => toast.danger('Stays', { action: { label: 'Close' } }));
			await findToast('Stays');

			await advance(20_000);

			expect(toasts()).toHaveLength(1);
		});

		it('restarts the timer when the same toast is raised again', async () => {
			render(<Toaster />);
			raise(() => toast.success('Copied'));
			await findToast('Copied');

			await advance(4000);
			raise(() => toast.success('Copied'));
			await advance(4000);
			expect(toasts()).toHaveLength(1);

			await advance(1100);
			await vi.waitFor(() => expect(toasts()).toHaveLength(0));
		});

		it('pauses while the pointer is over the stack, and spreads it', async () => {
			const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
			render(<Toaster />);
			raise(() => {
				toast.success('First');
				toast.success('Second');
			});
			const item = await findToast('Second');

			await user.hover(item);
			await advance(20_000);

			expect(toasts()).toHaveLength(2);
			for (const each of toasts()) expect(each).toHaveAttribute('data-expanded');

			await user.unhover(item);
			await vi.waitFor(() => expect(item).not.toHaveAttribute('data-expanded'));
			await advance(5100);
			await vi.waitFor(() => expect(toasts()).toHaveLength(0));
		});
	});
});
