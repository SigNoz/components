import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Popover } from '../popover.js';
import { openPopover, renderPopover } from './popover.test-utils.js';

describe('Popover interaction', () => {
	it('opens on a click and closes on the next one', async () => {
		const user = userEvent.setup();
		renderPopover();

		await openPopover();
		await user.click(screen.getByRole('button', { name: 'Open' }));

		await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
	});

	it('closes on a press outside', async () => {
		const user = userEvent.setup();
		renderPopover();
		await openPopover();

		await user.click(document.body);

		await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
	});

	it('closes on Escape and returns focus to the trigger', async () => {
		const user = userEvent.setup();
		renderPopover({}, <button type="button">Inside</button>);
		await openPopover();

		await user.keyboard('{Escape}');

		await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
		expect(screen.getByRole('button', { name: 'Open' })).toHaveFocus();
	});

	it('does not lock the page: the body keeps its scroll and pointer events', async () => {
		renderPopover();
		await openPopover();

		expect(document.body.style.overflow).not.toBe('hidden');
		expect(document.body.style.pointerEvents).not.toBe('none');
	});

	it('reports each change with its reason', async () => {
		const user = userEvent.setup();
		const onOpenChange = vi.fn();
		renderPopover({ onOpenChange });

		await openPopover();
		expect(onOpenChange).toHaveBeenLastCalledWith(
			true,
			expect.objectContaining({ reason: 'trigger-press' }),
		);

		await user.keyboard('{Escape}');
		await waitFor(() =>
			expect(onOpenChange).toHaveBeenLastCalledWith(
				false,
				expect.objectContaining({ reason: 'escape-key' }),
			),
		);
	});

	it('stays open when the close is cancelled through the event details', async () => {
		const user = userEvent.setup();
		renderPopover({
			onOpenChange: (open, details) => {
				if (!open && details.reason === 'outside-press') {
					details.cancel();
				}
			},
		});
		await openPopover();

		await user.click(document.body);

		expect(screen.getByRole('dialog')).toBeInTheDocument();

		await user.keyboard('{Escape}');
		await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
	});

	it('follows a controlled open', async () => {
		function Controlled() {
			const [open, setOpen] = useState(false);

			return (
				<>
					<button type="button" onClick={() => setOpen(true)}>
						Elsewhere
					</button>
					<Popover
						nativeButton
						side="bottom"
						align="start"
						trigger={<button type="button">Open</button>}
						open={open}
						onOpenChange={setOpen}
					>
						<p>Body</p>
					</Popover>
				</>
			);
		}
		const user = userEvent.setup();
		render(<Controlled />);

		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

		await user.click(screen.getByRole('button', { name: 'Elsewhere' }));
		expect(await screen.findByRole('dialog')).toBeInTheDocument();

		await user.keyboard('{Escape}');
		await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
	});

	it('unmounts the popup on close', async () => {
		const user = userEvent.setup();
		renderPopover();
		await openPopover();

		await user.keyboard('{Escape}');

		await waitFor(() => expect(document.querySelector('[data-slot="popover-popup"]')).toBeNull());
	});
});
