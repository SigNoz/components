import { Info } from '@signozhq/icons';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type ReactNode, useEffect } from 'react';
import { describe, expect, it, onTestFinished, vi } from 'vitest';
import type { DialogHandle } from '../dialog-handle.js';
import { Dialog } from '../dialog.js';
import { useDialogHandle } from '../use-dialog-handle.js';
import { DialogHarness, renderOpenDialog, slot } from './dialog.test-utils.js';

const FOOTER = (
	<>
		<button type="button">Cancel</button>
		<button type="button">Save</button>
	</>
);

describe('Dialog loading', () => {
	it('renders no skeleton and no busy state by default', async () => {
		await renderOpenDialog({ description: 'Pick a name', footerSuffix: FOOTER });

		const panel = screen.getByRole('dialog');

		expect(panel).not.toHaveAttribute('aria-busy');
		expect(panel).not.toHaveAttribute('data-loading');
		expect(screen.queryByTestId('dialog-title-skeleton')).toBeNull();
		expect(screen.queryByTestId('dialog-description-skeleton')).toBeNull();
		expect(screen.queryByTestId('dialog-body-skeleton')).toBeNull();
		expect(slot('dialog-title-skeleton')).toBeNull();
		expect(slot('dialog-description-skeleton')).toBeNull();
	});

	it('marks the panel busy and keeps the title as its accessible name', async () => {
		await renderOpenDialog({ loading: true });

		const panel = screen.getByRole('dialog', { name: 'Rename view' });

		expect(panel).toHaveAttribute('aria-busy', 'true');
		expect(panel).toHaveAttribute('data-loading');
		expect(
			slot('dialog-title-skeleton')?.contains(screen.getByTestId('dialog-title-skeleton')),
		).toBe(true);
	});

	it('shows a skeleton for the description only when one is passed', async () => {
		const { unmount } = await renderOpenDialog({ loading: true });

		expect(screen.queryByTestId('dialog-description-skeleton')).toBeNull();
		unmount();

		await renderOpenDialog({ loading: true, description: 'Pick a name' });

		expect(screen.getByTestId('dialog-description-skeleton')).toBeInTheDocument();
		expect(
			slot('dialog-description-skeleton')?.contains(
				screen.getByTestId('dialog-description-skeleton'),
			),
		).toBe(true);
		expect(screen.queryByText('Pick a name')).toBeNull();
		expect(slot('dialog-description')).toBeNull();
		expect(screen.getByRole('dialog')).not.toHaveAttribute('aria-describedby');
	});

	it('replaces the title icon with a skeleton', async () => {
		await renderOpenDialog({ loading: true, titleIcon: <Info data-testid="title-icon" /> });

		expect(screen.queryByTestId('title-icon')).toBeNull();
	});

	it.each([
		{ size: undefined, expected: 14 },
		{ size: '20px', expected: 20 },
	])(
		'draws the title icon skeleton at the icon size ($expected px)',
		async ({ size, expected }) => {
			if (size !== undefined) {
				document.body.style.setProperty('--dialog-title-icon-size', size);
				onTestFinished(() => document.body.style.removeProperty('--dialog-title-icon-size'));
			}
			await renderOpenDialog({ loading: true, titleIcon: <Info /> });

			const icon = slot('dialog-header')?.querySelector('[data-slot="skeleton-avatar"]');
			const box = icon?.getBoundingClientRect();

			expect(box?.width).toBe(expected);
			expect(box?.height).toBe(expected);
		},
	);

	it('does not render the children and shows the default body skeleton', async () => {
		await renderOpenDialog({ loading: true, children: <input aria-label="Name" /> });

		expect(screen.queryByRole('textbox', { name: 'Name' })).toBeNull();
		expect(slot('dialog-body')?.contains(screen.getByTestId('dialog-body-skeleton'))).toBe(true);
	});

	it('shows loadingContent in the body instead of the default skeleton', async () => {
		await renderOpenDialog({
			loading: true,
			loadingContent: <div data-testid="form-skeleton" />,
		});

		expect(slot('dialog-body')?.contains(screen.getByTestId('form-skeleton'))).toBe(true);
		expect(screen.queryByTestId('dialog-body-skeleton')).toBeNull();
	});

	it('replaces the footer actions with skeletons and keeps the footer slots', async () => {
		await renderOpenDialog({
			loading: true,
			footerPrefix: <button type="button">Delete</button>,
			footerSuffix: FOOTER,
		});

		expect(screen.queryByRole('button', { name: 'Save' })).toBeNull();
		expect(screen.queryByRole('button', { name: 'Cancel' })).toBeNull();
		expect(screen.queryByRole('button', { name: 'Delete' })).toBeNull();
		expect(slot('dialog-footer-prefix')?.childElementCount).toBe(1);
		expect(slot('dialog-footer-suffix')?.childElementCount).toBe(2);
	});

	it('renders no footer while loading when footerSuffix renders nothing', async () => {
		await renderOpenDialog({ loading: true, footerPrefix: <button type="button">Delete</button> });

		expect(slot('dialog-footer')).toBeNull();
	});

	it('keeps the close button working while loading', async () => {
		const onClose = vi.fn();

		await renderOpenDialog({ loading: true, onClose, closes: false });
		await userEvent.click(screen.getByRole('button', { name: 'Close' }));

		expect(onClose).toHaveBeenCalledWith('close-press');
	});

	it('renders the content once loading turns false', async () => {
		const { rerender } = render(
			<DialogHarness defaultOpen loading description="Pick a name" footerSuffix={FOOTER} />,
		);

		await waitFor(() => {
			expect(screen.getByRole('dialog')).toHaveAttribute('aria-busy', 'true');
		});

		rerender(<DialogHarness defaultOpen description="Pick a name" footerSuffix={FOOTER} />);

		const panel = screen.getByRole('dialog', { name: 'Rename view' });

		expect(panel).not.toHaveAttribute('aria-busy');
		expect(screen.getByRole('textbox', { name: 'Name' })).toBeInTheDocument();
		expect(screen.getByText('Pick a name')).toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
		expect(screen.queryByTestId('dialog-title-skeleton')).toBeNull();
	});
});

