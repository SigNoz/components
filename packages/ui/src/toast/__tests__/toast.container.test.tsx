import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Dialog } from '../../dialog/index.js';
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
			<Dialog open onClose={() => {}} title="Settings">
				<Toaster />
			</Dialog>,
		);

		expect(document.querySelector('[data-slot="dialog-popup"]')?.contains(slot('toaster'))).toBe(
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
				<Dialog open onClose={() => {}} title="Settings">
					Body
				</Dialog>
			</>,
		);

		const toaster = Number(getComputedStyle(slot('toaster') as HTMLElement).zIndex);
		const layer = Number(
			getComputedStyle(document.querySelector('[data-slot="dialog-layer"]') as HTMLElement).zIndex,
		);
		expect(toaster).toBeGreaterThan(layer);
	});

	// A modal dialog covers the page with its backdrop. The toasts sit above it, so the action stays
	// clickable, and it does not count as an outside press that closes the dialog.
	it('keeps the action of a toast clickable over a modal dialog, and the dialog open', async () => {
		const user = userEvent.setup();
		const onClick = vi.fn();
		const onClose = vi.fn();
		render(
			<>
				<Toaster />
				<Dialog open onClose={onClose} title="Settings">
					Body
				</Dialog>
			</>,
		);
		act(() => {
			toast.success('Saved', { action: { label: 'Undo', onClick } });
		});
		await vi.waitFor(() => expect(slot('toast-action')).not.toBeNull());
		const action = slot('toast-action') as HTMLElement;
		const { left, top, width, height } = action.getBoundingClientRect();

		expect(document.elementFromPoint(left + width / 2, top + height / 2)).toBe(action);

		await user.click(action);

		expect(onClick).toHaveBeenCalledOnce();
		await vi.waitFor(() => expect(slot('toast')).toBeNull());
		expect(onClose).not.toHaveBeenCalled();
		expect(screen.getByRole('dialog', { name: 'Settings' })).toBeInTheDocument();
	});
});
