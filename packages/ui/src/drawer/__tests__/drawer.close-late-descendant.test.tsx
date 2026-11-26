import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { Drawer } from '../drawer.js';

it('lets an inspector opened inside an already-asked drawer refuse the original close', async () => {
	let finishSaving!: () => void;
	const saving = new Promise<void>((resolve) => {
		finishSaving = resolve;
	});
	const closeOuter = vi.fn();
	const closeMiddle = vi.fn(() => saving);
	const closeEditor = vi.fn();
	const panels = (editing: boolean) => (
		<Drawer type="inspector" stack="overlay" open title="Pod" testId="pod" onClose={closeOuter}>
			<Drawer type="inspector" stack="overlay" open title="Container" onClose={closeMiddle}>
				<Drawer
					type="inspector"
					stack="overlay"
					open={editing}
					title="Edit query"
					onClose={(reason, { cancel }) => {
						closeEditor(reason);
						cancel();
					}}
				>
					Query
				</Drawer>
			</Drawer>
		</Drawer>
	);
	const { rerender } = render(panels(false));

	await userEvent.click(screen.getByTestId('pod-close'));
	expect(closeMiddle).toHaveBeenCalledTimes(1);
	rerender(panels(true));
	await screen.findByRole('dialog', { name: 'Edit query' });
	finishSaving();

	await waitFor(() => {
		expect(closeEditor).toHaveBeenCalledWith('close-press');
	});
	expect(closeOuter).not.toHaveBeenCalled();
	expect(closeMiddle).toHaveBeenCalledTimes(1);
});
