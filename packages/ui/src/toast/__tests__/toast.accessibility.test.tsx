import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { toast } from '../toast.js';
import { Toaster } from '../toaster.js';
import { actionButton, findToast, raise, slot } from './toast.test-utils.js';

describe('toast accessibility', () => {
	it('renders the viewport as a landmark named Notifications', () => {
		render(<Toaster />);

		expect(screen.getByRole('region', { name: 'Notifications' })).toBe(slot('toaster'));
	});

	it('lets a caller name the landmark itself', () => {
		render(<Toaster aria-label="Alerts" />);

		expect(screen.getByRole('region', { name: 'Alerts' })).toBeInTheDocument();
	});

	it('announces danger assertively and the rest politely', async () => {
		render(<Toaster />);
		raise(() => {
			toast.info('Polite');
			toast.danger('Assertive', { action: { label: 'Close' } });
		});
		await findToast('Assertive');

		expect(slot('toaster')).toHaveAttribute('aria-live', 'polite');
		await vi.waitFor(() =>
			expect(document.querySelector('[role="alert"]')).toHaveTextContent('Assertive'),
		);
		expect(document.querySelector('[role="alert"]')).not.toHaveTextContent('Polite');
	});

	it('hides the icon from assistive technology', async () => {
		render(<Toaster />);
		raise(() => toast.warning('Careful'));

		await findToast('Careful');
		expect(slot('toast-icon')).toHaveAttribute('aria-hidden', 'true');
	});

	it('names each toast by its title', async () => {
		render(<Toaster />);
		raise(() => toast.success('Panel saved', { description: 'It is on the dashboard.' }));

		await findToast('Panel saved');
		expect(screen.getByRole('dialog', { name: 'Panel saved' })).toBe(slot('toast'));
	});

	// Base UI keeps the button out of the accessibility tree while the stack is collapsed, and a
	// danger toast with it, which the alert region announces instead. Focus brings both back.
	it('exposes the button of a toast once it has focus', async () => {
		render(<Toaster />);
		raise(() => toast.success('Saved', { action: { label: 'Undo' } }));
		await findToast('Saved');
		const button = actionButton('Undo') as HTMLElement;
		expect(screen.queryByRole('button', { name: 'Undo' })).toBeNull();

		act(() => button.focus());

		expect(screen.getByRole('button', { name: 'Undo' })).toBe(button);
	});

	it('exposes a danger toast and its Close button once focus is inside the stack', async () => {
		const user = userEvent.setup();
		render(<Toaster />);
		raise(() => toast.danger('Broken', { action: { label: 'Close' } }));
		await findToast('Broken');
		expect(screen.queryByRole('alertdialog')).toBeNull();

		await user.keyboard('{F6}');
		await user.tab();

		expect(screen.getByRole('alertdialog', { name: 'Broken' })).toBe(slot('toast'));
		await user.tab();
		expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus();
	});

	describe('focus', () => {
		it('takes no focus when a toast arrives', async () => {
			render(
				<>
					<button type="button">Page</button>
					<Toaster />
				</>,
			);
			const page = screen.getByRole('button', { name: 'Page' });
			page.focus();
			raise(() => toast.success('Saved', { action: { label: 'Undo' } }));
			await findToast('Saved');

			expect(page).toHaveFocus();
		});

		it('moves focus to the viewport on F6', async () => {
			const user = userEvent.setup();
			render(
				<>
					<button type="button">Page</button>
					<Toaster />
				</>,
			);
			screen.getByRole('button', { name: 'Page' }).focus();
			raise(() => toast.success('Saved', { action: { label: 'Undo' } }));
			await findToast('Saved');

			await user.keyboard('{F6}');

			expect(slot('toaster')).toHaveFocus();
		});

		it('reaches the button of each toast with Tab, newest first', async () => {
			const user = userEvent.setup();
			render(<Toaster />);
			raise(() => {
				toast.info('Old', { action: { label: 'Old action' } });
				toast.info('New', { action: { label: 'New action' } });
			});
			await findToast('Old');

			await user.keyboard('{F6}');
			const reached: string[] = [];
			for (let step = 0; step < 6; step += 1) {
				await user.tab();
				const label = document.activeElement?.textContent ?? '';
				if (document.activeElement?.matches('[data-slot="toast-action"]')) reached.push(label);
			}

			expect(reached.slice(0, 2)).toEqual(['New action', 'Old action']);
		});
	});
});
