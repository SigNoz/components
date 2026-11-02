import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Dialog } from '../dialog.js';
import {
	DialogHarness,
	OPENER_NAME,
	renderOpenDialog,
	slot,
	slots,
	waitForClosed,
} from './dialog.test-utils.js';

/**
 * A press where a user presses: on whatever the page paints at a point outside the panel. The
 * panel is centered and the corner is 16px of padding at most, so this is the backdrop.
 */
async function pressBackdrop(): Promise<void> {
	await userEvent.click(document.elementFromPoint(2, 2) as Element);
}

describe('Dialog closing', () => {
	it('does not call onClose on open or on a re-render', async () => {
		const onClose = vi.fn();
		const { rerender } = await renderOpenDialog({ onClose });

		rerender(<DialogHarness defaultOpen onClose={onClose} title="Another title" />);

		expect(onClose).not.toHaveBeenCalled();
	});

	it('calls onClose with escape-key on Esc, once', async () => {
		const onClose = vi.fn();
		await renderOpenDialog({ onClose, closes: false });

		await userEvent.keyboard('{Escape}');

		expect(onClose).toHaveBeenCalledOnce();
		expect(onClose).toHaveBeenCalledWith('escape-key');
	});

	it('calls onClose with escape-key on Esc from the close button and from a footer button', async () => {
		const onClose = vi.fn();
		await renderOpenDialog({
			onClose,
			closes: false,
			footerSuffix: <button type="button">Save</button>,
		});

		screen.getByRole('button', { name: 'Close' }).focus();
		await userEvent.keyboard('{Escape}');
		screen.getByRole('button', { name: 'Save' }).focus();
		await userEvent.keyboard('{Escape}');

		expect(onClose).toHaveBeenCalledTimes(2);
		expect(onClose).toHaveBeenNthCalledWith(1, 'escape-key');
		expect(onClose).toHaveBeenNthCalledWith(2, 'escape-key');
	});

	it('calls onClose with outside-press on a press on the backdrop, once', async () => {
		const onClose = vi.fn();
		await renderOpenDialog({ onClose, closes: false });

		await pressBackdrop();

		expect(onClose).toHaveBeenCalledOnce();
		expect(onClose).toHaveBeenCalledWith('outside-press');
	});

	it('calls onClose with outside-press on a press on the backdrop element itself', async () => {
		const onClose = vi.fn();
		await renderOpenDialog({ onClose, closes: false });

		await userEvent.click(screen.getByTestId('dialog-backdrop'));

		expect(onClose).toHaveBeenCalledWith('outside-press');
	});

	it('calls onClose with close-press on the close button, once', async () => {
		const onClose = vi.fn();
		await renderOpenDialog({ onClose, closes: false });

		await userEvent.click(screen.getByRole('button', { name: 'Close' }));

		expect(onClose).toHaveBeenCalledOnce();
		expect(onClose).toHaveBeenCalledWith('close-press');
	});

	it('does not treat a press inside the panel as an outside press', async () => {
		const onClose = vi.fn();
		await renderOpenDialog({
			onClose,
			closes: false,
			description: 'Detail',
			footerSuffix: <button type="button">Save</button>,
		});

		await userEvent.click(screen.getByTestId('dialog-title'));
		await userEvent.click(screen.getByTestId('dialog-description'));
		await userEvent.click(screen.getByTestId('dialog-body'));
		await userEvent.click(screen.getByRole('textbox', { name: 'Name' }));
		await userEvent.click(screen.getByRole('button', { name: 'Save' }));

		expect(onClose).not.toHaveBeenCalled();
	});

	// The spec counts a press on another modal in `document.body` (the antd ErrorModal) as an
	// outside press. Base UI only counts the backdrop, and the viewport around the panel, so the
	// press does nothing, whether the other modal was there before the dialog opened or after.
	it.each([
		['before', true],
		['after', false],
	])(
		'ignores a press on another modal in document.body that mounted %s it',
		async (_when, before) => {
			const onClose = vi.fn();
			const modal = document.createElement('div');
			modal.setAttribute('role', 'dialog');
			modal.setAttribute('aria-label', 'Error');
			modal.style.cssText =
				'position:fixed;top:0;left:0;width:40px;height:40px;pointer-events:auto;';

			try {
				if (before) {
					document.body.append(modal);
				}
				await renderOpenDialog({ onClose, closes: false });
				if (!before) {
					document.body.append(modal);
				}

				await userEvent.click(modal);
			} finally {
				modal.remove();
			}

			expect(onClose).not.toHaveBeenCalled();
		},
	);

	it('stays open until open is false, whichever reason it was told', async () => {
		const onClose = vi.fn();
		await renderOpenDialog({ onClose, closes: false });

		await userEvent.keyboard('{Escape}');
		await pressBackdrop();
		await userEvent.click(screen.getByRole('button', { name: 'Close' }));

		expect(onClose.mock.calls.map(([reason]) => reason)).toEqual([
			'escape-key',
			'outside-press',
			'close-press',
		]);
		expect(screen.getByRole('dialog')).toBeInTheDocument();
		expect(slot('dialog-backdrop')).toBeInTheDocument();
	});

	it.each([
		['Esc', async () => userEvent.keyboard('{Escape}')],
		['a press on the backdrop', pressBackdrop],
		[
			'the close button',
			async () => userEvent.click(screen.getByRole('button', { name: 'Close' })),
		],
	])('closes on %s when the consumer sets open to false', async (_name, close) => {
		render(<DialogHarness defaultOpen />);
		await screen.findByRole('dialog');

		await close();
		await waitForClosed();

		expect(screen.queryByRole('dialog')).toBeNull();
		expect(slots('dialog-backdrop')).toHaveLength(0);
	});

	it('closes when the consumer sets open to false for a reason of its own', async () => {
		const { rerender } = render(
			<Dialog open onClose={() => {}} title="Rename view">
				Body
			</Dialog>,
		);
		await screen.findByRole('dialog');

		rerender(
			<Dialog open={false} onClose={() => {}} title="Rename view">
				Body
			</Dialog>,
		);
		await waitForClosed();

		expect(screen.queryByRole('dialog')).toBeNull();
	});

	it('plays its exit animation before it unmounts the content', async () => {
		const { rerender } = render(
			<Dialog open onClose={() => {}} title="Rename view" testId="dialog">
				Body
			</Dialog>,
		);
		const panel = await screen.findByRole('dialog');

		expect(panel).toHaveAttribute('data-open');
		expect(panel).not.toHaveAttribute('data-closed');

		rerender(
			<Dialog open={false} onClose={() => {}} title="Rename view" testId="dialog">
				Body
			</Dialog>,
		);

		expect(panel.isConnected).toBe(true);
		expect(panel).toHaveAttribute('data-closed');
		expect(panel).toHaveAttribute('data-ending-style');
		expect(screen.getByTestId('dialog-backdrop')).toHaveAttribute('data-closed');

		await waitForClosed();

		expect(panel.isConnected).toBe(false);
	});

	it('unmounts the content on close and keeps no state when it opens again', async () => {
		render(<DialogHarness />);
		await userEvent.click(screen.getByRole('button', { name: OPENER_NAME }));
		const field = await screen.findByRole('textbox', { name: 'Name' });

		await userEvent.type(field, 'Latency overview');

		expect(field).toHaveValue('Latency overview');

		await userEvent.keyboard('{Escape}');
		await waitForClosed();

		expect(screen.queryByRole('textbox', { name: 'Name', hidden: true })).toBeNull();

		await userEvent.click(screen.getByRole('button', { name: OPENER_NAME }));

		expect(await screen.findByRole('textbox', { name: 'Name' })).toHaveValue('');
	});

	it('does not mount the children of a closed dialog', () => {
		const onRender = vi.fn();
		function Probe() {
			onRender();

			return <input aria-label="Probe" />;
		}
		render(
			<Dialog open={false} onClose={() => {}} title="Rename view">
				<Probe />
			</Dialog>,
		);

		expect(onRender).not.toHaveBeenCalled();
	});
});
