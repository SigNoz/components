import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Drawer, DrawerContent, DrawerTitle } from '../drawer/index.js';
import { toast, Toaster } from '../toast/index.js';
import { Dialog, DialogContent, DialogTitle } from './index.js';

// The `Toaster` sits at the app root, so its toasts are portalled next to the dialog, outside
// the panel. Radix counts a press there as a press outside and closes the dialog, unless the
// panel skips toasts.

afterEach(() => {
	act(() => toast.dismiss());
});

async function raiseDanger(): Promise<HTMLElement> {
	act(() => {
		toast.danger('Could not copy the link', { action: { label: 'Close' } });
	});

	return vi.waitFor(() => {
		const action = document.querySelector<HTMLElement>('[data-slot="toast-action"]');
		expect(action).not.toBeNull();

		return action as HTMLElement;
	});
}

function renderDialog(content: ReactNode, onOpenChange = vi.fn(), modal = true) {
	render(
		<>
			<Toaster />
			<Dialog open modal={modal} onOpenChange={onOpenChange}>
				{content}
			</Dialog>
		</>,
	);

	return onOpenChange;
}

describe('Dialog with a toast over it', () => {
	it('stays open when a toast button is pressed', async () => {
		const user = userEvent.setup();
		const onPointerDownOutside = vi.fn();
		const onInteractOutside = vi.fn();
		const onOpenChange = renderDialog(
			<DialogContent
				onPointerDownOutside={onPointerDownOutside}
				onInteractOutside={onInteractOutside}
			>
				<DialogTitle>Invite member</DialogTitle>
			</DialogContent>,
		);

		await user.click(await raiseDanger());

		await vi.waitFor(() => expect(document.querySelector('[data-slot="toast"]')).toBeNull());
		expect(onOpenChange).not.toHaveBeenCalled();
		expect(onPointerDownOutside).not.toHaveBeenCalled();
		expect(onInteractOutside).not.toHaveBeenCalled();
	});

	it('stays open when a toast takes the focus from a non-modal dialog', async () => {
		const user = userEvent.setup();
		const onFocusOutside = vi.fn();
		const onOpenChange = renderDialog(
			<DialogContent onFocusOutside={onFocusOutside}>
				<DialogTitle>Invite member</DialogTitle>
			</DialogContent>,
			vi.fn(),
			false,
		);

		await user.click(await raiseDanger());

		expect(onOpenChange).not.toHaveBeenCalled();
		expect(onFocusOutside).not.toHaveBeenCalled();
	});

	it('still closes on a press on the overlay', async () => {
		const user = userEvent.setup();
		const onPointerDownOutside = vi.fn();
		const onOpenChange = renderDialog(
			<DialogContent onPointerDownOutside={onPointerDownOutside}>
				<DialogTitle>Invite member</DialogTitle>
			</DialogContent>,
		);
		await raiseDanger();

		await user.click(document.querySelector('[data-slot="dialog-overlay"]') as HTMLElement);

		expect(onPointerDownOutside).toHaveBeenCalledOnce();
		expect(onOpenChange).toHaveBeenCalledWith(false);
	});
});

describe('Drawer with a toast over it', () => {
	it('stays open when a toast button is pressed', async () => {
		const user = userEvent.setup();
		const onOpenChange = vi.fn();
		render(
			<>
				<Toaster />
				<Drawer open onOpenChange={onOpenChange}>
					<DrawerContent>
						<DrawerTitle>Edit member</DrawerTitle>
					</DrawerContent>
				</Drawer>
			</>,
		);

		await user.click(await raiseDanger());

		await vi.waitFor(() => expect(document.querySelector('[data-slot="toast"]')).toBeNull());
		expect(onOpenChange).not.toHaveBeenCalled();
		expect(screen.getByRole('dialog', { name: 'Edit member' })).toBeInTheDocument();
	});
});
