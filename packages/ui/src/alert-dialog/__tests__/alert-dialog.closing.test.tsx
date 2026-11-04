import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { OPENER_NAME, slot, slots } from '../../dialog/__tests__/dialog.test-utils.js';
import { AlertDialog } from '../index.js';
import {
	AlertHarness,
	cancelButton,
	confirmButton,
	renderOpenAlert,
	waitForClosed,
} from './alert-dialog.test-utils.js';

/**
 * A press where a user presses: on whatever the page paints at a point outside the panel. The
 * panel is centered and the corner is 16px of padding at most, so this is the backdrop.
 */
async function pressBackdrop(): Promise<void> {
	await userEvent.click(document.elementFromPoint(2, 2) as Element);
}

describe('AlertDialog closing', () => {
	it('does not call onCancel or onConfirm on open or on a re-render', async () => {
		const onCancel = vi.fn();
		const onConfirm = vi.fn();
		const { rerender } = await renderOpenAlert({ onCancel, onConfirm });

		rerender(
			<AlertHarness defaultOpen onCancel={onCancel} onConfirm={onConfirm} title="Another" />,
		);

		expect(onCancel).not.toHaveBeenCalled();
		expect(onConfirm).not.toHaveBeenCalled();
	});

	it('calls onCancel on Esc, once', async () => {
		const onCancel = vi.fn();
		await renderOpenAlert({ onCancel, closesOnCancel: false });

		await userEvent.keyboard('{Escape}');

		expect(onCancel).toHaveBeenCalledOnce();
		expect(onCancel).toHaveBeenCalledWith();
	});

	it('calls onCancel on Esc from the cancel button and from the confirm button', async () => {
		const onCancel = vi.fn();
		await renderOpenAlert({ onCancel, closesOnCancel: false });

		cancelButton().focus();
		await userEvent.keyboard('{Escape}');
		confirmButton().focus();
		await userEvent.keyboard('{Escape}');

		expect(onCancel).toHaveBeenCalledTimes(2);
	});

	it('calls onCancel on the cancel button, once', async () => {
		const onCancel = vi.fn();
		const onConfirm = vi.fn();
		await renderOpenAlert({ onCancel, onConfirm, closesOnCancel: false });

		await userEvent.click(cancelButton());

		expect(onCancel).toHaveBeenCalledOnce();
		expect(onConfirm).not.toHaveBeenCalled();
	});

	it('does nothing on a press on the backdrop', async () => {
		const onCancel = vi.fn();
		const onConfirm = vi.fn();
		await renderOpenAlert({ onCancel, onConfirm, closesOnCancel: false });

		await pressBackdrop();
		await userEvent.click(screen.getByTestId('alert-backdrop'));

		expect(onCancel).not.toHaveBeenCalled();
		expect(onConfirm).not.toHaveBeenCalled();
		expect(screen.getByRole('alertdialog')).toBeInTheDocument();
	});

	it('does nothing on a press inside the panel that is not on a button', async () => {
		const onCancel = vi.fn();
		await renderOpenAlert({ onCancel, closesOnCancel: false });

		await userEvent.click(screen.getByTestId('alert-title'));
		await userEvent.click(screen.getByTestId('alert-body'));
		await userEvent.click(screen.getByRole('alertdialog'));

		expect(onCancel).not.toHaveBeenCalled();
	});

	it('does not close on confirm, the consumer does', async () => {
		const onConfirm = vi.fn();
		const onCancel = vi.fn();
		await renderOpenAlert({ onConfirm, onCancel });

		await userEvent.click(confirmButton());

		expect(onConfirm).toHaveBeenCalledOnce();
		expect(onCancel).not.toHaveBeenCalled();
		expect(screen.getByRole('alertdialog')).toBeInTheDocument();
	});

	it('stays open on Esc until open is false', async () => {
		await renderOpenAlert({ closesOnCancel: false });

		await userEvent.keyboard('{Escape}');

		expect(screen.getByRole('alertdialog')).toBeInTheDocument();
	});

	it.each([
		['Esc', async () => userEvent.keyboard('{Escape}')],
		['the cancel button', async () => userEvent.click(cancelButton())],
	])('closes on %s when the consumer sets open to false', async (_name, close) => {
		render(<AlertHarness defaultOpen />);
		await screen.findByRole('alertdialog');

		await close();
		await waitForClosed();

		expect(screen.queryByRole('alertdialog')).toBeNull();
		expect(slots('alert-dialog-backdrop')).toHaveLength(0);
		expect(slots('alert-dialog-layer')).toHaveLength(0);
	});

	it('plays its exit animation before it unmounts the content', async () => {
		const props = {
			title: 'Delete this view?',
			color: 'danger',
			confirmText: 'Delete view',
			onConfirm: () => {},
			onCancel: () => {},
			children: 'Gone for good.',
		} as const;
		const { rerender } = render(<AlertDialog open {...props} />);
		const panel = await screen.findByRole('alertdialog');
		const backdrop = slot('alert-dialog-backdrop') as HTMLElement;

		expect(panel).toHaveAttribute('data-open');
		expect(backdrop).toHaveAttribute('data-open');

		rerender(<AlertDialog open={false} {...props} />);

		expect(panel.isConnected).toBe(true);
		expect(panel).toHaveAttribute('data-closed');
		expect(backdrop).toHaveAttribute('data-closed');

		await waitForClosed();

		expect(panel.isConnected).toBe(false);
		expect(backdrop.isConnected).toBe(false);
	});

	it('keeps no state when it opens again', async () => {
		render(
			<AlertHarness>
				<input aria-label="Reason" />
			</AlertHarness>,
		);
		await userEvent.click(screen.getByRole('button', { name: OPENER_NAME }));
		await userEvent.type(await screen.findByRole('textbox', { name: 'Reason' }), 'Because');

		await userEvent.keyboard('{Escape}');
		await waitForClosed();
		await userEvent.click(screen.getByRole('button', { name: OPENER_NAME }));

		expect(await screen.findByRole('textbox', { name: 'Reason' })).toHaveValue('');
	});

	it('opens again after it was answered', async () => {
		render(<AlertHarness />);

		for (let round = 0; round < 2; round += 1) {
			await userEvent.click(screen.getByRole('button', { name: OPENER_NAME }));
			await screen.findByRole('alertdialog');
			await userEvent.click(cancelButton());
			await waitForClosed();
		}

		expect(screen.queryByRole('alertdialog')).toBeNull();
	});
});
