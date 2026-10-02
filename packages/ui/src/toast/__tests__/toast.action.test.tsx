import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { MouseEvent } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { toast } from '../toast.js';
import { Toaster } from '../toaster.js';
import { actionButton, findToast, raise, slot, toasts } from './toast.test-utils.js';

describe('toast action', () => {
	describe('rendering', () => {
		it('is a button named by its label, with its own slot and test id', async () => {
			render(<Toaster testId="my-toaster" />);
			raise(() => toast.success('Saved', { id: 'one', action: { label: 'Undo' } }));

			const action = await screen.findByTestId('my-toaster-toast-one-action');
			expect(action.tagName).toBe('BUTTON');
			expect(action).toHaveAttribute('type', 'button');
			expect(action).toHaveAttribute('data-slot', 'toast-action');
			expect(action).toHaveTextContent('Undo');
			expect(action).toHaveAttribute('data-type', 'success');
		});

		it('takes a ReactNode label', async () => {
			render(<Toaster />);
			raise(() =>
				toast.info('Saved', {
					action: {
						label: (
							<>
								<svg aria-hidden="true" /> Undo
							</>
						),
					},
				}),
			);

			await findToast('Saved');
			expect(actionButton(' Undo')?.querySelector('svg')).not.toBeNull();
		});

		it.each([['success'], ['info'], ['warning'], ['loading']] as const)(
			'is not rendered for %s unless the toast is given one',
			async (variant) => {
				render(<Toaster />);
				raise(() => toast[variant]('Plain'));

				await findToast('Plain');
				expect(slot('toast-action')).toBeNull();
			},
		);

		// The types require an action on danger. Untyped code can still skip it, and there is no
		// default label to fall back to.
		it('is not rendered for a danger toast raised without one', async () => {
			render(<Toaster />);
			raise(() => (toast.danger as (title: string) => string)('Broken'));

			await findToast('Broken');
			expect(slot('toast-action')).toBeNull();
		});

		it('takes the label of the action on a danger toast', async () => {
			render(<Toaster />);
			raise(() => toast.danger('Broken', { action: { label: 'Dismiss' } }));

			await findToast('Broken');
			expect(slot('toast-action')).toHaveTextContent('Dismiss');
		});
	});

	describe('activation', () => {
		it('runs onClick once, then closes the toast', async () => {
			const user = userEvent.setup();
			const onClick = vi.fn();
			render(<Toaster />);
			raise(() => toast.success('Panel deleted', { action: { label: 'Undo', onClick } }));
			await findToast('Panel deleted');

			await user.click(slot('toast-action') as HTMLElement);

			expect(onClick).toHaveBeenCalledOnce();
			await vi.waitFor(() => expect(toasts()).toHaveLength(0));
		});

		it('closes the toast when it has no onClick', async () => {
			const user = userEvent.setup();
			render(<Toaster />);
			raise(() => toast.info('Heads up', { action: { label: 'Cancel' } }));
			await findToast('Heads up');

			await user.click(slot('toast-action') as HTMLElement);

			await vi.waitFor(() => expect(toasts()).toHaveLength(0));
		});

		it('closes a danger toast from its button', async () => {
			const user = userEvent.setup();
			render(<Toaster />);
			raise(() => toast.danger('Broken', { action: { label: 'Close' } }));
			await findToast('Broken');

			await user.click(actionButton('Close') as HTMLElement);

			await vi.waitFor(() => expect(toasts()).toHaveLength(0));
		});

		it('keeps the toast open when onClick calls preventDefault', async () => {
			const user = userEvent.setup();
			const onClick = vi.fn((event: MouseEvent<HTMLButtonElement>) => event.preventDefault());
			render(<Toaster />);
			raise(() => toast.success('Panel deleted', { action: { label: 'Undo', onClick } }));
			await findToast('Panel deleted');

			await user.click(slot('toast-action') as HTMLElement);
			await new Promise((done) => setTimeout(done, 50));

			expect(onClick).toHaveBeenCalledOnce();
			expect(toasts()).toHaveLength(1);

			// The next press without the veto closes it.
			onClick.mockImplementation(() => {});
			await user.click(slot('toast-action') as HTMLElement);
			await vi.waitFor(() => expect(toasts()).toHaveLength(0));
		});

		it('closes only its own toast', async () => {
			const user = userEvent.setup();
			render(<Toaster />);
			raise(() => {
				toast.info('Keep', { action: { label: 'Keep it' } });
				toast.info('Drop', { action: { label: 'Drop it' } });
			});
			await findToast('Drop');

			await user.click(actionButton('Drop it') as HTMLElement);

			await vi.waitFor(() => expect(toasts()).toHaveLength(1));
			expect(slot('toast-title')).toHaveTextContent('Keep');
		});

		it.each([
			['Enter', '{Enter}'],
			['Space', ' '],
		])('fires on %s', async (_name, key) => {
			const user = userEvent.setup();
			const onClick = vi.fn();
			render(<Toaster />);
			raise(() => toast.success('Panel deleted', { action: { label: 'Undo', onClick } }));
			await findToast('Panel deleted');

			slot('toast-action')?.focus();
			await user.keyboard(key);

			expect(onClick).toHaveBeenCalledOnce();
			await vi.waitFor(() => expect(toasts()).toHaveLength(0));
		});
	});
});
