import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { Drawer } from '../../drawer/index.js';
import { Dialog } from '../dialog.js';
import { waitForOnTop } from './dialog.test-utils.js';

function DrawerHarness() {
	const [drawerOpen, setDrawerOpen] = useState(true);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [presses, setPresses] = useState(0);

	return (
		<>
			<output data-testid="drawer-state">{drawerOpen ? 'drawer open' : 'drawer closed'}</output>
			<Drawer type="task" open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Settings">
				<button type="button" onClick={() => setDialogOpen(true)}>
					Open dialog
				</button>
				<Dialog
					open={dialogOpen}
					onClose={() => setDialogOpen(false)}
					title="Over the drawer"
					footerSuffix={
						<button type="button" onClick={() => setPresses((count) => count + 1)}>
							{`Pressed ${presses}`}
						</button>
					}
				>
					<input aria-label="Name" />
				</Dialog>
			</Drawer>
		</>
	);
}

async function openOverDrawer() {
	const user = userEvent.setup();
	render(<DrawerHarness />);
	await user.click(await screen.findByRole('button', { name: 'Open dialog' }));
	await screen.findByRole('dialog', { name: 'Over the drawer' });

	return user;
}

describe('Dialog opened from a drawer', () => {
	it('takes a press on its buttons and leaves the drawer open', async () => {
		const user = await openOverDrawer();

		await user.click(screen.getByRole('button', { name: 'Pressed 0' }));

		expect(screen.getByRole('button', { name: 'Pressed 1' })).toBeTruthy();
		expect(screen.getByTestId('drawer-state').textContent).toBe('drawer open');
	});

	it('keeps the focus and takes typing in its body', async () => {
		const user = await openOverDrawer();
		const input = screen.getByRole('textbox', { name: 'Name' });

		await waitFor(() =>
			expect(document.activeElement).toBe(screen.getByRole('dialog', { name: 'Over the drawer' })),
		);
		await user.click(input);
		await user.keyboard('abc');

		expect((input as HTMLInputElement).value).toBe('abc');
		expect(document.activeElement).toBe(input);
	});

	it('closes alone on Esc', async () => {
		const user = await openOverDrawer();

		await user.keyboard('{Escape}');

		await waitFor(() =>
			expect(screen.queryByRole('dialog', { name: 'Over the drawer' })).toBeNull(),
		);
		expect(screen.getByTestId('drawer-state').textContent).toBe('drawer open');
	});

	it('paints above the drawer', async () => {
		await openOverDrawer();

		await waitForOnTop(screen.getByRole('dialog', { name: 'Over the drawer' }));
	});

	it('gives the focus back to its opener in the drawer when it closes', async () => {
		const user = await openOverDrawer();

		await user.keyboard('{Escape}');

		await waitFor(() =>
			expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Open dialog' })),
		);
	});
});
