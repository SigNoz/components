import { act, render, screen, waitFor } from '@testing-library/react';
import { type ReactNode, StrictMode, useEffect, useRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import type { DialogHandle } from '../../dialog/dialog-handle.js';
import { Dialog, useDialogHandle } from '../../dialog/index.js';
import { AlertDialog } from '../index.js';
import { waitForClosed, waitForSettled } from './alert-dialog.test-utils.js';

interface HandleRef {
	current: DialogHandle | null;
}

function handleOf(ref: HandleRef): DialogHandle {
	return ref.current as DialogHandle;
}

function Alert({ handle }: { handle: DialogHandle }): ReactNode {
	return (
		<AlertDialog
			handle={handle}
			title="Delete this view?"
			color="danger"
			confirmText="Delete view"
			testId="alert"
			onConfirm={() => {}}
		/>
	);
}

function ShownHarness({
	handleRef,
	onOpenChange,
	shown,
}: {
	handleRef: HandleRef;
	onOpenChange: (open: boolean) => void;
	shown: boolean;
}): ReactNode {
	const handle = useDialogHandle(onOpenChange);

	useEffect(() => {
		handleRef.current = handle;
	}, [handle, handleRef]);

	return shown ? <Alert handle={handle} /> : null;
}

function ParentHarness({
	handleRef,
	onOpenChange,
	parentOpen,
}: {
	handleRef: HandleRef;
	onOpenChange: (open: boolean) => void;
	parentOpen: boolean;
}): ReactNode {
	const child = useDialogHandle(onOpenChange);

	useEffect(() => {
		handleRef.current = child;
	}, [child, handleRef]);

	return (
		<Dialog open={parentOpen} onClose={() => {}} title="Edit view" testId="parent">
			<Alert handle={child} />
		</Dialog>
	);
}

describe('AlertDialog on a handle that unmounts while open', () => {
	it('closes the handle and reports it, when the alert is no longer rendered', async () => {
		const onOpenChange = vi.fn();
		const handleRef: HandleRef = { current: null };
		const { rerender } = render(
			<ShownHarness handleRef={handleRef} onOpenChange={onOpenChange} shown />,
		);
		act(() => handleOf(handleRef).open());
		await screen.findByRole('alertdialog', { name: 'Delete this view?' });
		await waitForSettled();

		rerender(<ShownHarness handleRef={handleRef} onOpenChange={onOpenChange} shown={false} />);

		await waitFor(() => {
			expect(handleOf(handleRef).isOpen).toBe(false);
		});
		expect(onOpenChange.mock.calls).toEqual([[true], [false]]);
		expect(screen.queryByRole('alertdialog', { hidden: true })).toBeNull();
	});

	it('does not open at once when it is rendered again', async () => {
		const onOpenChange = vi.fn();
		const handleRef: HandleRef = { current: null };
		const { rerender } = render(
			<ShownHarness handleRef={handleRef} onOpenChange={onOpenChange} shown />,
		);
		act(() => handleOf(handleRef).open());
		await screen.findByRole('alertdialog', { name: 'Delete this view?' });
		rerender(<ShownHarness handleRef={handleRef} onOpenChange={onOpenChange} shown={false} />);
		await waitFor(() => {
			expect(handleOf(handleRef).isOpen).toBe(false);
		});

		rerender(<ShownHarness handleRef={handleRef} onOpenChange={onOpenChange} shown />);
		await act(async () => {});

		expect(screen.queryByRole('alertdialog', { hidden: true })).toBeNull();
	});

	it('leaves a handle that is already closed alone', async () => {
		const onOpenChange = vi.fn();
		const handleRef: HandleRef = { current: null };
		const { rerender } = render(
			<ShownHarness handleRef={handleRef} onOpenChange={onOpenChange} shown />,
		);

		rerender(<ShownHarness handleRef={handleRef} onOpenChange={onOpenChange} shown={false} />);
		await act(async () => {});

		expect(onOpenChange).not.toHaveBeenCalled();
	});

	it('resets an alert that closed with its parent dialog, so it stays closed when the parent opens again', async () => {
		const onOpenChange = vi.fn();
		const handleRef: HandleRef = { current: null };
		const { rerender } = render(
			<ParentHarness handleRef={handleRef} onOpenChange={onOpenChange} parentOpen />,
		);
		await screen.findByRole('dialog', { name: 'Edit view' });
		act(() => handleOf(handleRef).open());
		await screen.findByRole('alertdialog', { name: 'Delete this view?' });
		await waitForSettled();

		rerender(
			<ParentHarness handleRef={handleRef} onOpenChange={onOpenChange} parentOpen={false} />,
		);
		await waitForClosed();

		await waitFor(() => {
			expect(handleOf(handleRef).isOpen).toBe(false);
		});
		expect(onOpenChange.mock.calls).toEqual([[true], [false]]);

		rerender(<ParentHarness handleRef={handleRef} onOpenChange={onOpenChange} parentOpen />);
		await screen.findByRole('dialog', { name: 'Edit view' });
		await act(async () => {});

		expect(screen.queryByRole('alertdialog', { hidden: true })).toBeNull();
	});

	it('keeps a handle that was opened on mount open through Strict Mode', async () => {
		const handleRef: HandleRef = { current: null };
		function OpensOnMount(): ReactNode {
			const handle = useDialogHandle();
			const opened = useRef(false);

			// A ref survives Strict Mode's second pass, so the handle is opened once, not again.
			useEffect(() => {
				handleRef.current = handle;
				if (!opened.current) {
					opened.current = true;
					handle.open();
				}
			}, [handle]);

			return <Alert handle={handle} />;
		}
		render(
			<StrictMode>
				<OpensOnMount />
			</StrictMode>,
		);

		await screen.findByRole('alertdialog', { name: 'Delete this view?' });
		await act(async () => {});

		expect(handleOf(handleRef).isOpen).toBe(true);
		expect(screen.getByRole('alertdialog', { name: 'Delete this view?' })).toBeInTheDocument();
	});
});
