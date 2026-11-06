import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { toast, Toaster } from '../toast/index.js';
import { Drawer, DrawerContent, DrawerTitle } from './index.js';

// The `Toaster` sits at the app root, so its toasts are portalled next to the drawer, outside
// the panel. Radix counts a press there as a press outside and closes the drawer, unless the
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

function renderDrawer(content: ReactNode, onOpenChange = vi.fn(), modal = true) {
	render(
		<>
			<Toaster />
			<Drawer open modal={modal} onOpenChange={onOpenChange}>
				{content}
			</Drawer>
		</>,
	);

	return onOpenChange;
}

describe('Drawer with a toast over it', () => {
	it('stays open when a toast button is pressed', async () => {
		const user = userEvent.setup();
		const onPointerDownOutside = vi.fn();
		const onInteractOutside = vi.fn();
		const onOpenChange = renderDrawer(
			<DrawerContent
				onPointerDownOutside={onPointerDownOutside}
				onInteractOutside={onInteractOutside}
			>
				<DrawerTitle>Edit member</DrawerTitle>
			</DrawerContent>,
		);

		await user.click(await raiseDanger());

		await vi.waitFor(() => expect(document.querySelector('[data-slot="toast"]')).toBeNull());
		expect(onOpenChange).not.toHaveBeenCalled();
		expect(onPointerDownOutside).not.toHaveBeenCalled();
		expect(onInteractOutside).not.toHaveBeenCalled();
		expect(screen.getByRole('dialog', { name: 'Edit member' })).toBeInTheDocument();
	});

	it('stays open when a toast takes the focus from a non-modal drawer', async () => {
		const user = userEvent.setup();
		const onFocusOutside = vi.fn();
		const onOpenChange = renderDrawer(
			<DrawerContent onFocusOutside={onFocusOutside}>
				<DrawerTitle>Edit member</DrawerTitle>
			</DrawerContent>,
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
		const onOpenChange = renderDrawer(
			<DrawerContent onPointerDownOutside={onPointerDownOutside}>
				<DrawerTitle>Edit member</DrawerTitle>
			</DrawerContent>,
		);
		await raiseDanger();

		await user.click(document.querySelector('[data-slot="drawer-overlay"]') as HTMLElement);

		expect(onPointerDownOutside).toHaveBeenCalledOnce();
		expect(onOpenChange).toHaveBeenCalledWith(false);
	});
});
