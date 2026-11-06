import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { slot, waitForOnTop, zIndexOf } from '../../dialog/__tests__/dialog.test-utils.js';
import { Drawer } from '../../drawer/index.js';
import { AlertDialog } from '../index.js';

function DrawerHarness() {
	const [drawerOpen, setDrawerOpen] = useState(true);
	const [alertOpen, setAlertOpen] = useState(false);
	const [presses, setPresses] = useState(0);

	return (
		<>
			<output data-testid="drawer-state">{drawerOpen ? 'drawer open' : 'drawer closed'}</output>
			<Drawer type="task" open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Settings">
				<button type="button" onClick={() => setAlertOpen(true)}>
					Open alert
				</button>
				<AlertDialog
					open={alertOpen}
					title="Delete it?"
					color="danger"
					confirmText={`Delete ${presses}`}
					onConfirm={() => setPresses((count) => count + 1)}
					onCancel={() => setAlertOpen(false)}
				>
					It goes away.
				</AlertDialog>
			</Drawer>
		</>
	);
}

async function openOverDrawer() {
	const user = userEvent.setup();
	render(<DrawerHarness />);
	await user.click(await screen.findByRole('button', { name: 'Open alert' }));
	await screen.findByRole('alertdialog', { name: 'Delete it?' });

	return user;
}

describe('AlertDialog opened from a drawer', () => {
	it('lets the confirm button take a press and leaves the drawer open', async () => {
		const user = await openOverDrawer();

		await user.click(screen.getByRole('button', { name: 'Delete 0' }));

		expect(screen.getByRole('button', { name: 'Delete 1' })).toBeTruthy();
		expect(screen.getByTestId('drawer-state').textContent).toBe('drawer open');
		expect(screen.getByRole('alertdialog', { name: 'Delete it?' })).toBeInTheDocument();
	});

	it('focuses its panel and takes the keyboard', async () => {
		const user = await openOverDrawer();
		const panel = screen.getByRole('alertdialog', { name: 'Delete it?' });

		await waitFor(() => expect(document.activeElement).toBe(panel));
		await user.tab();

		expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Cancel' }));
		await user.tab();

		expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Delete 0' }));
	});

	it('closes alone on Esc', async () => {
		const user = await openOverDrawer();

		await user.keyboard('{Escape}');

		await waitFor(() =>
			expect(screen.queryByRole('alertdialog', { name: 'Delete it?' })).toBeNull(),
		);
		expect(screen.getByTestId('drawer-state').textContent).toBe('drawer open');
	});

	it('closes alone on the cancel button', async () => {
		const user = await openOverDrawer();

		await user.click(screen.getByRole('button', { name: 'Cancel' }));

		await waitFor(() =>
			expect(screen.queryByRole('alertdialog', { name: 'Delete it?' })).toBeNull(),
		);
		expect(screen.getByTestId('drawer-state').textContent).toBe('drawer open');
	});

	it('does nothing on a press on its backdrop, and leaves the drawer open', async () => {
		const user = await openOverDrawer();

		await user.click(document.elementFromPoint(2, 2) as Element);

		expect(screen.getByRole('alertdialog', { name: 'Delete it?' })).toBeInTheDocument();
		expect(screen.getByTestId('drawer-state').textContent).toBe('drawer open');
	});

	it('paints above the drawer', async () => {
		await openOverDrawer();

		await waitForOnTop(screen.getByRole('alertdialog', { name: 'Delete it?' }));
		await waitForOnTop(screen.getByRole('button', { name: 'Cancel' }));
	});

	it('stacks its layer above the drawer', async () => {
		await openOverDrawer();
		const drawerLayer = slot('drawer-layer') as HTMLElement;

		expect(zIndexOf(slot('alert-dialog-layer') as HTMLElement)).toBeGreaterThan(
			zIndexOf(drawerLayer),
		);
	});

	it('gives the focus back to its opener in the drawer when it closes', async () => {
		const user = await openOverDrawer();

		await user.keyboard('{Escape}');

		await waitFor(() =>
			expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Open alert' })),
		);
	});
});