interface Row {
	name: string;
}

type HandleRef = { current: DialogHandle<Row> | null };

function LoadingHandleHarness({
	handleRef,
	loading,
	renderRow,
}: {
	handleRef: HandleRef;
	loading: boolean;
	renderRow: (row: Row) => ReactNode;
}): ReactNode {
	const handle = useDialogHandle<Row>();

	useEffect(() => {
		handleRef.current = handle;
	}, [handle, handleRef]);

	return (
		<Dialog handle={handle} title="Edit view" testId="dialog" loading={loading}>
			{(row: Row) => renderRow(row)}
		</Dialog>
	);
}

describe('Dialog loading with a handle', () => {
	it('calls children with the payload only once loading is false', async () => {
		const handleRef: HandleRef = { current: null };
		const renderRow = vi.fn((row: Row) => <p>{row.name}</p>);
		const { rerender } = render(
			<LoadingHandleHarness handleRef={handleRef} loading renderRow={renderRow} />,
		);

		await waitFor(() => {
			expect(handleRef.current).not.toBeNull();
		});
		act(() => handleRef.current?.open({ name: 'Latency' }));
		await waitFor(() => {
			expect(screen.getByTestId('dialog-body-skeleton')).toBeInTheDocument();
		});

		expect(renderRow).not.toHaveBeenCalled();

		rerender(<LoadingHandleHarness handleRef={handleRef} loading={false} renderRow={renderRow} />);

		expect(screen.getByText('Latency')).toBeInTheDocument();
		expect(renderRow).toHaveBeenCalledWith({ name: 'Latency' });
	});
});
