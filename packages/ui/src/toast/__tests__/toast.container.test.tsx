import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Dialog, DialogContent, DialogTitle } from '../../dialog/index.js';
import { Drawer, DrawerContent, DrawerTitle } from '../../drawer/index.js';
import { Toaster } from '../toaster.js';
import { toast } from '../toast.js';
import { slot } from './toast.test-utils.js';

describe('Toaster container', () => {
	it('portals into document.body by default', () => {
		render(<Toaster />);

		expect(slot('toaster')?.closest('[data-base-ui-portal]')?.parentElement).toBe(document.body);
	});

	it('portals into the element it is given', () => {
		const host = document.createElement('div');
		document.body.append(host);
		try {
			render(<Toaster container={host} />);

			expect(host.contains(slot('toaster'))).toBe(true);
		} finally {
			host.remove();
		}
	});

	it('portals into the panel of the dialog it sits in', () => {
		render(
			<Dialog open>
				<DialogContent>
					<DialogTitle>Settings</DialogTitle>
					<Toaster />
				</DialogContent>
			</Dialog>,
		);

		expect(document.querySelector('[data-slot="dialog-content"]')?.contains(slot('toaster'))).toBe(
			true,
		);
	});

	it('portals into the panel of the drawer it sits in', () => {
		render(
			<Drawer open>
				<DrawerContent>
					<DrawerTitle>Settings</DrawerTitle>
					<Toaster />
				</DrawerContent>
			</Drawer>,
		);

		expect(document.querySelector('[data-slot="drawer-content"]')?.contains(slot('toaster'))).toBe(
			true,
		);
	});

	it('stays above a dialog', () => {
		render(
			<>
				<Toaster />
				<Dialog open>
					<DialogContent>
						<DialogTitle>Settings</DialogTitle>
					</DialogContent>
				</Dialog>
			</>,
		);

		const toaster = Number(getComputedStyle(slot('toaster') as HTMLElement).zIndex);
		const overlay = Number(
			getComputedStyle(document.querySelector('[data-slot="dialog-overlay"]') as HTMLElement)
				.zIndex,
		);
		expect(toaster).toBeGreaterThan(overlay);
	});

	// A modal dialog turns pointer events off on the body. The toasts turn them back on, so the
	// action stays clickable, and it does not count as an outside click that closes the dialog.
	it('keeps the action of a toast clickable over a modal dialog, and the dialog open', async () => {
		const user = userEvent.setup();
		const onClick = vi.fn();
		const onOpenChange = vi.fn();
		render(
			<>
				<Toaster />
				<Dialog open onOpenChange={onOpenChange}>
					<DialogContent>
						<DialogTitle>Settings</DialogTitle>
					</DialogContent>
				</Dialog>
			</>,
		);
		act(() => {
			toast.success('Saved', { action: { label: 'Undo', onClick } });
		});
		await vi.waitFor(() => expect(slot('toast-action')).not.toBeNull());
		const action = slot('toast-action') as HTMLElement;
		const { left, top, width, height } = action.getBoundingClientRect();

		expect(getComputedStyle(document.body).pointerEvents).toBe('none');
		expect(document.elementFromPoint(left + width / 2, top + height / 2)).toBe(action);

		await user.click(action);

		expect(onClick).toHaveBeenCalledOnce();
		await vi.waitFor(() => expect(slot('toast')).toBeNull());
		expect(onOpenChange).not.toHaveBeenCalled();
		expect(screen.getByRole('dialog', { name: 'Settings' })).toBeInTheDocument();
	});
});
